import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createPayPalOrder, isPayPalConfigured } from '@/lib/paypal';
import { attachPayPalPayment } from '@/lib/orders';
import { trackEvent } from '@/lib/insights';

const schema = z.object({
  total_cents: z.number().int().positive(),
  order_number: z.string().min(1),
});

export async function POST(req: Request) {
  const body = schema.parse(await req.json());

  if (!isPayPalConfigured()) {
    return NextResponse.json({
      demo: true,
      id: null,
      message: 'PayPal non configurato — usa checkout demo.',
    });
  }

  const order = await createPayPalOrder(body.total_cents, body.order_number);
  await attachPayPalPayment(body.order_number, order.id);
  trackEvent('checkout_paypal_order', {
    amount: String(body.total_cents),
    order_number: body.order_number,
  });
  return NextResponse.json({ id: order.id });
}