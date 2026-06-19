'use client';

import Link from 'next/link';
import { AdminGlobalSearch } from './AdminGlobalSearch';
import { IconMenu } from './AdminIcons';

type Props = { onMenuToggle?: () => void };

export function AdminHeader({ onMenuToggle }: Props) {
  return (
    <header className="admin-topbar">
      <button type="button" className="admin-menu-toggle" onClick={onMenuToggle} aria-label="Abrir menu">
        <IconMenu className="admin-icon-20" />
      </button>
      <AdminGlobalSearch />
      <div className="admin-topbar-actions">
        <Link href="/api/auth/signout" className="admin-topbar-signout">
          Sair
        </Link>
      </div>
    </header>
  );
}