import sql from 'mssql';
import type { Product, ProductInput } from './types';
import { getFallbackProduct, getFallbackProducts } from './catalog-fallback';

let pool: sql.ConnectionPool | null = null;

export function isDbConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

async function getPool() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not configured');
  if (!pool) {
    pool = await sql.connect(process.env.DATABASE_URL);
  }
  return pool;
}

async function safeDb<T>(fn: () => Promise<T>): Promise<T | null> {
  if (!isDbConfigured()) return null;
  try {
    return await fn();
  } catch {
    pool = null;
    return null;
  }
}

export async function testDbConnection(): Promise<boolean> {
  const r = await safeDb(async () => {
    const p = await getPool();
    await p.request().query('SELECT 1 AS ok');
    return true;
  });
  return r === true;
}

export async function listProducts(category?: string): Promise<Product[]> {
  if (!isDbConfigured()) return getFallbackProducts(category);

  const result = await safeDb(async () => {
  const p = await getPool();
  const req = p.request();
  let query = `
    SELECT p.*, STRING_AGG(c.[key], ',') AS category_keys
    FROM products p
    LEFT JOIN product_categories pc ON pc.product_id = p.id
    LEFT JOIN categories c ON c.id = pc.category_id
    WHERE p.is_active = 1
  `;
  if (category) {
    query += ` AND c.[key] = @category`;
    req.input('category', sql.NVarChar, category);
  }
  query += ` GROUP BY p.id, p.slug, p.title, p.description, p.thumb_url, p.main_image_url,
    p.hero_image_url, p.blob_thumb_url, p.price_cents, p.currency, p.is_active,
    p.is_featured, p.metadata_json, p.created_at, p.updated_at
    ORDER BY p.is_featured DESC, p.title`;

  const q = await req.query(query);
  return q.recordset.map(mapProduct);
  });
  return result ?? getFallbackProducts(category);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isDbConfigured()) return getFallbackProduct(slug);

  const result = await safeDb(async () => {
  const p = await getPool();
  const q = await p.request()
    .input('slug', sql.NVarChar, slug)
    .query(`SELECT TOP 1 * FROM products WHERE slug = @slug`);
  if (!q.recordset[0]) return null;
  return mapProduct(q.recordset[0]);
  });
  return result ?? getFallbackProduct(slug);
}

export async function adminGetProduct(id: number): Promise<Product | null> {
  if (!isDbConfigured()) {
    return getFallbackProducts().find((p) => p.id === id) ?? null;
  }
  const result = await safeDb(async () => {
  const p = await getPool();
  const q = await p.request()
    .input('id', sql.Int, id)
    .query('SELECT TOP 1 * FROM products WHERE id = @id');
  return q.recordset[0] ? mapProduct(q.recordset[0]) : null;
  });
  return result ?? getFallbackProducts().find((p) => p.id === id) ?? null;
}

export async function adminListProducts(): Promise<Product[]> {
  if (!isDbConfigured()) return getFallbackProducts();

  const result = await safeDb(async () => {
  const p = await getPool();
  const q = await p.request().query('SELECT * FROM products ORDER BY updated_at DESC');
  return q.recordset.map(mapProduct);
  });
  return result ?? getFallbackProducts();
}

export async function adminCreateProduct(input: ProductInput): Promise<Product> {
  const p = await getPool();
  const result = await p.request()
    .input('slug', sql.NVarChar, input.slug)
    .input('title', sql.NVarChar, input.title)
    .input('description', sql.NVarChar, input.description || null)
    .input('thumb_url', sql.NVarChar, input.thumb_url || null)
    .input('main_image_url', sql.NVarChar, input.main_image_url || null)
    .input('hero_image_url', sql.NVarChar, input.hero_image_url || null)
    .input('price_cents', sql.Int, input.price_cents)
    .input('is_active', sql.Bit, input.is_active ?? true)
    .input('is_featured', sql.Bit, input.is_featured ?? false)
    .query(`
      INSERT INTO products (slug, title, description, thumb_url, main_image_url, hero_image_url, price_cents, is_active, is_featured)
      OUTPUT INSERTED.*
      VALUES (@slug, @title, @description, @thumb_url, @main_image_url, @hero_image_url, @price_cents, @is_active, @is_featured)
    `);
  return mapProduct(result.recordset[0]);
}

