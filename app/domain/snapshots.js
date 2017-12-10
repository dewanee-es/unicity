var dataRepo = require('../repo/data');

const Snapshots = {

  create: function () {
    return {
      scene: {},
      environment: {},
      flow: {}
    }
  },
  
  load: async function (player, flowname) {
    try {
      var snapshot = await dataRepo.loadSnapshot(player.id)
      if(snapshot && snapshot.flow && snapshot.flow.name == flowname) {
        return snapshot
      } else {
        return false
      }
    } catch(err) {
      return Promise.reject(err)
    }
  },
  
  save: async function (player, snapshot) {
    try {
      return dataRepo.saveSnapshot(player.id, snapshot)
    } catch(err) {
      return Promise.reject(err)
    }
  },
  
  remove: async function (player) {
    try {
      return dataRepo.deleteSnapshot(player.id)
    } catch(err) {
      return Promise.reject(err)
    }
  }

}

module.exports = Snapshots
