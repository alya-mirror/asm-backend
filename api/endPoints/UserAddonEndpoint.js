const UserAddonService = require('../endpointsServices/UserAddonService');
const UserAddonSchema = require('../../data-model/UserAddon');

class UserAddonEndpoint {

  initialize(router, socketIo) {
    this.userAddonService = new UserAddonService(UserAddonSchema, socketIo);

    this.basePath = '/userAddons';
    router.post(this.basePath + "/", this.install.bind(this));
    router.delete(this.basePath + "/:userAddonId", this.delete.bind(this));
    router.put(this.basePath + "/:userAddonId", this.update.bind(this));
    router.put(this.basePath + "/coreSettings/:userAddonId", this.updateCoreSettings.bind(this));
  }

  install(req, res) {
    const method = 'UserAddonEndpoint.install';
    const path = 'POST ' + this.basePath + '/';
    console.info(method, 'Access to', path);

    const body = req.body;
    const addonId = body.addonId;
    const userId = body.userId;
    const coreSettings = {position: ""};
    const addonSettings = {};

    const userAddon = new UserAddonSchema({
      userId: userId,
      addonId: addonId,
      coreSettings: coreSettings,
      addonSettings: addonSettings
    });
    this.userAddonService.installAddon(userAddon).then((userAddonInformation) => {
      res.status(200).send(userAddonInformation);
    }).catch((err) => {
      res.status(500).send(err);
    })

  }

  update(req, res) {
    const method = 'UserAddonEndpoint.update';
    const path = 'PUT ' + this.basePath + '/';
    console.info(method, 'Access to', path);

    const userAddonId = req.params.userAddonId;
    const addonSettings = req.body.addonSettings;

    this.userAddonService.updateUserAddonSettings(userAddonId, addonSettings).then(() => {
      res.sendStatus(200);
    }).catch((err) => {
      res.status(500).send(err);
    })
  }

  updateCoreSettings(req, res) {
    const method = 'UserAddonEndpoint.updateCoreSettings';
    const path = 'PUT ' + this.basePath + '/';
    console.info(method, 'Access to', path);

    const userAddonId = req.params.userAddonId;
    const coreSettings = req.body.coreSettings;
    const oldCoreSettings = req.body.oldCoreSettings;

    this.userAddonService.updateUserAddonCoreSettings(userAddonId, coreSettings, oldCoreSettings).then(() => {
      res.sendStatus(200);
    }).catch((err) => {
      res.status(500).send(err);
    })
  }

  delete(req, res) {
    const method = 'UserAddonEndpoint.delete';
    const path = 'DELETE ' + this.basePath + '/';
    console.info(method, 'Access to', path);

    const userAddonId = req.params.userAddonId;

    this.userAddonService.deleteUserAddon(userAddonId).then(() => {
      res.sendStatus(200);
    }).catch((err) => {
      res.status(500).send(err);
    })
  }


}

module.exports = UserAddonEndpoint;
