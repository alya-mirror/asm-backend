const BaseService = require('./BaseService')
const SocketServer = require('../utils/SocketServer');
const addonSchema = require('../../data-model/Addon');
const userSchema = require('../../data-model/User');

class UserAddonService extends BaseService {
  constructor(userAddonSchema, socketIo) {
    super(userAddonSchema);

    this.socketServer = new SocketServer();
    this.socketCallbacks = {"addonInstalled": this.addonInstalled, "addonDeleted": this.addonDeleted};
    this.socketServer.connect(socketIo).then((socket) => {
      this.socketServer.onMessage(this.socketCallbacks, this);
      this.socket = socket;
    })
  }

  addonInstalled(message, caller) {
    message = message.toString();
    caller.socketServer.emitEvent("installingAddonFinished", message).then(() => {
    }).catch((err) => {
      console.log(err);
    });

  };

  addonDeleted(message, caller) {
    message = message.toString();
    caller.socketServer.emitEvent("deletingAddonFinished", message).then(() => {
    }).catch((err) => {
      console.log(err);
    });
  };

  getNextPosition(userId) {
    return new Promise((resolve, reject) => {
      userSchema.findOne({_id: userId}, function (err, user) {
        if (err || !user) {
          var message = "wrong user Id provided " + userId;
          reject({err: message});
          console.log(message);
        }
        else {
          const positionsMap = user.mirrorConfiguration;
          for (var position in positionsMap) {
            if (positionsMap.hasOwnProperty(position)) {
              if (positionsMap[position] == 0) {
                resolve(position);
              }
            }
          }
          reject("no more positions found!");
        }
      });
    });

  };


