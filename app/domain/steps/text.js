if (!global.Intl) {
    require('intl');
}

const IntlMessageFormat = require('intl-messageformat');

function Text(text) {
  this.text = text;
}

Text.create = function (text) {
  return new Text(text);
}

Text.prototype.execute = function (context, scene) {
  var textFormat = new IntlMessageFormat(this.text
    .replace(/\{\{([^\{\}]+)\|([^\{\}]+)\}\}/g, '{gender, select, male {$1} female {$2} }')
    .replace(/\{\{\{([^\{\}]+)\|([^\{\}]+)\}\}\}/g, '{mate.gender, select, male {$1} female {$2} }')
    .replace(/\{\{\{\{([^\{\}]+)\|([^\{\}]+)\|([^\{\}])\}\}\}\}/g, '{attraction, select, male {$1} female {$2} both {$3} }'),
    'es-ES');
  scene.text = textFormat.format(context);
}

module.exports = Text;