// Importamos las funciones auxiliares
import { normalizar, escaparHTML } from "../../js/utilidades.js";

// Seleccionamos los elementos HTML
const dominio = document.getElementById("dominio");
const codigoHTML = document.getElementById("codigoHTML");
const analizar = document.getElementById("analizar");

// Seleccionamos los elementos del informe
const informe = document.getElementById("informe");
const mensaje = document.getElementById("mensaje");

// Función principal para analizar la página
function analizarPagina() {

    // Recogemos los datos introducidos
    let direccion = dominio.value.trim();
    let html = codigoHTML.value.trim();

    // Comprobamos que se ha introducido el dominio
    if (direccion === "") {
        mensaje.textContent = "Introduce el dominio de la página web.";
        return;
    }

    // Comprobamos que se ha pegado el código HTML
    if (html === "") {
        mensaje.textContent = "Pega el código fuente HTML de la página.";
        return;
    }

    // Comprobamos que el dominio tiene un formato válido
    let url;
    try {
        url = new URL(direccion.includes("://") ? direccion : 
        "https://" + direccion);
    } catch (error) {
        mensaje.textContent = "Introduce un dominio válido.";
        return;
    }

    // Convertimos el texto HTML en un documento
    const parser = new DOMParser();
    const documento = parser.parseFromString(html, "text/html"
    );

    // Comprobamos que se ha creado el documento
    console.log(documento);
    mensaje.textContent = "HTML recibido y preparado para analizar.";
}

// Ejecutamos el análisis al pulsar el botón
analizar.addEventListener("click", analizarPagina);