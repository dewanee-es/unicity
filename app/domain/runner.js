var Flows = require('./flows');

exports.currentFlowState = function (name, player) {
  return new Promise(function (resolve, reject) {
    if(name == 'game') {
      if(!player.complete) {
        reject('Incomplete player');
      } else {
        var flow = Flows.newFlow(name, player);
        Flows.currentState(flow)
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          })
      }
    } else {
      reject('Unkown flow: ' + name);
    }
  });
}

exports.playFlowAction = function (name, player, action) {
  return new Promise(function (resolve, reject) {
    if(name == 'game') {
      if(!player.complete) {
        reject('Incomplete player');
      } else {
        var flow = Flows.newFlow(name, player);
        Flows.executeAction(flow, action)
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          })
      }
    } else {
      reject('Unkown flow: ' + name);
    }
  });
}