var occupationDomain = require('../domain/occupations');

exports.searchOccupation = function (req, res, next) {
  var player = req.player;
  var name = req.query.name;

  if(player && player.gender) {
    if(name) {
      occupationDomain.searchOccupation(name, player.gender)  
        .then(occupations => {
          res.send(occupations);
        })
        .catch(err => {
          console.log('ERROR: Search occupation. ' + err.stack);
          res.send(500);
        });
    } else {
      console.log('ERROR: Search occupation. Missing name.');
      res.send(400);
    }
  } else {
    console.log('ERROR: Search occupation. No player or gender.');
    res.send(401);
  }
  
  return next();
}
