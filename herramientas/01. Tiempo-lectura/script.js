//Seleccionamos los elementos HTML
const texto = document.getElementById("texto");
const velocidad = document.getElementById("velocidad");
const copiar = document.getElementById("copiar");

//Seleccionamos los resultados
const palabras = document.getElementById("palabras");
const conEspacios = document.getElementById("conEspacios");
const sinEspacios = document.getElementById("sinEspacios");
const frases = document.getElementById("frases");
const parrafos = document.getElementById("parrafos");
const tiempo = document.getElementById("tiempo");
const estado = document.getElementById("estado");

//Función para analizar el texto
function analizarTexto() {
    let contenido = texto.value;

    //Contar palabras
    let listaPalabras = contenido.trim() === "" ? []
    : contenido.trim().split(/\s+/);
    let totalPalabras = listaPalabras.length;

    //Contar caracteres
    let totalConEspacios = contenido.length;
    let totalSinEspacios = contenido.replace(/\s/g, "").length;

    //Contar frases
    let listaFrases = contenido.match(/[^.!?]+[.!?]+/g);
    let totalFrases = listaFrases ? listaFrases.length : 0;

    //Contar párrafos
    let totalParrafos = contenido.trim() === "" ? 0
    : contenido.trim().split(/\n\s*\n/).filter(Boolean).length;

    //Calcular tiempo de lectura
    let velocidadLectura = Number(velocidad.value);
    let segundos = totalPalabras / velocidadLectura * 60;
    let minutos = Math.floor(segundos / 60);
    let segundosRestantes = Math.round(segundos % 60);

    //Ajustar si los segundos llegan a 60
    if (segundosRestantes === 60){
        minutos++;
        segundosRestantes = 0;
    }

    //Mostrar resultados
    palabras.textContent = totalPalabras;
    conEspacios.textContent = totalConEspacios;
    sinEspacios.textContent = totalSinEspacios;
    frases.textContent = totalFrases;
    parrafos.textContent = totalParrafos;

    tiempo.textContent = minutos + "min" + segundosRestantes + "s";
}
 //Analizar automáticamente al escribir
 texto.addEventListener("input", analizarTexto);

 //Actualizar tiempo al cambiar la velocidad
 velocidad.addEventListener("change", analizarTexto);

 //Copiar estadísticas
 copiar.addEventListener("click", function() {
    let resumen =
        "ESTADÍSTICAS DEL TEXTO\n" +
        "Palabras: " + palabras.textContent +"\n" +
        "Caracteres con espacios: " + conEspacios.textContent + "\n" +
        "Caracteres sin espacios: " + sinEspacios.textContent + "\n" +
        "Frases: " + frases.textContent + "\n" +
        "Párrafos: " + parrafos.textContent + "\n" +
        "Tiempo de lectura: " + tiempo.textContent;
    navigator.clipboard.writeText(resumen).then(function() {
        estado.textContent = "¡Copiado al portapapeles!";
    }) 
    .catch(function() {
        estado.textContent = "No se ha podido copial el texto.";
    });
 });
 
 //Ejecutar al cargar la página
 analizarTexto();


