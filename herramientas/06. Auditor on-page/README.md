# Auditoría SEO on-page

## 1. Descripción del proyecto

Esta herramienta permite realizar un análisis SEO básico de una página web a partir de su código fuente HTML.

El usuario introduce el dominio de la página y pega su código HTML. La aplicación procesa ese código y genera un informe con los principales elementos SEO.

## 2. Funcionalidades

La herramienta analiza los siguientes elementos:

- **Title:** comprueba el título de la página y su longitud.
- **Meta description:** analiza la descripción y el número de caracteres.
- **Meta robots:** identifica las instrucciones destinadas a los buscadores.
- **Canonical:** comprueba si existe una URL canonical.
- **Encabezados H1-H6:** muestra los encabezados encontrados, su jerarquía y el número de etiquetas H1.
- **Imágenes:** muestra las imágenes y comprueba si tienen el atributo alt.
- **Enlaces internos y externos:** cuenta los enlaces, los clasifica y detecta los que utilizan nofollow.
- **Hreflang:** identifica las etiquetas que indican las versiones lingüísticas o regionales de una página.

## 3. Cómo utilizar la herramienta

1. Abrir la página web que se desea analizar.
2. Pulsar Ctrl + U para consultar su código fuente.
3. Seleccionar y copiar todo el código HTML.
4. Abrir la herramienta Auditoría SEO on-page.
5. Introducir el dominio de la página.
6. Pegar el código HTML en el campo correspondiente.
7. Pulsar el botón «Analizar página».
8. Consultar los resultados del informe SEO.

## 4. Tecnologías utilizadas

- HTML5 para la estructura de la aplicación.
- CSS3 para el diseño y la presentación.
- JavaScript para procesar y analizar el código HTML.
- DOMParser para convertir el texto HTML en un documento que JavaScript puede analizar.

## 5. Limitaciones

La herramienta analiza únicamente el código HTML que proporciona el servidor y que el usuario pega en el formulario.

No ejecuta JavaScript de la página analizada, por lo que no puede detectar contenido que se genere dinámicamente después de cargar la página y que no aparezca en el código fuente original.

Los resultados ofrecen una orientación SEO básica y no sustituyen a una auditoría profesional completa.

## 6. Indicadores de resultados

El informe utiliza tres indicadores:

- **Verde:** elemento correcto según las comprobaciones realizadas.
- **Naranja:** elemento que conviene revisar o mejorar.
- **Rojo:** elemento que presenta un problema o no se ha encontrado.