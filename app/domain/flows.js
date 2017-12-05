const Context = require('./context');
const Events = require('./events');
const Snapshots = require('./snapshots');
const States = require('./states');

function Flow(name, player, environment) {
  this.name = name
  this.player = player
  this.environment = environment
  this.events = {}
}

Flow.create = function (name, player, environment) {
  return require('./flows/' + name).create(name, player, environment)
}

Flow.load = async function (data, player, environment) {
  var flow = Flow.create(data.name, player, environment)
  flow.events = data.events
  if(data.child) {
    flow.child = Flow.load(data.child, player, environment) 
  }
  return flow
}

Flow.prototype.state = async function (name, context, scene) {
  try {
    var state = await States.loadState(name)
    if(!context) {
      context = Context.newContext(this.name, this.player, this.environment)
    }
    if(!scene) {
      scene = {}
    }
    this.events = {}
    var command = await States.bindState(state, context, scene, this.events)
    if(command) {
      await this.handleCommand(command, context, scene)
    }
    return scene
  } catch(err) {
    return Promise.reject(err)
  }
}

Flow.prototype.play = async function(action) {
  try {
    if(this.child) {
      return this.child.play(action)
    } else {
      var command = Events.onAction(this.events, action)
      if(command) {
        var context = Context.newContext(this.name, this.player, this.environment)
        var scene = {}
        await this.handleCommand(command, context, scene)
        return scene
      }
      return false
    }
  } catch(err) {
    return Promise.reject(err)
  }
}

Flow.prototype.handleCommand = async function (command, context, scene) {
  try {
    var handler = require('./commands/' + command.name)
    handler(this, command, context, scene)
  } catch(err) {
    return Promise.reject(err)
  }
}

Flow.prototype.save = function() {
  var data = {
    name: this.name,
    events: this.events
  }
  if(this.child) {
    data.child = this.child.save()
  }
  return data
}

Flow.prototype.start = async function (context, scene) {
  try {
    if(this.onStart) {
      await this.onStart()
    }
    return await this.state(this.name, context, scene)
  } catch(err) {
    return Promise.reject(err)
  }
}

Flow.prototype.stop = async function () {
  try {
    if(this.onEnd) {
      await this.onEnd()
    }
  } catch(err) {
    return Promise.reject(err)
  }
}

module.exports = Flow