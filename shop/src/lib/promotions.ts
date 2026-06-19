import {
  createPromotion as dbCreate,
  deletePromotion as dbDelete,
  listPromotions as dbList,
  updatePromotion as dbUpdate,
  isDbConfigured,
  type PromotionRow,
} from './db';

const memoryPromos: PromotionRow[] = [
  {
    id: 1,
    code: 'BK10',
    title: '10% su primo ordine',
    discount_type: 'percent',
    discount_value: 10,
    starts_at: null,
    ends_at: null,
    is_active: true,
    usage_limit: 1000,
    usage_count: 0,
  },
];

let nextId = 2;

export async function listPromotions(): Promise<PromotionRow[]> {
  if (isDbConfigured()) {
    try {
      const rows = await dbList();
      if (rows.length) return rows;
    } catch {
      // fallback
    }
  }
  return memoryPromos;
}

export async function createPromotion(data: Omit<PromotionRow, 'id' | 'usage_count'>) {
  if (isDbConfigured()) {
    try {
      return await dbCreate(data);
    } catch {
      // fallback
    }
  }
  const row: PromotionRow = { ...data, id: nextId++, usage_count: 0 };
  memoryPromos.push(row);
  return row;
}

export async function updatePromotion(id: number, data: Partial<PromotionRow>) {
  if (isDbConfigured()) {
    try {
      const r = await dbUpdate(id, data);
      if (r) return r;
    } catch {
      // fallback
    }
  }
  const idx = memoryPromos.findIndex((p) => p.id === id);
  if (idx < 0) return null;
  memoryPromos[idx] = { ...memoryPromos[idx], ...data };
  return memoryPromos[idx];
}

export async function deletePromotion(id: number) {
  if (isDbConfigured()) {
    try {
      if (await dbDelete(id)) return true;
    } catch {
      // fallback
    }
  }
  const idx = memoryPromos.findIndex((p) => p.id === id);
  if (idx < 0) return false;
  memoryPromos.splice(idx, 1);
  return true;
}