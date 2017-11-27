var dataRepo = require('../repo/data');

exports.createPlayer = function (playerData) {
  Object.assign(playerData, {
    id: false,
    complete: false,
    playing: false
  });
  
  return new Promise(function(resolve, reject) {
    dataRepo.savePlayer(playerData)
      .then(player => {
        resolve(player);
      })
      .catch(err => {
        reject(err);
      });
  });
}

exports.deletePlayer = function ({ id }) {
  return new Promise(function(resolve, reject) {
    dataRepo.deletePlayer(id)
      .then(() => {
        resolve(true);
      })
      .catch(err => {
        reject(err);
      });
  });
}

exports.loadPlayer = function (id) {
  return new Promise(function(resolve, reject) {
    dataRepo.loadPlayer(id)
      .then(player => {
        resolve(player);
      })
      .catch(err => {
        reject(err);
      });
  });
}
