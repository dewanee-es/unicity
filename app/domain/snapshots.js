var dataRepo = require('../repo/data');

exports.loadSnapshot = function (flow) {
  return new Promise(function(resolve, reject) {
    dataRepo.loadSnapshot(flow.player.id)
      .then(snapshot => {
        resolve(snapshot);
      })
      .catch(err => {
        reject(err);
      });
  });
}

exports.saveSnapshot = function (flow, snapshot) {
  return new Promise(function(resolve, reject) {
    Object.assign(snapshot, { flow: flow.name });
    dataRepo.saveSnapshot(flow.player.id, snapshot)
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
