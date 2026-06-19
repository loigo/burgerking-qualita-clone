import { listAuditLogsFromDb, writeAuditLogToDb } from '../db';

/**
 * Audit trail — PEN-TEST: rastreabilidade para investigação pós-incidente.
 */

export type AuditEntry = {
  user_id: string;
  action: string;
  entity: string;
  entity_id?: string;
  payload?: string;
};

const memoryLog: Array<AuditEntry & { id: number; created_at: Date }> = [];
let memoryId = 1;

export async function writeAuditLog(entry: AuditEntry) {
  memoryLog.unshift({ ...entry, id: memoryId++, created_at: new Date() });
  if (memoryLog.length > 500) memoryLog.pop();
  await writeAuditLogToDb(entry);
}

export async function listAuditLogs(limit = 100) {
  const dbLogs = await listAuditLogsFromDb(limit);
  if (dbLogs.length > 0) return dbLogs;
  return memoryLog.slice(0, limit);
}