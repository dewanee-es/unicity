var dataRepo = require('../repo/data');

exports.loadSnapshot = function ({ id }) {
  return new Promise(function(resolve, reject) {
    dataRepo.loadSnapshot(id)
      .then(snapshot => {
        resolve(snapshot);
      })
      .catch(err => {
        reject(err);
      });
  });
}

exports.saveSnapshot = function ({ id }, snapshot) {
  return new Promise(function(resolve, reject) {
    dataRepo.saveSnapshot(id, snapshot)
      .then(snapshot => {
        resolve(snapshot);
      })
      .catch(err => {
        reject(err);
      });
  });
}

exports.deleteSnapshot = function ({ id }) {
  return new Promise(function(resolve, reject) {
    dataRepo.deleteSnapshot(id)
      .then(() => {
        resolve(true);
      })
      .catch(err => {
        reject(err);
      });
  });
}
