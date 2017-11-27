exports.newContext = function (player, environment) {
  return new Proxy({ player: player, environment: environment }, {
    get: function(target, property) {
      var descriptor = this.getOwnPropertyDescriptor(target, property);
      return descriptor ? descriptor.value : undefined;
    },

    getOwnPropertyDescriptor(target, property) {
      var value = undefined;
      if(property in target) {
        value = target[property];
      } else if(property in target.player) {
        value = target.player[property];
      } else if(property in target.environment) {
        value = target.environment[property];
      } else {
        return undefined;
      }
      return {configurable: true, enumerable: true, value: value};
    }
  });
}