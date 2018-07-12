const BaseService = require('./BaseService')
const SocketServer = require('../utils/SocketServer');
const addonSchema = require('../../data-model/Addon');

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
  
  installAddon(newUserAddon) {
    //TODO check if the user has installed this addon before
    let self = this;
    return new Promise((resolve, reject) => {
      addonSchema.findOne({_id: newUserAddon.addonId}, function (err, addon) {
        if (err || !addon) {
          reject(err);
          console.log('error' + err)
        }
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

    });
  }

  deleteUserAddon(userAddonId) {
    let self = this;
    return new Promise((resolve, reject) => {
      this.findOne({_id: userAddonId}).then((userAddon) => {
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
    });
  }

  updateUserAddon(userAddonId, addonSettings) {
    let self = this;
    console.log('this is the coming settings '+  JSON.stringify(addonSettings));
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
}

module.exports = UserAddonService;
