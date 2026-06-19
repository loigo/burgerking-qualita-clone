import {
  createPendingOrder as dbCreatePendingOrder,
  markOrderFailed as dbMarkOrderFailed,
  markOrderPaid as dbMarkOrderPaid,
  updateOrderStatus as dbUpdateOrderStatus,
  linkPaymentIntent,
  linkPayPalOrder,
  linkSatispayPayment,
  isDbConfigured,
  recoverAbandonedCart,
  type OrderStatus,
} from './db';

export type OrderPayload = {
  email: string;
  items: Array<{ product_id: number; title: string; slug: string; qty: number; unit_cents: number }>;
  total_cents: number;
  payment_provider: string;
  payment_intent_id?: string;
  paypal_order_id?: string;
  satispay_payment_id?: string;
  session_id?: string;
};

type MemoryOrder = {
  id: string;
  order_number: string;
  email: string;
  items: OrderPayload['items'];
  total_cents: number;
  payment_provider: string;
  status: OrderStatus;
  payment_intent_id?: string;
  paypal_order_id?: string;
  satispay_payment_id?: string;
  created_at: Date;
  paid_at?: Date;
};

const memoryOrders: MemoryOrder[] = [];

function generateOrderNumber() {
  return `BK-${Date.now().toString(36).toUpperCase()}`;
}

export async function createPendingOrder(data: OrderPayload) {
  if (isDbConfigured()) {
    try {
      const result = await dbCreatePendingOrder(data);
      if (result) return result;
    } catch {
      // fallback to memory
    }
  }
  const order_number = generateOrderNumber();
  const id = crypto.randomUUID();
  memoryOrders.push({
    id,
    order_number,
    email: data.email,
    items: data.items,
    total_cents: data.total_cents,
    payment_provider: data.payment_provider,
    status: 'pending',
    created_at: new Date(),
  });
  return { id, order_number };
}

export async function confirmOrderPaid(
  orderNumber: string,
  extras?: {
    payment_intent_id?: string;
    paypal_order_id?: string;
    satispay_payment_id?: string;
    session_id?: string;
  }
) {
  if (isDbConfigured()) {
    try {
      const result = await dbMarkOrderPaid(orderNumber, extras);
      if (result && extras?.session_id) {
        try {
          await recoverAbandonedCart(extras.session_id);
        } catch {
          // non-blocking
        }
      }
      if (result) return result;
    } catch {
      // fallback
    }
  }
  const order = memoryOrders.find((o) => o.order_number === orderNumber);
  if (!order) return null;
  if (order.status === 'paid') return { id: order.id, order_number: order.order_number, status: 'paid' };
  order.status = 'paid';
  order.paid_at = new Date();
  if (extras?.payment_intent_id) order.payment_intent_id = extras.payment_intent_id;
  if (extras?.paypal_order_id) order.paypal_order_id = extras.paypal_order_id;
  if (extras?.satispay_payment_id) order.satispay_payment_id = extras.satispay_payment_id;
  return { id: order.id, order_number: order.order_number, status: 'paid' };
}

export async function failOrder(orderNumber: string) {
  if (isDbConfigured()) {
    try {
      const result = await dbMarkOrderFailed(orderNumber);
      if (result) return result;
    } catch {
      // fallback
    }
  }
  const order = memoryOrders.find((o) => o.order_number === orderNumber);
  if (!order || order.status !== 'pending') return null;
  order.status = 'failed';
  return { id: order.id, order_number: order.order_number, status: 'failed' };
}

export async function setOrderStatus(orderId: string, status: OrderStatus) {
  if (isDbConfigured()) {
    try {
      const result = await dbUpdateOrderStatus(orderId, status);
      if (result) return result;
    } catch {
      // fallback
    }
  }
  const order = memoryOrders.find((o) => o.id === orderId);
  if (!order) return null;
  order.status = status;
  return order;
}

export async function attachStripePayment(orderNumber: string, paymentIntentId: string) {
  if (isDbConfigured()) {
    try {
      await linkPaymentIntent(orderNumber, paymentIntentId);
      return;
    } catch {
      // fallback
    }
  }
  const order = memoryOrders.find((o) => o.order_number === orderNumber);
  if (order) order.payment_intent_id = paymentIntentId;
}

export async function attachPayPalPayment(orderNumber: string, paypalOrderId: string) {
  if (isDbConfigured()) {
    try {
      await linkPayPalOrder(orderNumber, paypalOrderId);
      return;
    } catch {
      // fallback
    }
  }
  const order = memoryOrders.find((o) => o.order_number === orderNumber);
  if (order) order.paypal_order_id = paypalOrderId;
}

export async function attachSatispayPayment(orderNumber: string, paymentId: string) {
  if (isDbConfigured()) {
    try {
      await linkSatispayPayment(orderNumber, paymentId);
      return;
    } catch {
      // fallback
    }
  }
  const order = memoryOrders.find((o) => o.order_number === orderNumber);
  if (order) order.satispay_payment_id = paymentId;
}

/** Demo / legacy: cria pedido e marca como pago imediatamente */
export async function placeOrder(data: OrderPayload) {
  const pending = await createPendingOrder(data);
  await confirmOrderPaid(pending.order_number, {
    payment_intent_id: data.payment_intent_id,
    paypal_order_id: data.paypal_order_id,
    session_id: data.session_id,
  });
  return pending;
}

export function getMemoryOrders() {
  return memoryOrders;
}

export function getMemoryOrderByNumber(orderNumber: string) {
  const order = memoryOrders.find((o) => o.order_number === orderNumber);
  if (!order) return null;
  return {
    order: {
      id: order.id,
      order_number: order.order_number,
      email: order.email,
      status: order.status,
      subtotal_cents: order.total_cents,
      total_cents: order.total_cents,
      currency: 'EUR',
      payment_provider: order.payment_provider,
      payment_intent_id: order.payment_intent_id || null,
      paypal_order_id: order.paypal_order_id || null,
      created_at: order.created_at,
      paid_at: order.paid_at || null,
    },
    items: order.items.map((item, idx) => ({
      id: idx + 1,
      product_id: item.product_id,
      product_title: item.title,
      product_slug: item.slug,
      quantity: item.qty,
      unit_price_cents: item.unit_cents,
      line_total_cents: item.qty * item.unit_cents,
    })),
  };
}