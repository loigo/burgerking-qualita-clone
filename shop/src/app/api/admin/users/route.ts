import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/security/api-guard';
import { getCustomersFromOrders } from '@/lib/db';
import { getMemoryOrders } from '@/lib/orders';

type CustomerRow = {
  email: string;
  order_count: number;
  total_spent_cents: number;
  last_order_at?: string | Date;
};

export async function GET(req: Request) {
  const { error } = await requireAdminApi(req);
  if (error) return error;

  let users: CustomerRow[] = (await getCustomersFromOrders()) as CustomerRow[];
  if (users.length === 0) {
    const mem = getMemoryOrders();
    const map = new Map<string, { email: string; order_count: number; total_spent_cents: number }>();
    for (const o of mem) {
      const cur = map.get(o.email) || { email: o.email, order_count: 0, total_spent_cents: 0 };
      cur.order_count++;
      cur.total_spent_cents += o.total_cents;
      map.set(o.email, cur);
    }
    users = Array.from(map.values());
  }
  return NextResponse.json(users);
}