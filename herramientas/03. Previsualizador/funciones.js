window.onload = start;

function start() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Función para medir el ancho de un texto
    function medirTexto(texto, fuente) {
        ctx.font = fuente;
        return ctx.measureText(texto).width;
    }

    // Función para recortar un texto
    function recortarTexto(texto, limite, fuente) {
        let resultado = texto;

        // Mientras el texto supere el límite
        while (medirTexto(resultado, fuente) > limite) {

            // Quitamos la última palabra
            let palabras = resultado.split(" ");
            palabras.pop();
            resultado = palabras.join(" ");
        }

        // Añadimos puntos suspensivos 
        if (resultado !== texto) {
            resultado += "...";
        }
        return resultado;
    }

    // Límites aproximados en píxeles
    const LIMITE_TITULO = 580;
    const LIMITE_DESCRIPCION = 920;

    // Recogemos los elementos del HTML
    const titulo = document.getElementById("titulo");
    const url = document.getElementById("url");
    const descripcion = document.getElementById("descripcion");

    // Recogemos los elementos de la simulación
    const vistaTitulo = document.getElementById("vistaTitulo");
    const vistaUrl = document.getElementById("vistaUrl");
    const vistaDescripcion = document.getElementById("vistaDescripcion");

    // Recogemos las barras de progreso
    const progresoTitulo = document.getElementById("progresoTitulo");
    const progresoDescripcion = document.getElementById("progresoDescripcion");

    // Recogemos los contadores
    const contadorTitulo = document.getElementById("contadorTitulo");
    const contadorDescripcion = document.getElementById("contadorDescripcion");

    // Función para actualizar la simulación
    function actualizarSimulacion() {

        // Recogemos el contenido de los campos
        let textoTitulo = titulo.value;
        let textoUrl = url.value;
        let textoDescripcion = descripcion.value;

        // Actualizamos la barra del título
        actualizarBarra(textoTitulo, LIMITE_TITULO, progresoTitulo, contadorTitulo, "20px Arial");

        // Actualizamos la barra de la descripción
        actualizarBarra(textoDescripcion, LIMITE_DESCRIPCION, progresoDescripcion, contadorDescripcion, "14px Arial");

        //Mostramos la URL
        vistaUrl.textContent = textoUrl || "www.ejemplo.com";

        // Mostramos el título
        vistaTitulo.textContent = recortarTexto(textoTitulo || "Aquí aparecerá el título", LIMITE_TITULO, "20px Arial");

        // Mostramos la descripción 
        vistaDescripcion.textContent = recortarTexto(textoDescripcion || 
            "Aquí aparecerá la descripción de tu página.", LIMITE_DESCRIPCION, "14px Arial");
    }

    // Función para actualizar las barras
    function actualizarBarra(texto, limite, barra, contador, fuente) {

        // Medimos el texto en píxeles
        let ancho = medirTexto(texto, fuente);

        // Calculamos el porcentaje
        let porcentaje = (ancho / limite) * 100;

        // Evitamos que la barra supere el 100%
        if (porcentaje > 100) {
            porcentaje = 100;
        }

        // Cambiamos la anchura de la barra
        barra.style.width = porcentaje + "%";

        // Mostramos los píxeles utilizados
        contador.textContent = Math.round(ancho) + " / " + limite + " px";

        // Cambiamos el color según la longitud
        if (ancho > limite) {
            barra.style.backgroundColor = "red";
        }
        else if (ancho >= limite * 0.85) {
            barra.style.backgroundColor = "orange";
        }
        else {
            barra.style.backgroundColor = "green";
        }
    }


    // Detectamos cuando escribimos en los campos
    titulo.addEventListener("input", actualizarSimulacion);
    url.addEventListener("input", actualizarSimulacion);
    descripcion.addEventListener("input", actualizarSimulacion);

    // Ejecutamos las funciones al cargar la página
    actualizarSimulacion();

    // Recogemos los botones
    const botonEscritorio = document.getElementById("escritorio");
    const botonMovil = document.getElementById("movil");

    // Recogemos el resultado
    const resultado = document.querySelector(".resultado");

    // Vista de escritorio
    botonEscritorio.addEventListener("click", function () {
        resultado.classList.remove("movil");
        botonEscritorio.classList.add("activo");
        botonMovil.classList.remove("activo");
    });

    // Vista de móvil
    botonMovil.addEventListener("click", function () {
        resultado.classList.add("movil");
        botonMovil.classList.add("activo");
        botonEscritorio.classList.remove("activo");
    });

}