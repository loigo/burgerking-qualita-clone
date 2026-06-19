import {
  adminListProducts,
  getAbandonedCartMetrics,
  getSalesMetrics,
  isDbConfigured,
  testDbConnection,
} from './db';
import type { DashboardStats } from './admin-stats-shared';

export type { DashboardStats } from './admin-stats-shared';
export { formatEur, pctChange } from './admin-stats-shared';

function sumInRange(
  orders: Array<{ total_cents: number; created_at: Date }>,
  start: Date,
  end: Date
) {
  return orders
    .filter((o) => o.created_at >= start && o.created_at < end)
    .reduce((s, o) => s + o.total_cents, 0);
}

function countInRange(
  orders: Array<{ total_cents: number; created_at: Date }>,
  start: Date,
  end: Date
) {
  return orders.filter((o) => o.created_at >= start && o.created_at < end).length;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const products = await adminListProducts();
  const active = products.filter((p) => p.is_active).length;
  const dbConfigured = isDbConfigured();
  const dbConnected = dbConfigured ? await testDbConnection() : false;

  let orders: Array<{ total_cents: number; created_at: Date }> = [];
  let abandoned = { count: 0, valueCents: 0 };

  if (dbConnected) {
    const sales = await safeMetrics(getSalesMetrics);
    const ab = await safeMetrics(getAbandonedCartMetrics);
    if (sales) orders = sales;
    if (ab) abandoned = ab;
  }

  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startYesterday = new Date(startToday);
  startYesterday.setDate(startYesterday.getDate() - 1);
  const startTomorrow = new Date(startToday);
  startTomorrow.setDate(startTomorrow.getDate() + 1);
  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return {
    salesTodayCents: sumInRange(orders, startToday, startTomorrow),
    salesYesterdayCents: sumInRange(orders, startYesterday, startToday),
    salesMonthCents: sumInRange(orders, startMonth, startNextMonth),
    productsTotal: products.length,
    productsActive: active,
    abandonedCarts: abandoned.count,
    abandonedCartsValueCents: abandoned.valueCents,
    ordersToday: countInRange(orders, startToday, startTomorrow),
    ordersMonth: countInRange(orders, startMonth, startNextMonth),
    metaPixelActive: Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID),
    gtmActive: Boolean(process.env.NEXT_PUBLIC_GTM_ID),
    ga4Active: Boolean(process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID),
    database: dbConnected
      ? 'Persistência ativa no banco'
      : dbConfigured
        ? 'SQL offline — usando memória'
        : 'Modo demo — dados em memória',
    dbConnected,
  };
}

async function safeMetrics<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

