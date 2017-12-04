const Flows = require('../flows');

module.exports = function (flow, command, context, scene) {
  flow.state(command.value, context, scene)
}