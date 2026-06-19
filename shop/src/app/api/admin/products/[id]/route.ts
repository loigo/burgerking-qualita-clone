import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminDeleteProduct, adminGetProduct, adminUpdateProduct, isDbConfigured, testDbConnection } from '@/lib/db';
import { requireAdmin } from '@/lib/api-auth';

const schema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  thumb_url: z.string().optional(),
  main_image_url: z.string().optional(),
  hero_image_url: z.string().optional(),
  price_cents: z.number().int().positive().optional(),
  is_active: z.boolean().optional(),
  is_featured: z.boolean().optional(),
});

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin(req);
  if (error) return error;
  const product = await adminGetProduct(Number(params.id));
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin(req, { action: 'update', entity: 'product', entity_id: params.id });
  if (error) return error;
  if (!isDbConfigured() || !(await testDbConnection())) {
    return NextResponse.json({ error: 'DATABASE_URL necessario per modificare prodotti.' }, { status: 503 });
  }
  const body = schema.parse(await req.json());
  const product = await adminUpdateProduct(Number(params.id), body);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(product);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin(req, { action: 'delete', entity: 'product', entity_id: params.id });
  if (error) return error;
  if (!isDbConfigured() || !(await testDbConnection())) {
    return NextResponse.json({ error: 'DATABASE_URL necessario per eliminare prodotti.' }, { status: 503 });
  }
  const ok = await adminDeleteProduct(Number(params.id));
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}