'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useCart } from '@/store/cart';
import { trackInitiateCheckout, trackPurchase } from '@/lib/tracking/events';
import { getOrCreateSessionId } from '@/lib/session-id';
import { syncAbandonedCart } from '@/lib/cart-sync';

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

type PaymentMethod = 'stripe' | 'paypal' | 'satispay' | 'demo';

function formatPrice(cents: number) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}

function StripeForm({
  orderNumber,
  onSuccess,
  onFailure,
}: {
  orderNumber: string;
  onSuccess: () => Promise<void>;
  onFailure: () => Promise<void>;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError('');
    const returnUrl = `${window.location.origin}/ordine/confermato?order=${encodeURIComponent(orderNumber)}`;
    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
      redirect: 'if_required',
    });
    if (submitError) {
      setError(submitError.message || 'Pagamento fallito');
      await onFailure();
      setLoading(false);
      return;
    }
    if (paymentIntent?.status === 'succeeded') {
      await onSuccess();
    } else if (paymentIntent?.status === 'requires_payment_method') {
      await onFailure();
      setError('Pagamento rifiutato. Riprova con un\'altra carta.');
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handlePay}>
      <p className="text-sm mb-3 text-gray-600">
        Carta, Apple Pay o Google Pay
      </p>
      <PaymentElement />
      {error && <p className="admin-error mt-4">{error}</p>}
      <button type="submit" className="btn-main mt-4 w-full" disabled={!stripe || loading}>
        {loading ? 'Elaborazione...' : 'Paga con Stripe'}
      </button>
    </form>
  );
}

const METHOD_LABELS: Record<PaymentMethod, string> = {
  stripe: 'Stripe',
  paypal: 'PayPal',
  satispay: 'Satispay',
  demo: 'Demo',
};

