var Flows = require('./flows');

exports.currentFlowState = function (name, player) {
  return new Promise(function (resolve, reject) {
    Flows.newFlow(name, player)
      .then(flow => {
        Flows.currentState(flow)
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          })        
      })
      .catch(err => {
        reject(err);
      })
  });
}

exports.playFlowAction = function (name, player, action) {
  return new Promise(function (resolve, reject) {
    Flows.newFlow(name, player)
      .then(flow => {
        Flows.executeAction(flow, action)
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          })
      })
      .catch(err => {
        reject(err);
      })
  });
}