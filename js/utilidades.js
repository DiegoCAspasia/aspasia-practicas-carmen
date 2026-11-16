//Función para normalizar el texto 
export function normalizar(texto) {
    return texto.toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^\w\s]/g, " ");
}