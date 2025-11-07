// api/auth.js
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method-not-allowed' });

  // No escribas el valor de proceso en logs; esto solo para debug muy corto si lo necesitas:
  // console.log('AUTH called; env present?', !!process.env.SITE_PASSWORD);

  const { password } = req.body || {};
  if (!process.env.SITE_PASSWORD) return res.status(500).json({ error: 'no-site-password' });
  if (!password) return res.status(400).json({ error: 'password-required' });

  if (password === process.env.SITE_PASSWORD) {
    return res.status(200).json({ ok: true });
  } else {
    return res.status(401).json({ error: 'invalid-password' });
  }
};