// Script del panel de administración de canchas.
// Maneja las operaciones CRUD desde el front-end:
//   - Listar todas las canchas en una tabla
//   - Crear una nueva cancha con el formulario
//   - Editar una cancha existente (rellena el formulario con los datos actuales)
//   - Eliminar una cancha (con confirmación previa)

// URL base de la API CRUD
const API_URL = '/api/canchas'

// ── Referencias a elementos del DOM ──────────────────────────────────────────
const formulario       = document.getElementById('form-cancha')
const campoId          = document.getElementById('campo-id')
const campoNombre      = document.getElementById('campo-nombre')
const campoDeporte     = document.getElementById('campo-deporte')
const campoPrecio      = document.getElementById('campo-precio')
const campoCapacidad   = document.getElementById('campo-capacidad')
const campoDisponible  = document.getElementById('campo-disponible')
const btnGuardar       = document.getElementById('btn-guardar')
const btnCancelar      = document.getElementById('btn-cancelar')
const formTitulo       = document.getElementById('form-titulo')
const mensajeForm      = document.getElementById('mensaje-form')
const contenedorTabla  = document.getElementById('contenedor-tabla')

// ── Funciones de utilidad ─────────────────────────────────────────────────────

// Muestra un mensaje de éxito o error debajo del formulario
function mostrarMensaje(texto, tipo) {
    mensajeForm.textContent = texto
    mensajeForm.className = `mensaje-form mensaje-${tipo}`  // 'exito' o 'error'
    mensajeForm.style.display = 'block'

    // El mensaje desaparece solo después de 3 segundos
    setTimeout(() => {
        mensajeForm.style.display = 'none'
    }, 3000)
}

// Limpia todos los campos del formulario y lo vuelve al modo "Alta"
function resetearFormulario() {
    campoId.value = ''
    formulario.reset()
    formTitulo.textContent = 'Agregar nueva cancha'
    btnGuardar.textContent = 'Agregar cancha'
    btnCancelar.style.display = 'none'
}

// ── Leer: cargar la tabla de canchas ─────────────────────────────────────────

async function cargarTabla() {
    try {
        const respuesta = await fetch(API_URL)
        const canchas = await respuesta.json()

        // Si no hay canchas, mostramos un mensaje en lugar de una tabla vacía
        if (canchas.length === 0) {
            contenedorTabla.innerHTML = '<p class="sin-datos">No hay canchas registradas todavía.</p>'
            return
        }

        // Construimos la tabla dinámicamente con los datos recibidos
        let html = `
            <table class="admin-tabla">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Deporte</th>
                        <th>Precio/hora</th>
                        <th>Capacidad</th>
                        <th>Disponible</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `

        canchas.forEach((cancha) => {
            html += `
                <tr>
                    <td>${cancha.nombre}</td>
                    <td>${cancha.deporte}</td>
                    <td>$${cancha.precio}</td>
                    <td>${cancha.capacidad} personas</td>
                    <td>
                        <span class="${cancha.disponible ? 'disponible' : 'ocupada'}">
                            ${cancha.disponible ? 'Sí' : 'No'}
                        </span>
                    </td>
                    <td class="td-acciones">
                        <!-- El ID se pasa como atributo data para usarlo en los event listeners -->
                        <button class="btn-accion btn-editar" data-id="${cancha.id}">Editar</button>
                        <button class="btn-accion btn-eliminar" data-id="${cancha.id}">Eliminar</button>
                    </td>
                </tr>
            `
        })

        html += '</tbody></table>'
        contenedorTabla.innerHTML = html

        // Asignamos los eventos a los botones recién creados
        asignarEventosBotones()

    } catch (error) {
        console.error('Error al cargar la tabla:', error)
        contenedorTabla.innerHTML = '<p class="error-carga">Error al cargar las canchas.</p>'
    }
}

// ── Asignar eventos a los botones de la tabla ─────────────────────────────────

