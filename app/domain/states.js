var dataRepo = require('../repo/data');
var { shuffle } = require('../tools/data_tools');
var Steps = require('./steps');
var util = require('util');

exports.loadState = function (name) {
  return new Promise(function(resolve, reject) {
    dataRepo.loadState(name)
      .then(state => {
        resolve(state);
      })
      .catch(err => {
        reject(err);
      });
  });
}

exports.bindState = function (state, context, scene, events) {
  var command = false;
  for(var step in state) {
    command = Steps.executeStep(step, state[step], context, scene, events) || command
  }
  return command
}
