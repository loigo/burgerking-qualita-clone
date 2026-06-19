import { NextResponse } from 'next/server';
import { confirmOrderPaid, failOrder } from '@/lib/orders';
import { getOrderByPayPalId } from '@/lib/db';
import { isPayPalConfigured, verifyPayPalWebhook } from '@/lib/paypal';
import { trackEvent } from '@/lib/insights';

type PayPalEvent = {
  event_type: string;
  resource: {
    id?: string;
    status?: string;
    custom_id?: string;
    supplementary_data?: { related_ids?: { order_id?: string } };
  };
};

export async function POST(req: Request) {
  if (!isPayPalConfigured()) {
    return NextResponse.json({ error: 'PayPal not configured' }, { status: 503 });
  }

  const raw = await req.text();
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;

  if (webhookId) {
    const valid = await verifyPayPalWebhook(req.headers, raw, webhookId);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
  }

  let event: PayPalEvent;
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
    const orderNumber = event.resource.custom_id;
    const paypalOrderId = event.resource.supplementary_data?.related_ids?.order_id;
    if (orderNumber) {
      await confirmOrderPaid(orderNumber, { paypal_order_id: paypalOrderId });
      trackEvent('paypal_webhook_paid', { order_number: orderNumber });
    } else if (paypalOrderId) {
      const order = await getOrderByPayPalId(paypalOrderId);
      if (order?.order_number) {
        await confirmOrderPaid(order.order_number, { paypal_order_id: paypalOrderId });
      }
    }
  }

  if (event.event_type === 'PAYMENT.CAPTURE.DENIED' || event.event_type === 'CHECKOUT.ORDER.VOIDED') {
    const paypalOrderId = event.resource.id;
    if (paypalOrderId) {
      const order = await getOrderByPayPalId(paypalOrderId);
      if (order?.order_number) {
        await failOrder(order.order_number);
        trackEvent('paypal_webhook_failed', { order_number: order.order_number });
      }
    }
  }

  return NextResponse.json({ received: true });
}