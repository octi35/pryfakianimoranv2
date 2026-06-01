// Módulo de conexión a la base de datos PostgreSQL (Supabase).
// Usamos el paquete "pg" con un Pool de conexiones.
// La URI de conexión viene del archivo .env para no exponer credenciales.

import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

// Supabase (y cualquier PostgreSQL en la nube) requiere SSL para conectarse
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false  // Necesario para conexiones SSL en la nube
    }
})

const conectarDB = async () => {
    try {
        await pool.query('SELECT 1')
        console.log('Conexión a PostgreSQL (Supabase) exitosa')

        // Creamos la tabla si todavía no existe en la base de datos
        await pool.query(`
            CREATE TABLE IF NOT EXISTS canchas (
                id         SERIAL PRIMARY KEY,
                nombre     VARCHAR(100)   NOT NULL,
                deporte    VARCHAR(50)    NOT NULL,
                precio     NUMERIC(10,2)  NOT NULL CHECK (precio >= 0),
                capacidad  INTEGER        NOT NULL CHECK (capacidad >= 1),
                disponible BOOLEAN        NOT NULL DEFAULT TRUE,
                created_at TIMESTAMP      DEFAULT NOW(),
                updated_at TIMESTAMP      DEFAULT NOW()
            )
        `)
        console.log('Tabla "canchas" verificada')

    } catch (error) {
        console.error('Error al conectar con la base de datos:', error.message)
        process.exit(1)
    }
}

export { pool }
export default conectarDB
