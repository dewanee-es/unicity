var dataRepo = require('../repo/data');

var emptyPlayer = {
  id: false,          // number
  completed: false,   // boolean
  playing: false,     // boolean
  email: false,       // string
  name: false,        // string
  surname: false,     // string(2)
  gender: false,      // male, female
  attraction: false,  // male, female, both
  birthDate: false,   // date
  gps: false,         // location
  height: false,      // number(cm)
  weight: false,      // number(kg)
  occupation: false,  // string
  traits: {         
    one: false,       // percent
    two: false,       // percent
    three: false,     // percent
    four: false,      // percent
    five: false       // percent
  },
  preferences: {
    sound: false      // music, alerts, off
  },
  character: {
    skin: false,      // string
    hair: false,      // string
    eyes: false,      // string
    mouth: false,     // string
    outfit: false     // string
  }
}

function decoratePlayer(player) {
  player.fullName = () => this.name + ' ' + this.surname;
  player.sexuality = () => {
    switch(this.gender + '-' + this.attraction) {
    case 'male-male':
      return 'gay';
    case 'male-female':
    case 'female-male':
      return 'heterosexual';
    case 'male-both':
    case 'female-both':
      return 'bisexual';
    case 'female-female':
      return 'lesbian';
    default:
      return 'unknown';
    }
  }
}

exports.createPlayer = function (playerData) {
  playerData = Object.assign({}, emptyPlayer, playerData, {
    id: false,
    complete: false,
    playing: false
  });
  
  return new Promise(function(resolve, reject) {
    dataRepo.savePlayer(playerData)
      .then(player => {
        resolve(decoratePlayer(player));
      })
      .catch(err => {
        reject(err);
      });
  });
}

exports.deletePlayer = function ({ id }) {
  return new Promise(function(resolve, reject) {
    dataRepo.deletePlayer(id)
      .then(() => {
        resolve(true);
      })
      .catch(err => {
        reject(err);
      });
  });
}

exports.loadPlayer = function (id) {
  return new Promise(function(resolve, reject) {
    dataRepo.loadPlayer(id)
      .then(player => {
        resolve(decoratePlayer(player));
      })
      .catch(err => {
        reject(err);
      });
  });
}
