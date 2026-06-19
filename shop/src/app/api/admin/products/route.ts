import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminCreateProduct, adminListProducts, isDbConfigured, testDbConnection } from '@/lib/db';
import { requireAdmin } from '@/lib/api-auth';

const schema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  thumb_url: z.string().optional(),
  main_image_url: z.string().optional(),
  hero_image_url: z.string().optional(),
  price_cents: z.number().int().positive(),
  is_active: z.boolean().optional(),
  is_featured: z.boolean().optional(),
});

export async function GET(req: Request) {
  const { error } = await requireAdmin(req);
  if (error) return error;
  const products = await adminListProducts();
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const { error } = await requireAdmin(req, { action: 'create', entity: 'product' });
  if (error) return error;
  if (!isDbConfigured() || !(await testDbConnection())) {
    return NextResponse.json(
      { error: 'DATABASE_URL necessario per creare prodotti. Configura Azure SQL.' },
      { status: 503 }
    );
  }
  try {
    const body = schema.parse(await req.json());
    const product = await adminCreateProduct(body);
    return NextResponse.json(product, { status: 201 });
  } catch (e) {
    const msg = String(e);
    if (msg.includes('UNIQUE') || msg.includes('duplicate')) {
      return NextResponse.json({ error: 'Slug já existe' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Erro ao criar produto', detail: msg }, { status: 500 });
  }
}