// Se llama cada vez que se recarga la tabla, porque los botones son dinámicos
function asignarEventosBotones() {
    // Botones de editar
    document.querySelectorAll('.btn-editar').forEach((btn) => {
        btn.addEventListener('click', () => cargarCanchaEnFormulario(btn.dataset.id))
    })

    // Botones de eliminar
    document.querySelectorAll('.btn-eliminar').forEach((btn) => {
        btn.addEventListener('click', () => confirmarEliminacion(btn.dataset.id))
    })
}

// ── Editar: cargar datos de una cancha en el formulario ───────────────────────

async function cargarCanchaEnFormulario(id) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`)
        const cancha = await respuesta.json()

        // Llenamos el formulario con los datos actuales de la cancha
        campoId.value          = cancha.id
        campoNombre.value      = cancha.nombre
        campoDeporte.value     = cancha.deporte
        campoPrecio.value      = cancha.precio
        campoCapacidad.value   = cancha.capacidad
        campoDisponible.checked = cancha.disponible

        // Cambiamos el título y el botón para indicar que estamos editando
        formTitulo.textContent = 'Editar cancha'
        btnGuardar.textContent = 'Guardar cambios'
        btnCancelar.style.display = 'inline-block'

        // Hacemos scroll hasta el formulario para que el usuario lo vea
        formulario.scrollIntoView({ behavior: 'smooth' })

    } catch (error) {
        console.error('Error al cargar cancha para editar:', error)
        mostrarMensaje('No se pudieron cargar los datos de la cancha.', 'error')
    }
}

// ── Eliminar ──────────────────────────────────────────────────────────────────

function confirmarEliminacion(id) {
    // Confirmación antes de eliminar para evitar borrados accidentales
    const confirmado = confirm('¿Estás seguro de que querés eliminar esta cancha? Esta acción no se puede deshacer.')

    if (confirmado) {
        eliminarCancha(id)
    }
}

async function eliminarCancha(id) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        })

        if (!respuesta.ok) {
            throw new Error('Error al eliminar')
        }

        mostrarMensaje('Cancha eliminada correctamente.', 'exito')
        cargarTabla()  // Recargamos la tabla para reflejar el cambio

    } catch (error) {
        console.error('Error al eliminar cancha:', error)
        mostrarMensaje('No se pudo eliminar la cancha.', 'error')
    }
}

// ── Submit del formulario: Alta o Modificación ────────────────────────────────

formulario.addEventListener('submit', async (evento) => {
    // Prevenimos que el formulario recargue la página
    evento.preventDefault()

    // Construimos el objeto con los datos del formulario
    const datosCancha = {
        nombre:     campoNombre.value.trim(),
        deporte:    campoDeporte.value,
        precio:     Number(campoPrecio.value),
        capacidad:  Number(campoCapacidad.value),
        disponible: campoDisponible.checked
    }

    const id = campoId.value  // Si tiene valor, estamos editando; si está vacío, es alta

    try {
        let respuesta

        if (id) {
            // MODIFICACIÓN: el ID existe → hacemos PUT
            respuesta = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosCancha)
            })
        } else {
            // ALTA: no hay ID → hacemos POST
            respuesta = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosCancha)
            })
        }

        if (!respuesta.ok) {
            const errorData = await respuesta.json()
            throw new Error(errorData.detalle || 'Error al guardar')
        }

        const mensaje = id ? 'Cancha actualizada correctamente.' : 'Cancha creada correctamente.'
        mostrarMensaje(mensaje, 'exito')

        resetearFormulario()
        cargarTabla()  // Recargamos la tabla para mostrar el cambio

    } catch (error) {
        console.error('Error al guardar cancha:', error)
        mostrarMensaje(`Error: ${error.message}`, 'error')
    }
})

// ── Botón Cancelar ────────────────────────────────────────────────────────────

btnCancelar.addEventListener('click', resetearFormulario)

// ── Inicialización ────────────────────────────────────────────────────────────

// Cargamos la tabla al abrir la página
cargarTabla()
