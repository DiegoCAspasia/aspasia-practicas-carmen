
// Importamos las funciones auxiliares
import { escaparHTML } from "../../js/utilidades.js";

// Array donde guardaremos todos los bloques del artículo
let bloques = [];

// Localizamos los botones para añadir bloques
const btnH1 = document.getElementById("btnH1");
const btnH2 = document.getElementById("btnH2");
const btnH3 = document.getElementById("btnH3");
const btnParrafo = document.getElementById("btnParrafo");
const btnLista = document.getElementById("btnLista");
const btnImagen = document.getElementById("btnImagen");
const btnCTA = document.getElementById("btnCTA");
const btnBorrar = document.getElementById("btnBorrar");

// Localizamos los espacios de contenido
const listaBloques = document.getElementById("listaBloques");
const vistaPrevia = document.getElementById("vistaPrevia");
const codigoHTML = document.getElementById("codigoHTML");
const crearIndice = document.getElementById("crearIndice");
const errores = document.getElementById("errores");
const btnCopiar = document.getElementById("btnCopiar");

//  EVENTOS DE LOS BOTONES
btnH1.addEventListener("click", function () {
    anadirBloque("h1");
});

btnH2.addEventListener("click", function () {
    anadirBloque("h2");
});

btnH3.addEventListener("click", function () {
    anadirBloque("h3");
});

btnParrafo.addEventListener("click", function () {
    anadirBloque("parrafo");
});

btnLista.addEventListener("click", function () {
    anadirBloque("lista");
});

btnImagen.addEventListener("click", function () {
    anadirBloque("imagen");
});

btnCTA.addEventListener("click", function () {
    anadirBloque("cta");
});

//  AÑADIR BLOQUES
function anadirBloque(tipo) {
    let nuevoBloque = {
        tipo: tipo,
        texto: "",
        alt: "",
        url: ""
    };

    bloques.push(nuevoBloque);
    dibujarBloques();
    actualizarVistaPrevia();
    console.log(bloques);
}

//  SUBIR UN BLOQUE
function subirBloque(indice) {
    if (indice > 0) {
        let temporal = bloques[indice];
        bloques[indice] = bloques[indice - 1];
        bloques[indice - 1] = temporal;

        dibujarBloques();
        actualizarVistaPrevia();
    }
}

// BAJAR UN BLOQUE
function bajarBloque(indice) {
    if (indice < bloques.length - 1) {
        let temporal = bloques[indice];
        bloques[indice] = bloques[indice + 1];
        bloques[indice + 1] = temporal;

        dibujarBloques();
        actualizarVistaPrevia();
    }
}

// ELIMINAR UN BLOQUE
function eliminarBloque(indice) {
    bloques.splice(indice, 1);
    dibujarBloques();
    actualizarVistaPrevia();
}

// GENERAR EL HTML DE CADA BLOQUE
function generarHTMLBloque(bloque, indiceH2) {
    let texto = escaparHTML(bloque.texto);
    switch (bloque.tipo) {
        case "h1":
            return `<h1>${texto}</h1>`;
        case "h2":
            return `<h2 id="seccion-${indiceH2}">${texto}</h2>`;
        case "h3":
            return `<h3>${texto}</h3>`;
        case "parrafo":
            return `<p>${texto}</p>`;
        case "lista":

            let elementos = bloque.texto.split("\n");
            let listaHTML = "<ul>";

            elementos.forEach(function (elemento) {

                if (elemento.trim() !== "") {
                    listaHTML += `<li>${escaparHTML(elemento)}</li>`;
                }
            });

            listaHTML += "</ul>";
            return listaHTML;

        case "imagen":
            return `<img src="${escaparHTML(bloque.texto)}" alt="${escaparHTML(bloque.alt)}">`;

        case "cta":
            return `<a class="cta" href="${escaparHTML(bloque.url)}">${texto}</a>`;

        default:
            return "";
    }
}

