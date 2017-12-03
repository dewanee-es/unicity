const Context = require('./context');
const Events = require('./events');
const Snapshots = require('./snapshots');
const States = require('./states');

function Flow(name, player) {
  this.name = name
  this.player = player
}

Flow.create = function (name, player) {
  return new Flow(name, player)
}

// TODO

Flow.prototype.state = async function (name, environment) {
  try {
    var state = await States.loadState(name)
    var context = Context.newContext(this.name, this.player, environment)
    var scene = {}
    this.events = {}
    var command = await States.bindState(state, context, scene, this.events)
    if(command) {
      this.handleCommand(command, context, scene)
    }
    return scene
  } catch(err) {
    return Promise.reject(err)
  }
}

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