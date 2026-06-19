import { NextResponse } from 'next/server';
import { z } from 'zod';
import { recordPresence } from '@/lib/presence';

const schema = z.object({
  session_id: z.string().min(8).max(128),
  path: z.string().max(256).optional(),
});

export async function POST(req: Request) {
  const body = schema.parse(await req.json());
  recordPresence(body.session_id, body.path);
  return NextResponse.json({ ok: true });
}