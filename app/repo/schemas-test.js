const { dictionary, empty, flags, map, number, string, schema, schemas } = (function() {
var Schema = function() {
  this.types = [];
  this.current = null;
};

// Schema properties

Schema.attributePrefix = '$';

// Esquemas

Schema.schemas = function (schemas) {
	var schemasObject = {};
	schemasObject.schemas = schemas;
	schemasObject.get = function (name) {
	  var schema = this.schemas[name];
	  if(!schema) {
		throw new Error('Unkown schema with name ' + name);
	  }
	  
	  return {
		run: function(source, context) {
		  var ctx = Object.assign({}, context);
		  if(!ctx.schemas) {
			ctx.schemas = schemasObject;
		  }
		  if(!ctx.path) {
			ctx.path = name + ':';
		  }
		  return schema.run(source, ctx);
		}
	  }
	}
	
	return schemasObject;
}

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
    run: function (object, context) {
      var applied = false;
      var result = false;
      if(typeof object == 'object') {
        applied = true;
        result = this.initial;
        for(var property in object) {
          if(property.startsWith(context.attributePrefix)) {
            if(this.attributes[property]) {
              this.attributes[property].assign(result, property.substring(context.attributePrefix.length), this.attributes[property].schema.run(object[property], Object.assign({}, context, { path: context.path + '/' + property })), context);
            } else {
              throw new Error('Attribute ' + context.path + '/' + property + ' not found in schema');
            }
          } else {
	        this.each(result, property, this.item.run(object[property], Object.assign({}, context, { path: context.path + '/' + property })));
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
    run: function (object, context) {
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
    run: function (object, context) {
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
          if(property.charAt(0) == '+' || property.charAt(0) == '-') {
            flag = property.charAt(0) == '+';
            property = property.substring(1);
          }
          if(result[property] != 'undefined') {
            result[property] = flag;
          } else {
            throw new Error('Flag ' + property + ' not allowed at ' + (context.path || '/'));
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
    run: function (object, context) {
      var applied = false;
      var result = false;
      if(typeof object == 'object') {
        applied = true;
        result = {};
        for(var property in object) {
          if(!this.map[property]) {
            throw new Error('Property ' + context.path + '/' + property + ' not found in schema');
          } else {
            result[property] = this.map[property].run(object[property], Object.assign({}, context, { path: context.path + '/' + property }));
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
    run: function (object, context) {
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
  this.current = {
    type: 'schema',
    schema: schema,
    run: function (object, context) {
      var applied = true;
      var result = context.schemas.get(this.schema).run(object, context);
      return { applied: applied, result: result };
    }
  }
  this.types.push(this.current);
  return this;
}

Schema.prototype.string = function () {
  this.current = {
    type: 'string',
    run: function (object, context) {
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

// Schema run

Schema.prototype.run = function(object, context) {
  var ctx = Object.assign({}, {
	attributePrefix: Schema.attributePrefix,
	path: '',
	schemas: {
	  get: function(name) {
		throw new Error('Empty schemas repository. Unknown schema with name ' + name);
	  }
	}
  }, context);
  var i = 0;
  var applied = false;
  var result = false;
  var allowed = [];
  
  while(!applied && i < this.types.length) {
    var type = this.types[i++];
    allowed.push(type.type);
    ({ applied, result } = type.run(object, ctx));
  }
  
  if(!applied) {
    throw new Error('Value ' + object + ' of type ' + typeof object + ' not expected at ' + (ctx.path || '/') + '. Allowed contents: ' + allowed.join(', '));
  }
  
  return result;
};

// Exports

return Schema;
})()

/*-------------------------------------------------------------------------------------------------------------------------------------------*/

var theSchemas = schemas({
	
	increment: 
		dictionary(number()),   // eg. alcohol: 1, alcohol: -1

	set: 
		dictionary(number()),         // eg. alcohol: 0, place: House

	occupations:
	  dictionary(flags({
		male: false,
		female: false,
		hidden: false
	  }))
	  .asList((key, item) => item.name = key),

	options:
	      dictionary(   // key (text to show): value (option value)
            string()          // An option can be a string containing action name to invoke
            .schema('options')  // or a dictionary of suboptions
          )                
          .initial({
            items: []
          })
          .each((object, key, value) => object.items.push({
            key: value.endsWith('?') ? value.substring(0, value.length - 1) : value,
            value: key,
            hidden: value.endsWith('?')
          }))
          .attribute('$include', string())  // Include data by name (file, database...)
            .assign((object, attribute, value, context) => {
				object.items.concat(context.schemas.get('options').run(context.loader(value), context))
			})
          .attribute('$max', number()),     // Max number of options (random selected)*/
		  
	state:
  map({
    text: string(),       // State text in markdown format with plugins: br, container/alerts (info, warning...), underline
                          // {variable}, {{male|female}}, {{{mate-male|mate-female}}} => alt: {gender:$var|male|female} {|male|female} {:male|female} {2:male|female}
                          // Global variables (uppercase): {CIUDAD} {TITULO}
    options:              // Options
      schema('options'),
    random:               // Execute random command
      dictionary(empty()),
    set: schema('set'),             // Set palyer attributes values
    increment: schema('increment'), // Increment player attributes values
    once:                 // Run only the first time player visit this state
      map({
        set: schema('set'),
        increment: schema('increment')
      }),
    view:                 // View representation
      map({
        render: string(),     // Type of view to render, eg. choice, talk, map, etc...
        image: string(),      // Image URL, relative to static resources path
        background: string(), // Background color by name (flatly colors)
        foreground: string()  // Foreground (text) color by name
      })
  })
  //.parameter('name')
});

var apply = function (name, source, loader) {
  var myschema = theSchemas.get(name);
  return myschema.run(source, { loader: loader });
};
/*---*/
var json = {
  "text": "¡Bienvenid{{o|a}} a la ciudad! ¿Preparad{{o|a}} para conocer gente? ¡Pues ponte en movimiento! ¿Dónde quieres ir?",
  "options": {
    "$include": "lugares",
    "$max": 4
  }
};
var loader = (name) => {
	if(name == 'lugares') {
		return {
		  "Bar": "bar",
		  "Cafetería": "cafeteria",
		  "Centro comercial": "centro-comercial",
		  "Cine": "cine?",
		  "Discoteca": "discoteca",
		  "Fiesta": "fiesta?",
		  "Gimnasio": "gimnasio",
		  "Metro": "metro?",
		  "Museo": "museo",
		  "Parque": "parque",
		  "Piscina": "piscina",
		  "Restaurante": "restaurante?",
		  "Tienda": "tienda?"
		}
	}
};
console.log(apply('state', json, loader));