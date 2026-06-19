import { NextResponse } from 'next/server';
import { z } from 'zod';
import { isDbConfigured, upsertAbandonedCart } from '@/lib/db';

const schema = z.object({
  session_id: z.string().min(1),
  email: z.string().email().optional(),
  items: z.array(z.object({
    productId: z.number(),
    title: z.string(),
    quantity: z.number(),
    unit_price_cents: z.number(),
  })).min(1),
  total_cents: z.number().int().positive(),
});

export async function POST(req: Request) {
  const body = schema.parse(await req.json());

  if (!isDbConfigured()) {
    return NextResponse.json({ ok: true, mode: 'no-db' });
  }

  await upsertAbandonedCart({
    session_id: body.session_id,
    email: body.email,
    items_json: JSON.stringify(body.items),
    total_cents: body.total_cents,
  });

  return NextResponse.json({ ok: true });
}