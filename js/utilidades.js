//Función para normalizar el texto 
export function normalizar(texto) {
    return texto.toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^\w\s]/g, " ");
}

//Función para escapar carcteres HTML
export function escaparHTML(texto) {
    return texto
         .replace(/&/g, "&amp;")
         .replace(/>/g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#39;");
}