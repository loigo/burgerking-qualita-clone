'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';
import type { Product, ProductInput } from '@/lib/types';

export default function ModificaProdottoPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/products/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      });
  }, [params.id]);

  async function handleSubmit(data: ProductInput) {
    const res = await fetch(`/api/admin/products/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Errore salvataggio');
    }
    setProduct(await res.json());
  }

  async function handleDelete() {
    if (!confirm('Eliminare questo prodotto?')) return;
    const res = await fetch(`/api/admin/products/${params.id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json();
      alert(err.error || 'Errore eliminazione');
      return;
    }
    router.push('/admin/prodotti');
  }

  if (loading) return <p>Caricamento...</p>;
  if (!product?.id) return <p>Prodotto non trovato</p>;

  return (
    <div>
      <h1 className="admin-page-title">Modifica: {product.title}</h1>
      <ProductForm initial={product} onSubmit={handleSubmit} onDelete={handleDelete} />
    </div>
  );
}