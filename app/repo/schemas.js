const { dictionary, empty, flags, map, number, schema, string } = require('../tools/schema_tools');

var schemas = {};

var increment = dictionary(number());   // eg. alcohol: 1, alcohol: -1

var set = dictionary(number());         // eg. alcohol: 0, place: House

schemas.occupations = () =>
  dictionary(flags({
    male: false,
    female: false,
    hidden: false
  }))
  .asList((key, item) => item.name = key);

schemas.state = (loader) => {
  var options = schema(); // Empty schema to reference itself. Real definition below.

  options.dictionary(   // key (text to show): value (option value)
            string()          // An option can be a string containing action name to invoke
            .schema(options)  // or a dictionary of suboptions
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
            .assign((object, attribute, value) => object.items.concat(options.apply(loader(value))))
          .attribute('$max', number());     // Max number of options (random selected)*/
              
  return map({
    text: string(),       // State text in markdown format with plugins: br, container/alerts (info, warning...), underline
                          // {variable}, {{male|female}}, {{{mate-male|mate-female}}} => alt: {gender:$var|male|female} {|male|female} {:male|female} {2:male|female}
                          // Global variables (uppercase): {CIUDAD} {TITULO}
    options:              // Options
      options,
    random:               // Execute random command
      dictionary(empty()),
    set: set,             // Set palyer attributes values
    increment: increment, // Increment player attributes values
    once:                 // Run only the first time player visit this state
      map({
        set: set,
        increment: increment
      }),
    call: string(),       // Call subflow
    view:                 // View representation
      map({
        render: string(),     // Type of view to render, eg. choice, talk, map, etc...
        image: string(),      // Image URL, relative to static resources path
        background: string(), // Background color by name (flatly colors)
        foreground: string()  // Foreground (text) color by name
      })
  });
  //.parameter('name')
}

exports.apply = function (name, source, loader) {
  return schemas[name](loader).apply(source);
};
