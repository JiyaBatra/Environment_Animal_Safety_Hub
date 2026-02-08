/**
 * Payment Gateway Configuration
 * Handles Stripe and PayPal setup
 */

require('dotenv').config();

// Initialize Stripe only if the secret key is provided to avoid runtime crashes
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
} else {
    // Helpful warning for developers during local development
    console.warn('⚠️ STRIPE_SECRET_KEY is not set. Stripe initialization skipped. Set STRIPE_SECRET_KEY in your .env to enable payments.');
}

const paypal = require('@paypal/checkout-server-sdk');

// Stripe Configuration
const stripeConfig = {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    currency: 'usd',
    stripe: stripe
};

// PayPal Configuration
function paypalEnvironment() {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    
    // Use sandbox for testing, live for production
    return process.env.NODE_ENV === 'production'
        ? new paypal.core.LiveEnvironment(clientId, clientSecret)
        : new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

const paypalClient = new paypal.core.PayPalHttpClient(paypalEnvironment());

const paypalConfig = {
    clientId: process.env.PAYPAL_CLIENT_ID,
    clientSecret: process.env.PAYPAL_CLIENT_SECRET,
    webhookId: process.env.PAYPAL_WEBHOOK_ID,
    client: paypalClient
};

module.exports = {
    stripeConfig,
    paypalConfig
};
