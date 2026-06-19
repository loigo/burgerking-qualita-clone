import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/security/api-guard';
import { getSalesByDay, getSalesByProduct } from '@/lib/db';

export async function GET(req: Request) {
  const { error } = await requireAdminApi(req);
  if (error) return error;

  const [byDay, byProduct] = await Promise.all([
    getSalesByDay(14),
    getSalesByProduct(8),
  ]);

  return NextResponse.json({ byDay, byProduct });
}