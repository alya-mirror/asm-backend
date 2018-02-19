const express = require('express');
const apiApp = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRouter = express.Router();


const http = require('http');


const props = {
  appInfo: {},
  appPort: 3100,
  appHost: 'localhost',
};
const config = require('./appConfig.js').getConfig(props);

apiApp.use(bodyParser.json());
apiApp.use(bodyParser.urlencoded({
  extended: false
}));
apiApp.use(cors());
apiApp.use('/api', apiRouter);

var server = http.createServer(apiApp);


server.listen(config.appPort, '0.0.0.0', function () {
  console.log('APIs on port ' + config.appPort);
});


