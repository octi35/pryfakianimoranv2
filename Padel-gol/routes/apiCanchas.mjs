// Rutas de la API CRUD para administrar canchas.
// Esta API tiene 5 endpoints (2 lecturas, alta, baja y modificación).
// Se monta bajo el prefijo /api/canchas en index.mjs.
// Es utilizada principalmente por el panel de administración.

import { Router } from 'express'
import {
    obtenerCanchas,
    obtenerCanchaPorId,
    crearCancha,
    actualizarCancha,
    eliminarCancha
} from '../controllers/canchaController.mjs'

const router = Router()

// ── LECTURA 1 ─────────────────────────────────────────────────────────────────
// GET /api/canchas → retorna el listado completo de canchas
router.get('/', obtenerCanchas)

// ── LECTURA 2 ─────────────────────────────────────────────────────────────────
// GET /api/canchas/:id → retorna los datos de una cancha específica
router.get('/:id', obtenerCanchaPorId)

// ── ALTA ──────────────────────────────────────────────────────────────────────
// POST /api/canchas → crea una nueva cancha con los datos del body
router.post('/', crearCancha)

// ── MODIFICACIÓN ──────────────────────────────────────────────────────────────
// PUT /api/canchas/:id → actualiza los campos de una cancha existente
router.put('/:id', actualizarCancha)

// ── BAJA ──────────────────────────────────────────────────────────────────────
// DELETE /api/canchas/:id → elimina permanentemente una cancha de la DB
router.delete('/:id', eliminarCancha)

export default router
