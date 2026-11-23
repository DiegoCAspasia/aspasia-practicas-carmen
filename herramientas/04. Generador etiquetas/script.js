// Importamos las funciones auxiliares
import { escaparHTML } from "../../js/utilidades.js";

//Localizamos los elementos del formulario
const formulario = document.getElementById("formulario");
const titulo = document.getElementById("titulo");
const descripcion = document.getElementById("descripcion");
const url = document.getElementById("url");
const sitio = document.getElementById("sitio");
const tipo = document.getElementById("tipo");
const imagen = document.getElementById("imagen");

// Elementos de las vistas previas
const imgFacebook = document.getElementById("imgFacebook");
const imgTwitter = document.getElementById("imgTwitter");
const imgLinkedln = document.getElementById("imgLinkedln");

// Mensajes
const avisoImagen = document.getElementById("avisoImagen");
const codigoMeta = document.getElementById("codigoMeta");
const estado = document.getElementById("estado");

// Cuando el usuario selecciona una imagen
    imagen.addEventListener("change", function () {
    const archivo = imagen.files[0];

    // Comprobamos que haya seleccionado un archivo
    if (!archivo) {
        return;
    }

    // Comprobamos que sea una imagen
    if (!archivo.type.startsWith("image/")) {
        avisoImagen.textContent = "El achivo seleccionado no es una imagen.";
        return;
    }

    // Creamos un lector de archivos
    const lector = new FileReader();

    // Cuando termina de leer la imagen
    lector.onload = function () {
        const imagenCargada = new Image();
    

    // Cargamos el contenido leido
    imagenCargada.src = lector.result;

    // Mostramos la imagen en las tres tarjetas
    imgFacebook.src = lector.result;
    imgTwitter.src = lector.result;
    imgLinkedln.src = lector.result;

    // Cuando conocemos las dimensiones
    imagenCargada.onload = function () {
        const ancho = imagenCargada.naturalWidth;
        const alto = imagenCargada.naturalHeight;
        comprobarDimensiones(ancho, alto);
    };
};

// Leemos el archivo como una URL de datos
lector.readAsDataURL(archivo);

});

function comprobarDimensiones(ancho, alto) {
    const proporcion = ancho / alto;
    const recomendada = 1200 / 630;

    // Mostramos las dimensiones
    avisoImagen.textContent = "Dimensiones de la imagen" + ancho + " x " + alto + " pixeles.";

    //Comprobamos la proporción y el tamaño
    if ( Math.abs(proporcion - recomendada) > 0.1 || ancho < 1200 || alto < 630) {
        avisoImagen.textContent += " Aviso: se recomienda utilizar una imagen de 1200 x 630 píxeles.";
        avisoImagen.style.color = "#d97706";
    }
    else {
        avisoImagen.textContent += "La imagen tiene unas dimensiones adecuadas.";
        avisoImagen.style.color = "#287a58";
    }
}

function actualizarVista() {
    const textoTitulo = titulo.value;
    const textoDescripcion = descripcion.value;
    const direccion = url.value;

    let dominio = direccion;
    try {
        dominio = new URL(direccion).hostname;
    }
    catch (error) {
        dominio = direccion;
    }

    // Facebook
    document.getElementById("tituloFacebook").textContent = textoTitulo;
    document.getElementById("descFacebook").textContent = textoDescripcion;
    document.getElementById("urlFacebook").textContent = dominio;

    // Twitter
    document.getElementById("tituloTwitter").textContent = textoTitulo;
    document.getElementById("descTwitter").textContent = textoDescripcion;
    document.getElementById("urlTwitter").textContent = dominio;

    // Linkedln
    document.getElementById("tituloLinkedln").textContent = textoTitulo;
    document.getElementById("descLinkedln").textContent = textoDescripcion;
    document.getElementById("urlLinkedln").textContent = dominio;

    console.log("Título:", textoTitulo);
    console.log("Descripción:", textoDescripcion);
    console.log("URL:", dominio);
}

function generarEtiquetas() {
    // Obtenemos los datos del formulario
    const t = escaparHTML(titulo.value);
    const d = escaparHTML(descripcion.value);
    const u = escaparHTML(url.value);
    const s = escaparHTML(sitio.value);
    const tipoContenido = tipo.value;

    // La imagen local todavía no tiene una URL pública
    const imagenPublica = "https://www.tudominio.com/imagen.jpg"

    let etiquetas = "";
    etiquetas += "<!-- OPEN GRAPH -->\n";
    etiquetas += '<meta property="og:title" content="' + t + '">\n';
    etiquetas += '<meta property="og:descripcion" content="' + d + '">\n';
    etiquetas += '<meta property="og:url" content="' + u + '">\n';
    etiquetas += '<meta property="og:site_name" content="' + s + '">\n';
    etiquetas += '<meta property="og:type" content="' + tipoContenido + '">\n';
    etiquetas += '<meta property="og:image" content="' + imagenPublica + '">\n';

    etiquetas += "\n<!-- TWITTER -->\n";
    etiquetas += '<meta name="twitter:card" content="sumary_large_image">\n';
    etiquetas += '<meta name="twitter:title" content="' + t + '">\n';
    etiquetas += '<meta name="twitter:descripcion" content="' + d + '">\n';
    etiquetas += '<meta name="twitter:image" content="' + imagenPublica + '">';

    codigoMeta.value = etiquetas;
}


formulario.addEventListener("submit", function(event){
    event.preventDefault();
    actualizarVista();
    generarEtiquetas();

    estado.textContent = "Vista previa y etiquetas generadas correctamente.";
});

const botonCopiar = document.getElementById("copiar");
botonCopiar.addEventListener("click", async function() {
    if (codigoMeta.value === "") {
        estado.textContent = "Primero debes generar las etiquetas.";
        return;
    }
    try {
        await navigator.clipboard.writeText(codigoMeta.value);
        estado.textContent = "¡Etiquetas copiadas correctamente";
    }
    catch (error) {
        estado.textContent = "No se ha podido copiar el código";

    }    
});
