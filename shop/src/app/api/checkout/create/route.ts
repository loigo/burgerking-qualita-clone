import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createPendingOrder } from '@/lib/orders';
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
  items: z.array(itemSchema).min(1),
});

export async function POST(req: Request) {
  const body = schema.parse(await req.json());
  const order = await createPendingOrder({
    email: body.email,
    items: body.items,
    total_cents: body.total_cents,
    payment_provider: body.payment_provider,
  });
  trackEvent('order_created_pending', {
    order_number: order.order_number,
    provider: body.payment_provider,
    total: String(body.total_cents),
  });
  return NextResponse.json(order);
}