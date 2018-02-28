const BaseService = require('./BaseService')

class UserService extends BaseService {

  constructor(userSchema) {
    super(userSchema);
  }

  signIn(email, password) {
    return new Promise((resolve, reject) => {
      this.schema.findOne({
        email: email
      }, function (err, user) {
        if (err) {
          reject(500);
        }
        else if (!user) {
          reject(400);
        }
        else {
          user.comparePassword(password, function (err, isMatch) {
            if (isMatch && !err) {

              let trained = true;
              if (!user.faceId) {
                trained = false;
              }
              let userInformation = {"firstName": user.firstName, "userId": user._id, "trained": trained};
              resolve(userInformation);
            }
            else {
              reject(400);
            }
          });
        }
      });
    });
  }
}

module.exports = UserService;
