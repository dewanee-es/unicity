const Events = require('../events');

function Call(call) {
  this.call = call;
}

Call.create = function (call) {
  return new Call(call);
}

Call.prototype.execute = function () {
  return Events.newEvent('call', call);
}

module.exports = Call;