const Players = require('../domain/players');
const Snapshots = require('../domain/snapshots');

const Player = {

  login: function (req, res, next) {
    res.send(204);
    return next();
  },
  
  create: function (req, res, next) {
    var playerData = req.body;
    
    Players.createPlayer(playerData)
      .then(player => {
        res.send(player);
      })
      .catch(err => {
        console.log('ERROR: Create player. ' + err.stack);
        res.send(400);
      });
    
    return next();
  },
  
  current: function (req, res, next) {
    var player = req.player;
    
    if(player) {
      res.send(player);
    } else {
      console.log('ERROR: Current player. No player');
      res.send(401);
    }
    
    return next();
  },
  
  remove: function (req, res, next) {
    var player = req.player;
    
    if(player) {
      Snapshots.remove(player)
        .then(() => {
          return Players.deletePlayer(player)
        })
        .then(() => {
          res.send(204)
        })
        .catch(err => {
          console.log('ERROR: Delete player. ' + err.stack)
          res.send(500)
        })
    } else {
      console.log('ERROR: Delete player. No player');
      res.send(401);
    }
    
    return next();
  }
  
}

module.exports = Player