export async function adminUpdateProduct(id: number, input: Partial<ProductInput>): Promise<Product | null> {
  const p = await getPool();
  const result = await p.request()
    .input('id', sql.Int, id)
    .input('title', sql.NVarChar, input.title)
    .input('description', sql.NVarChar, input.description)
    .input('thumb_url', sql.NVarChar, input.thumb_url)
    .input('price_cents', sql.Int, input.price_cents)
    .input('is_active', sql.Bit, input.is_active)
    .input('is_featured', sql.Bit, input.is_featured)
    .query(`
      UPDATE products SET
        title = COALESCE(@title, title),
        description = COALESCE(@description, description),
        thumb_url = COALESCE(@thumb_url, thumb_url),
        price_cents = COALESCE(@price_cents, price_cents),
        is_active = COALESCE(@is_active, is_active),
        is_featured = COALESCE(@is_featured, is_featured),
        updated_at = SYSUTCDATETIME()
      OUTPUT INSERTED.*
      WHERE id = @id
    `);
  return result.recordset[0] ? mapProduct(result.recordset[0]) : null;
}

export async function adminDeleteProduct(id: number): Promise<boolean> {
  const p = await getPool();
  const result = await p.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM products WHERE id = @id');
  return (result.rowsAffected[0] ?? 0) > 0;
}

export type OrderItemInput = {
  product_id: number;
  title: string;
  slug: string;
  qty: number;
  unit_cents: number;
};

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'shipped' | 'refunded' | 'cancelled';

function generateOrderNumber() {
  return `BK-${Date.now().toString(36).toUpperCase()}`;
}

async function insertOrderWithItems(
  data: {
    email: string;
    items: OrderItemInput[];
    total_cents: number;
    payment_provider: string;
    status: OrderStatus;
    payment_intent_id?: string;
    paypal_order_id?: string;
    paid_at?: boolean;
  },
  orderNumber = generateOrderNumber()
) {
  const p = await getPool();
  const tx = new sql.Transaction(p);
  await tx.begin();
  try {
    const orderReq = new sql.Request(tx);
    const orderRes = await orderReq
      .input('order_number', sql.NVarChar, orderNumber)
      .input('email', sql.NVarChar, data.email)
      .input('total_cents', sql.Int, data.total_cents)
      .input('subtotal_cents', sql.Int, data.total_cents)
      .input('status', sql.NVarChar, data.status)
      .input('payment_provider', sql.NVarChar, data.payment_provider)
      .input('payment_intent_id', sql.NVarChar, data.payment_intent_id || null)
      .input('paypal_order_id', sql.NVarChar, data.paypal_order_id || null)
      .query(`
        INSERT INTO orders (order_number, email, status, subtotal_cents, total_cents, payment_provider, payment_intent_id, paypal_order_id, paid_at)
        OUTPUT INSERTED.id
        VALUES (@order_number, @email, @status, @subtotal_cents, @total_cents, @payment_provider, @payment_intent_id, @paypal_order_id, ${data.paid_at ? 'SYSUTCDATETIME()' : 'NULL'})
      `);
    const orderId = orderRes.recordset[0].id;
    for (const item of data.items) {
      const itemReq = new sql.Request(tx);
      await itemReq
        .input('order_id', sql.UniqueIdentifier, orderId)
        .input('product_id', sql.Int, item.product_id)
        .input('title', sql.NVarChar, item.title)
        .input('slug', sql.NVarChar, item.slug)
        .input('qty', sql.Int, item.qty)
        .input('unit', sql.Int, item.unit_cents)
        .query(`
          INSERT INTO order_items (order_id, product_id, product_title, product_slug, quantity, unit_price_cents, line_total_cents)
          VALUES (@order_id, @product_id, @title, @slug, @qty, @unit, @qty * @unit)
        `);
    }
    await tx.commit();
    return { id: orderId, order_number: orderNumber };
  } catch (e) {
    await tx.rollback();
    throw e;
  }
}

