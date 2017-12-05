var TokenGenerator = require('tokgen');
var config = require('../../config/config.json');

exports.shuffle = function(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}

exports.random = function(a) {
  return a[Math.floor(Math.random() * a.length)];
}

exports.randomBase64Code = function(length) {
  if(!length) {
    length = 1;
  }
  
  let generator = new TokenGenerator({chars: '0-9a-zA-Z+/', length: length});
  
  return generator.generate();
}

