/**
 * Gera par RSA + KeyId Satispay (sandbox ou produção)
 * Uso: node scripts/satispay-setup.mjs CODIGO_ATIVACAO
 *
 * Exemplo sandbox: solicite conta em https://satispay-sandbox.paperform.co/
 */
import crypto from 'crypto';

const token = process.argv[2];
if (!token) {
  console.error('Uso: node scripts/satispay-setup.mjs CODIGO_ATIVACAO');
  process.exit(1);
}

const mode = process.env.SATISPAY_MODE || 'sandbox';
const host = mode === 'production'
  ? 'authservices.satispay.com'
  : 'staging.authservices.satispay.com';

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

const publicKeyFormatted = publicKey.trim().split('\n').join('\\n');

const res = await fetch(`https://${host}/g_business/v1/authentication_keys`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ public_key: publicKeyFormatted, token }),
});

const data = await res.json();
if (!res.ok) {
  console.error('Erro:', data);
  process.exit(1);
}

const privateKeyOneLine = privateKey.trim().replace(/\n/g, '\\n');

console.log('\n✅ Satispay configurado! Cole em shop/.env.local:\n');
console.log(`SATISPAY_MODE=${mode}`);
console.log(`SATISPAY_KEY_ID=${data.key_id}`);
console.log(`SATISPAY_PRIVATE_KEY="${privateKeyOneLine}"`);
console.log('\nReinicie o servidor: npm run start\n');