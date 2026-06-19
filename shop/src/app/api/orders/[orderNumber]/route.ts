import { NextResponse } from 'next/server';
import { getOrderByNumber } from '@/lib/db';
import { getMemoryOrderByNumber } from '@/lib/orders';

type OrderItemRow = {
  product_title: string;
  product_slug: string;
  quantity: number;
  unit_price_cents: number;
  line_total_cents: number;
};

export async function GET(
  _req: Request,
  { params }: { params: { orderNumber: string } }
) {
  const orderNumber = decodeURIComponent(params.orderNumber);
  const dbData = await getOrderByNumber(orderNumber);
  const memData = dbData ? null : getMemoryOrderByNumber(orderNumber);
  const data = dbData ?? memData;
  if (!data) {
    return NextResponse.json({ error: 'Ordine non trovato' }, { status: 404 });
  }
  const { order, items } = data;
  const itemRows = items as OrderItemRow[];
  return NextResponse.json({
    order_number: order.order_number,
    email: order.email,
    status: order.status,
    total_cents: order.total_cents,
    subtotal_cents: order.subtotal_cents,
    currency: order.currency || 'EUR',
    payment_provider: order.payment_provider,
    created_at: order.created_at,
    paid_at: order.paid_at,
    items: itemRows.map((i) => ({
      title: i.product_title,
      slug: i.product_slug,
      quantity: i.quantity,
      unit_price_cents: i.unit_price_cents,
      line_total_cents: i.line_total_cents,
    })),
  });
}