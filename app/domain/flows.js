const Context = require('./context');
const Events = require('./events');
const Snapshots = require('./snapshots');
const States = require('./states');

function runState(flow, state) {
  return new Promise(function (resolve, reject) {
    States.loadState(state)
      .then(state => {
        if(!flow.snapshot) {
          flow.snapshot = Snapshots.newSnapshot(flow);
        }
        
        var context = Context.newContext(flow.name, flow.player, flow.environment);
        var command = States.bindState(state, context, flow.snapshot);
        if(command) {
          resolve(handleCommand(flow, command));
        } else {
          Snapshots.saveSnapshot(flow, snapshot)
            .then(snapshot => {
              resolve(snapshot.state);
            })
            .catch(err => {
              reject(err);
            })
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}

exports.runState = runState;

function newFlow(name, player) {
  return new Promise(function (resolve, reject) {
    try {
      var Flow = require('./flows/' + name);
      resolve(Flow.create({
        name: name,
        player: player,
        environment: {}
      }));
    } catch(e) {
      reject(e);
    }
  }
}

exports.newFlow = newFlow;

function currentState(flow) {
  return new Promise(function (resolve, reject) {
    Snapshots.loadSnapshot(flow)
    .then(snapshot => {
      if(snapshot === false) {
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
        if(snapshot === false) {
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
    var handler = require('./commands/' + command.name);
    resolve(handler(flow, command));
  });
}