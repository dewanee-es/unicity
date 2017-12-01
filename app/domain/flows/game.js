// TODO

function Game(data) {
  Object.assign(this, data);
}

Game.create = function (data) {
  if(!data.player.complete) {
    throw new Error('Incomplete player');
  }
  
  return new Game(data);
}

module.exports = Game;