  installAddon(newUserAddon) {
    //TODO check if the user has installed this addon before
    let self = this;
    return new Promise((resolve, reject) => {
      addonSchema.findOne({_id: newUserAddon.addonId}, function (err, addon) {
        if (err || !addon) {
          reject(err);
          console.log('error' + err)
        }
        self.getNextPosition(newUserAddon.userId).then((newPosition) => {
          self.addUserPosition(newUserAddon.userId, newPosition).then(() => {
            newUserAddon.coreSettings = {position: newPosition};
            self.insert(newUserAddon).then((userAddon) => {
              newUserAddon = newUserAddon.toJSON();
              newUserAddon['name'] = addon.name;
              newUserAddon['npm_name'] = addon.npm_name;
              let message = {data: {userAddon: newUserAddon}};
              let userAddonInformation = {"userAddonId": userAddon._id};
              self.socketServer.emitEvent("addAddon", JSON.stringify(message), self.socket).then(() => {
                resolve(userAddonInformation);
              });
            }).catch((err) => {
              reject(err);
            });
          }).catch((err) => {
            reject(err);
          });
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err);
      });
    });
  }

  deleteUserPosition(userId, position) {
    return new Promise((resolve, reject) => {
      userSchema.findOne({_id: userId}, function (err, user) {
        if (err || !user) {
          var message = "wrong user Id provided " + userId;
          reject({err: message});
          console.log(message);
        }
        else {
          const positionsMap = user.mirrorConfiguration;
          if (!positionsMap[position]) {
            console.log('wrong position ' + position);
            reject('wrong position ' + position)
          }
          else {
            positionsMap[position] = 0;
            userSchema.update({_id: userId}, {$set: {mirrorConfiguration: positionsMap}}).then(() => {
              console.log('positioned has been deleted successfully');
              resolve();
            }).catch((err) => {
              reject(err);
            });

          }
        }
      });
    });
  };

  addUserPosition(userId, position) {
    return new Promise((resolve, reject) => {
      userSchema.findOne({_id: userId}, function (err, user) {
        if (err || !user) {
          var message = "wrong user Id provided " + userId;
          reject({err: message});
          console.log(message);
        }
        else {
          const positionsMap = user.mirrorConfiguration;
          if (positionsMap[position] != 0) {
            console.log('wrong position ' + position);
            reject('wrong position ' + position)
          }
          else {
            positionsMap[position] = 1;
            userSchema.update({_id: userId}, {$set: {mirrorConfiguration: positionsMap}}).then(() => {
              console.log('positioned has been added successfully');
              resolve();
            }).catch((err) => {
              reject(err);
            });

          }
        }
      });
    });
  };


  deleteUserAddon(userAddonId) {
    let self = this;
    return new Promise((resolve, reject) => {

      this.findOne({_id: userAddonId}).then((userAddon) => {
        self.deleteUserPosition(userAddon.userId, userAddon.coreSettings.position).then(() => {
          this.delete({_id: userAddonId}).then(() => {
            addonSchema.findOne({_id: userAddon.addonId}, function (err, addon) {
              if (err) {
                reject(err);
              }
              else {
                userAddon = userAddon.toJSON();
                userAddon['name'] = addon.name;
                let message = {data: {userAddon: userAddon}};
                self.socketServer.emitEvent("deleteAddon", JSON.stringify(message)).then(() => {
                  resolve();
                });
                resolve();
              }
            });
          }).catch((err) => {
            reject(err);
          });
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err);
      });

    });
  }

  updateUserAddonSettings(userAddonId, addonSettings) {
    let self = this;
    console.log('this is the coming settings ' + JSON.stringify(addonSettings));
    return new Promise((resolve, reject) => {
      this.update({_id: userAddonId}, {$set: {addonSettings: addonSettings}}).then((userAddon) => {
        let message = {data: {addonSettings: addonSettings}};
        addonSchema.findOne({_id: userAddon.addonId}, function (err, addon) {
          if (err || !addon) {
            reject(err);
          }
          self.socketServer.emitEvent(addon.npm_name, JSON.stringify(message), self.socket).then(() => {
            resolve();
          }).catch((err) => {
            reject(err);
          });
          resolve();
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err);
      });
    });
  }

  updatePosition(userId, oldPosition, newPosition) {
    return new Promise((resolve, reject) => {
      userSchema.findOne({_id: userId}, function (err, user) {
        if (err || !user) {
          var message = "wrong user Id provided " + userId;
          reject({err: message});
          console.log(message);
        }
        else {
          const positionsMap = user.mirrorConfiguration;
          if (!positionsMap[oldPosition]) {
            console.log('wrong position ' + oldPosition);
            reject('wrong position ' + oldPosition)
          }
          else if (positionsMap[newPosition] == 1) {
            console.log('occupied  position ' + newPosition);
            reject('occupied  position' + newPosition);
          }
          else {
            positionsMap[oldPosition] = 0;
            positionsMap[newPosition] = 1;
            userSchema.update({_id: userId}, {$set: {mirrorConfiguration: positionsMap}}).then(() => {
              console.log('positioned has been swapped successfully');
              resolve();
            }).catch((err) => {
              reject(err);
            });

          }
        }
      });
    });
  };


  updateUserAddonCoreSettings(userAddonId, coreSettings, oldCoreSettings) {
    let self = this;
    console.log('this is the coming coreSettings  ' + JSON.stringify(coreSettings));
    return new Promise((resolve, reject) => {

      self.findOne({_id: userAddonId}).then((resultedUserAddon) => {
        self.updatePosition(resultedUserAddon.userId, oldCoreSettings.position, coreSettings.position).then(() => {
          self.update({_id: userAddonId}, {$set: {coreSettings: coreSettings}}).then((userAddon) => {
            let message = {data: {coreSettings: coreSettings}};
            addonSchema.findOne({_id: userAddon.addonId}, function (err, addon) {
              if (err || !addon) {
                reject(err);
              }
              self.socketServer.emitEvent("changeAddonCoreSettings", JSON.stringify(message), self.socket).then(() => {
                resolve();
              }).catch((err) => {
                reject(err);
              });
              resolve();
            }).catch((err) => {
              reject(err);
            });
          }).catch((err) => {
            reject(err);
          });
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

module.exports = UserAddonService;
