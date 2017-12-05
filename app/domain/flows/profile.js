function Profile(player, environment) {
  Flow.call(this, 'profile', player, environment)
}

Profile.prototype = Flow.prototype

Profile.prototype.constructor = Profile

Profile.prototype.onStart = function () {
  if(this.player.playing) {
    throw new Error('Player is playing');
  }
}

Profile.create = function (player, environment) {
  return new Profile(player, environment);
}

module.exports = Profile;