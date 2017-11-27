console.log('Unicity server v.0.0.1.20171119');

var restify = require('restify');
var playersDomain = require('./app/domain/players');

var app = restify.createServer({name: 'Unicity'});
var routes = require('./app/routes/routes');

app.use(restify.plugins.queryParser({ mapParams: true }));
app.use(restify.plugins.bodyParser());

app.param('player', function (req, res, next) {
  return playersDomain.loadPlayer(req.params.player)
    .then(player => {
      req.player = player;
      return next();
    })
    .catch(err => {
      console.log('ERROR: ' + err);
      return next();
    });
});

routes.assignRoutes(app, restify);

app.listen(8080, function() {
  console.log('%s listening at %s', app.name, app.url);
});

