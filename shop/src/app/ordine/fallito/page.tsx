import Link from 'next/link';
import { OrderDetails } from '@/components/checkout/OrderDetails';

export default function OrdineFallitoPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  const orderNumber = searchParams.order || '';

  return (
    <div className="container-1600 py-12 text-center">
      <div className="order-fail-icon text-5xl mb-4 text-red-500">✕</div>
      <h1 className="titolo-section">Pagamento non riuscito</h1>
      <p className="text-xl mt-4">
        Il pagamento non è stato completato. Nessun addebito è stato effettuato.
      </p>
      {orderNumber && (
        <p className="mt-2 font-mono text-lg">
          Riferimento: <strong>{orderNumber}</strong>
        </p>
      )}
      <OrderDetails orderNumber={orderNumber} />
      <div className="flex gap-4 justify-center mt-8 flex-wrap">
        <Link href="/checkout" className="btn-main">
          Riprova il pagamento
        </Link>
        <Link href="/prodotti" className="btn-main-outline">
          Torna ai prodotti
        </Link>
      </div>
    </div>
  );
}