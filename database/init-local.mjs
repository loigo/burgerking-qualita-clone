/**
 * Inicializa SQL Server local (Docker) ou Azure SQL
 * Uso: node database/init-local.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sql from 'mssql';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MASTER_URL =
  process.env.DATABASE_MASTER_URL ||
  'Server=localhost,1433;Database=master;User Id=sa;Password=BkShop@2026!Strong;Encrypt=true;TrustServerCertificate=true;';

const DB_URL =
  process.env.DATABASE_URL ||
  'Server=localhost,1433;Database=bk_shop;User Id=sa;Password=BkShop@2026!Strong;Encrypt=true;TrustServerCertificate=true;';

async function runSqlFile(pool, filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const batches = raw.split(/^\s*GO\s*$/gim).filter((b) => b.trim());
  for (const batch of batches) {
    if (batch.trim()) await pool.request().query(batch);
  }
}

async function main() {
  console.log('🔌 Conectando ao SQL Server...');
  const master = await sql.connect(MASTER_URL);
  await master.request().query(`
    IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'bk_shop')
    CREATE DATABASE bk_shop;
  `);
  await master.close();
  console.log('✅ Database bk_shop OK');

  const pool = await sql.connect(DB_URL);

  console.log('📋 Aplicando schema...');
  await runSqlFile(pool, path.join(__dirname, 'schema.sql'));

  console.log('📋 Aplicando migration 002...');
  await runSqlFile(pool, path.join(__dirname, 'migrations', '002_settings_abandoned.sql'));

  const count = await pool.request().query('SELECT COUNT(*) AS n FROM products');
  if (count.recordset[0].n === 0) {
    console.log('🌱 Gerando seed de produtos...');
    const { execSync } = await import('child_process');
    execSync('node seed-products.mjs', { cwd: __dirname, stdio: 'inherit' });
    const seedPath = path.join(__dirname, 'seed-data.sql');
    if (fs.existsSync(seedPath)) {
      await runSqlFile(pool, seedPath);
      console.log('✅ 166 produtos inseridos');
    }
  } else {
    console.log(`ℹ️  Produtos já existem (${count.recordset[0].n})`);
  }

  await pool.close();
  console.log('\n🎉 Banco pronto! Configure no shop/.env.local:');
  console.log(`DATABASE_URL=${DB_URL}`);
}

main().catch((e) => {
  console.error('❌ Erro:', e.message);
  console.error('\nCertifique-se que o Docker SQL está rodando:');
  console.error('  docker compose up -d');
  process.exit(1);
});