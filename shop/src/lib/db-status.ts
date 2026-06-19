import { isDbConfigured, testDbConnection } from './db';

export type DbMode = 'connected' | 'configured_offline' | 'memory';

export type DbStatus = {
  mode: DbMode;
  label: string;
  detail: string;
  configured: boolean;
  connected: boolean;
};

export async function getDbStatus(): Promise<DbStatus> {
  const configured = isDbConfigured();
  if (!configured) {
    return {
      mode: 'memory',
      label: 'Modo demonstração',
      detail:
        'Sem DATABASE_URL. Produtos, pedidos e métricas usam dados em memória — ideal para demo rápida.',
      configured: false,
      connected: false,
    };
  }

  const connected = await testDbConnection();
  if (connected) {
    return {
      mode: 'connected',
      label: 'SQL Server conectado',
      detail: 'Banco ativo. Produtos, pedidos, métricas e audit log persistem no SQL.',
      configured: true,
      connected: true,
    };
  }

  return {
    mode: 'configured_offline',
    label: 'SQL configurado — offline',
    detail:
      'DATABASE_URL definida, mas o servidor SQL não responde. Execute npm run db:up && npm run db:init ou verifique a connection string.',
    configured: true,
    connected: false,
  };
}