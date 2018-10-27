'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserAddonsSchema = new Schema({
  addonId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  coreSettings: {
    type: Object,
    required: true
  },
  addonSettings: {
    type: Object,
    required: true
  }
});

module.exports = mongoose.model('UserAddon', UserAddonsSchema);
