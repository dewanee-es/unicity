const Runner = require('../domain/runner');

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
      var player = req.player;
      
      if(player) {
        Runner.create(player).start('game') // TODO
          .then(result => {
            res.send(result);
          })
          .catch(err => {
            console.log('ERROR: Game start. ' + (err.stack ? err.stack : err));
            res.send(err.stack ? 500 : 400);
          })
      } else {
        console.log('ERROR: Game start. No player');
        res.send(401);
      }

      return next();
    },
    
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
      var player = req.player;
      
      if(player) {
        Runner.create(player).stop('game') // TODO
          .then(result => {
            res.send(result);
          })
          .catch(err => {
            console.log('ERROR: Game stop. ' + (err.stack ? err.stack : err));
            res.send(err.stack ? 500 : 400);
          })
      } else {
        console.log('ERROR: Game stop. No player');
        res.send(401);
      }

      return next();
    }
    
  },
  
  profile: {
    
    state: function (req, res, next) {
      var player = req.player;
      
      if(player) {  
        Runner.create(player).state('profile')
          .then(result => {
            res.send(result);
          })
          .catch(err => {
            console.log('ERROR: Profile current state. ' + (err.stack ? err.stack : err));
            res.send(err.stack ? 500 : 400);
          });
      } else {
        console.log('ERROR: Profile current state. No player');
        res.send(401);
      }
      
      return next();
    },

    start: function (req, res, next) {
      var player = req.player;
      
      if(player) {
        Runner.create(player).start('profile')
          .then(result => {
            res.send(result);
          })
          .catch(err => {
            console.log('ERROR: Profile start. ' + (err.stack ? err.stack : err));
            res.send(err.stack ? 500 : 400);
          })
      } else {
        console.log('ERROR: Profile start. No player');
        res.send(401);
      }

      return next();
    },

    go: function (req, res, next) { // TODO
      var player = req.player;
      var action = req.body ? req.body.action : false;

      if(!player) {
        console.log('ERROR: Profile go action. No player');
        res.send(401);
      } else if(!action) {
        console.log('ERROR: Profile go action. No action');
        res.send(401);
      } else {
        Runner.create(player).play('profile', action)
          .then(result => {
            res.send(result);
          })
          .catch(err => {
            console.log('ERROR: Profile go action. ' + (err.stack ? err.stack : err));
            res.send(err.stack ? 500 : 400);
          });
      }
      
      return next();
    },

    end: function (req, res, next) {
      var player = req.player;
      
      if(player) {
        Runner.create(player).stop('profile')
          .then(result => {
            res.send(result);
          })
          .catch(err => {
            console.log('ERROR: Profile end. ' + (err.stack ? err.stack : err));
            res.send(err.stack ? 500 : 400);
          })
      } else {
        console.log('ERROR: Profile end. No player');
        res.send(401);
      }

      return next();
    }

  }
  
}

module.exports = Flow