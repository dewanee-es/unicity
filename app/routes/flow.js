var Context = require('../domain/context');
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
    Snapshots.loadSnapshot(player)
      .then(snapshot => {
        if(snapshot === false) {
          States.loadState(config.start)
            .then(state => {
              var context = Context.newContext(player, {});
              var snapshot = States.bindState(state, context);
              Snapshots.saveSnapshot(player, snapshot)
                .then(snapshot => {
                  res.send(snapshot.state);
                })
                .catch(err => {
                  console.log('ERROR: Save snapshot. ' +  err.stack);
                  res.send(500);
                })
            })
            .catch(err => {
              console.log('ERROR: Load state. ' + err.stack);
              res.send(500);
            });
        } else {
          res.send(snapshot.state);
        }
      })
      .catch(err => {
        console.log('ERROR: Load snapshot. ' + err.stack);
        res.send(500);
      });
  } else {
    console.log('ERROR: Game current state. No player');
    res.send(401);
  }
  
  return next();
}

exports.game.playAction = function (req, res, next) {
  res.send(204);
  return next();
}

exports.game.resetState = function (req, res, next) {
  res.send(204);
  return next();
}