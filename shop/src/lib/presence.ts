/**
 * Presença online — usuários ativos na loja (últimos 5 min).
 * PEN-TEST: dados agregados apenas, sem PII exposto no dashboard.
 */

type Presence = { session_id: string; last_seen: number; path?: string };

const sessions = new Map<string, Presence>();
const TTL_MS = 5 * 60 * 1000;

export function recordPresence(sessionId: string, path?: string) {
  sessions.set(sessionId, { session_id: sessionId, last_seen: Date.now(), path });
}

export function getOnlineCount(): number {
  const cutoff = Date.now() - TTL_MS;
  let count = 0;
  for (const [id, s] of sessions.entries()) {
    if (s.last_seen < cutoff) sessions.delete(id);
    else count++;
  }
  return count;
}

if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const cutoff = Date.now() - TTL_MS;
    for (const [id, s] of sessions.entries()) {
      if (s.last_seen < cutoff) sessions.delete(id);
    }
  }, 60_000);
}