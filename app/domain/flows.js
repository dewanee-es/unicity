const Context = require('./context');
const Events = require('./events');
const Snapshots = require('./snapshots');
const States = require('./states');

function Flow(name) {
  this.name = name
}

Flow.create = function (name) {
  return new Flow(name)
}

// TODO

Flow.prototype.state = async function (name) {
  try {
    var state = await States.loadState(name);
    var context = Context.newContext(flow.name, flow.player, flow.environment);
    var output = await States.bindState(state, context);
    if(output.command) {
      return
          resolve(handleCommand(flow, command));
        } else {
          Snapshots.saveSnapshot(flow, flow.snapshot)
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
  });
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

module.exports = Flow