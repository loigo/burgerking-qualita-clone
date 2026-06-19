import './admin.css';
import { AdminShell } from '@/components/admin/AdminShell';

export const metadata = {
  title: 'BK Admin Enterprise | Burger King Italia',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}