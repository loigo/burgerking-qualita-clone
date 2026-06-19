import { getSatispayPayment, isSatispayConfigured } from './satispay';
import { confirmOrderPaid, failOrder } from './orders';
import { getOrderBySatispayId } from './db';
import { trackEvent } from './insights';

export async function processSatispayCallback(paymentId: string) {
  if (!isSatispayConfigured()) return { ok: false, reason: 'not_configured' };

  const payment = await getSatispayPayment(paymentId);
  let orderNumber =
    payment.external_code ||
    payment.metadata?.order_number ||
    (await getOrderBySatispayId(paymentId))?.order_number;

  if (!orderNumber) {
    return { ok: false, reason: 'order_not_found', status: payment.status };
  }

  if (payment.status === 'ACCEPTED') {
    await confirmOrderPaid(orderNumber, { satispay_payment_id: paymentId });
    trackEvent('satispay_payment_accepted', { order_number: orderNumber, payment_id: paymentId });
    return { ok: true, status: 'ACCEPTED', order_number: orderNumber };
  }

  if (payment.status === 'CANCELED') {
    await failOrder(orderNumber);
    trackEvent('satispay_payment_canceled', { order_number: orderNumber });
    return { ok: true, status: 'CANCELED', order_number: orderNumber };
  }

  return { ok: true, status: payment.status, order_number: orderNumber };
}