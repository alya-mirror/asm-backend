'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AddonConfigurationSchema = new Schema({
  npm_name: {
    type: String,
    unique: true,
    required: true
  },
  addonId: {
    type: String,
    required: true,
    unique: true
  },
  settingsSchema: {
    type: Object,
    required: true
  }
});

module.exports = mongoose.model('AddonConfigurationSchema', AddonConfigurationSchema);
