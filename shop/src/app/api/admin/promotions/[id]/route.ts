import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdminApi } from '@/lib/security/api-guard';
import { deletePromotion, updatePromotion } from '@/lib/promotions';

const patchSchema = z.object({
  title: z.string().min(2).max(256).optional(),
  is_active: z.boolean().optional(),
  discount_value: z.number().int().positive().optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  const { error } = await requireAdminApi(req, { audit: { action: 'update', entity: 'promotion', entity_id: params.id } });
  if (error) return error;
  const body = patchSchema.parse(await req.json());
  const updated = await updatePromotion(id, body);
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  const { error } = await requireAdminApi(req, { audit: { action: 'delete', entity: 'promotion', entity_id: params.id } });
  if (error) return error;
  const ok = await deletePromotion(id);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}