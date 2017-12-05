Player
======

Javascript
----------

```javascript
{
  id: number,               // Identificador
  completed: boolean,       // Perfil completo
  playing: boolean,         // En juego
  email: string,            // Correo electrónico
  name: string,             // Nombre
  surname: string(2),       // Apellidos (iniciales)
  fullName: () => string,   // Nombre completo: nombre + apellidos
  gender: string,           // Género: male (hombre), female (mujer)
  attraction: string,       // Atracción: male (hombre), female (mujer), both (hombre y mujer)
  sexuality: () => string,  // Sexualidad (gender-attraction):
                            //  gay (male-male)
                            //  heterosexual (male-female, female-male)
                            //  bisexual (male-both, female-both)
                            //  lesbian (female-female)
                            //  unknown (???) 
  birthDate: date,          // Fecha de nacimiento
  gps: location,            // Localización
  height: number,           // Altura (cm)
  weight: number,           // Peso (kg)
  occupation: string,       // Profesión
  traits: {                 // Cualidades         
    one: percent,           // 
    two: percent,           // 
    three: percent,         // 
    four: percent,          // 
    five: percent           // 
  },
  preferences: {            // Preferencias
    sound: string           // Sonido: music (música), alerts (notificaciones), off (silencio)
  },
  character: {              // Personaje
    skin: string,           // Color de piel
    hair: string,           // Pelo
    eyes: string,           // Ojos
    extra: string,          // Accesorios
    outfit: string          // Vestuario
  }
}

```

Registro
--------

1. Género y orientación
2. Nombre y apellidos
3. Fecha de nacimiento, altura y peso
4. Cualidades
5. Profesión
6. Personaje: piel (color)
7. Personaje: pelo (estilo y color)
8. Personaje: ojos (color y accesorios: gafas, ...)
9. Personaje: extras (bigote, perilla, barba, pendientes, piercings, ...)