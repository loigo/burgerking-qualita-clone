import { NextResponse } from 'next/server';
import { z } from 'zod';
import { confirmOrderPaid } from '@/lib/orders';
import { trackEvent } from '@/lib/insights';

const schema = z.object({
  order_number: z.string().min(1),
  payment_intent_id: z.string().optional(),
  paypal_order_id: z.string().optional(),
  satispay_payment_id: z.string().optional(),
  session_id: z.string().optional(),
});

export async function POST(req: Request) {
  const body = schema.parse(await req.json());
  const result = await confirmOrderPaid(body.order_number, {
    payment_intent_id: body.payment_intent_id,
    paypal_order_id: body.paypal_order_id,
    satispay_payment_id: body.satispay_payment_id,
    session_id: body.session_id,
  });
  if (!result) {
    return NextResponse.json({ error: 'Ordine non trovato o già elaborato' }, { status: 404 });
  }
  trackEvent('order_confirmed_paid', { order_number: body.order_number });
  return NextResponse.json(result);
}