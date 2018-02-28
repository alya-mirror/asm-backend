'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const UserController = require('./api/endPoints/UserEndpoint');
const mongoose = require('mongoose');

const apiApp = express();
const apiRouter = express.Router();

mongoose.connect('mongodb://localhost/alyaSmartMirror');

const props = {
  appInfo: {},
  appPort: 3100,
  appHost: 'localhost',
};
const config = require('./appConfig.js')
  .getConfig(props);

apiApp.use(bodyParser.json());
apiApp.use(bodyParser.urlencoded({
  extended: false
}));
apiApp.use(cors());
apiApp.use('/api', apiRouter);

const server = http.createServer(apiApp);
new UserController(config, apiRouter);

server.listen(config.appPort, '0.0.0.0', function() {
  console.log('APIs on port ' + config.appPort);
});