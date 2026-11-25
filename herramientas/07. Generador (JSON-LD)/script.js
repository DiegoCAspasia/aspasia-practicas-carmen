console.log("JavaScript está funcionando");

// Seleccionamos los elementos HTML
const tipoSchema = document.getElementById("tipoSchema");
console.log("Selector encontrado:", tipoSchema);
const formularioSchema = document.getElementById("formularioSchema");
const mensaje = document.getElementById("mensaje");

// Función para mostrar el formulario seleccionado
function mostrarFormulario() {

    // Recogemos el tipo de marcado elegido
    const tipo = tipoSchema.value;
    console.log("Tipo seleccionado:", tipo);

    // Comprobamos qué formulario debemos mostrar
    if (tipo === "Course") {
        formularioSchema.innerHTML = `
            <h2>Datos del curso</h2>
            <label for="nombreCurso">Nombre del curso *</label>
            <input type="text" id="nombreCurso"
                placeholder="Ejemplo: Operaciones básicas de cocina">
            
            <label for="descripcionCurso">Descripción del curso *</label>
            <textarea id="descripcionCurso"
                placeholder="Describe el contenido del curso...."></textarea>
            
            <label for="proveedor">Centro u organización que imparte el curso</label>
            <input type="text" id="proveedor"
                placeholder="Nombre del centro">
                
            <label for="urlCurso">URL del curso *</label>
            <input type="url" id="urlCurso"
                placeholder="https://www.ejemplo.com/curso"> 
                
            <label for="codigoCurso">Código del curso *</label>
            <input type="text" id="codigoCurso"
                placeholder="Ejemplo: HOTR0108">

            <label for="idiomaCurso">Idioma del curso *</label>
            <input type="text" id="idiomaCurso"
                placeholder="Ejemplo: es">    
        `;
    } else {

        // Para los demás tipos todavía no hemos creado los formularios
        formularioSchema.innerHTML = `
              <p>Este formulario lo prepararemos más adelante.</p>
        `;
    }
}

// Detectamos los cambios en el selector
tipoSchema.addEventListener("change", mostrarFormulario);
console.log("Evento change registrado");