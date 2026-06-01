// Controlador de canchas.
// Contiene la lógica de negocio para cada operación del CRUD.
// Llama al modelo para acceder a la base de datos y devuelve la respuesta HTTP.

import { encontrarTodas, encontrarPorId, crear, actualizar, eliminar } from '../models/Cancha.mjs'

// ─────────────────────────────────────────────────────────────────────────────
// LECTURA 1: Obtener todas las canchas
// GET /api/canchas
// ─────────────────────────────────────────────────────────────────────────────
const obtenerCanchas = async (req, res) => {
    try {
        const canchas = await encontrarTodas()
        res.json(canchas)
    } catch (error) {
        console.error('Error en obtenerCanchas:', error.message)
        res.status(500).json({ error: 'Error interno al obtener las canchas' })
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// LECTURA 2: Obtener una cancha por su ID
// GET /api/canchas/:id
// ─────────────────────────────────────────────────────────────────────────────
const obtenerCanchaPorId = async (req, res) => {
    try {
        const cancha = await encontrarPorId(req.params.id)

        if (!cancha) {
            return res.status(404).json({ error: 'Cancha no encontrada' })
        }

        res.json(cancha)
    } catch (error) {
        console.error('Error en obtenerCanchaPorId:', error.message)

        // El código 22P02 indica que se pasó un valor no numérico como ID
        if (error.code === '22P02') {
            return res.status(400).json({ error: 'El ID proporcionado no es válido' })
        }

        res.status(500).json({ error: 'Error interno al obtener la cancha' })
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// ALTA: Crear una nueva cancha
// POST /api/canchas
// ─────────────────────────────────────────────────────────────────────────────
const crearCancha = async (req, res) => {
    try {
        // Validación básica: verificamos que vengan los campos requeridos
        const { nombre, deporte, precio, capacidad } = req.body
        if (!nombre || !deporte || precio === undefined || capacidad === undefined) {
            return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, deporte, precio, capacidad' })
        }

        const nuevaCancha = await crear(req.body)

        // 201 Created: el recurso fue creado exitosamente
        res.status(201).json(nuevaCancha)
    } catch (error) {
        console.error('Error en crearCancha:', error.message)

        // El código 23514 indica que se violó una restricción CHECK de la tabla
        if (error.code === '23514') {
            return res.status(400).json({ error: 'Datos inválidos: revisar precio y capacidad' })
        }

        res.status(400).json({ error: 'Error al crear la cancha', detalle: error.message })
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// MODIFICACIÓN: Actualizar una cancha existente
// PUT /api/canchas/:id
// ─────────────────────────────────────────────────────────────────────────────
const actualizarCancha = async (req, res) => {
    try {
        const canchaActualizada = await actualizar(req.params.id, req.body)

        if (!canchaActualizada) {
            return res.status(404).json({ error: 'Cancha no encontrada' })
        }

        res.json(canchaActualizada)
    } catch (error) {
        console.error('Error en actualizarCancha:', error.message)

        if (error.code === '22P02') {
            return res.status(400).json({ error: 'El ID proporcionado no es válido' })
        }

        res.status(400).json({ error: 'Error al actualizar', detalle: error.message })
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// BAJA: Eliminar una cancha
// DELETE /api/canchas/:id
// ─────────────────────────────────────────────────────────────────────────────
const eliminarCancha = async (req, res) => {
    try {
        const canchaEliminada = await eliminar(req.params.id)

        if (!canchaEliminada) {
            return res.status(404).json({ error: 'Cancha no encontrada' })
        }

        res.json({ mensaje: 'Cancha eliminada correctamente' })
    } catch (error) {
        console.error('Error en eliminarCancha:', error.message)

        if (error.code === '22P02') {
            return res.status(400).json({ error: 'El ID proporcionado no es válido' })
        }

        res.status(500).json({ error: 'Error interno al eliminar la cancha' })
    }
}

export { obtenerCanchas, obtenerCanchaPorId, crearCancha, actualizarCancha, eliminarCancha }
