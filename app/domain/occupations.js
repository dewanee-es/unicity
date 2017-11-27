var Fuse = require('fuse.js');
var dataRepo = require('../repo/data');

var occupations = [];

dataRepo.loadOccupations()
  .then(list => {
    occupations = list;
    console.log('Loaded %d occupations', occupations.length);
  })
  .catch(err => {
    console.log('ERROR: Error loading occupations. ' + err + err.stack);
  });

exports.searchOccupation = function(name, gender) {
  return new Promise(function(resolve, reject) {
    if(name.length < 3 || name.length > 25) {
      resolve([]);
    } else {
      var filtered = occupations.filter(occupation => occupation[gender]);
      var options = {
        shouldSort: true,
        includeScore: true,
        threshold: 0.7,
        location: 0,
        distance: 10,
        maxPatternLength: 25,
        minMatchCharLength: 1,
        keys: ["name"]
      };
      var fuse = new Fuse(filtered, options);
      var results = fuse.search(name);
      
      if(results.length == 0) {
        resolve([]);
      } else if(results[0].score === 0.0) {
        resolve([results[0].item.name]);
      } else {
        resolve(results.map(result => result.item.name).slice(0, 4));
      }
    }
  });
}

