// Seleccionamos los elementos HTML
const tipoSchema = document.getElementById("tipoSchema");
const formularioSchema = document.getElementById("formularioSchema");
const mensaje = document.getElementById("mensaje");

// Función para mostrar el formulario seleccionado
function mostrarFormulario() {

    // Recogemos el tipo de marcado elegido
    const tipo = tipoSchema.value;

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
                
            <label for="urlCurso">URL del curso </label>
            <input type="url" id="urlCurso"
                placeholder="https://www.ejemplo.com/curso"> 
                
            <label for="codigoCurso">Código del curso </label>
            <input type="text" id="codigoCurso"
                placeholder="Ejemplo: HOTR0108">

            <label for="idiomaCurso">Idioma del curso </label>
            <input type="text" id="idiomaCurso"
                placeholder="Ejemplo: es">
                
            <button type="button" id="generarJSON">Generar código JSON-LD</button>
        `;
    } else if (tipo === "FAQPage") {
        formularioSchema.innerHTML = `
        <h2>Preguntas frecuentes</h2>
        <label for="tituloFAQ">Título de la página</label>
            <input type="text" id="tituloFAQ"
                placeholder="Ejemplo: Preguntas frecuentes sobre nuestros cursos">
            <div id="listaPreguntas"></div>
            
            <button type="button" id="anadirPregunta">Añadir pregunta</button>
            <button type="button" id="generarJSON">Generar código JSON-LD</button>
            `;
    } else if (tipo === "Article") {
        formularioSchema.innerHTML = `
        <h2>Datos del artículo</h2>
        <label for="tituloArticulo">Título del artículo *</label>
            <input type="text" id="tituloArticulo"
                placeholder="Escribe el título del artículo">

        <label for="descripcionArticulo">Descripción *</label>
            <textarea id="descripcionArticulo"
                placeholder="Escribe una descripción del artículo"></textarea>

        <label for="autorArticulo">Autor</label>
            <input type="text" id="autorArticulo"
                placeholder="Nombre del autor">

        <label for="urlArticulo">URL del artículo</label>
            <input type="url" id="urlArticulo"
                placeholder="https://www.ejemplo.com/articulo">

        <label for="imagenArticulo">URL de la imagen</label>
            <input type="url" id="imagenArticulo"
                placeholder="https://www.ejemplo.com/imagen.jpg">

        <label for="fechaArticulo">Fecha de publicación</label>
            <input type="date" id="fechaArticulo">
               
        <button type="button" id="generarJSON">Generar código JSON-LD</button>
    `;
    } else if (tipo === "BreadcrumbList") {
        contadorNiveles = 0;
        formularioSchema.innerHTML = `
        <h2>Ruta de navegación</h2>
        <p>Añade los niveles que forman la ruta de navegación.</p>
        <div id="listaNiveles"></div>
        
        <button type="button" id="anadirNivel">Añadir nivel</button>
        <button type="button" id="generarJSON">Generador código JSON-LD</button>
    `;
    }
}

// Contador de preguntas
let contadorPreguntas = 0;

// Función para añadir una pregunta
function anadirPregunta() {
    contadorPreguntas++;
    const listaPreguntas = document.getElementById("listaPreguntas");
    listaPreguntas.innerHTML += `
        <div class="pregunta-item">
           <h3>Pregunta ${contadorPreguntas}</h3>
           
           <label for="pregunta${contadorPreguntas}">Pregunta *</label>
           
           <input type="text" id="pregunta${contadorPreguntas}"
                placeholder="Escribe la pregunta">
                
           <label for="respuesta${contadorPreguntas}">Respuesta *</label>
           <textarea id="respuesta${contadorPreguntas}"
                placeholder="Escribe la respuesta"></textarea>
        </div>
        `;
    }

// Contador de niveles de navegación
let contadorNiveles = 0;

// Función para añadir un nivel
function anadirNivel() {
    contadorNiveles++;
    const listaNiveles = document.getElementById("listaNiveles");
    listaNiveles.insertAdjacentHTML("beforeend", `
        <div class="nivel-item">
        <h3>Nivel ${contadorNiveles}</h3>
        
        <label for="nombreNivel${contadorNiveles}">Nombre del nivel *</label>
        
        <input type="text" id="nombreNivel${contadorNiveles}"
            placeholder="Ejemplo: Inicio">
            
        <label for="urlNivel${contadorNiveles}">URL del nivel *</label>
        
        <input type="url" id="urlNivel${contadorNiveles}"
            placeholder="https://www.ejemplo.com">
        </div>
    `);
}

// Función para generar el marcado JSON-LD de Course
function generarCourse() {

    // Recoger los valores del formulario
    const nombre = document.getElementById("nombreCurso").value.trim();
    const descripcion = document.getElementById("descripcionCurso").value.trim();
    const proveedor = document.getElementById("proveedor").value.trim();
    const url = document.getElementById("urlCurso").value.trim();
    const codigo = document.getElementById("codigoCurso").value.trim();
    const idioma = document.getElementById("idiomaCurso").value.trim();

    // Comprobar los campos obligatorios
    if (nombre === "" || descripcion === "") {
        alert("El nombre y la descripción del curso son obligatorios.");
        return;
    }

    // Crear el objeto principal
    const curso = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": nombre,
        "description": descripcion
    };

    // Añadir los campos opcionales si tienen contenido
    if (proveedor !== "") {
        curso.provider = {
            "@type": "Organization",
            "name": proveedor
        };
    } if (url !== "") {
        curso.url = url;
    } if (codigo !== "") {
        curso.courseCode = codigo;
    } if (idioma !== "") {
        curso.inLanguage = idioma;
    }

    // Convertir el objeto en texto JSON
    const resultado = JSON.stringify(curso, null, 2);

    // Mostrar el resultado en el área de texto
    document.getElementById("codigoJSON").value =
        `<script type="application/ld+json">\n${resultado}\n<\/script>`;
}

// Función para generar el marcado JSON-LD de FAQPage
function generarFAQ() {
  
    // Recogemos el título de la página
    const titulo = document.getElementById("tituloFAQ").value.trim();

    // Comprobamos que exista al menos una pregunta
    if (contadorPreguntas === 0) {
        alert("Debes añadir al menos una pregunta.");
        return;
    }

    // Creamos el objeto principal
    const faq = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": []
    };

    // Añadimos el título si tiene contenido
    if (titulo !== "") {
        faq.name = titulo;
    }

    // Recorremos todas las preguntas
    for (let i = 1; i <= contadorPreguntas; i++) {
        const pregunta = document.getElementById(`pregunta${i}`).value.trim();
        const respuesta = document.getElementById(`respuesta${i}`).value.trim();

        // Comprobamos que los campos estén completos
        if (pregunta === "" || respuesta === "") {
            alert(`Debes completar la pregunta y respuesta número ${i}.`);
            return
        }

        // Añadimos la pregunta y su respuesta
        faq.mainEntity.push({
            "@type": "Question",
            "name": pregunta,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": respuesta
            }
        });
    }

    // Convertimos el objeto en texto JSON
    const resultado = JSON.stringify(faq, null, 2);

    // Mostramos el resultado
    document.getElementById("codigoJSON").value =
    `<script type="application/ld+json">\n${resultado}\n\/script>`;
}

// Función para generar el marcado JSON-LD de Article
function generarArticle() {

    // Recogemos los valores del formulario
    const titulo = document.getElementById("tituloArticulo").value.trim();
    const descripcion = document.getElementById("descripcionArticulo").value.trim();
    const autor = document.getElementById("autorArticulo").value.trim();
    const url = document.getElementById("urlArticulo").value.trim();
    const imagen = document.getElementById("imagenArticulo").value.trim();
    const fecha = document.getElementById("fechaArticulo").value;

    // Comprobamos los campos obligatorios
    if (titulo === "" || descripcion === "") {
        alert("El título y la descripción del artículo son obligatorios.");
        return;
    }

    // Creamos el objeto principal
    const articulo = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": titulo,
        "description": descripcion
    };

    // Añadimos los campos opcionales si tienen contenido
    if (autor !== "") {
        articulo.author = {
            "@type": "Person",
            "name": autor
        };
    }
    if (url !== "") {
        articulo.url = url;
    }
    if (imagen !== "") {
        articulo.image = imagen;
    }
    if (fecha !== "") {
        articulo.datePublished = fecha;
    }

    // Convertimos el objeto en texto JSON
    const resultado = JSON.stringify(articulo, null, 2);

    // Mostramos el resultado en el área de texto
    document.getElementById("codigoJSON").value =
       `<script type="application/ld+json">\n${resultado}\n<\/script>`;
}

// Función para generar el marcado JSON-LD de BreadcrumbList
function generarBreadcrumb() {

    // Comprobamos que exista al menos un nivel
    if (contadorNiveles === 0) {
        alert("Debes añadir al menos un nivel de navegación.");
        return;
    }

    // Creamos el objeto principal
    const breadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": []
    };

    // Recorremos todos los niveles
    for (let i = 1; i <= contadorNiveles; i++) {
        const nombre = document.getElementById(`nombreNivel${i}`).value.trim();
        const url = document.getElementById(`urlNivel${i}`).value.trim();

        // Comprobamos que los campos estén completos
        if (nombre === "" || url === "") {
            alert(`Debes completar el nombre y la URL del nivel ${i}.`);
            return;
        }

        // Añadimos el nivel a la ruta
        breadcrumb.itemListElement.push({
            "@type": "ListItem",
            "position": i,
            "name": nombre,
            "item": url    
        });
    }

    // Convertimos el objeto en texto JSON
    const resultado = JSON.stringify(breadcrumb, null, 2);

    // Mostramos el resultado
    document.getElementById("codigoJSON").value =
        `<script type="application/ld+json">\n${resultado}\n<\/script>`;
}

// Detectamos los cambios en el selector
tipoSchema.addEventListener("change", function() {

    // Limpiamos el código generado anteriormente
    document.getElementById("codigoJSON").value = "";

    // Mostramos el formulario seleccionado
    mostrarFormulario();
});


// Detectar el clic en el botón de generar JSON-LD
formularioSchema.addEventListener("click", function(evento) {
    if (evento.target.id === "generarJSON") {
        if (tipoSchema.value === "Course") {
            generarCourse();
        }
        if (tipoSchema.value === "FAQPage") {
            generarFAQ();
        }
        if (tipoSchema.value === "Article") {
            generarArticle();
        }        
    }
    if (evento.target.id === "anadirPregunta") {
        anadirPregunta();
    }
    if (evento.target.id === "anadirNivel") {
        anadirNivel();
    }
    if (evento.target.id === "generarJSON" &&
        tipoSchema.value === "BreadcrumbList") {
        generarBreadcrumb();
    }
});

// Detectamos el clic en el botón Copiar
const botonCopiar = document.getElementById("copiar");
botonCopiar.addEventListener("click", async function() {
    const codigo = document.getElementById("codigoJSON").value;

    // Comprobamos que exista código para copiar
    if (codigo.trim() === "") {
        alert("Primero debes generar el código JSON-LD.");
        return;
    }
    
    // Copiamos el código al portapapeles
    try {
        await navigator.clipboard.writeText(codigo);
        alert("¡Código JSON-LD copiado correctamente!");
    } catch (error) {
        alert("No se ha podido copiar el código.");
    }
});