// ACTUALIZAR VISTA PREVIA Y CÓDIGO HTML
function actualizarVistaPrevia() {
    let html = "";
    let indiceH2 = 0;
    let indiceHTML = "";

    // Comprobamos si hay que crear el índice
    if (crearIndice.checked) {
        let titulos = bloques.filter(function(bloque){
            return bloque.tipo === "h2";
        });

        if (titulos.length > 0) {
            indiceHTML = `<nav class="indice">`;
            indiceHTML += `<h2>Índice del artículo</h2>`;
            indiceHTML += `<ul>`;
            titulos.forEach(function(bloque, indice) {
                indiceHTML += `<li><a href="#seccion-${indice + 1}">${escaparHTML(bloque.texto)}</a></li>`;
            });

            indiceHTML += `</ul>`;
            indiceHTML += `</nav>`;
        }
    } 

    // Generamos el HTML de todos los bloques
    bloques.forEach(function (bloque) {
        if (bloque.tipo === "h2") {
            indiceH2++;
        }
        html += generarHTMLBloque(bloque, indiceH2) + "\n";
    });

    //Mostramos el índice y el artículo en la vista previa
    vistaPrevia.innerHTML = indiceHTML + html;
    
    // Mostramos el código HTML generado
    codigoHTML.value = indiceHTML + html;

    // Comprobamos si el artículo tiene errores
    validarBloques();

    // Guardamos automáticamente el borrador
    guardarBorrador();
}

// Función para validar los bloques del artículo
function validarBloques() {
    let listaErrores = [];
    
    // Comprobar que existe exactamente un H1
    let cantidadH1 =bloques.filter(function(bloque) {
        return bloque.tipo === "h1";
    }).length;

    if (cantidadH1 === 0) {
        listaErrores.push("El artículo debe tener un H1.");
    }

    if (cantidadH1 > 1) {
        listaErrores.push("El artículo no puede tener más de un H1.")
    }

    // Comprobar que ningún H3 aparece sin un H2 anterior
    let existeH2 = false;
    bloques.forEach(function(bloque, indice) {
        if (bloque.tipo === "h2") {
            existeH2 = true;
        }
        if (bloque.tipo === "h3" && !existeH2) {
            listaErrores.push("El bloque " + (indice + 1) + ": hay un H3 sin un H2 anterior."); 
        }
    });

    // Comprobar que todas las imágenes tienen texto alternativo
    bloques.forEach(function(bloque, indice) {
        if (bloque.tipo === "imagen" && bloque.alt.trim() === "") {
            listaErrores.push("El bloque " + (indice + 1) + ": la imagen necesita un texto alternativo (alt).");
        } 
    });

    // Mostrar los errores
    if (listaErrores.length > 0) {
        errores.innerHTML = listaErrores.join("<br>");
    } else {
        errores.textContent = "¡El artículo es correcto! No se han encontrado errores.";
    }
    return listaErrores.length === 0;
}

// Función para guardar el borrador
function guardarBorrador() {
    localStorage.setItem("articuloGuardado", JSON.stringify(bloques));
    localStorage.setItem("indiceActivado", crearIndice.checked);
}

// Función para recuperar el borrador
function recuperarBorrador() {
    const borrador = localStorage.getItem("articuloGuardado");
    if (borrador !== null) {
        bloques = JSON.parse(borrador);
    }
    const indiceGuardado = localStorage.getItem("indiceActivado");
    if (indiceGuardado !== null) {
        crearIndice.checked = indiceGuardado === "true";
    }
    dibujarBloques();
    }

