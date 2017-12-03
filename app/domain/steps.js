exports.executeStep = function (name, data, context, scene, events) {
  var step = require('./steps/' + name);
  if(!step.create) {
    throw new Error('Step ' + name + ' doesn\'t have a create function');
  }
  return step.create(data).execute(context, scene, events);
}