const BaseService = require('./BaseService')
const UserAddonSchema = require('../../data-model/UserAddon');

class AddonService extends BaseService {

  constructor(addonSchema) {
    super(addonSchema);
  }

  getUninstalledAddons(allApprovedAddons, userAddons) {
    let unInstalledAddons = [];
    let index = 0;
    while (index < allApprovedAddons.length) {
      if (userAddons) {
        for (let i = 0; i < userAddons.length; i++) {
          if (allApprovedAddons[index]._id == userAddons[i].addonId) {
            index++;
            i = -1;
          }
        }
      }
      unInstalledAddons.push(allApprovedAddons[index]);
      index++;
    }
    return unInstalledAddons;
  }

  getInstalledAddons(userAddons) {
    return new Promise((resolve, reject) => {
      let installedAddons = [];
      let addonsIDs = [];
      for (let i = 0; i < userAddons.length; i++) {
        addonsIDs.push(userAddons[i].addonId);
      }
      this.schema.find({
        _id: {$in: addonsIDs}
      }, function (err, docs) {
        if (!err) {
          docs.forEach(function (element) {
            installedAddons.push(element);
          });
          resolve(installedAddons);
        }
        else {
          console.log('error ' + err);
        }
      });
    });
  }

  getAllApprovedAddons(userId) {
    let self = this;
    return new Promise((resolve, reject) => {
      this.find({}).then((allApprovedAddons) => {
        UserAddonSchema.find({userId: userId}, function (err, userAddons) {
          if (err) {
            reject(err);
          }
          else {
            let unInstalledAddons = self.getUninstalledAddons(allApprovedAddons, userAddons);
            self.getInstalledAddons(userAddons).then((installedAddons) => {
              let response = {"userUninstalledAddons": unInstalledAddons, "userInstalledAddons": installedAddons};
              resolve(response);
            });

          }
        });
      }).catch((err) => {
        reject(err);
      })
    });
  }
}


module.exports = AddonService;
