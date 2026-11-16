import {
    normalizar
} from "../../js/utilidades.js";

// Seleccionamos los elementos HTML
const texto = document.getElementById("texto");
const keywords = document.getElementById("keywords");
const minimo = document.getElementById("minimo");
const maximo = document.getElementById("maximo");
const analizar = document.getElementById("analizar");
const estado = document.getElementById("estado");

// Seleccionamos las tablas
const resultadoKeywords = document.getElementById("resultadoKeywords");
const resultadoPalabras = document.getElementById("resultadoPalabras");
const resultadoBigramas = document.getElementById("resultadoBigramas");
const resultadoTrigramas = document.getElementById("resultadoTrigramas");

// Palabras que no queremos contar en los rankings
const stopwords = new Set([
    "de", "la", "que", "el", "en", "y", "los", "las", "un", "una",
    "unos", "unas", "para", "por", "con", "del", "al", "es", "se", 
    "su", "sus", "como", "a", "o", "pero", "si", "no", "lo", "le",
    "les", "me", "te", "mi", "tu"
]);

// Contar las palabras repetidas
function contarFrecuencias(lista) {
    let frecuencias = new Map();
    lista.forEach(function(palabra) {
        if (!stopwords.has(palabra)) {
            let cantidad = frecuencias.get(palabra) || 0;
            frecuencias.set(palabra, cantidad + 1);
        }
    });
    return frecuencias;
}

// Contar combinaciones de palabras
function contarNgramas(lista, cantidad) {
    let frecuencias = new Map();
    for (let i = 0; i <= lista.length - cantidad; i++) {
        let grupo = lista.slice(i, i + cantidad);
        if (grupo.some(palabra => stopwords.has(palabra))) {
            continue;
        }
        let combinacion = grupo.join(" ");
        let veces = frecuencias.get(combinacion) || 0;
        frecuencias.set(combinacion, veces + 1);
    }
    return frecuencias;
}

// Contar las veces que aparece una palabra clave
function contarKeyword(palabras, keyword) {
    let contador = 0;
    for (let i = 0; i <= palabras.length - keyword.length; i++) {
        let coincide = true;
        for (let j = 0; j < keyword.length; j++) {
            if (palabras[i + j] !== keyword[j]) {
                coincide = false;
                break;
            }
        }
        if (coincide) {
            contador++;
        }
    }
    return contador;
}

// Función para separar las palabras
function obtenerPalabras(texto) {
    return normalizar(texto)
        .trim()
        .split(/\s+/)
        .filter(Boolean);
}

// Crear una celda de la tabla
function crearCelda(fila, contenido, valor, clase = "") {
    let celda = document.createElement("td");
    celda.textContent = contenido;
    celda.dataset.valor = valor;
    celda.className = clase;
    fila.appendChild(celda);
}

// Mostrar los resultados de las palabras clave
function mostrarKeywords(lista, palabras, total, min, max) {
    resultadoKeywords.innerHTML = "";
    lista.forEach(function(keyword) {
        let apariciones = contarKeyword(palabras, keyword.palabras);
        let densidad = total > 0
            ? (apariciones * keyword.palabras.length / total) * 100 : 0;
            let clase = "correcta";
            let mensaje = "Correcta";

            if (densidad < min) {
                clase = "baja";
                mensaje = "Demasiado alta";
            }
              if (densidad > max) {
                clase = "alta";
                mensaje = "Demasiado alta";
            }
            let fila = document.createElement("tr");
            crearCelda(fila, keyword.nombre, keyword.nombre);
            crearCelda(fila, apariciones, apariciones);
            crearCelda(fila, densidad.toFixed(2) + " %", densidad);

            let celdaEstado = document.createElement("td");
            celdaEstado.textContent = mensaje;
            celdaEstado.className = clase;
            fila.appendChild(celdaEstado);
            resultadoKeywords.appendChild(fila);
    });

    if (lista.length === 0) {
        resultadoKeywords.textContent = "Introduce alguna palabra clave.";
    }
}

// Mostrar las palabras y combinaciones más repetidas
function mostrarRanking(tabla, frecuencias, limite) {
    tabla.innerHTML = "";
    let resultados = Array.from(frecuencias.entries());
    resultados.sort(function(a, b) {
        return b[1] - a[1];
    });

    resultados = resultados.slice(0, limite);
    resultados.forEach(function(elemento) {
        let fila = document.createElement("tr");
        crearCelda(fila, elemento[0], elemento[0]);
        crearCelda(fila, elemento[1], elemento[1]);
        tabla.appendChild(fila);
    });
}

// Ordenar las tablas al pulsar las cabeceras
document.querySelectorAll(".ordenar").forEach(function(boton) {
    boton.addEventListener("click", function() {
        let tabla = boton.closest("table");
        let cuerpo = tabla.querySelector("tbody");
        let columna = Number(boton.dataset.columna);
        let filas = Array.from(cuerpo.querySelectorAll("tr"));
        let orden = boton.dataset.orden === "asc" ? "desc" : "asc";
        boton.dataset.orden = orden;
        filas.sort(function(a, b) {
            let valorA = a.cells[columna].dataset.valor;
            let valorB = b.cells[columna].dataset.valor;

            let numeroA = Number(valorA);
            let numeroB = Number(valorB);

            if (valorA.trim() !== "" && valorB.trim() !== "" && !isNaN(numeroA) && !isNaN(numeroB)) {
                return orden === "asc"
                ? numeroA - numeroB
                : numeroB - numeroA;
            }
            return orden === "asc"
            ? valorA.localeCompare(valorB, "es")
            : valorB.localeCompare(valorA, "es");
        });
        
        filas.forEach(function(fila) {
            cuerpo.appendChild(fila);
        });
    });
});

// Analizar el texto
analizar.addEventListener("click", function() {
    
    //Recoger el texto y separarlo en palabras
    let listaPalabras = obtenerPalabras(texto.value);
    let total = listaPalabras.length;

    //Recoger las palabras clave
    let listaKeywords = keywords.value.split(",")
        .map(function(nombre) {
            return {
                nombre: nombre.trim(),
                palabras: obtenerPalabras(nombre)
            };
        })
        .filter(function(keyword) {
            return keyword.palabras.length > 0;
        });

        // Recoger los porcentajes
        let min = Number(minimo.value);
        let max = Number(maximo.value);

        // Comprobar los porcentajes
        if (minimo.value === "" || maximo.value === "" || min < 0 || max < 0 || max < min) {
            estado.textContent = "Comprueba los porcentajes mínimo y máximo.";
            return;
        }

        // Calcular las palabras repetidas
        let frecuencias = contarFrecuencias(listaPalabras);

        // Calcular las combinaciones
        let bigramas = contarNgramas(listaPalabras, 2);
        let trigramas = contarNgramas(listaPalabras, 3);

        // Mostrar los resultados
        mostrarKeywords(listaKeywords, listaPalabras, total, min, max);
        mostrarRanking(resultadoPalabras, frecuencias, 20);
        mostrarRanking(resultadoBigramas, bigramas, 10);
        mostrarRanking(resultadoTrigramas, trigramas, 10);

        // Mostrar mensaje
        estado.textContent = "Análisis completado correctamente.";
    });