const BaseService = require('./BaseService')

class AddonConfigurationSchemaService extends BaseService {

  constructor(addonConfigurationSchema) {
    super(addonConfigurationSchema);
  }

  getAddonSchema(npm_name) {
    return new Promise((resolve, reject) => {
      this.find({npm_name: npm_name}).then((addonSchema) => {
        resolve(addonSchema);
      }).catch((err) => {
        reject(err);
      });
    });
  }
}


module.exports = AddonConfigurationSchemaService;
