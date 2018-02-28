'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AddonSchema = new Schema({
  npm_name: {
    type: String,
    unique: true,
    required: true
  },
  description: {
    type: String,
    required: false,
    default: 'addon for alya smart mirror'
  },
  name: {
    type: String,
    required: true
  },
  repo_git_url: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Addon', AddonSchema);
