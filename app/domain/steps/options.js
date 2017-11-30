const { shuffle } = require('../../tools/data_tools');
const Events = require('../events');

function Options(options) {
  this.options = options;
}

Options.create = function (options) {
  return new Options(options);
}

Options.prototype.execute = function (context, { state, events }) {
  state.options = [];
  this.fillOptionsEvents(this.options, state.options, events);
}

Options.prototype.fillOptionsEvents = function (options, list, events) {
  var filtered = options.items.filter(item => !item.hidden);
  
  if(options.max && filtered.length > options.max) {
    shuffle(filtered);
    filtered = filtered.slice(options.max);
  }
  
  filtered.forEach(option => {
    if(option.value.items) {
      var sublist = [];
      fillOptionsEvents(option.value.items, sublist, events);
      option.value = sublist;
    } else {
      events[option.key] = Events.newEvent('go', option.key);
    }
    
    list.push({ key: option.key, value: option.value });
  })
}

module.exports = Options;