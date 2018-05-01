class BaseService {

  constructor(schema) {
    this.schema = schema;
  }

  insert(newSchema) {
    return new Promise((resolve, reject) => {
      newSchema.save(function (err, savedSchema) {
        if (err) {
          reject(err);
        }
        else {
          resolve(savedSchema);
        }
      });
    });

  }

  find(query) {
    return new Promise((resolve, reject) => {
      this.schema.find(query, function (err, results) {
        if (err) {
          reject(err);
        }
        else {
          resolve(results);
        }
      });
    });
  }

  findOne(query) {
    return new Promise((resolve, reject) => {
      this.schema.findOne(query, function (err, result) {
        if (err) {
          reject(err);
        }
        else {
          resolve(result);
        }
      });
    });
  }

  update(query, update) {
    return new Promise((resolve, reject) => {
      this.schema.findOneAndUpdate(query, update, function (err, results) {
        if (err || !results) {
          reject(err);
        }
        else {
          resolve(results);
        }

      });
    });
  }

  delete(query) {
    return new Promise((resolve, reject) => {
      this.schema.find(query).remove(function (err) {
        if (err) {
          reject(err);
        }
        else {
          resolve();
        }
      })
    });
  }

  exist(query) {
    return new Promise((resolve, reject) => {
      this.schema.findOne(query, function (err, results) {
        if (err || !results) {
          reject(err);
        }
        else {
          resolve(results);
        }
      });
    });
  }

}

module.exports = BaseService;
