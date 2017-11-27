var Schema = function() {
  this.types = [];
  this.current = null;
};

// Schema properties

Schema.attributePrefix = '$';

// Schema types (static)

Schema.dictionary = function (item) {
  return new Schema().dictionary(item);
};

Schema.empty = function () {
  return new Schema().empty();
};

Schema.flags = function (value) {
  return new Schema().flags(value);
}

Schema.map = function (data) {
  return new Schema().map(data);
};

Schema.number = function() {
  return new Schema().number();
};

Schema.schema = function(schema) {
  return new Schema().schema(schema);
}

Schema.string = function() {
  return new Schema().string();
};

// Schema types (class)

Schema.prototype.dictionary = function (item) {
  this.current = {
    type: 'dictionary',
    item: item,
    initial: {},
    each: ((object, key, value) => object[key] = value),
    attributes: {},
    apply: function (object, path) {
      var applied = false;
      var result = false;
      if(typeof object == 'object') {
        applied = true;
        result = this.initial;
        for(var property in object) {
          if(property.startsWith(Schema.attributePrefix)) {
            if(this.attributes[property]) {
              this.attributes[property].assign(result, property.substring(Schema.attributePrefix.length), this.attributes[property].schema.apply(object[property], path + '/' + property));
            } else {
              throw new Error('Attribute ' + (path || '') + '/' + property + ' not found in schema');
            }
          } else {
	    this.each(result, property, this.item.apply(object[property], path + '/' + property));
	  }
        }
      }
      return { applied: applied, result: result };
    }
  };
  this.types.push(this.current);
  return this;
};

Schema.prototype.empty = function () {
  this.current = {
    type: 'empty',
    apply: function (object, path) {
      var applied = false;
      var result = false;
      if(object === null) {
        applied = true;
        result = object;
      }
      return { applied: applied, result: result };
    }
  };
  this.types.push(this.current);
  return this;
};

Schema.prototype.flags = function (value) {
  this.current = {
    type: 'flags',
    value: value,
    apply: function (object, path) {
      var applied = false;
      var result = false;
      if(typeof object == 'string' || Array.isArray(object)) {
        applied = true;
        result = Object.assign({}, this.value);
        if(!Array.isArray(object)) {
          object = object.split(',');
        }
        object.forEach(property => {
          var flag = true;
          property = property.trim();
          if(property.charAt(0) == '+' || property.charAt(0) == '-') {
            flag = property.charAt(0) == '+';
            property = property.substring(1);
          }
          if(result[property] != 'undefined') {
            result[property] = flag;
          } else {
            throw new Error('Flag ' + property + ' not allowed at ' + (path || '/'));
          }
        });
      }
      return { applied: applied, result: result };
    }
  };
  this.types.push(this.current);
  return this;
}

Schema.prototype.map = function (data) {
  this.current = {
    type: 'map',
    map: data,
    apply: function (object, path) {
      var applied = false;
      var result = false;
      if(typeof object == 'object') {
        applied = true;
        result = {};
        for(var property in object) {
          if(!this.map[property]) {
            throw new Error('Property ' + (path || '') + '/' + property + ' not found in schema');
          } else {
            result[property] = this.map[property].apply(object[property], path + '/' + property);
          }
        }
      }
      return { applied: applied, result: result };
    }
  };
  this.types.push(this.current);
  return this;
};

Schema.prototype.number = function() {
  this.current = {
    type: 'number',
    apply: function (object, path) {
      var applied = false;
      var result = false;
      if(typeof object == 'number') {
        applied = true;
        result = object;
      }
      return { applied: applied, result: result };
    }
  };
  this.types.push(this.current);
  return this;
};

Schema.prototype.schema = function (schema) {
  if(!schema) {
    return this;
  }
  
  this.current = {
    type: 'schema',
    schema: schema,
    apply: function (object, path) {
      var applied = true;
      var result = this.schema.apply(object, path);
      return { applied: applied, result: result };
    }
  }
  this.types.push(this.current);
  return this;
}

Schema.prototype.string = function () {
  this.current = {
    type: 'string',
    apply: function (object, path) {
      var applied = false;
      var result = false;
      if(typeof object == 'string') {
        applied = true;
        result = object;
      }
      return { applied: applied, result: result };
    }
  };
  this.types.push(this.current);
  return this;
};

// Type modifiers 

Schema.prototype.asList = function (keycallback) {
  if(!this.current.initial || !this.current.each) {
    throw new Error('List conversion not allowed for ' + this.current.type);
  }
  
  keycallback = keycallback || ((key, item) => {});
  this.current.initial = [];
  this.current.each = (list, key, item) => {
    keycallback(key, item);
    list.push(item);
  };
  return this;
};

Schema.prototype.assign = function (callback) {
  if(this.current.currentChild && this.current.currentChild.assign) {
    this.current.currentChild.assign = callback;
  } else if(this.current.assign) {
    this.current.assign = callback;
  } else {
    throw new Error('Assign function not allowed for ' + this.current.type);
  }
  
  return this;
};

Schema.prototype.attribute = function (name, schema) {
  if(!name.startsWith(Schema.attributePrefix)) {
    throw new Error('Attribute ' + name + ' doesn\'t start with attribute prefix: ' + Schema.attributePrefix);
  }
  if(!this.current.attributes) {
    throw new Error('Attributes not allowed for ' + this.current.type);
  }
  var attribute = {
    type: 'attribute',
    schema: schema,
    assign: ((object, key, value) => object[key] = value)
  };
  this.current.attributes[name] = attribute;
  this.current.currentChild = attribute;
  return this;
};

Schema.prototype.each = function (callback) {
  if(!this.current.each) {
    throw new Error('Each function not allowed for ' + this.current.type);
  }
  this.current.each = callback;
  return this;
};

Schema.prototype.initial = function (initial) {
  if(!this.current.initial) {
    throw new Error('Initial value not allowed for ' + this.current.type);
  }
  this.current.initial = initial;
  return this;
};

// Schema apply

Schema.prototype.apply = function(object, path) {
  var i = 0;
  var applied = false;
  var result = false;
  var allowed = [];
  
  while(!applied && i < this.types.length) {
    var type = this.types[i++];
    allowed.push(type.type);
    ({ applied, result } = type.apply(object, path || ''));
  }
  
  if(!applied) {
    throw new Error('Value ' + object + ' of type ' + typeof object + ' not expected at ' + (path || '/') + '. Allowed contents: ' + allowed.join(', '));
  }
  
  return result;
};

// Exports

module.exports = Schema;
