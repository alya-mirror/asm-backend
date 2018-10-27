const UserService = require('../endpointsServices/UserService');
const UserSchema = require('../../data-model/User');
const config = require('../../config/config.default');

let positionsMap = new Object();

class UserEndpoint {

  initialize(router) {
    this.userService = new UserService(UserSchema);

    this.basePath = '/user';

    router.post(this.basePath + "/", this.create.bind(this));
    router.get(this.basePath + "/logout/:id", this.signOut.bind(this));
    router.post(this.basePath + "/login", this.signIn.bind(this));
  }

  signOut(req, res) {
    const method = 'UserEndpoint.signOut';
    const path = 'GET ' + this.basePath + '/';
    console.info(method, 'Access to', path);

  }

  initializePositions() {
    positionsMap["w3-display-topleft"] = 0;
    positionsMap["w3-display-topmiddle"] = 0;
    positionsMap["w3-display-topright"] = 0;

    positionsMap["w3-display-left"] = 0;
    positionsMap["w3-display-middle"] = 0;
    positionsMap["w3-display-right"] = 0;

    positionsMap["w3-display-bottomright"] = 0;
    positionsMap["w3-display-bottommiddle"] = 0;
    positionsMap["w3-display-bottomright"] = 0;
    return positionsMap;
  }

  create(req, res) {
    const method = 'UserEndpoint.create ';
    const path = 'POST ' + this.basePath + '/';
    console.info(method, 'Access to', path);

    const body = req.body;
    const firstName = body.firstName;
    const email = body.email;
    const password = body.password;
    const mirrorConfiguration = this.initializePositions();

    const newUser = new UserSchema({
      email: email,
      password: password,
      firstName: firstName,
      faceId: "",
      mirrorConfiguration: mirrorConfiguration
    });
    this.userService.insert(newUser).then((savedUser) => {
      res.sendStatus(201);
    }).catch((err) => {
      if (err.code == 11000) {
        res.status(400).send('user already exist');
      }
      else {
        res.status(500).send(err);
      }
    });
  };

  signIn(req, res) {
    const method = 'UserEndpoint.signIn ';
    const path = 'POST ' + this.basePath + '/';
    console.info(method, 'Access to', path);

    const body = req.body;
    const email = body.email;
    const password = body.password;

    this.userService.signIn(email, password).then((userInformation) => {
      res.status(200).send(userInformation);
    }).catch((statusCode) => {
      res.sendStatus(statusCode);
    });
  }
}

module.exports = UserEndpoint;
