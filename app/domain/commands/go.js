const Flows = require('../flows');

module.exports = function (flow, command) {
  return Flows.runSate(command.value);
}