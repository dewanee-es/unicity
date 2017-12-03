function Game(player) {
  Flow.call(this, 'game', player)
}

Game.prototype = Flow.prototype

Game.prototype.constructor = Game

Game.create = function (player) {
  if(!player.complete) {
    throw new Error('Incomplete player');
  }
  
  return new Game(player);
}

module.exports = Game;