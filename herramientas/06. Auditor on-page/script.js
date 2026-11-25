// Importamos las funciones auxiliares
import { normalizar, escaparHTML } from "../../js/utilidades.js";

// Seleccionamos los elementos HTML
const dominio = document.getElementById("dominio");
const codigoHTML = document.getElementById("codigoHTML");
const analizar = document.getElementById("analizar");

// Función para crear una sección desplegable del informe
function crearSeccion(titulo, estado, contenido) {
    return `
      <details> 
          <summary> ${escaparHTML(titulo)} 
            <span class="indicador ${estado}">
              ${estado === "verde" ? "Correcto" :
              estado === "naranja" ? "Revisar" : "Problema"} 
            </span>
          </summary>
          <div class="contenido-seccion">
             ${contenido}
          </div>
      </details>
    `;
}

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
    const documento = parser.parseFromString(html, "text/html");

    // Comprobamos que se ha creado el documento
    mensaje.textContent = "HTML recibido y preparado para analizar.";

    // Extraer el título de la página
    const elementoTitle = documento.querySelector("title");
    const title = elementoTitle ? elementoTitle.textContent.trim() : "";

    // Calcular la longitud del título
    const longitudTitle = title.length;

    // Comprobar el título
    let estadoTitle;
    if (title === "") {
        estadoTitle = "rojo";
    } else if (longitudTitle >= 30 && longitudTitle <= 60) {
        estadoTitle = "verde";
    } else {
        estadoTitle = "naranja";
    }

    // Extraer la meta description
    const elementoDescription = documento.querySelector(`meta[name="description"]`
    );
    const description = elementoDescription 
    ? elementoDescription.getAttribute("content") || "" : "";

    // Calcular su longitud
    const longitudDescription = description.trim().length;

    // Comprobar la meta description
    let estadoDescription;
    if (description.trim() === "") {
        estadoDescription = "rojo";
    } else if (
        longitudDescription >= 120 &&
        longitudDescription <= 160
    ) {
        estadoDescription = "verde";
    } else {
        estadoDescription = "naranja";
    }

    // Extraer la meta robots
    const elementoRobots = documento.querySelector(`meta[name="robots"]`    
    );
    const robots = elementoRobots ? elementoRobots.getAttribute("content") 
    || "" : "";

    // Comprobar la meta robots
    let estadoRobots;
    if (robots === "") {
        estadoRobots = "verde";
    } else if (/noindex|nofollow/i.test(robots)) {
        estadoRobots = "naranja";
    } else {
        estadoRobots = "verde";
    }

    // Extraer la etiqueta canonical
    const elementoCanonical = documento.querySelector(`link[rel="canonical"]`);
    const canonical = elementoCanonical ? elementoCanonical.getAttribute("href") || "" : "";

    // Comprobar la canonical
    let canonicalFinal = "";
    let estadoCanonical;
    if (canonical.trim() === "") {
        estadoCanonical = "naranja";
    } else {
        try {
            canonicalFinal = new URL(canonical, url.href).href;
            estadoCanonical = "verde";
        } catch (error) {
            estadoCanonical = "rojo";
        }
    }

// Extraer todos los encabezados H1 hasta H6
const encabezados = documento.querySelectorAll("h1, h2, h3, h4, h5, h6");

// Contar cuántos encabezados H1 hay
const cantidadH1 = documento.querySelectorAll("h1").length;

// Comprobar el estado de los encabezados H1
let estadoEncabezados = "rojo";
if (cantidadH1 === 0){
    estadoEncabezados = "rojo";
} else if (cantidadH1 === 1) {
    estadoEncabezados = "verde";
} else {
    estadoEncabezados = "naranja";
}

// Crear la lista de encabezados
let listaEncabezados = "";
encabezados.forEach(encabezado => {

    // Obtener el nivel del encabezado (1, 2, 3...)
    const nivel = Number(encabezado.tagName.substring(1));

    // Obtener el texto del encabezado
    const texto = encabezado.textContent.trim();

    // Calcular la sangría según el nivel
    const sangria = (nivel - 1) * 20;
    listaEncabezados +=`
       <div style="margin-left: ${sangria}px;">
          <strong>${encabezado.tagName}:</strong>
          ${escaparHTML(texto)}
       </div>
    `;
});

