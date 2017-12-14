State
=====

* La descripción del estado que se muestra al jugador se indica en el elemento *[text](texto.md)* 

Javascript
----------

```javascript
{
  text: string,
  options: {
    items: [{
      key: string,
      value: string      
    }, {
      ...
    }],
    max: number
  },
  call: string,
  view: {
    render: string,
    image: string,
    background: string,
    foreground: string
  }
}
```

YAML
----

```yaml
text: Texto           # Texto a mostrar
options:              # Opciones para el jugador
  Opción 1: id1
  Opción 2:           # Opción con subopciones
    Subopción 1: id21
    ...
  $include: nombre    # Incluye el diccionario de opciones nombre
  $max: número        # Limita el nº de opciones a número, elegidas aleatoriamente
random:               # Ejecuta una acción aleatoria
  acción1:
  acción2:
  ...
set:                  # Asigna valores
  variable1: valor    # Ej: dinero: 1000, lugar: casa
  variable2: +valor   # Aumenta valor. Ej: dinero: +100 (dinero = dinero + 100)
  variable2: -valor   # Disminuye valor. Ej: dinero: -100 (dinero = dinero - 100)
  ...
once:                 # Se ejecuta solamente la primera vez que el jugador llega a este estado
  set:                
    ...
call: nombre          # Ejecuta el flow llamado nombre
view:                 # Vista del estado
  render: vista       # Tipo de vista a mostrar
  image: imagen       # URL de imagen, relativa a ruta de recursos estáticos
  background: color   # Color de fondo
  foreground: color   # Color de texto
