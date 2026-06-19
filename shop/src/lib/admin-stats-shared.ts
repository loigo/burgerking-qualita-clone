/** Client-safe helpers — no db/mssql imports (safe for 'use client' bundles). */

export type DashboardStats = {
  salesTodayCents: number;
  salesYesterdayCents: number;
  salesMonthCents: number;
  productsTotal: number;
  productsActive: number;
  abandonedCarts: number;
  abandonedCartsValueCents: number;
  ordersToday: number;
  ordersMonth: number;
  metaPixelActive: boolean;
  gtmActive: boolean;
  ga4Active: boolean;
  database: string;
  dbConnected: boolean;
};

export function formatEur(cents: number, currency = 'EUR') {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency }).format(cents / 100);
}

export function pctChange(today: number, yesterday: number) {
  if (yesterday === 0) return today > 0 ? 100 : 0;
  return Math.round(((today - yesterday) / yesterday) * 100);
}