export function CheckoutClient() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const totalCents = useCart((s) => s.totalCents());
  const clear = useCart((s) => s.clear);
  const [email, setEmail] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('stripe');
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paypalReady, setPaypalReady] = useState(false);
  const paypalRendered = useRef(false);
  const lastProvider = useRef<PaymentMethod | null>(null);

  useEffect(() => {
    if (items.length === 0) return;
    syncAbandonedCart(items, email || undefined);
    trackInitiateCheckout(
      totalCents / 100,
      items.map((i) => ({
        id: String(i.productId),
        name: i.title,
        price: i.unit_price_cents / 100,
        quantity: i.quantity,
      }))
    );
  }, [items, totalCents, email]);

  const orderItems = useCallback(
    () =>
      items.map((i) => ({
        product_id: i.productId,
        title: i.title,
        slug: i.slug,
        qty: i.quantity,
        unit_cents: i.unit_price_cents,
      })),
    [items]
  );

  async function ensurePendingOrder(provider: PaymentMethod) {
    if (orderNumber && lastProvider.current === provider) return orderNumber;
    if (!email) throw new Error('Inserisci la tua email');
    const res = await fetch('/api/checkout/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        total_cents: totalCents,
        payment_provider: provider,
        items: orderItems(),
      }),
    });
    if (!res.ok) throw new Error('Impossibile creare l\'ordine');
    const data = await res.json();
    setOrderNumber(data.order_number);
    lastProvider.current = provider;
    return data.order_number as string;
  }

  async function confirmPaid(
    num: string,
    extra?: { payment_intent_id?: string; paypal_order_id?: string; satispay_payment_id?: string }
  ) {
    const res = await fetch('/api/checkout/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_number: num,
        ...extra,
        session_id: getOrCreateSessionId(),
      }),
    });
    if (!res.ok) throw new Error('Conferma ordine fallita');
  }

  async function markFailed(num: string) {
    await fetch('/api/checkout/fail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_number: num }),
    });
    router.push(`/ordine/fallito?order=${encodeURIComponent(num)}`);
  }

  function finishSuccess(num: string) {
    trackPurchase({
      orderId: num,
      value: totalCents / 100,
      items: items.map((i) => ({
        id: String(i.productId),
        name: i.title,
        price: i.unit_price_cents / 100,
        quantity: i.quantity,
      })),
    });
    sessionStorage.setItem('bk-last-purchase', num);
    clear();
    router.push(`/ordine/confermato?order=${encodeURIComponent(num)}`);
  }

  useEffect(() => {
    if (method !== 'stripe' || !email || !stripePromise) {
      setClientSecret(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const num = await ensurePendingOrder('stripe');
        const res = await fetch('/api/checkout/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            total_cents: totalCents,
            order_number: num,
            items_json: JSON.stringify(orderItems()),
          }),
        });
        const data = await res.json();
        if (!cancelled && data.client_secret) setClientSecret(data.client_secret);
      } catch {
        if (!cancelled) setError('Errore Stripe');
      }
    })();
    return () => { cancelled = true; };
  }, [method, email, totalCents, items]);

  useEffect(() => {
    if (method !== 'paypal' || !paypalReady || !email || !paypalClientId) return;
    if (paypalRendered.current) return;

    let cancelled = false;
    (async () => {
      try {
        const num = await ensurePendingOrder('paypal');
        // @ts-expect-error PayPal SDK global
        const paypal = window.paypal;
        if (!paypal || cancelled) return;

        paypalRendered.current = true;
        await paypal.Buttons({
          style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' },
          createOrder: async () => {
            const res = await fetch('/api/checkout/paypal', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ total_cents: totalCents, order_number: num }),
            });
            const data = await res.json();
            if (!data.id) throw new Error('PayPal non disponibile');
            return data.id;
          },
          onApprove: async (approveData: { orderID: string }) => {
            setLoading(true);
            try {
              const capRes = await fetch('/api/checkout/paypal/capture', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  order_id: approveData.orderID,
                  order_number: num,
                  session_id: getOrCreateSessionId(),
                }),
              });
              if (!capRes.ok) throw new Error('Capture fallita');
              await confirmPaid(num, { paypal_order_id: approveData.orderID });
              finishSuccess(num);
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Errore PayPal');
              await markFailed(num);
            } finally {
              setLoading(false);
            }
          },
          onError: async () => { await markFailed(num); },
          onCancel: async () => { setError('Pagamento PayPal annullato'); },
        }).render('#paypal-button');
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Errore PayPal');
      }
    })();

    return () => { cancelled = true; };
  }, [method, paypalReady, email, totalCents]);

  useEffect(() => {
    paypalRendered.current = false;
    const el = document.getElementById('paypal-button');
    if (el) el.innerHTML = '';
  }, [method, email]);

  async function handleSatispay() {
    if (!email) {
      setError('Inserisci la tua email');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const num = await ensurePendingOrder('satispay');
      const res = await fetch('/api/checkout/satispay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total_cents: totalCents, order_number: num }),
      });
      const data = await res.json();
      if (data.demo) {
        await confirmPaid(num);
        finishSuccess(num);
        return;
      }
      if (!data.redirect_url) throw new Error('Satispay non disponibile');
      sessionStorage.setItem(`bk-satispay-${num}`, data.id);
      window.location.href = data.redirect_url;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Errore Satispay');
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoCheckout() {
    if (!email) {
      setError('Inserisci la tua email');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const num = await ensurePendingOrder('demo');
      await confirmPaid(num);
      finishSuccess(num);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Errore');
    } finally {
      setLoading(false);
    }
  }

  function switchMethod(m: PaymentMethod) {
    setMethod(m);
    setError('');
    if (m !== lastProvider.current) {
      setOrderNumber(null);
      lastProvider.current = null;
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-1600 py-12 text-center">
        <h1 className="titolo-section">Checkout</h1>
        <p className="mt-4">Il carrello è vuoto.</p>
        <a href="/prodotti" className="btn-main mt-6">Vai ai prodotti</a>
      </div>
    );
  }

  const mainMethods: PaymentMethod[] = ['stripe', 'paypal', 'satispay'];

  return (
    <div className="container-1600 py-8">
      {paypalClientId && (
        <Script
          src={`https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=EUR&intent=capture`}
          strategy="lazyOnload"
          onLoad={() => setPaypalReady(true)}
        />
      )}
      <h1 className="titolo-section text-center mb-8">Checkout</h1>
      <div className="checkout-grid max-w-5xl mx-auto">
        <div>
          <h2 className="text-xl font-bold mb-4">Il tuo ordine</h2>
          {items.map((item) => (
            <div key={item.productId} className="cart-item">
              {item.thumb_url && <img src={item.thumb_url} alt={item.title} />}
              <div className="flex-grow">
                <div className="font-bold">{item.title}</div>
                <div>Qty: {item.quantity}</div>
              </div>
              <div className="font-bold">{formatPrice(item.unit_price_cents * item.quantity)}</div>
            </div>
          ))}
          <p className="text-2xl font-bold mt-4">Totale: {formatPrice(totalCents)}</p>
          {orderNumber && (
            <p className="text-sm mt-2 text-gray-500">Rif. ordine: {orderNumber}</p>
          )}
        </div>
        <div className="admin-form">
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <p className="text-sm font-bold mb-2">Metodo di pagamento</p>
          <div className="payment-methods">
            {mainMethods.map((m) => (
              <button
                key={m}
                type="button"
                className={`payment-method-btn ${method === m ? 'active' : ''} payment-method-${m}`}
                onClick={() => switchMethod(m)}
              >
                {METHOD_LABELS[m]}
              </button>
            ))}
          </div>
          {error && <p className="admin-error">{error}</p>}
          {method === 'stripe' && stripePromise && clientSecret && orderNumber && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: { theme: 'stripe' },
              }}
            >
              <StripeForm
                orderNumber={orderNumber}
                onSuccess={async () => {
                  await confirmPaid(orderNumber);
                  finishSuccess(orderNumber);
                }}
                onFailure={async () => markFailed(orderNumber)}
              />
            </Elements>
          )}
          {method === 'stripe' && (!stripePromise || !clientSecret) && email && (
            <p className="text-sm">
              Configura STRIPE_SECRET_KEY e NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in shop/.env.local.
            </p>
          )}
          {method === 'paypal' && (
            <>
              {!paypalClientId && (
                <p className="text-sm mb-2">
                  Configura NEXT_PUBLIC_PAYPAL_CLIENT_ID in shop/.env.local.
                </p>
              )}
              <div id="paypal-button" />
              {loading && <p className="text-sm mt-2">Elaborazione PayPal...</p>}
            </>
          )}
          {method === 'satispay' && (
            <>
              <p className="text-sm mb-3">
                Paga con l&apos;app Satispay — molto usato in Italia. Verrai reindirizzato per completare il pagamento in EUR.
              </p>
              <button
                type="button"
                className="btn-satispay w-full"
                onClick={handleSatispay}
                disabled={loading || !email}
              >
                {loading ? 'Reindirizzamento...' : 'Paga con Satispay'}
              </button>
            </>
          )}
          <details className="mt-6">
            <summary className="text-sm cursor-pointer text-gray-500">Checkout demo (senza credenziali)</summary>
            <button type="button" className="btn-main-outline w-full mt-2" onClick={handleDemoCheckout} disabled={loading}>
              Conferma ordine demo
            </button>
          </details>
        </div>
      </div>
    </div>
  );
}