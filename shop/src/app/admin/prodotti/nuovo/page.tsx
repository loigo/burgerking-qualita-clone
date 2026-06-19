'use client';

import { useRouter } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';
import type { ProductInput } from '@/lib/types';

export default function NuovoProdottoPage() {
  const router = useRouter();

  async function handleSubmit(data: ProductInput) {
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Errore creazione');
    }
    const product = await res.json();
    router.push(`/admin/prodotti/${product.id}`);
  }

  return (
    <div>
      <h1 className="admin-page-title">Nuovo prodotto</h1>
      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
}