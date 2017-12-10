const Flow = require('../flows')
const Players = require('../players')

function Game(player, environment) {
  Flow.call(this, 'game', player, environment)
}

Game.prototype = Flow.prototype

Game.prototype.constructor = Game

Game.prototype.onStart = function () {
  if(!this.player.complete) {
    throw new Error('Incomplete player')
  } else if(!this.player.playing) {
    this.player.playing = true
    Players.savePlayer(this.player)
  }
}

Game.prototype.onStop = function() {
  if(this.player.playing) {
    this.player.playing = false
    Players.savePlayer(this.player)
  }
}

Game.create = function (player, environment) {
  return new Game(player, environment)
}

module.exports = Game;