# Configuração Final — Loja 100% Funcional

Para a apresentação, vamos colar **credenciais reais de teste** (sandbox) nos serviços abaixo.
Isso demonstra o fluxo completo: **produto → carrinho → pagamento → pedido no SQL → eventos Meta/GTM**.

---

## Passo 1 — Banco de dados (obrigatório)

### Opção A: SQL Server local (Docker) — recomendado para demo

```powershell
# Na raiz do projeto
docker compose up -d

# Aguarde ~30s, depois inicialize o banco
cd shop
npm run db:init
```

### Opção B: Azure SQL Database

1. Crie o banco no portal Azure
2. Execute `database/schema.sql` + `database/migrations/002_settings_abandoned.sql`
3. Execute `node database/seed-products.mjs` → `seed-data.sql`

### Configure `shop/.env.local`

```env
DATABASE_URL=Server=localhost,1433;Database=bk_shop;User Id=sa;Password=BkShop@2026!Strong;Encrypt=true;TrustServerCertificate=true;
```

Para Azure SQL, substitua pelo connection string do portal.

---

## Passo 2 — Autenticação Admin

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=gere-um-secret-aleatorio-32-chars-minimo
ADMIN_EMAILS=admin@burgerking.it
```

Login: **admin@burgerking.it** / **admin**

### 2FA (opcional — recomendado para demo enterprise)

```env
ADMIN_2FA_ENABLED=true
ADMIN_TOTP_SECRET=COLE_SECRET_BASE32_AQUI
```

1. Acesse `/admin/seguranca` para ver o secret demo e o URI do Google Authenticator
2. Adicione a conta no app Authenticator
3. Após login com email/senha, insira o código TOTP de 6 dígitos

Com `ADMIN_2FA_ENABLED=false`, o admin funciona só com email/senha (modo demo rápido).

---

## Passo 3 — Stripe (modo teste)

1. Acesse https://dashboard.stripe.com/test/apikeys
2. Cole em `shop/.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Cartão de teste: `4242 4242 4242 4242` · qualquer data futura · CVC 123

### Webhook Stripe (local)

```powershell
# Instale Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Copie o whsec_... exibido para STRIPE_WEBHOOK_SECRET no .env.local
```

### Webhook Stripe (produção — Vercel ou Azure)

1. Dashboard Stripe → Developers → Webhooks → Add endpoint
2. URL: `https://SEU-DOMINIO/api/webhooks/stripe`
3. Eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copie o Signing secret para `STRIPE_WEBHOOK_SECRET` nas variáveis de ambiente do deploy

### Fluxo Stripe

1. Checkout cria pedido `pending` no SQL
2. PaymentIntent recebe `metadata.order_number`
3. Pagamento confirmado → `/api/checkout/confirm` marca `paid`
4. Webhook Stripe também marca `paid` (redundância em produção)

---

## Passo 4 — PayPal Sandbox

1. https://developer.paypal.com/dashboard/
2. Crie app Sandbox → copie Client ID e Secret

```env
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
NEXT_PUBLIC_PAYPAL_CLIENT_ID=...   # mesmo Client ID (frontend SDK)
PAYPAL_MODE=sandbox
PAYPAL_WEBHOOK_ID=...              # opcional, para verificar assinatura
```

### Webhook PayPal (produção)

1. Developer Dashboard → My Apps → Webhooks → Add Webhook
2. URL: `https://SEU-DOMINIO/api/webhooks/paypal`
3. Eventos: `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.DENIED`
4. Copie Webhook ID para `PAYPAL_WEBHOOK_ID`

### Fluxo PayPal

1. Checkout cria pedido `pending`
2. Botão PayPal captura pagamento → `/api/checkout/paypal/capture` marca `paid`
3. Webhook PayPal confirma status no banco (backup)

---

## Passo 5 — Satispay Sandbox (Itália)

1. Solicite conta sandbox: https://satispay-sandbox.paperform.co/
2. Receberá código de ativação por email (ex: `6N3ECU`)
3. Gere as chaves RSA:

```powershell
cd shop
node scripts/satispay-setup.mjs CODIGO_ATIVACAO
```

4. Cole o output em `shop/.env.local`:

```env
SATISPAY_MODE=sandbox
SATISPAY_KEY_ID=...
SATISPAY_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

### Callback Satispay (webhook)

O Satispay chama automaticamente:
`https://SEU-DOMINIO/api/webhooks/satispay?payment_id={uuid}`

Para testes locais, use **ngrok** ou similar — Satispay não alcança `localhost` diretamente:
```powershell
ngrok http 3000
# Atualize NEXT_PUBLIC_APP_URL com a URL ngrok
```

A página de sucesso também faz polling via `/api/checkout/satispay/sync` após o redirect.

### Fluxo Satispay

1. Checkout cria pedido `pending`
2. API cria pagamento `MATCH_CODE` (EUR) e retorna `redirect_url`
3. Cliente paga no app Satispay
4. Callback S2S marca pedido `paid` no banco
5. Redirect para `/ordine/confermato?order=BK-XXX&provider=satispay`

---

## Passo 6 — Meta Pixel (Facebook Ads)

1. https://business.facebook.com/events_manager
2. Crie Pixel de teste

```env
NEXT_PUBLIC_META_PIXEL_ID=123456789012345
```

Eventos disparados automaticamente: `PageView`, `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`

---

## Passo 7 — Google Tag Manager + GA4

1. https://tagmanager.google.com — crie container
2. Configure tag GA4 com eventos ecommerce

```env
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXX
```

---

## Passo 8 — Azure (produção)

```env
AZURE_STORAGE_CONNECTION_STRING=...   # upload imagens admin
APPLICATIONINSIGHTS_CONNECTION_STRING=...
```

Deploy: `infra/azure/main.bicep`

---

## Iniciar a loja

```powershell
cd shop
npm install
npm run build
npm run start
```

- Loja: http://localhost:3000
- Admin: http://localhost:3000/admin

---

## Checklist da apresentação

| Funcionalidade | Como testar |
|----------------|-------------|
| CRUD produtos | Admin → Prodotti → criar/editar/apagar |
| Pedidos reais | Checkout Stripe/PayPal/Satispay → /ordine/confermato → Admin → Ordini |
| Status pedido | Admin → Ordini: Pendente → Pagato → Inviato |
| Carrinho | Adicionar produto → /carrello |
| Carrinhos abandonados | Adicionar ao carrinho sem comprar → Dashboard |
| Métricas dashboard | Vendas aparecem após checkout |
| Configurações | Admin → alterar nome/logo → refresh na loja |
| Meta Pixel | Facebook Events Manager → Test Events |
| GTM | Preview mode no GTM → ver dataLayer |

---

## Fluxo demo sugerido (5 min)

1. Mostrar catálogo com 166 produtos do BK
2. Adicionar Bacon King ao carrinho (evento AddToCart)
3. Checkout com Stripe teste ou Demo
4. Confirmar pedido em /ordine/confermato (evento Purchase)
5. Abrir Admin → Dashboard com vendas atualizadas
6. Mostrar pedido em Ordini
7. Mostrar Meta Pixel / GTM ativos em Campanhas