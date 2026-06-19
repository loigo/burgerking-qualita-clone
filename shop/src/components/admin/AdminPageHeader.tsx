type Props = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
};

export function AdminPageHeader({ title, subtitle, actions }: Props) {
  return (
    <header className="admin-page-header">
      <div className="admin-page-header-text">
        <h1 className="admin-page-title">{title}</h1>
        {subtitle && <p className="admin-page-sub">{subtitle}</p>}
      </div>
      {actions && <div className="admin-page-header-actions">{actions}</div>}
    </header>
  );
}