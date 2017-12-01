const Runner = require('../domain/runner');

// TODO

const Flow = {
    
  game: {
    
    state: function (req, res, next) {
      var player = req.player;
        
      if(player) {  
        Runner.create(player).state('game')
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
    },

    start: function (req, res, next) {
      res.send(204);
      return next();
    }
    
    play: function (req, res, next) {
      var player = req.player;
      var action = req.body ? req.body.action : false;

      if(!player) {
        console.log('ERROR: Game play action. No player');
        res.send(401);
      } else if(!action) {
        console.log('ERROR: Game play action. No action');
        res.send(401);
      } else {
        Runner.create(player).play('game', action)
          .then(result => {
            res.send(result);
          })
          .catch(err => {
            console.log('ERROR: Game play action. ' + (err.stack ? err.stack : err));
            res.send(err.stack ? 500 : 400);
          });
      }
      
      return next();
    },

    stop: function (req, res, next) {
      res.send(204);
      return next();
    }
    
  }
  
  profile: {
    
    state: function (req, res, next) {
      res.send(204);
      return next();
    },

    start: function (req, res, next) {
      res.send(204);
      return next();
    },

    next: function (req, res, next) {
      res.send(204);
      return next();
    },

    end: function (req, res, next) {
      res.send(204);
      return next();
    }

  }
  
}

module.exports = Flow