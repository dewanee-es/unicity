Player
======

Javascript
----------

```javascript
{
  id: number,               // Identificador
  completed: boolean,       // Perfil completo
  playing: boolean,         // En juego
  email: string,            // Correo electr�nico
  name: string,             // Nombre
  surname: string(2),       // Apellidos (iniciales)
  fullName: () => string,   // Nombre completo: nombre + apellidos
  gender: string,           // G�nero: male (hombre), female (mujer)
  attraction: string,       // Atracci�n: male (hombre), female (mujer), both (hombre y mujer)
  sexuality: () => string,  // Sexualidad (gender-attraction):
                            //  gay (male-male)
                            //  heterosexual (male-female, female-male)
                            //  bisexual (male-both, female-both)
                            //  lesbian (female-female)
                            //  unknown (???) 
  birthDate: date,          // Fecha de nacimiento
  gps: location,            // Localizaci�n
  height: number,           // Altura (cm)
  weight: number,           // Peso (kg)
  occupation: string,       // Profesi�n
  traits: {                 // Cualidades         
    one: percent,           // 
    two: percent,           // 
    three: percent,         // 
    four: percent,          // 
    five: percent           // 
  },
  preferences: {            // Preferencias
    sound: string           // Sonido: music (m�sica), alerts (notificaciones), off (silencio)
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

1. G�nero y orientaci�n
2. Nombre y apellidos
3. Fecha de nacimiento, altura y peso
4. Cualidades
5. Profesi�n
6. Personaje: piel (color)
7. Personaje: pelo (estilo y color)
8. Personaje: ojos (color y accesorios: gafas, ...)
9. Personaje: extras (bigote, perilla, barba, pendientes, piercings, ...)