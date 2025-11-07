// api/create-checkout.js
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { priceId, productId } = req.body || {};

    if (!priceId && !productId) {
      return res.status(400).json({ error: 'priceId or productId required' });
    }

    let line_items;

    if (priceId && priceId.startsWith('price_')) {
      line_items = [{ price: priceId, quantity: 1 }];
    } else if (productId && productId.startsWith('prod_')) {
      const DEFAULT_UNIT_AMOUNT = 9900; // 99.00 MXN (centavos)
      line_items = [{
        price_data: {
          currency: 'mxn',
          product: productId,
          unit_amount: DEFAULT_UNIT_AMOUNT,
        },
        quantity: 1
      }];
    } else {
      return res.status(400).json({ error: 'Invalid priceId or productId format' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: `${process.env.SITE_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SITE_URL}/cancel.html`,
    });

    res.status(200).json({ id: session.id });
  } catch (err) {
    console.error('create-checkout error:', err);
    res.status(500).json({ error: err.message });
  }
};