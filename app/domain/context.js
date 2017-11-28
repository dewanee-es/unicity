const config = require('../../config/config.json');

exports.newContext = function (flow, player, environment) {
  return new Proxy({ flow: flow, player: player, environment: environment, vars: config.vars }, {
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
      } else if(property in target.vars) {
        value = target.vars[property];
      } else {
        return undefined;
      }
      return {configurable: true, enumerable: true, value: value};
    }
  });
}