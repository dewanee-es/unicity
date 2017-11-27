var profile = require('./profile');
var player = require('./player');
var flow = require('./flow');

exports.assignRoutes = function (app, restify) {
  //app.post('/login', player.login);
  //console.log('Add route POST /login');
  
  //app.get('/flow/profile', flow.profile.currentState);
  //console.log('Add route GET /flow/profile');
  
  //app.put('/flow/profile', flow.profile.playAction);
  //console.log('Add route PUT /flow/profile');
  
  //app.del('/flow/profile', flow.profile.resetState);
  //console.log('Add route DELETE /flow/profile');
  
  app.get('/flow/game', flow.game.currentState);
  console.log('Add route GET /flow/game');
  
  //app.put('/flow/game', flow.game.playAction);
  //console.log('Add route PUT /flow/game');
  
  //app.del('/flow/game', flow.game.resetState);
  //console.log('Add route DELETE /flow/game');
  
  app.get(/\/character\/.*/, restify.plugins.serveStatic({
    directory: './assets'
  }));
  console.log('Add route GET /character/:attribute/:value');
  
  app.get('/profile/occupation', profile.searchOccupation);
  console.log('Add route GET /profile/occupation');
  
  //app.get('/player', player.currentPlayer);
  //console.log('Add route GET /player');
  
  //app.post('/player', player.createPlayer);
  //console.log('Add route POST /player');
  
  //app.del('/player', player.deletePlayer);
  //console.log('Add route DELETE /player');
}
