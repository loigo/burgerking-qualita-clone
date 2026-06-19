import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-auth';
import { isDbConfigured, listOrders } from '@/lib/db';
import { getMemoryOrders } from '@/lib/orders';

export async function GET(req: Request) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  if (isDbConfigured()) {
    try {
      const orders = await listOrders(100);
      return NextResponse.json(orders);
    } catch (e) {
      return NextResponse.json({ error: 'Erro ao ler pedidos do banco', detail: String(e) }, { status: 500 });
    }
  }

  const memory = getMemoryOrders().map((o) => ({
    id: o.id,
    order_number: o.order_number,
    email: o.email,
    status: 'paid',
    total_cents: o.total_cents,
    currency: 'EUR',
    payment_provider: o.payment_provider,
    created_at: o.created_at,
    paid_at: o.created_at,
    item_count: o.items.length,
  }));
  return NextResponse.json(memory);
}