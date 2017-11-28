const Context = require('./context');
const Events = require('./events');
const Snapshots = require('./snapshots');
const States = require('./states');

function runState(flow, state) {
  return new Promise(function (resolve, reject) {
    States.loadState(state)
      .then(state => {
        var context = Context.newContext(flow.name, flow.player, flow.environment);
        var snapshot = States.bindState(state, context);
        Snapshots.saveSnapshot(flow, snapshot)
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

function newFlow(name, player) {
  return {
    name: name,
    player: player,
    environment: {}
  };
}

exports.newFlow = newFlow;

function currentState(flow) {
  return new Promise(function (resolve, reject) {
    Snapshots.loadSnapshot(flow)
    .then(snapshot => {
      if(snapshot === false || snapshot.flow != flow.name) {
        resolve(runState(flow, flow.name));
      } else {
        resolve(snapshot.state);
      }
    })
    .catch(err => {
      console.log('ERROR: Load snapshot. ' + err.stack);
      res.send(500);
    });

  })
}

exports.currentState = currentState;

function executeAction(flow, action) {
  return new Promise(function (resolve, reject) {
    Snapshots.loadSnapshot(flow)
      .then(snapshot => {
        if(snapshot === false || snapshot.flow != flow.name) {
          resolve(runState(flow, flow.name));
        } else {
          var command = Events.onAction(snapshot.events, action);
          if(command) {
            resolve(handleCommand(flow, command));
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

exports.executeAction = executeAction;

function handleCommand(flow, command) {
  return new Promise(function (resolve, reject) {
    var stateName = command;
    resolve(runState(flow, stateName));
    States.loadState(stateName);
  });
}