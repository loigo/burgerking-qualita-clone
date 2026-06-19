import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createPaymentIntent, isStripeConfigured } from '@/lib/stripe';
import { attachStripePayment } from '@/lib/orders';
import { trackEvent } from '@/lib/insights';

const schema = z.object({
  email: z.string().email(),
  total_cents: z.number().int().positive(),
  order_number: z.string().min(1),
  items_json: z.string().optional(),
});

export async function POST(req: Request) {
  const body = schema.parse(await req.json());

  if (!isStripeConfigured()) {
    return NextResponse.json({
      demo: true,
      client_secret: null,
      message: 'Stripe non configurato — usa checkout demo.',
    });
  }

  const intent = await createPaymentIntent(body.total_cents, body.email, {
    order_number: body.order_number,
    items_json: body.items_json || '[]',
  });
  await attachStripePayment(body.order_number, intent.id);
  trackEvent('checkout_stripe_intent', {
    amount: String(body.total_cents),
    order_number: body.order_number,
  });
  return NextResponse.json({ client_secret: intent.client_secret, payment_intent_id: intent.id });
}