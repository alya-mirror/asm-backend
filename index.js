'use strict';

const AWSIoTclient = require('./api/utils/AWSIotClient');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const config = require('./config/config.default');
const mongoose = require('mongoose');

const UserEndpoint = require('./api/endPoints/UserEndpoint');
const UserAddonEndpoint = require('./api/endPoints/UserAddonEndpoint');
const RecognitionService = require('./api/otherServices/RecognitionService');
const AddonEndpoint = require('./api/endPoints/AddonEndpoint');
const AddonConfigurationSchemaEndpoint = require('./api/endPoints/AddonConfigurationSchemaEndpoint');

const userEndpoint = new UserEndpoint();
const recognitionService = new RecognitionService();
const userAddonEndpoint = new UserAddonEndpoint();
const addonEndpoint = new AddonEndpoint();
const addonConfigurationSchemaEndpoint = new AddonConfigurationSchemaEndpoint();

const apiApp = express();
const apiRouter = express.Router();
const awsIotClient = new AWSIoTclient();

mongoose.connect('mongodb://localhost/alyaSmartMirror');

const props = {
  appInfo: {},
  appPort: 3100,
  /* put your ip address in the appHost  */
  appHost: '',
};

const appConfig = require('./appConfig.js').getConfig(props);

apiApp.use(bodyParser.json());
apiApp.use(bodyParser.urlencoded({
  extended: false
}));
apiApp.use(cors());
apiApp.use('/api', apiRouter);

const server = http.createServer(apiApp);
const socketIo = require('socket.io')(server);

awsIotClient.connect(config.awsIoTConfigs)
.then(() => {
  awsIotClient.subscribe(config.topics.DATA_TOPIC, {});
}).catch((error) => {
  console.log('could not connect to AWSIoT ' + error);
});

const allAddons = require('./data/approvedAddons');
const addonsConfigurationSchemas = require('./data/addonsConfigurationSchemas');
const AddonSchema = require('./data-model/Addon');
const AddonConfigurationSchema = require('./data-model/AddonConfigurationSchema');

(function initializeDatabase() {
  initializeResources(AddonSchema, allAddons);
  initializeResources(AddonConfigurationSchema, addonsConfigurationSchemas);
}());
function initializeResources(schema, data) {
  schema.insertMany(data, function(error, docs) {
    if (error) {
      console.log(schema.collection.collectionName + ' has been initialized');
    }
  });
}

recognitionService.initialize(socketIo, awsIotClient);
userEndpoint.initialize(apiRouter);
userAddonEndpoint.initialize(apiRouter, socketIo);
addonEndpoint.initialize(apiRouter);
addonConfigurationSchemaEndpoint.initialize(apiRouter);

server.listen(appConfig.appPort, '0.0.0.0', function() {
  console.log('APIs on port ' + appConfig.appPort);
});
