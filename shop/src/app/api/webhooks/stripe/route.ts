import { NextResponse } from 'next/server';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { confirmOrderPaid, failOrder } from '@/lib/orders';
import { getOrderByPaymentIntent } from '@/lib/db';
import { trackEvent } from '@/lib/insights';

export async function POST(req: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  const stripe = getStripe();
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const raw = await req.text();

  let event;
  if (webhookSecret && sig) {
    try {
      event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : 'Invalid signature' },
        { status: 400 }
      );
    }
  } else {
    try {
      event = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as { id: string; amount: number; metadata?: { order_number?: string } };
    const orderNumber = pi.metadata?.order_number;
    if (orderNumber) {
      await confirmOrderPaid(orderNumber, { payment_intent_id: pi.id });
      trackEvent('stripe_webhook_paid', { order_number: orderNumber, id: pi.id });
    } else {
      const order = await getOrderByPaymentIntent(pi.id);
      if (order?.order_number) {
        await confirmOrderPaid(order.order_number, { payment_intent_id: pi.id });
      }
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const pi = event.data.object as { id: string; metadata?: { order_number?: string } };
    const orderNumber = pi.metadata?.order_number;
    if (orderNumber) {
      await failOrder(orderNumber);
      trackEvent('stripe_webhook_failed', { order_number: orderNumber });
    }
  }

  return NextResponse.json({ received: true });
}