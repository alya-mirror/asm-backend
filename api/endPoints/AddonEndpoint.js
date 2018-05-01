const AddonService = require('../endpointsServices/AddonService');
const AddonSchema = require('../../data-model/Addon');

class AddonEndpoint {

  initialize(router) {
    this.addonService = new AddonService(AddonSchema);
    this.basePath = '/addons';
    router.get(this.basePath + "/:userId", this.getAllAddons.bind(this));
  }

  getAllAddons(req, res) {
    const method = 'UserEndpoint.getAllAddons';
    const path = 'GET ' + this.basePath + '/';
    console.info(method, 'Access to', path);
    const userId = req.params.userId;
    console.log('userId' + userId);
    this.addonService.getAllApprovedAddons(userId).then((response) => {
      res.status(200).send(response);
    }).catch((err) => {
      res.status(500).send(err);
    })
  }


}


module.exports = AddonEndpoint;
