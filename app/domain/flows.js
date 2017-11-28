const Events = require('./events');
const Snapshots = require('./snapshots');

function runState(flow, state) {
  return new Promise(function (resolve, reject) {
    States.loadState(state)
      .then(state => {
        var context = Context.newContext(flow.player, flow.environment);
        var snapshot = States.bindState(state, context);
        Snapshots.saveSnapshot(player, snapshot)
          .then(snapshot => {
            resolve(snapshot.state);
          })
          .catch(err => {
            reject(err);
          })
      })
      .catch(err => {
        reject(err);
      });
  });
}

exports.newFlow = function (name, player) {
  return {
    name: name,
    player: player,
    environment: {}
  };
}

exports.executeAction = function (flow, action) {
  return new Promise(function (resolve, reject) {
    Snapshots.loadSnapshot(flow.player)
      .then(snapshot => {
        if(snapshot === false || snapshot.flow != flow.name) {
          resolve(runState(flow, flow.name));
        } else {
          var command = Events.onAction(snapshot.events, action);
          if(command) {
            resolve(this.handleCommand(flow, command));
          } else {
            resolve(snapshot.state);
          }
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}

exports.handleCommand = function (flow, command) {
  return new Promise(function (resolve, reject) {
    var stateName = command;
    resolve(runState(flow, stateName));
    States.loadState(stateName);
  });
}