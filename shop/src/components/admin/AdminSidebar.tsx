'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminLogo } from './AdminLogo';
import {
  IconDashboard,
  IconBox,
  IconCart,
  IconUsers,
  IconCard,
  IconMegaphone,
  IconChart,
  IconShield,
  IconSettings,
  IconStore,
} from './AdminIcons';

type NavItem = {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
};

const NAV: NavItem[] = [
  { href: '/admin', label: 'Dashboard', Icon: IconDashboard, exact: true },
  { href: '/admin/prodotti', label: 'Prodotti', Icon: IconBox },
  { href: '/admin/ordini', label: 'Ordini', Icon: IconCart },
  { href: '/admin/clienti', label: 'Clienti', Icon: IconUsers },
  { href: '/admin/pagamentos', label: 'Pagamentos', Icon: IconCard },
  { href: '/admin/campanhas', label: 'Campanhas', Icon: IconMegaphone },
  { href: '/admin/relatorios', label: 'Relatórios', Icon: IconChart },
  { href: '/admin/seguranca', label: 'Segurança', Icon: IconShield },
  { href: '/admin/configuracoes', label: 'Configurações', Icon: IconSettings },
];

type Props = { open?: boolean; onClose?: () => void };

export function AdminSidebar({ open, onClose }: Props) {
  const pathname = usePathname();

  return (
    <>
      {open && <div className="admin-sidebar-backdrop" onClick={onClose} aria-hidden />}
      <aside className={`admin-sidebar${open ? ' open' : ''}`}>
        <div className="admin-sidebar-brand">
          <AdminLogo />
          <div>
            <div className="admin-sidebar-brand-title">Burger King</div>
            <div className="admin-sidebar-brand-sub">Admin Enterprise</div>
          </div>
        </div>

        <nav className="admin-nav" aria-label="Menu principal">
          {NAV.map((item) => {
            const { href, label, Icon, exact } = item;
            const active = exact
              ? pathname === href
              : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`admin-nav-link${active ? ' active' : ''}`}
                onClick={onClose}
              >
                <Icon className="admin-nav-icon" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <Link href="/prodotti" className="admin-nav-link admin-nav-link-muted" target="_blank" onClick={onClose}>
            <IconStore className="admin-nav-icon" />
            <span>Ver loja</span>
          </Link>
        </div>
      </aside>
    </>
  );
}