// DIBUJAR LOS BLOQUES EN PANTALLA
function dibujarBloques() {

    // Vaciamos el contenido anterior
    listaBloques.innerHTML = "";

    // Recorremos el array de bloques
    bloques.forEach(function (bloque, indice) {

        // Creamos un contenedor para cada bloque
        const div = document.createElement("div");
        div.className = "bloque";

        // Creamos el título del bloque
        const titulo = document.createElement("h3");
        titulo.textContent = "Bloque " + (indice + 1) +
            " - " + bloque.tipo.toUpperCase();
        div.appendChild(titulo);
        
        // BLOQUE DE IMAGEN
        if (bloque.tipo === "imagen") {

            // Campo para la URL de la imagen
            const campoURL = document.createElement("input");
            campoURL.type = "text";
            campoURL.placeholder = "Introduce la URL de la imagen";
            campoURL.value = bloque.texto;
            campoURL.addEventListener("input", function () {
                bloques[indice].texto = campoURL.value;
                actualizarVistaPrevia();
            });
            div.appendChild(campoURL);

            // Campo para el texto alternativo
            const campoAlt = document.createElement("input");
            campoAlt.type = "text";
            campoAlt.placeholder = "Introduce el texto alternativo (alt)";
            campoAlt.value = bloque.alt;
            campoAlt.addEventListener("input", function () {
                bloques[indice].alt = campoAlt.value;
                actualizarVistaPrevia();
            });
            div.appendChild(campoAlt);
        }

        // BLOQUE CTA
        else if (bloque.tipo === "cta") {

            // Campo para el texto del botón
            const campoTexto = document.createElement("input");
            campoTexto.type = "text";
            campoTexto.placeholder = "Texto del botón";
            campoTexto.value = bloque.texto;
            campoTexto.addEventListener("input", function () {
                bloques[indice].texto = campoTexto.value;
                actualizarVistaPrevia();
            });
            div.appendChild(campoTexto);

            // Campo para la URL de destino
            const campoURL = document.createElement("input");
            campoURL.type = "text";
            campoURL.placeholder = "Introduce la URL de destino";
            campoURL.value = bloque.url;
            campoURL.addEventListener("input", function () {
                bloques[indice].url = campoURL.value;
                actualizarVistaPrevia();
            });
            div.appendChild(campoURL);
        }
      
        // RESTO DE BLOQUES
        else {
            const campo = document.createElement("textarea");
            campo.value = bloque.texto;
            campo.placeholder = "Escribe el contenido...";
            campo.addEventListener("input", function () {
                bloques[indice].texto = campo.value;
                actualizarVistaPrevia();
            });
            div.appendChild(campo);
        }

        // BOTONES DE ACCIONES
        const acciones = document.createElement("div");
        acciones.className = "acciones";
        crearIndice.addEventListener("chage", function() {
            actualizarVistaPrevia();
        });

        // Botón subir
        const btnSubir = document.createElement("button");
        btnSubir.type = "button";
        btnSubir.textContent = "Subir";
        btnSubir.addEventListener("click", function () {
            subirBloque(indice);
        });

        // Botón bajar
        const btnBajar = document.createElement("button");
        btnBajar.type = "button";
        btnBajar.textContent = "Bajar";
        btnBajar.addEventListener("click", function () {
            bajarBloque(indice);
        });

        // Botón eliminar
        const btnEliminar = document.createElement("button");
        btnEliminar.type = "button";
        btnEliminar.textContent = "Eliminar";
        btnEliminar.addEventListener("click", function () {
            eliminarBloque(indice);
        });

        // Introducimos los botones en el contenedor
        acciones.appendChild(btnSubir);
        acciones.appendChild(btnBajar);
        acciones.appendChild(btnEliminar);

        // Añadimos las acciones al bloque
        div.appendChild(acciones);

        // Añadimos el bloque a la página
        listaBloques.appendChild(div);
    });
}

// Evento para copiar el código HTML
btnCopiar.addEventListener("click", function() {
    if (validarBloques()) {
        navigator.clipboard.writeText(codigoHTML.value).then(function() {
            alert("¡Código HTML copiado correctamente!")
        })
        .catch(function() {
            alert("No se ha podido copiar el código.");
        });
    } else { alert("No puedes copiar el código. Corrige primero los errores."); }
});

// Recuperamos el borrador al cargar la página
recuperarBorrador();

// Evento para borrar el artículo
btnBorrar.addEventListener("click", function() {
    if (confirm("¿Quieres borrar todo el artículo?")) {
        bloques = [];
        localStorage.removeItem("articuloGuardado");
        localStorage.removeItem("indiceActivado");
        crearIndice.checked = false;
        dibujarBloques();
    }
});