export async function createPendingOrder(data: {
  email: string;
  items: OrderItemInput[];
  total_cents: number;
  payment_provider: string;
}) {
  return insertOrderWithItems({ ...data, status: 'pending' });
}

/** @deprecated Use createPendingOrder + markOrderPaid */
export async function createOrder(data: {
  email: string;
  items: OrderItemInput[];
  total_cents: number;
  payment_provider: string;
  payment_intent_id?: string;
  paypal_order_id?: string;
}) {
  return insertOrderWithItems({
    ...data,
    status: 'paid',
    paid_at: true,
  });
}

export async function markOrderPaid(
  orderNumber: string,
  extras?: { payment_intent_id?: string; paypal_order_id?: string; satispay_payment_id?: string }
) {
  const p = await getPool();
  const result = await p.request()
    .input('num', sql.NVarChar, orderNumber)
    .input('pi', sql.NVarChar, extras?.payment_intent_id || null)
    .input('pp', sql.NVarChar, extras?.paypal_order_id || null)
    .input('sp', sql.NVarChar, extras?.satispay_payment_id || null)
    .query(`
      UPDATE orders SET
        status = 'paid',
        paid_at = COALESCE(paid_at, SYSUTCDATETIME()),
        payment_intent_id = COALESCE(@pi, payment_intent_id),
        paypal_order_id = COALESCE(@pp, paypal_order_id),
        satispay_payment_id = COALESCE(@sp, satispay_payment_id)
      OUTPUT INSERTED.id, INSERTED.order_number, INSERTED.status
      WHERE order_number = @num AND status IN ('pending', 'failed')
    `);
  if (result.recordset[0]) return result.recordset[0];
  const existing = await p.request()
    .input('num', sql.NVarChar, orderNumber)
    .query(`SELECT id, order_number, status FROM orders WHERE order_number = @num AND status = 'paid'`);
  return existing.recordset[0] || null;
}

export async function markOrderFailed(orderNumber: string) {
  const p = await getPool();
  const result = await p.request()
    .input('num', sql.NVarChar, orderNumber)
    .query(`
      UPDATE orders SET status = 'failed'
      OUTPUT INSERTED.id, INSERTED.order_number, INSERTED.status
      WHERE order_number = @num AND status = 'pending'
    `);
  return result.recordset[0] || null;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const p = await getPool();
  const result = await p.request()
    .input('id', sql.UniqueIdentifier, orderId)
    .input('status', sql.NVarChar, status)
    .query(`
      UPDATE orders SET status = @status
      OUTPUT INSERTED.*
      WHERE id = @id
    `);
  return result.recordset[0] || null;
}

export async function linkPaymentIntent(orderNumber: string, paymentIntentId: string) {
  const p = await getPool();
  await p.request()
    .input('num', sql.NVarChar, orderNumber)
    .input('pi', sql.NVarChar, paymentIntentId)
    .query(`UPDATE orders SET payment_intent_id = @pi WHERE order_number = @num`);
}

export async function linkPayPalOrder(orderNumber: string, paypalOrderId: string) {
  const p = await getPool();
  await p.request()
    .input('num', sql.NVarChar, orderNumber)
    .input('pp', sql.NVarChar, paypalOrderId)
    .query(`UPDATE orders SET paypal_order_id = @pp WHERE order_number = @num`);
}

export async function linkSatispayPayment(orderNumber: string, paymentId: string) {
  const result = await safeDb(async () => {
    const p = await getPool();
    await p.request()
      .input('num', sql.NVarChar, orderNumber)
      .input('sp', sql.NVarChar, paymentId)
      .query(`UPDATE orders SET satispay_payment_id = @sp WHERE order_number = @num`);
    return true;
  });
  return result === true;
}

export async function getOrderBySatispayId(paymentId: string) {
  const result = await safeDb(async () => {
    const p = await getPool();
    const orderRes = await p.request()
      .input('sp', sql.NVarChar, paymentId)
      .query('SELECT TOP 1 * FROM orders WHERE satispay_payment_id = @sp');
    return orderRes.recordset[0] || null;
  });
  return result ?? null;
}

