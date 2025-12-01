/**
* Función para filtrar los planes de servicio
* Se llama en el evento 'onkeyup' del campo de búsqueda.
*/
function filtrarPlanes() {
    // 1. Obtener el valor de búsqueda y convertirlo a mayúsculas para una comparación insensible a mayúsculas/minúsculas
    let input = document.getElementById("buscador");
    let filtro = input.value.toUpperCase();

    // 2. Obtener el contenedor de los planes y la colección de todos los planes (etiquetas <article>)
    let contenedor = document.getElementById("contratar");
    let planes = contenedor.getElementsByTagName('article');

    // 3. Iterar sobre cada plan y revisar si coincide con el filtro
    for (let i = 0; i < planes.length; i++) {
        let planCard = planes[i];

        let nombrePlan = planCard.getElementsByTagName("h2")[0];
        let caracteristicas = planCard.getElementsByTagName("ul")[0];
        let precioDiv = planCard.querySelector('[data-precio] span'); // Busca el precio visible

        // Combinar todo el texto relevante para una búsqueda completa
        let textoCompleto = "";

        if (nombrePlan) {
            textoCompleto += nombrePlan.textContent + " ";
        }
        if (caracteristicas) {
            textoCompleto += caracteristicas.textContent + " ";
        }
        if (precioDiv) {
            // Incluir el precio en el texto de búsqueda
            textoCompleto += precioDiv.textContent;
        }

        // 4. Comparar el texto del plan con el filtro
        if (textoCompleto.toUpperCase().indexOf(filtro) > -1) {
            // Si el texto de búsqueda se encuentra en el plan, lo mostramos
            planCard.style.display = ""; // Usa el estilo por defecto (generalmente flex o block)
        } else {
            // Si no se encuentra, lo ocultamos
            planCard.style.display = "none";
        }
    }
}

// Array global para almacenar los ítems del carrito. Se inicializará al cargar.
let carrito = [];

// 1. SELECTORES DE ELEMENTOS DEL DOM
const contadorCarrito = document.getElementById('contador-carrito');
const listaCarrito = document.getElementById('lista-carrito');
const totalCarrito = document.getElementById('total-carrito');
const panelCarrito = document.getElementById('panel-carrito');
const botonCerrarCarrito = document.getElementById('cerrar-carrito-btn');
const iconoCarrito = document.getElementById('carrito-icono');
const botonesAgregar = document.querySelectorAll('.agregar-carrito');

// --- FUNCIONES DE LOCALSTORAGE AÑADIDAS ---

/**
 * Guarda el array 'carrito' en LocalStorage.
 */
function guardarCarritoEnLocalStorage() {
    // Convertimos el array a una cadena JSON antes de guardarlo
    localStorage.setItem('carritoDeNoxTechs', JSON.stringify(carrito));
}

/**
 * Carga el array 'carrito' desde LocalStorage si existe.
 */
function cargarCarritoDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem('carritoDeNoxTechs');
    if (carritoGuardado) {
        // Si hay datos, los parseamos de vuelta a un objeto JavaScript
        carrito = JSON.parse(carritoGuardado);
    }
    // Una vez cargado (o si está vacío), actualizamos el DOM
    actualizarCarritoDOM();
}

// 2. FUNCIÓN PARA ACTUALIZAR EL HTML DEL CARRITO
function actualizarCarritoDOM() {
    // A. Limpiar la lista actual
    listaCarrito.innerHTML = '';
    let total = 0;
    let totalItems = 0;

    // B. Iterar sobre el array 'carrito'
    carrito.forEach((item, index) => {
        // Sumar al total y al contador
        total += item.precio * item.cantidad;
        totalItems += item.cantidad;

        // Crear elemento de lista para el ítem
        const li = document.createElement('li');
        li.innerHTML = `
            ${item.nombre} - ${item.cantidad}x ($${item.precio.toFixed(2)})
            <button onclick="removerDelCarrito(${index})" style="margin-left: 10px; background: red; color: white; border: none; cursor: pointer;">X</button>
        `;
        listaCarrito.appendChild(li);
    });

    // C. Actualizar los marcadores (contador y total)
    contadorCarrito.textContent = totalItems;
    totalCarrito.textContent = total.toFixed(2);

    // D. ¡NUEVO! Guardar el estado actual del carrito
    guardarCarritoEnLocalStorage();
}

