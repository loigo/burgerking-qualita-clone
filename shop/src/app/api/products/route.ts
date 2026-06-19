import { NextResponse } from 'next/server';
import { listProducts } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('cat') || undefined;
  const products = await listProducts(category);
  return NextResponse.json(products);
}