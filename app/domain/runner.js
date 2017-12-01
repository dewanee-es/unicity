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
      return snapshot.scene // TODO
    } else {
      return this.start(flowname)
    }
  } catch(err) {
    return Promise.reject(err)
  }
}

Runner.prototype.play = async function (flowname, action) {
  try {
    var snapshot = awit Snapshots.load(this.player, flowname)
    if(snapshot) {
      var flow = await Flows.load(snapshot.flow, this.player)  // TODO
      var scene = await flow.play(actiom, snapshot.environment)
      if(scene) { // TODO
        snapshot.scene = scene;
        snapshot.flow = flow.save();  // TODO
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
    var flow = Flows.create(flowname)
    var snapshot = Snapshots.create()
    snapshot.scene = flow.state(flowname)
    snapshot.flow = flow.save()
    await Snapshots.save(this.player, snapshot)
    return snapshot.scene
  } catch(err) {
    return Promise.reject(err)
  }
}

Runner.prototype.stop = async function (flowname) {
  // TODO
}
    
module.exports = Runner // TODO