const dataRepo = require('../repo/data')
const tools = require('../tools/tools')

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
  return player;
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

exports.savePlayer = function (player) {
  return new Promise(function(resolve, reject) {
    dataRepo.savePlayer(player)
      .then(player => {
        resolve(player);
      })
      .catch(err => {
        reject(err);
      });
  });
}

exports.randomPlayer = function (gender, attraction) {
  if(gender == 'both') {
    gender = tools.random(['male', 'female'])    
  }
  return {  // TODO
    //id: false,
    //completed: true,
    //playing: true,
    //email: false,
    //name: randomName(gender),
    //surname: randomSurname(),
    name: tools.randomString(3, '1234567890'),
    gender: gender,
    attraction: attraction,
    //birthDate: randomBirthdate(),
    //gps: randomLocation(),
    //height: randomHeight(gender),
    //weight: randomWeight(gender),
    //occupation: randomOccupation(gender),
    /*traits: {         
      one: false,       // percent
      two: false,       // percent
      three: false,     // percent
      four: false,      // percent
      five: false       // percent
    },
    preferences: {
      sound: false      // music, alerts, off
    },*/
    /*character: {
      skin: randomSkin(),      
      hair: randomHair(gender),    
      eyes: randomEyes(gender),
      extra: randomExtra(gender),
      outfit: randomOutfit(gender)
    }*/
  }
}
