function Match(player, environment) {
  Flow.call(this, 'match', player, environment)
}

Match.prototype = Flow.prototype

Match.prototype.constructor = Match

Match.prototype.onStart = async function () {
  var candidates = []
  while(candidates.length < 4) {
    candidates.push(await Players.randomPlayer(this.player.attraction, this.player.gender))
  }
  this.environment.candidates = candidates
}

Match.create = function (player, environment) {
  return new Match(player, environment);
}

module.exports = Match;