export async function listOrders(limit = 50) {
  const result = await safeDb(async () => {
  const p = await getPool();
  const q = await p.request()
    .input('limit', sql.Int, limit)
    .query(`
      SELECT TOP (@limit) o.*, COUNT(oi.id) AS item_count
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      GROUP BY o.id, o.order_number, o.email, o.status, o.subtotal_cents, o.tax_cents,
        o.total_cents, o.currency, o.payment_provider, o.payment_intent_id, o.paypal_order_id,
        o.shipping_name, o.shipping_address, o.created_at, o.paid_at, o.user_id
      ORDER BY o.created_at DESC
    `);
  return q.recordset;
  });
  return result ?? [];
}

export async function getOrderByNumber(orderNumber: string) {
  const result = await safeDb(async () => {
    const p = await getPool();
    const orderRes = await p.request()
      .input('num', sql.NVarChar, orderNumber)
      .query('SELECT TOP 1 * FROM orders WHERE order_number = @num');
    if (!orderRes.recordset[0]) return null;
    const itemsRes = await p.request()
      .input('oid', sql.UniqueIdentifier, orderRes.recordset[0].id)
      .query('SELECT * FROM order_items WHERE order_id = @oid');
    return { order: orderRes.recordset[0], items: itemsRes.recordset };
  });
  return result ?? null;
}

export async function getOrderByPaymentIntent(paymentIntentId: string) {
  const result = await safeDb(async () => {
    const p = await getPool();
    const orderRes = await p.request()
      .input('pi', sql.NVarChar, paymentIntentId)
      .query('SELECT TOP 1 * FROM orders WHERE payment_intent_id = @pi');
    return orderRes.recordset[0] || null;
  });
  return result ?? null;
}

export async function getOrderByPayPalId(paypalOrderId: string) {
  const result = await safeDb(async () => {
    const p = await getPool();
    const orderRes = await p.request()
      .input('pp', sql.NVarChar, paypalOrderId)
      .query('SELECT TOP 1 * FROM orders WHERE paypal_order_id = @pp');
    return orderRes.recordset[0] || null;
  });
  return result ?? null;
}

export async function getSalesMetrics() {
  const p = await getPool();
  const result = await p.request().query(`
    SELECT total_cents, created_at
    FROM orders WHERE status = 'paid'
  `);
  return result.recordset.map((r: { total_cents: number; created_at: Date }) => ({
    total_cents: r.total_cents,
    created_at: new Date(r.created_at),
  }));
}

export async function getAbandonedCartMetrics() {
  const p = await getPool();
  const result = await p.request().query(`
    SELECT COUNT(*) AS cart_count, ISNULL(SUM(total_cents), 0) AS total_value
    FROM abandoned_carts
    WHERE recovered = 0 AND updated_at >= DATEADD(day, -7, SYSUTCDATETIME())
  `);
  return {
    count: result.recordset[0]?.cart_count ?? 0,
    valueCents: result.recordset[0]?.total_value ?? 0,
  };
}

const DEFAULT_SETTINGS: Record<string, string> = {
  site_name: 'Burger King Italia',
  currency: 'EUR',
  logo_url: 'https://www.burgerking.it/assets/images/logo-bk.svg',
  support_email: 'ordini@burgerking.it',
};

export async function getSiteSettings(): Promise<Record<string, string>> {
  if (!isDbConfigured()) return DEFAULT_SETTINGS;
  const result = await safeDb(async () => {
  const p = await getPool();
  const q = await p.request().query('SELECT [key], value FROM site_settings');
  const map: Record<string, string> = { ...DEFAULT_SETTINGS };
  for (const row of q.recordset) map[row.key] = row.value;
  return map;
  });
  return result ?? DEFAULT_SETTINGS;
}

