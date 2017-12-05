var flow = require('./flow');
var player = require('./player');
var character = require('./character');

exports.assignRoutes = function (app, restify) {
  app.post('/login', player.login);
  console.log('Add route POST /login');
  
  app.get('/profile/state', flow.profile.state);
  console.log('Add route GET /profile/state');
  
  app.post('/profile/start', flow.profile.start);
  console.log('Add route POST /profile/start');
  
  app.post('/profile/go', flow.profile.go); 
  console.log('Add route POST /profile/go');
  
  app.post('/profile/end', flow.profile.end);
  console.log('Add route POST /profile/end');
  
  app.get('/game/state', flow.game.state);
  console.log('Add route GET /game/state');
  
  app.post('/game/start', flow.game.start);
  console.log('Add route POST /game/start');
  
  app.post('/game/play', flow.game.play);
  console.log('Add route POST /game/play');
  
  app.post('/game/stop', flow.game.stop);
  console.log('Add route POST /game/stop');
  
  app.get('/character/occupation', character.occupation.search);
  console.log('Add route GET /character/occupation');
  
  app.get(/\/character\/.*/, restify.plugins.serveStatic({
    directory: './assets'
  }));
  console.log('Add route GET /character/:attribute/:value');
  
  app.get('/player', player.current);
  console.log('Add route GET /player');
  
  app.post('/player', player.create);
  console.log('Add route POST /player');
  
  app.del('/player', player.remove);
  console.log('Add route DELETE /player');
}
