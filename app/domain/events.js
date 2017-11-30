exports.newEvent = function (command, value) {
  return {
    command: command,
    value: value
  }
}

exports.onAction = function (events, action) {
  return events[action];
}