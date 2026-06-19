'use client';

import { useState } from 'react';
import type { Product, ProductInput } from '@/lib/types';

type Props = {
  initial?: Product;
  onSubmit: (data: ProductInput) => Promise<void>;
  onDelete?: () => Promise<void>;
};

export function ProductForm({ initial, onSubmit, onDelete }: Props) {
  const [form, setForm] = useState<ProductInput>({
    slug: initial?.slug || '',
    title: initial?.title || '',
    description: initial?.description || '',
    thumb_url: initial?.thumb_url || '',
    main_image_url: initial?.main_image_url || '',
    hero_image_url: initial?.hero_image_url || '',
    price_cents: initial?.price_cents || 699,
    is_active: initial?.is_active ?? true,
    is_featured: initial?.is_featured ?? false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      {error && <p className="admin-error">{error}</p>}
      <label>
        Slug
        <input
          value={form.slug}
          disabled={!!initial}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          required
        />
      </label>
      <label>
        Titolo
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
      </label>
      <label>
        Descrizione
        <textarea
          value={form.description}
          rows={5}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </label>
      <label>
        Immagine thumb URL
        <input value={form.thumb_url} onChange={(e) => setForm({ ...form, thumb_url: e.target.value })} />
      </label>
      <label>
        Prezzo (centesimi)
        <input
          type="number"
          value={form.price_cents}
          onChange={(e) => setForm({ ...form, price_cents: Number(e.target.value) })}
          required
        />
      </label>
      <label className="admin-checkbox">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
        />
        Attivo
      </label>
      <label className="admin-checkbox">
        <input
          type="checkbox"
          checked={form.is_featured}
          onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
        />
        In evidenza
      </label>
      <div className="admin-form-actions">
        <button type="submit" className="btn-main" disabled={loading}>
          {loading ? 'Salvataggio...' : 'Salva'}
        </button>
        {onDelete && (
          <button type="button" className="btn-main-outline" onClick={onDelete}>
            Elimina
          </button>
        )}
      </div>
    </form>
  );
}