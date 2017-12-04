const Flows = require('./flows')
const Snapshots = require('./snapshots')

function Runner(player) {
  this.player = player 
}

Runner.create = function (player) {
  return new Runner(player)
}

Runner.prototype.state = async function (flowname) {
  try {
    var snapshot = await Snapshots.load(this.player, flowname)
    if(snapshot) {
      return snapshot.scene
    } else {
      return this.start(flowname)
    }
  } catch(err) {
    return Promise.reject(err)
  }
}

Runner.prototype.play = async function (flowname, action) {
  try {
    var snapshot = await Snapshots.load(this.player, flowname)
    if(snapshot) {
      var flow = await Flows.load(snapshot.flow, this.player, snapshot.environment)
      var scene = await flow.play(action)
      if(scene) {
        snapshot.scene = scene;
        snapshot.flow = flow.save();
        await Snapshots.save(this.player, snapshot)
      }
      return snapshot.scene
    } else {
      return this.start(flowname)
    }
  } catch(err) {
    return Promise.reject(err)
  }
}

Runner.prototype.start = async function (flowname) {
  try {
    var snapshot = Snapshots.create()
    var flow = Flows.create(flowname, this.player, snapshot.environment)
    snapshot.scene = await flow.start()
    snapshot.flow = flow.save()
    await Snapshots.save(this.player, snapshot)
    return snapshot.scene
  } catch(err) {
    return Promise.reject(err)
  }
}

Runner.prototype.stop = async function (flowname) {
  try {
    var snapshot = await Snapshots.load(this.player, flowname)
    if(snapshot) {
      var flow = await Flows.load(snapshot.flow, this.player, snapshot.environment)
      flow.stop() // TODO
    }
  } catch(err) {
    return Promise.reject(err)
  }
}
    
module.exports = Runner