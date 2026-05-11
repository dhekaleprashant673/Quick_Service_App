require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const app = express();
app.use(express.json());

// Enable CORS so the mobile app can reach the server
const cors = require('cors');
app.use(cors());

app.post('/create-payment-sheet', async (req, res) => {
  const { amount, currency, email } = req.body;

  try {
    console.log(`Creating payment sheet for ${email} - Amount: ${amount}`);

    // 1. Create or retrieve a customer
    const customer = await stripe.customers.create({
      email: email,
    });

    // 2. Create an Ephemeral Key for the customer
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2022-11-15' }
    );

    // 3. Create a PaymentIntent with the desired payment methods
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency || 'inr',
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
  } catch (e) {
    console.error('Stripe Error:', e.message);
    res.status(400).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Stripe Backend is running on http://localhost:${PORT}`);
  console.log(`💡 Mobile app should connect to your Computer IP instead of localhost if using a physical device.`);
});
