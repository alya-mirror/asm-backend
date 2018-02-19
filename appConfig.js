'use strict';


function BackendConfig(requiredProperties) { // where is this coming from
  const self = this;

  // First read required properties from the defaults
  for (const p in requiredProperties) {
    if (requiredProperties.hasOwnProperty(p)) {
      self[p] = requiredProperties[p];
    }
  }

  // const config = require('./config.json');
  // self.mongodb = config['mongodb'];

  validate();

  function validate() {
    // confirm that all required properties are now set
    let valid = true;
    for (const p in requiredProperties) {
      if (requiredProperties.hasOwnProperty(p) && self[p] === undefined) {
        console.error('Required property', p, 'still not set');
        valid = false;
      }
    }
    if (!valid) {
      process.exit(-1);
    }
  }

}

BackendConfig.getConfig = function (requiredProperties) {
  // In local testing of isolated components, it's convenient to use local-vcap.json file
  // However, in a real deployment, the config is read from environment values.
  return new BackendConfig(requiredProperties);
};

module.exports = BackendConfig;

