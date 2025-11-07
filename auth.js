// api/auth.js
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { password } = req.body && typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');

    const expected = process.env.SITE_PASSWORD || ''; // variable en Vercel
    if (!expected) return res.status(500).json({ error: 'Server misconfigured' });

    if (password === expected) {
      return res.status(200).json({ ok: true });
    } else {
      return res.status(401).json({ ok: false, error: 'Invalid password' });
    }
  } catch (err) {
    console.error('auth error', err);
    return res.status(500).json({ error: 'internal' });
  }
};