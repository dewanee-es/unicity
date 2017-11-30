var fs = require('fs');
var yaml = require('js-yaml');
var Schemas = require('./schemas');
var { randomBase64Code } = require('../tools/data_tools');

var loadData = function (name, type, schema) {
  return new Promise(function (resolve, reject) {
    loadYaml(type + '/' + name)
      .then(data => {
        if(!schema) {
          resolve(data);
        } else {
          resolve(Schemas.apply(schema, data, loaderForSchema));
        }
      })
      .catch(err => {
        reject(err);
      })
  });
}

exports.loadData = loadData;

var loadDict = function (name, schema) {
  return loadData(name, 'dict', schema);
};

exports.loadDict = loadDict;

exports.loadOccupations = function () {
  return this.loadDict('profesiones', 'occupations');
}

exports.loadPlayer = function (id) {
  return this.loadJson('players/' + id);
}

exports.savePlayer = function (player) {
  return new Promise(function(resolve, reject) {
    if(!player.id) {
      player.id = randomBase64Code(5).replace(/\+/g, '-').replace(/\//g, '!');
      while(fs.existsSync('./data/players/' + player.id + '.json')) {
        player.id += randomBase64Code().replace(/\+/g, '-').replace(/\//g, '!');
      }
    }
    
    fs.writeFile('./data/players/' + player.id + '.json', JSON.stringify(player), (err) => {
      if (err) reject(err);
      resolve(player);
    });
  });
}

exports.deletePlayer = function (id) {
  return new Promise(function(resolve, reject) {
    var path = './data/players/' + id + '.json';
    if(fs.existsSync(path)) {
      fs.unlink(path, (err) => {
        if(err) reject(err);
        else resolve(true);
      });
    } else {
      resolve(true);
    }
  });
}

exports.loadSnapshot = function (id) {
  return this.loadJsonIfExists('snapshots/' + id, false);
}

exports.saveSnapshot = function(id, snapshot) {
  return new Promise(function(resolve, reject) {
    var path = './data/snapshots/' + id + '.json';
    fs.writeFile(path, JSON.stringify(snapshot), (err) => {
      if(err) reject(err);
      else resolve(snapshot);
    });
  });
}

exports.deleteSnapshot = function (id) {
  return new Promise(function(resolve, reject) {
    var path = './data/snapshots/' + id + '.json';
    if(fs.existsSync(path)) {
      fs.unlink(path, (err) => {
        if(err) reject(err);
        else resolve(true);
      });
    } else {
      resolve(true);
    }
  });
}

exports.loadState = function (name) {
  return this.loadData(name, 'state', 'state');
}

exports.loadJson = function (file) {
  return new Promise(function(resolve, reject) {
    fs.readFile('./data/' + file + '.json', (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });
}

exports.loadJsonIfExists = function (file, notExists) {
  return new Promise(function(resolve, reject) {
    var path = './data/' + file + '.json';
    if(fs.existsSync(path)) {
      fs.readFile('./data/' + file + '.json', (err, data) => {
        if (err) reject(err);
        else resolve(JSON.parse(data));
      });
    } else {
      resolve(notExists);
    }
  });
}

var loadYaml = function (file) {
  return new Promise(function(resolve, reject) {
    var path = './data/' + file + '.yml';
    try {
      if(fs.existsSync(path)) {
        var data = yaml.safeLoad(fs.readFileSync(, 'utf8'));
        resolve(data);
      } else {
        reject('File ' + path + ' doesn\'t exist');
      }
    } catch (e) {
      reject(e);
    }
  });
}

var loadYamlSync = function (file) {
  return yaml.safeLoad(fs.readFileSync('./data/' + file + '.yml', 'utf8'));
}

exports.loadYaml = loadYaml;

// Loader for schemas
function loaderForSchema(name) {
  return loadYamlSync('dict/' + name);
}

