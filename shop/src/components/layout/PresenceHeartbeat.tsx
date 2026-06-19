'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const STORAGE_KEY = 'bk_presence_sid';

function getSessionId() {
  if (typeof window === 'undefined') return '';
  let sid = localStorage.getItem(STORAGE_KEY);
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, sid);
  }
  return sid;
}

/** PEN-TEST: heartbeat anonimo — sem PII, só contagem agregada de presença. */
export function PresenceHeartbeat() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith('/admin')) return;

    const sid = getSessionId();

    function ping() {
      fetch('/api/presence/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sid, path: pathname || '/' }),
      }).catch(() => {});
    }

    ping();
    const id = setInterval(ping, 60_000);
    return () => clearInterval(id);
  }, [pathname]);

  return null;
}