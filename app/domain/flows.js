exports.onAction = function (flow, action) {
    var snapshot = dataRepo.loadSnapshot(flow);
    
    if(snapshot) {
        var command = Events.onAction(snapshot.events, action);
        
        if(command) {
            return this.handleCommand(flow, command);
        } else {
            return snapshot.state;
        }
    }
}

exports.handleCommand = function (flow, command) {
    var stateName = command;
    var state = States.loadState(stateName);
    var context = Context.newContext(flow.player, flow.environment);
    return States.bindState(state, context);
}