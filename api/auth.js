// api/auth.js
// Nota: si corres localmente con Node simple, instala dotenv: npm install dotenv
if (process.env.NODE_ENV !== 'production') {
  // carga .env en desarrollo (no afectará producción en Vercel)
  try { require('dotenv').config(); } catch (e) { /* no pasa nada si no existe */ }
}

module.exports = async (req, res) => {
  // Solo POST permitido
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method-not-allowed', message: 'Usa POST' });
  }

  // Asegúrate que el body se parseó como JSON (en serverless de Vercel ya viene parseado)
  const { password } = req.body || {};

  if (!process.env.SITE_PASSWORD) {
    // En producción: preferible lanzar error y no retornar contraseña
    console.error('SITE_PASSWORD no definido en process.env');
    return res.status(500).json({ error: 'server-misconfigured', message: 'Variable de entorno faltante' });
  }

  if (!password) {
    return res.status(400).json({ error: 'missing-password', message: 'Envía { "password": "..." }' });
  }

  if (password === process.env.SITE_PASSWORD) {
    return res.status(200).json({ ok: true });
  } else {
    return res.status(401).json({ error: 'invalid-password' });
  }
};