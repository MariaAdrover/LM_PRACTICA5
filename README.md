# LM_PRACTICA5
Repositorio creado para la práctica de formularios html, con lectura de datos desde un fichero xml (o json) y autocorrección a través de js.
 
> * Enlace a la página de [INSTRUCCIONES](https://rawgit.com/MariaAdrover/lunar-landing-javascript/v0.7/instrucciones.html)
> * Enlace a la página del [TEST](https://rawgit.com/MariaAdrover/lunar-landing-javascript/v0.7/about.html) 

**VERSIÓN MINIMIFICADA**

> * Enlace al [Repositorio branch vMini](https://github.com/MariaAdrover/lunar-landing-javascript/tree/v0.7mini)
> * Enlace a la página de [INSTRUCCIONES](https://rawgit.com/MariaAdrover/lunar-landing-javascript/v0.7mini/instrucciones.html)
> * Enlace a la página del [TEST](https://rawgit.com/MariaAdrover/lunar-landing-javascript/v0.7mini/about.html)

## DESCRIPCIÓN
El repositorio contiene dos ficheros html, uno con una breve presentación de la página e instrucciones para realizar el test (**index.html**), y otro con el código del formulario (**formulario.html**).
#### CRONÓMETRO
Hay un tiempo máximo para responder todas las preguntas del test (3 minutos). Pasado este tiempo ya no se podrá corregir el test y se obtendrá automáticamente un 0 como nota final.
#### COMPROBACIÓN ANTES DE CORREGIR
Tal como se pedía en las especificaciones, antes de corregir se comprueba que el usuario ha contestado a todas las preguntas. Si no es así se nos pide que contestemos.
#### CORRECCIÓN
La corrección del test se realiza como sigue:
* Tipo TEXT
  * Respuesta correcta: se suma 1 punto a la nota.
  * Respuesta incorrecta: se descuentan 0.2 puntos.
* Tipo SELECT y RADIO
  * Respuesta correcta: se suma 1 punto a la nota.
  * Respuesta incorrecta: se descuenta (1/nº de opciones).
* Tipo SELECT MÚLTIPLE y CHECKBOX
  * Respuesta correcta: cada opción seleccionada correcta suma (1/nº de opciones correctas).
  * Respuesta incorrecta: cada opción seleccionada incorrecta resta (1/nº de opciones). 

#### PRESENTACIÓN DE LA NOTA
Una vez corregido el test se nos informará de:
* Si hemos respondido correctamente a cada pregunta.
* La puntuación que hemos conseguido en cada pregunta.
* Si la respuesta es incorrecta (parcial o totalmente) se nos mostrarán la/s respuesta/s correcta/s.
* La nota final.
Si la nota final fuera negativa se redondeará a 0, pero también se nos informará de cual es la nota real.