export async function updateSiteSettings(settings: Record<string, string>) {
  const p = await getPool();
  const tx = new sql.Transaction(p);
  await tx.begin();
  try {
    for (const [key, value] of Object.entries(settings)) {
      const req = new sql.Request(tx);
      await req
        .input('key', sql.NVarChar, key)
        .input('value', sql.NVarChar, value)
        .query(`
          MERGE site_settings AS t
          USING (SELECT @key AS [key], @value AS value) AS s
          ON t.[key] = s.[key]
          WHEN MATCHED THEN UPDATE SET value = s.value, updated_at = SYSUTCDATETIME()
          WHEN NOT MATCHED THEN INSERT ([key], value) VALUES (s.[key], s.value);
        `);
    }
    await tx.commit();
  } catch (e) {
    await tx.rollback();
    throw e;
  }
}

export async function upsertAbandonedCart(data: {
  session_id: string;
  email?: string;
  items_json: string;
  total_cents: number;
}) {
  const p = await getPool();
  await p.request()
    .input('sid', sql.NVarChar, data.session_id)
    .input('email', sql.NVarChar, data.email || null)
    .input('items', sql.NVarChar, data.items_json)
    .input('total', sql.Int, data.total_cents)
    .query(`
      MERGE abandoned_carts AS t
      USING (SELECT @sid AS session_id) AS s ON t.session_id = s.session_id
      WHEN MATCHED THEN UPDATE SET
        email = COALESCE(@email, t.email),
        items_json = @items,
        total_cents = @total,
        updated_at = SYSUTCDATETIME(),
        recovered = 0
      WHEN NOT MATCHED THEN INSERT (session_id, email, items_json, total_cents)
        VALUES (@sid, @email, @items, @total);
    `);
}

export async function recoverAbandonedCart(session_id: string) {
  const p = await getPool();
  await p.request()
    .input('sid', sql.NVarChar, session_id)
    .query('UPDATE abandoned_carts SET recovered = 1, updated_at = SYSUTCDATETIME() WHERE session_id = @sid');
}

export async function writeAuditLogToDb(entry: {
  user_id: string;
  action: string;
  entity: string;
  entity_id?: string;
  payload?: string;
}) {
  await safeDb(async () => {
    const p = await getPool();
    await p.request()
      .input('uid', sql.NVarChar, entry.user_id)
      .input('action', sql.NVarChar, entry.action.slice(0, 64))
      .input('entity', sql.NVarChar, entry.entity.slice(0, 64))
      .input('eid', sql.NVarChar, entry.entity_id || null)
      .input('payload', sql.NVarChar, entry.payload || null)
      .query(`
        INSERT INTO admin_audit_log (user_id, action, entity, entity_id, payload)
        VALUES (@uid, @action, @entity, @eid, @payload)
      `);
    return true;
  });
}

export async function listAuditLogsFromDb(limit = 100) {
  const result = await safeDb(async () => {
    const p = await getPool();
    const q = await p.request()
      .input('limit', sql.Int, limit)
      .query(`SELECT TOP (@limit) * FROM admin_audit_log ORDER BY created_at DESC`);
    return q.recordset;
  });
  return result ?? [];
}

export async function getSalesByDay(days = 14) {
  const result = await safeDb(async () => {
    const p = await getPool();
    const q = await p.request()
      .input('days', sql.Int, days)
      .query(`
        SELECT CAST(created_at AS DATE) AS day,
               COUNT(*) AS order_count,
               SUM(total_cents) AS revenue_cents
        FROM orders
        WHERE status IN ('paid', 'shipped') AND created_at >= DATEADD(day, -@days, SYSUTCDATETIME())
        GROUP BY CAST(created_at AS DATE)
        ORDER BY day
      `);
    return q.recordset.map((r: { day: Date; order_count: number; revenue_cents: number }) => ({
      day: String(r.day).slice(0, 10),
      order_count: r.order_count,
      revenue_cents: r.revenue_cents,
    }));
  });
  return result ?? [];
}

export async function getSalesByProduct(limit = 10) {
  const result = await safeDb(async () => {
    const p = await getPool();
    const q = await p.request()
      .input('limit', sql.Int, limit)
      .query(`
        SELECT TOP (@limit) oi.product_title, oi.product_slug,
               SUM(oi.quantity) AS qty_sold,
               SUM(oi.line_total_cents) AS revenue_cents
        FROM order_items oi
        JOIN orders o ON o.id = oi.order_id
        WHERE o.status IN ('paid', 'shipped')
        GROUP BY oi.product_title, oi.product_slug
        ORDER BY revenue_cents DESC
      `);
    return q.recordset;
  });
  return result ?? [];
}

