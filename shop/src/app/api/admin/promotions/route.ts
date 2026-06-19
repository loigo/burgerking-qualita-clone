import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdminApi } from '@/lib/security/api-guard';
import { createPromotion, listPromotions } from '@/lib/promotions';
import { stripHtml } from '@/lib/security/sanitize';

const schema = z.object({
  code: z.string().min(2).max(64),
  title: z.string().min(2).max(256),
  discount_type: z.enum(['percent', 'fixed']),
  discount_value: z.number().int().positive(),
  is_active: z.boolean().optional(),
  usage_limit: z.number().int().positive().nullable().optional(),
});

export async function GET(req: Request) {
  const { error } = await requireAdminApi(req);
  if (error) return error;
  return NextResponse.json(await listPromotions());
}

export async function POST(req: Request) {
  const { error } = await requireAdminApi(req, { audit: { action: 'create', entity: 'promotion' } });
  if (error) return error;
  const body = schema.parse(await req.json());
  const promo = await createPromotion({
    code: body.code.toUpperCase(),
    title: stripHtml(body.title),
    discount_type: body.discount_type,
    discount_value: body.discount_value,
    starts_at: null,
    ends_at: null,
    is_active: body.is_active ?? true,
    usage_limit: body.usage_limit ?? null,
  });
  return NextResponse.json(promo, { status: 201 });
}