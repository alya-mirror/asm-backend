const AddonConfigurationSchemaService = require('../endpointsServices/AddonConfigurationSchemaService')
const AddonConfigurationSchema = require('../../data-model/AddonConfigurationSchema');

class AddonConfigurationSchemaEndpoint {

  initialize(router) {
    this.addonConfigurationSchemaService = new AddonConfigurationSchemaService(AddonConfigurationSchema);

    this.basePath = '/addonsConfigurationSchema';

    router.get(this.basePath + "/:npm_name", this.get.bind(this));
  }

  get(req, res) {
    const method = 'addonsConfigurationSchemaEndpoint.getAllAddons';
    const path = 'GET ' + this.basePath + '/';
    console.info(method, 'Access to', path);
    const npm_name = req.params.npm_name;

    this.addonConfigurationSchemaService.getAddonSchema(npm_name).then((response) => {
      res.status(200).send(response);
    }).catch((err) => {
      res.status(500).send(err);
    })
  }

}


module.exports = AddonConfigurationSchemaEndpoint;
