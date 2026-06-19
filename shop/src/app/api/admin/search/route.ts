import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdminApi } from '@/lib/security/api-guard';
import { adminSearch, adminListProducts, listOrders } from '@/lib/db';
import { stripHtml } from '@/lib/security/sanitize';

const schema = z.object({ q: z.string().min(1).max(128) });

export async function GET(req: Request) {
  const { error } = await requireAdminApi(req);
  if (error) return error;

  const url = new URL(req.url);
  const q = stripHtml(schema.parse({ q: url.searchParams.get('q') || '' }).q);

  let results = await adminSearch(q);
  if (results.length === 0) {
    const products = await adminListProducts();
    const orders = await listOrders(50);
    const ql = q.toLowerCase();
    results = [
      ...products.filter((p) => p.title.toLowerCase().includes(ql) || p.slug.includes(ql)).slice(0, 5).map((p) => ({
        type: 'product', id: p.id, slug: p.slug, title: p.title,
      })),
      ...orders.filter((o: Record<string, unknown>) => String(o.order_number).toLowerCase().includes(ql) || String(o.email).toLowerCase().includes(ql)).slice(0, 5).map((o: Record<string, unknown>) => ({
        type: 'order', id: o.id, order_number: o.order_number, email: o.email,
      })),
    ];
  }
  return NextResponse.json(results);
}