export async function getCustomersFromOrders() {
  const result = await safeDb(async () => {
    const p = await getPool();
    const q = await p.request().query(`
      SELECT email,
             COUNT(*) AS order_count,
             SUM(total_cents) AS total_spent_cents,
             MAX(created_at) AS last_order_at
      FROM orders
      WHERE status IN ('paid', 'shipped', 'pending')
      GROUP BY email
      ORDER BY total_spent_cents DESC
    `);
    return q.recordset;
  });
  return result ?? [];
}

export type PromotionRow = {
  id: number;
  code: string;
  title: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  usage_limit: number | null;
  usage_count: number;
};

export async function listPromotions(): Promise<PromotionRow[]> {
  const result = await safeDb(async () => {
    const p = await getPool();
    const q = await p.request().query('SELECT * FROM promotions ORDER BY created_at DESC');
    return q.recordset;
  });
  return result ?? [];
}

export async function createPromotion(data: Omit<PromotionRow, 'id' | 'usage_count'>) {
  const p = await getPool();
  const r = await p.request()
    .input('code', sql.NVarChar, data.code)
    .input('title', sql.NVarChar, data.title)
    .input('dtype', sql.NVarChar, data.discount_type)
    .input('dval', sql.Int, data.discount_value)
    .input('starts', sql.DateTime2, data.starts_at || null)
    .input('ends', sql.DateTime2, data.ends_at || null)
    .input('active', sql.Bit, data.is_active)
    .input('limit', sql.Int, data.usage_limit)
    .query(`
      INSERT INTO promotions (code, title, discount_type, discount_value, starts_at, ends_at, is_active, usage_limit)
      OUTPUT INSERTED.*
      VALUES (@code, @title, @dtype, @dval, @starts, @ends, @active, @limit)
    `);
  return r.recordset[0];
}

export async function updatePromotion(id: number, data: Partial<PromotionRow>) {
  const p = await getPool();
  const r = await p.request()
    .input('id', sql.Int, id)
    .input('title', sql.NVarChar, data.title)
    .input('active', sql.Bit, data.is_active)
    .input('dval', sql.Int, data.discount_value)
    .query(`
      UPDATE promotions SET
        title = COALESCE(@title, title),
        is_active = COALESCE(@active, is_active),
        discount_value = COALESCE(@dval, discount_value),
        updated_at = SYSUTCDATETIME()
      OUTPUT INSERTED.*
      WHERE id = @id
    `);
  return r.recordset[0] || null;
}

export async function deletePromotion(id: number) {
  const p = await getPool();
  const r = await p.request().input('id', sql.Int, id).query('DELETE FROM promotions WHERE id = @id');
  return (r.rowsAffected[0] ?? 0) > 0;
}

export async function adminSearch(query: string) {
  const term = `%${query.slice(0, 64)}%`;
  const result = await safeDb(async () => {
    const p = await getPool();
    const products = await p.request()
      .input('q', sql.NVarChar, term)
      .query(`SELECT TOP 5 id, slug, title, 'product' AS type FROM products WHERE title LIKE @q OR slug LIKE @q`);
    const orders = await p.request()
      .input('q', sql.NVarChar, term)
      .query(`SELECT TOP 5 id, order_number, email, 'order' AS type FROM orders WHERE order_number LIKE @q OR email LIKE @q`);
    return [...products.recordset, ...orders.recordset];
  });
  return result ?? [];
}

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as number,
    slug: row.slug as string,
    title: row.title as string,
    description: (row.description as string) || null,
    thumb_url: (row.thumb_url as string) || null,
    main_image_url: (row.main_image_url as string) || null,
    hero_image_url: (row.hero_image_url as string) || null,
    price_cents: row.price_cents as number,
    currency: (row.currency as string) || 'EUR',
    is_active: Boolean(row.is_active),
    is_featured: Boolean(row.is_featured),
    metadata_json: (row.metadata_json as string) || null,
    categories: row.category_keys ? String(row.category_keys).split(',') : [],
  };
}