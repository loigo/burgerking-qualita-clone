import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/api-auth';
import { setOrderStatus } from '@/lib/orders';
import type { OrderStatus } from '@/lib/db';

const schema = z.object({
  status: z.enum(['pending', 'paid', 'failed', 'shipped', 'refunded', 'cancelled']),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = schema.parse(await req.json());
  const { error } = await requireAdmin(req, {
    action: 'update_status',
    entity: 'order',
    entity_id: params.id,
  });
  if (error) return error;

  const result = await setOrderStatus(params.id, body.status as OrderStatus);
  if (!result) {
    return NextResponse.json({ error: 'Ordine non trovato' }, { status: 404 });
  }
  return NextResponse.json(result);
}