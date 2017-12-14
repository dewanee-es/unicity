const TokenGenerator = require('tokgen');
const config = require('../../config/config.json');

const Tools = {

  shuffle: function(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      [a[i], a[j]] = [a[j], a[i]]
    }
  },

  random: function(a) {
    return a[Math.floor(Math.random() * a.length)]
  },

  randomBase64Code: function(length) {
    return this.randomString(length, '0-9a-zA-Z+/')
  },
  
  randomString: function(length, chars) {
    if(!length) {
      length = 1
    }
  
    let generator = new TokenGenerator({chars: chars, length: length})
  
    return generator.generate()
  },
  
}

module.exports = Tools