exports.newEvent = function (command, value) {
  return {
    name: command,
    value: value
  }
}

exports.onAction = function (events, action) {
  return events[action];
}