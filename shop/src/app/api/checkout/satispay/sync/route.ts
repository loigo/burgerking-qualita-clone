import { NextResponse } from 'next/server';
import { z } from 'zod';
import { processSatispayCallback } from '@/lib/satispay-callback';
import { isSatispayConfigured } from '@/lib/satispay';

const schema = z.object({
  payment_id: z.string().min(1),
});

/** Sincroniza status após redirect do Satispay (polling no frontend) */
export async function POST(req: Request) {
  const body = schema.parse(await req.json());
  if (!isSatispayConfigured()) {
    return NextResponse.json({ error: 'Satispay non configurato' }, { status: 503 });
  }
  const result = await processSatispayCallback(body.payment_id);
  return NextResponse.json(result);
}