// Preparar el contenido de los encabezados
const contenidoEncabezados = `<p><strong>Total de encabezados:</strong>
     ${encabezados.length}</p>
    <p><strong>Número de H1:</strong>${cantidadH1}</p>

    <div class="lista-encabezados">
    ${listaEncabezados || "No se han encotrado encabezados."}
    </div>
    `;

// Extraer todas las imágenes
const imagenes = documento.querySelectorAll("img");

// Contar las imágenes sin atributo alt
let imagenesSinAlt = 0;
imagenes.forEach(imagen => {
    if (!imagen.hasAttribute("alt")) {
        imagenesSinAlt++;
    }
});

//Comprobar el estado de las imágenes
let estadoImagenes;
if (imagenes.length === 0) {
    estadoImagenes = "naranja";
} else if (imagenesSinAlt === 0) {
    estadoImagenes = "verde";
} else {
    estadoImagenes = "naranja";
}

// Crear el listado de imágenes
let listaImagenes = "";
imagenes.forEach((imagen, indice) => {
     const origen = imagen.getAttribute("src") || "Sin URL";
     const alt = imagen.getAttribute("alt");

     listaImagenes += `
     <div class="imagen-item">
        <p><strong>Imagen ${indice + 1}</strong></p>
        <p><strong>URL:</strong> ${escaparHTML(origen)}</p>
        <p><strong>Texto alternativo</strong> ${alt === null 
            ? `<span class="texto-error">Sin atributo alt</span>`
            : escaparHTML(alt || "Texto alternativo vacio")}
        </p>
    </div>
  `;
});

// Preparar el contenido de las imágenes
const contenidoImagenes = `
    <p><strong>Total del imágenes:</strong> ${imagenes.length}</p>
    <p><strong>Imágenes sin atributo alt:</strong> ${imagenesSinAlt}</p>
    <div class="lista-imagenes"> ${listaImagenes || "No se han encontrado imágenes."}
    </div>
`;

// Extraer todos los enlaces
const enlaces = documento.querySelectorAll("a[href]");

// Contadores de enlaces
let enlacesInternos = 0;
let enlacesExternos = 0;
let internosNofollow = 0;
let externosNofollow = 0;

// Crear los listados de enlaces
let listaInternos = "";
let listaExternos = "";
enlaces.forEach((enlace, indice) => {

    // Obtener la dirección del enlace
    const href = enlace.getAttribute("href");

    // Obtener el texto del enlace
    const textoEnlace = enlace.textContent.trim() || "Sin texto";

    // Obtener el atributo rel
    const rel = enlace.getAttribute("rel") || "";

    // Comprobar si tiene nofollow
    const tieneNofollow = rel.toLowerCase().split(/\s+/).includes("nofollow");

    // Convertir la dirección en una URL completa
    let urlEnlace;
    try {
        urlEnlace = new URL(href, url.href);
    } catch (error) {
        urlEnlace = null;
    }

    // Comprobar si es un enlace interno o externo
    const esInterno = urlEnlace && urlEnlace.origin === url.origin;
    if (esInterno) {
        enlacesInternos++;
        if(tieneNofollow) {
            internosNofollow++;
        }
        listaInternos += `
        <div class="enlace-item">
           <p><strong>${escaparHTML(textoEnlace)}</strong></p>
           <p>${escaparHTML(href)}</p>
           <p>${tieneNofollow ? "Nofollow" : "Follow"}</p>
           </div>
        `;
    } else {
        enlacesExternos++;
        if (tieneNofollow) {
            externosNofollow++;
        }
          listaExternos += `
        <div class="enlace-item">
           <p><strong>${escaparHTML(textoEnlace)}</strong></p>
           <p>${escaparHTML(href)}</p>
           <p>${tieneNofollow ? "Nofollow" : "Follow"}</p>
           </div>
        `;
    }
});

