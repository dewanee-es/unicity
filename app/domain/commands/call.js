const Flows = require('../flows')

// TODO

module.exports = function (flow, command) {
    var subflow = Flows.newFlow(command.value, flow.player);
    flow.child = subflow;
}