// 3. FUNCIÓN PARA AGREGAR UN PLAN AL CARRITO
function agregarAlCarrito(event) {
    // El botón está dentro de un <article> (la 'card' del producto)
    const article = event.target.closest('.producto-card');

    // Buscar el div que contiene el precio y los datos (asumiendo la estructura)
    const dataDiv = article.querySelector('div[data-nombre]');

    if (!dataDiv) {
        console.error("No se encontró el div con los atributos de datos.");
        return;
    }

    const nombre = dataDiv.dataset.nombre; // Lee el atributo data-nombre
    const precio = parseFloat(dataDiv.dataset.precio); // Lee el atributo data-precio

    // Verificar si el ítem ya existe en el carrito
    const itemExistente = carrito.find(item => item.nombre === nombre);

    if (itemExistente) {
        // Si existe, solo incrementa la cantidad
        itemExistente.cantidad++;
    } else {
        // Si no existe, agregarlo como nuevo ítem
        carrito.push({
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }

    // Actualizar la vista del carrito (y automáticamente guarda en LocalStorage)
    actualizarCarritoDOM();

    // Mostrar un mensaje de éxito (opcional)
    alert(`"${nombre}" agregado al carrito!`);

    // Abrir el panel del carrito
    panelCarrito.classList.add('visible');
}

// 4. FUNCIÓN PARA REMOVER UN PLAN DEL CARRITO (opcional pero muy útil)
function removerDelCarrito(index) {
    // Reducir la cantidad o eliminar el ítem completamente
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--;
    } else {
        carrito.splice(index, 1); // Elimina el ítem del array
    }
    // Actualizar la vista del carrito (y automáticamente guarda en LocalStorage)
    actualizarCarritoDOM();
}

// 5. EVENT LISTENERS

// Asignar la función 'agregarAlCarrito' a todos los botones 'Agregar al Carrito'
botonesAgregar.forEach(button => {
    button.addEventListener('click', agregarAlCarrito);
});

// Mostrar/Ocultar el panel del carrito
iconoCarrito.addEventListener('click', () => {
    panelCarrito.classList.toggle('visible');
});

botonCerrarCarrito.addEventListener('click', () => {
    panelCarrito.classList.remove('visible');
});

// Simular la acción de comprar (puedes enlazar esto a una pasarela de pago real)
document.getElementById('comprar-btn').addEventListener('click', () => {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Agrega planes antes de comprar.");
    } else {
        alert(`¡Compra finalizada! Total a pagar: $${totalCarrito.textContent}. Gracias por contratar con NoxTechs. te estaremos embiando la factura por gmail`);
        // Opcional: Vaciar el carrito después de la compra
        carrito = [];
        // Actualizar el DOM y guardar el carrito vacío en LocalStorage
        actualizarCarritoDOM();
        panelCarrito.classList.remove('visible');
    }
});

// airtable 
const airtableToken = "patKhYaxYl2wGveZK.1cabad950c964875e2a42f7a2b6ce22687e7b5bb1661b12c71e6784ac37910f3";
const base_id = "app7T1tZP7USslwZ0";
const table_name = "planes";

// Corregí la URL para que use las variables `base_id` y `table_name` correctamente.
const airtableUrl = `https://api.airtable.com/v0/${base_id}/${table_name}`;

async function getplanesFromAirtable() {
    try {
        const response = await fetch(airtableUrl, {
            headers: {
                'Authorization': `Bearer ${airtableToken}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log('planes from Airtable', data);
    } catch (error) {
        console.error('Error fetching planes from Airtable:', error);
    }
}

// 6. INICIALIZACIÓN: Cargar el carrito guardado al iniciar la página.
document.addEventListener('DOMContentLoaded', cargarCarritoDesdeLocalStorage);