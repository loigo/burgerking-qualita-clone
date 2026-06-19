import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSatispayPayment, isSatispayConfigured } from '@/lib/satispay';
import { attachSatispayPayment } from '@/lib/orders';
import { trackEvent } from '@/lib/insights';

const schema = z.object({
  total_cents: z.number().int().positive(),
  order_number: z.string().min(1),
});

export async function POST(req: Request) {
  const body = schema.parse(await req.json());

  if (!isSatispayConfigured()) {
    return NextResponse.json({
      demo: true,
      redirect_url: null,
      message: 'Satispay non configurato — usa checkout demo.',
    });
  }

  const payment = await createSatispayPayment(body.total_cents, body.order_number);
  await attachSatispayPayment(body.order_number, payment.id);
  trackEvent('checkout_satispay_payment', {
    amount: String(body.total_cents),
    order_number: body.order_number,
    payment_id: payment.id,
  });
  return NextResponse.json({
    id: payment.id,
    redirect_url: payment.redirect_url,
    status: payment.status,
  });
}