// Preparar el contenido de los enlaces
const contenidoEnlaces = `
    <p><strong>Total de enlaces:</strong>${enlaces.length}</p>
    <p><strong>Enlaces internos:</strong>${enlacesInternos}</p>
    <p><strong>Enlaces externos:</strong>${enlacesExternos}</p>
    <p><strong>Internos con nofollow:</strong>${internosNofollow}</p>
    <p><strong>Externos con nofollow:</strong>${externosNofollow}</p>
    
    <h3>Enlaces internos</h3>
    ${listaInternos || "<p>No se han encontrado enlaces internos.</p>"}
    <h3>Enlaces externos</h3>
    ${listaExternos || "<p>No se han encontrado enlaces externos.</p>"}
    `;

// Extraer las etiquetas hreflang
const etiquetasHreflang = documento.querySelectorAll(`link[rel~="alternate"][hreflang]`
    );

// Comprobar el estado de las etiquetas
let estadoHreflang = "verde";

// Crear el listado de etiquetas
let listaHreflang = "";
etiquetasHreflang.forEach((etiqueta, indice) => {
    const idioma = etiqueta.getAttribute("hreflang") || "";
    const href = etiqueta.getAttribute("href") || "";

// Comprobar que tiene idioma y URL
if (idioma.trim() === "" || href.trim() === "") {
    estadoHreflang = "rojo";
}
listaHreflang += `
    <div class="enlace-item">
        <p><strong>Etiqueta ${indice + 1}</strong></p>
        <p><strong>Idioma:</strong> ${escaparHTML(idioma || "No especificado")}</p>
        <p><strong>URL:</strong> ${escaparHTML(href || "No especificada")}</p>
    </div>
  `;
});

// Preparar el contenido de hreflang
const contenidoHreflang = `
    <p><strong>Total de etiquetas:</strong> ${etiquetasHreflang.length}</p>
    <div>
        ${listaHreflang || "No se han encontrado etiquetas hreflang."}
    </div>
`;

// Preparar el contenido de cada apartadoS
const contenidoTitle = `
    <p><strong>Título:</strong> ${escaparHTML(title || "No encontrado")}</p>
    <p><strong>Longitud:</strong> ${longitudTitle} caracteres</p>
    `;
const contenidoDescription = `
    <p><strong>Descripción:</strong> ${escaparHTML(description || "No encontrada")}</p>
    <p><strong>Longitud:</strong> ${longitudDescription} caracteres</p>
    `;
const contenidoRobots = `
    <p><strong>Valor:</strong> ${escaparHTML(robots || "No especificada")}</p>
    <p><strong>Interpretación:</strong> ${robots === "" ? "Por defecto : index, follow"
        : "Revisa las instrucciones indicadas para los buscadores."}</p>
    `;
const contenidoCanonical = `
    <p><strong>URL canonical:</strong> ${escaparHTML(canonicalFinal || "No encontrada o no válida")}</p>
    `;

// Generar el informe SEO
informe.innerHTML = `
     <h2>Informe SEO</h2>
     ${crearSeccion("Title", estadoTitle, contenidoTitle)}
     ${crearSeccion("Meta description", estadoDescription, contenidoDescription)}
     ${crearSeccion("Meta robots", estadoRobots, contenidoRobots)}
     ${crearSeccion("Canonical", estadoCanonical, contenidoCanonical)}
     ${crearSeccion("Encabezados H1-H6", estadoEncabezados, contenidoEncabezados)}
     ${crearSeccion("Imágenes", estadoImagenes, contenidoImagenes)}
     ${crearSeccion("Enlaces internos y externos", "verde", contenidoEnlaces)}
     ${crearSeccion("Etiquetas hreflang", estadoHreflang, contenidoHreflang)}
    `;    
}

// Ejecutamos el análisis al pulsar el botón
analizar.addEventListener("click", analizarPagina);