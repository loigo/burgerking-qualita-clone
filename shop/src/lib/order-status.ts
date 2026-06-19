import type { OrderStatus } from './db';

const LABELS: Record<OrderStatus, string> = {
  pending: 'Pendente',
  paid: 'Pagato',
  shipped: 'Inviato',
  failed: 'Fallito',
  refunded: 'Rimborsato',
  cancelled: 'Annullato',
};

export function orderStatusLabel(status: string): string {
  return LABELS[status as OrderStatus] || status;
}

export function orderStatusClass(status: string): string {
  switch (status) {
    case 'pending':
      return 'pending';
    case 'paid':
      return 'paid';
    case 'shipped':
      return 'shipped';
    case 'failed':
      return 'failed';
    default:
      return 'off';
  }
}