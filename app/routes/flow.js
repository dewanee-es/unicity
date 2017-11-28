var Context = require('../domain/context');
var Runner = require('../domain/runner');
var States = require('../domain/states');
var Snapshots = require('../domain/snapshots');
var config = require('../../config/config.json');

exports.profile = {};

exports.profile.currentState = function (req, res, next) {
  res.send(204);
  return next();
}

exports.profile.playAction = function (req, res, next) {
  res.send(204);
  return next();
}

exports.profile.resetState = function (req, res, next) {
  res.send(204);
  return next();
}

exports.game = {};

exports.game.currentState = function (req, res, next) {
  var player = req.player;
    
  if(player) {  
    Runner.currentFlowState('game', player)
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log('ERROR: Game current state. ' + (err.stack ? err.stack : err));
      res.send(err.stack ? 500 : 400);
    });
  } else {
    console.log('ERROR: Game current state. No player');
    res.send(401);
  }
  
  return next();
}

exports.game.playAction = function (req, res, next) {
  var player = req.player;
  var action = req.body ? req.body.action : false;

  if(!player) {
    console.log('ERROR: Game play action. No player');
    res.send(401);
  } else if(!action) {
    console.log('ERROR: Game play action. No action');
    res.send(401);
	} else {
	  Runner.playFlowAction('game', player, action)
	    .then(result => {
	      res.send(result);
	    })
	    .catch(err => {
	      console.log('ERROR: Game play action. ' + (err.stack ? err.stack : err));
	      res.send(err.stack ? 500 : 400);
	    });
	}
  
  return next();
}

exports.game.resetState = function (req, res, next) {
  res.send(204);
  return next();
}