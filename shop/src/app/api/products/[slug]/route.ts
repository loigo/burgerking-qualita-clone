import { NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/db';

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(product);
}