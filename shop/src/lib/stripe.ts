import Stripe from 'stripe';

let stripe: Stripe | null = null;

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY not configured');
  }
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-02-24.acacia' });
  }
  return stripe;
}

export async function createPaymentIntent(amountCents: number, email: string, metadata?: Record<string, string>) {
  const s = getStripe();
  return s.paymentIntents.create({
    amount: amountCents,
    currency: 'eur',
    receipt_email: email,
    automatic_payment_methods: { enabled: true, allow_redirects: 'always' },
    metadata,
  });
}