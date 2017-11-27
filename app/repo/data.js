const file = require('./file');

exports.loadOccupations = function() {
  return file.loadOccupations();
};

exports.loadPlayer = function(id) {
  return file.loadPlayer(id);
}

exports.savePlayer = function(player) {
  return file.savePlayer(player);
}

exports.deletePlayer = function(id) {
  return file.deletePlayer(id);
}

exports.loadSnapshot = function(id) {
  return file.loadSnapshot(id);
}

exports.saveSnapshot = function(id, snapshot) {
  return file.saveSnapshot(id, snapshot);
}

exports.deleteSnapshot = function(id) {
  return file.deleteSnapshot(id);
}

exports.loadState = function(name) {
  return file.loadState(name);
};
