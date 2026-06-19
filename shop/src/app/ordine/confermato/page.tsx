import Link from 'next/link';
import { PurchaseTracker } from './PurchaseTracker';
import { OrderDetails } from '@/components/checkout/OrderDetails';
import { OrderConfirmPoller } from '@/components/checkout/OrderConfirmPoller';

export default function OrdineConfermatoPage({
  searchParams,
}: {
  searchParams: { order?: string; provider?: string };
}) {
  const orderNumber = searchParams.order || '';
  const provider = searchParams.provider || '';

  return (
    <div className="container-1600 py-12 text-center">
      <PurchaseTracker orderNumber={orderNumber} />
      <div className="order-success-icon text-5xl mb-4">✓</div>
      <h1 className="titolo-section">Grazie per il tuo ordine!</h1>
      <p className="text-xl mt-4">Il pagamento è stato confermato.</p>
      {orderNumber && (
        <p className="mt-2 font-mono text-lg">
          Numero ordine: <strong>{orderNumber}</strong>
        </p>
      )}
      <OrderConfirmPoller orderNumber={orderNumber} provider={provider} />
      <OrderDetails orderNumber={orderNumber} />
      <p className="mt-6 text-sm">Riceverai una conferma via email a breve.</p>
      <Link href="/prodotti" className="btn-main mt-8 inline-block">
        Continua lo shopping
      </Link>
    </div>
  );
}