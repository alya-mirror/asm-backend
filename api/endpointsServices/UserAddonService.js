const BaseService = require('./BaseService')
const SocketServer = require('../utils/SocketServer');

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
    ;
  };

  installAddon(newUserAddon) {
    //TODO check if the user has installed this addon before
    return new Promise((resolve, reject) => {
      this.insert(newUserAddon).then(() => {
        let message = {data: {userAddon: newUserAddon}};
        this.socketServer.emitEvent("addAddon", JSON.stringify(message)).then(() => {
          resolve();
        });

      }).catch((err) => {
        reject(err);
      })
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
}


module.exports = UserAddonService;
