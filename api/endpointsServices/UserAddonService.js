const BaseService = require('./BaseService')
const SocketServer = require('../utils/SocketServer');
const addonSchema = require('../../data-model/Addon');

class UserAddonService extends BaseService {
  constructor(userAddonSchema, socketIo) {
    super(userAddonSchema);

    this.socketServer = new SocketServer();
    this.socketCallbacks = {"addonInstalled": this.addonInstalled, "addonDeleted": this.addonDeleted};
    this.socketServer.connect(socketIo).then(() => {
      this.socketServer.onMessage(this.socketCallbacks, this);
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
      this.insert(newUserAddon).then((userAddon) => {
        addonSchema.findOne({_id: newUserAddon.addonId}, function (err, addon) {
          if (err || !addon) {
            reject(err);
            console.log('error'+ err)
          }
          let message = {data: {userAddon: newUserAddon, addon: addon}};
          let userAddonInformation = { "userAddonId": userAddon._id};
          self.socketServer.emitEvent("addAddon", JSON.stringify(message)).then(() => {
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
    return new Promise((resolve, reject) => {
      this.delete({_id: userAddonId}).then(() => {
        let message = {data: {userAddonId: userAddonId}};
        this.socketServer.emitEvent("deleteAddon", JSON.stringify(message)).then(() => {
          resolve();
        });
      }).catch((err) => {
        reject(err);
      })
    });
  }

  updateUserAddon(userAddonId, addonSettings) {
    let self = this;
    return new Promise((resolve, reject) => {
      this.update({_id: userAddonId}, {$set: {addonSettings: addonSettings}}).then((userAddon) => {
        let message = {data: {addonSettings: addonSettings}};
        addonSchema.findOne({_id: userAddon.addonId}, function (err, addon) {
          if (err || !addon) {
            reject(err);
          }
          self.socketServer.emitEvent(addon.npm_name, JSON.stringify(message)).then(() => {
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
