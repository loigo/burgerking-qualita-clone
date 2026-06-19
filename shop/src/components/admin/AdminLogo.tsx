'use client';

import { useState } from 'react';

const LOGO_SRC = 'https://www.burgerking.it/assets/images/logo-bk.svg';

export function AdminLogo() {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return <div className="admin-topbar-logo-fallback" aria-hidden>BK</div>;
  }

  return (
    <img
      src={LOGO_SRC}
      alt="Burger King"
      className="admin-topbar-logo"
      height={36}
      onError={() => setBroken(true)}
    />
  );
}