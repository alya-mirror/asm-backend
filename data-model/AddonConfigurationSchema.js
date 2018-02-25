var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AddonConfigurationSchema = new Schema({
  npm_name: {
    type: String,
    unique: true,
    required: true
  },
  addonId: {
    type: String,
    required: true,
    unique:true
  },
  settingsSchema: {
    type: Object,
    required: true
  }
});

module.exports = mongoose.model('AddonConfigurationSchema', AddonConfigurationSchema);
