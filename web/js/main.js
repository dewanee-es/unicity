var fonemas = {};

function hablar(personaje, texto) {
  var $boca = $(personaje).find('.boca');
  var anteriorFonema = false;
  var indiceTexto = 0;
  var hablarTimer = setInterval(function(){
    var fonema = false;
    if(indiceTexto < texto.length && !fonema) {
        fonema = fonemas[texto.substr(indiceTexto, 2)];
        if(fonemas) {
          indiceTexto += 2;
        } else {
          fonema = fonemas[texto.charAt(indiceTexto++)];
        }
    }
    if(fonema) {
        if(anteriorFonema) {
          $(personaje).find('.fonema-' + anteriorFonema).hide();
        } else {
          $boca.hide();
        }
        $(personaje).find('.fonema-' + fonema).show();
        anteriorFonema = fonema;
    } else {
      clearInterval(hablarTimer);
      $(personaje).find('.fonema-' + anteriorFonema).hide();
      $boca.show();
    }
  }, 75);
}