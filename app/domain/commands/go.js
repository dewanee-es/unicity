const Flows = require('../flows');

module.exports = function (flow, command) {
  return Flows.runState(flow, command.value);
}