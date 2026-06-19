import { NextResponse } from 'next/server';
import { z } from 'zod';
import { failOrder } from '@/lib/orders';
import { trackEvent } from '@/lib/insights';

const schema = z.object({
  order_number: z.string().min(1),
});

export async function POST(req: Request) {
  const body = schema.parse(await req.json());
  const result = await failOrder(body.order_number);
  if (!result) {
    return NextResponse.json({ error: 'Ordine non trovato' }, { status: 404 });
  }
  trackEvent('order_failed', { order_number: body.order_number });
  return NextResponse.json(result);
}