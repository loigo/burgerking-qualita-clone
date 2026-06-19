import { NextResponse } from 'next/server';
import { z } from 'zod';
import { capturePayPalOrder, isPayPalConfigured } from '@/lib/paypal';
import { confirmOrderPaid } from '@/lib/orders';

const schema = z.object({
  order_id: z.string().min(1),
  order_number: z.string().min(1),
  session_id: z.string().optional(),
});

export async function POST(req: Request) {
  const body = schema.parse(await req.json());
  if (!isPayPalConfigured()) {
    return NextResponse.json({ error: 'PayPal non configurato' }, { status: 503 });
  }
  const result = await capturePayPalOrder(body.order_id);
  const status = result?.status;
  if (status === 'COMPLETED') {
    await confirmOrderPaid(body.order_number, {
      paypal_order_id: body.order_id,
      session_id: body.session_id,
    });
  }
  return NextResponse.json({ ...result, order_number: body.order_number });
}