import { NextResponse } from 'next/server';
import { z } from 'zod';
import { placeOrder } from '@/lib/orders';
import { trackEvent } from '@/lib/insights';

const itemSchema = z.object({
  product_id: z.number().int(),
  title: z.string(),
  slug: z.string(),
  qty: z.number().int().positive(),
  unit_cents: z.number().int().positive(),
});

const schema = z.object({
  email: z.string().email(),
  total_cents: z.number().int().positive(),
  payment_provider: z.enum(['stripe', 'paypal', 'satispay', 'demo']),
  payment_intent_id: z.string().optional(),
  paypal_order_id: z.string().optional(),
  session_id: z.string().optional(),
  items: z.array(itemSchema).min(1),
});

export async function POST(req: Request) {
  const body = schema.parse(await req.json());
  const order = await placeOrder({
    email: body.email,
    items: body.items,
    total_cents: body.total_cents,
    payment_provider: body.payment_provider,
    payment_intent_id: body.payment_intent_id,
    paypal_order_id: body.paypal_order_id,
    session_id: body.session_id,
  });
  trackEvent('order_completed', {
    order_number: order.order_number,
    provider: body.payment_provider,
    total: String(body.total_cents),
  });
  return NextResponse.json(order);
}