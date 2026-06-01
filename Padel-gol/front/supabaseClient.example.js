// Copia este archivo a `supabaseClient.js` y rellena los valores.
// No subas `supabaseClient.js` al repositorio si contiene tus claves.

// Valores de ejemplo (reemplaza por los tuyos):
const SUPABASE_URL = 'https://db.gbmnqxynivnlbbsvchsu.supabase.co'
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE'

// La librería UMD de supabase expone `supabase` con `createClient`
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Exponer global para los scripts del front
window.supabaseClient = supabaseClient
