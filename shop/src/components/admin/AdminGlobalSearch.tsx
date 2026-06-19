'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { IconSearch } from './AdminIcons';

type Result = {
  type: string;
  id?: number | string;
  slug?: string;
  title?: string;
  order_number?: string;
  email?: string;
};

export function AdminGlobalSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      const res = await fetch(`/api/admin/search?q=${encodeURIComponent(q)}`);
      if (res.ok) setResults(await res.json());
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  function href(r: Result) {
    if (r.type === 'product' && r.id) return `/admin/prodotti/${r.id}`;
    if (r.type === 'order') return `/admin/ordini`;
    return '/admin';
  }

  function label(r: Result) {
    if (r.type === 'product') return r.title || r.slug || 'Produto';
    if (r.type === 'order') return `${r.order_number} — ${r.email}`;
    return String(r.title || r.id);
  }

  return (
    <>
      <button type="button" className="admin-search-trigger" onClick={() => setOpen(true)}>
        <IconSearch className="admin-icon-16" />
        <span>Buscar</span>
        <kbd>Ctrl+K</kbd>
      </button>
      {open && (
        <div className="admin-search-overlay" onClick={() => setOpen(false)}>
          <div className="admin-search-modal" onClick={(e) => e.stopPropagation()}>
            <input
              ref={inputRef}
              className="admin-search-input"
              placeholder="Produtos, pedidos, emails..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <ul className="admin-search-results">
              {results.map((r, i) => (
                <li key={i}>
                  <Link href={href(r)} onClick={() => setOpen(false)}>
                    {label(r)}
                  </Link>
                </li>
              ))}
              {q.length >= 2 && results.length === 0 && (
                <li className="muted">Nenhum resultado</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}