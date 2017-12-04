const Flows = require('../flows')

module.exports = function (flow, command, context, scene) {
    var subflow = Flows.create(command.value, flow.player, flow.environment)
    flow.child = subflow
    subflow.start(context, scene)
}