// Rutas de la API de solo lectura para la web pública.
// Expone 2 endpoints que el front-end público consume para mostrar las canchas.
// Se monta bajo el prefijo /api/web en index.mjs.
//
// Al reutilizar las mismas funciones del controlador, evitamos duplicar código.
// La diferencia con la API CRUD es que aquí solo habilitamos métodos GET.

import { Router } from 'express'
import { obtenerCanchas, obtenerCanchaPorId } from '../controllers/canchaController.mjs'

const router = Router()

// Endpoint 1: Listado de canchas para la web
// GET /api/web/canchas
router.get('/canchas', obtenerCanchas)

// Endpoint 2: Detalle de una cancha para la web
// GET /api/web/canchas/:id
router.get('/canchas/:id', obtenerCanchaPorId)

export default router
