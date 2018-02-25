var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AddonSchema = new Schema({
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
  },
});

module.exports = mongoose.model('Addon', AddonSchema);
