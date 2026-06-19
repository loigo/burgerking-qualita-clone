/**
 * Sanitização de inputs — PEN-TEST: mitiga XSS em outputs refletidos.
 * SQL Injection: todas as queries usam parâmetros tipados (mssql .input()).
 */

export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

export function sanitizeSlug(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 128);
}

export function sanitizeEmail(input: string): string {
  return input.trim().toLowerCase().slice(0, 256);
}

export function escapeLikePattern(input: string): string {
  return input.replace(/[%_[\]\\]/g, '\\$&');
}