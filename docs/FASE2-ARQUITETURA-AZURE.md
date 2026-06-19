# Fase 2 — Loja Virtual Burger King Italia (Azure)

## Escolha do banco: Azure SQL Database

| Critério | Azure SQL | Cosmos DB |
|----------|-----------|-----------|
| Pedidos + itens + pagamentos | Relacional nativo (FK, transações ACID) | Modelagem manual, consistência eventual |
| Relatórios de vendas / GA4 | JOINs simples | Agregações mais complexas |
| Admin CRUD | Tabelas normais | Containers + partition keys |
| Custo inicial (loja média) | Previsível, tier Basic/S0 | Pode escalar caro com RU/s |

**Decisão:** **Azure SQL Database** para catálogo, carrinho persistido, pedidos, pagamentos e auditoria.

---

## Diagrama de arquitetura

```mermaid
flowchart TB
  subgraph Cliente
    U[Browser / Mobile]
  end

  subgraph Marketing
    MP[Meta Pixel]
    GTM[Google Tag Manager]
    GA4[Google Analytics 4]
  end

  subgraph Azure
    subgraph Compute
      AS[Azure App Service<br/>Next.js 14 App Router]
    end
    subgraph Data
      SQL[(Azure SQL Database)]
      BLOB[Azure Blob Storage<br/>imagens produto]
    end
    subgraph Security
      B2C[Azure AD B2C<br/>ou NextAuth + B2C OIDC]
      KV[Azure Key Vault<br/>secrets Stripe/PayPal/SQL]
    end
    subgraph Observability
      AI[Application Insights]
      LOG[Log Analytics]
    end
  end

  subgraph Pagamentos
    STR[Stripe Sandbox]
    PP[PayPal Sandbox]
  end

  U -->|HTTPS| AS
  U --> MP
  U --> GTM
  GTM --> GA4
  AS --> SQL
  AS --> BLOB
  AS --> KV
  AS --> B2C
  AS --> STR
  AS --> PP
  AS --> AI
  AI --> LOG
  AS -->|AddToCart Purchase| MP
  AS -->|ecommerce events| GTM
```

---

## Fluxo de compra

```mermaid
sequenceDiagram
  participant C as Cliente
  participant N as Next.js API
  participant DB as Azure SQL
  participant S as Stripe/PayPal
  participant T as Meta + GTM

  C->>N: Adicionar ao carrinho
  N->>DB: Upsert cart_items
  N->>T: AddToCart
  C->>N: Checkout
  N->>S: Criar PaymentIntent / Order
  S-->>N: client_secret
  C->>S: Confirmar pagamento (sandbox)
  S-->>N: Webhook payment_succeeded
  N->>DB: INSERT orders + order_items
  N->>T: Purchase
  N-->>C: /ordine/confermato
```

---

## Estrutura do projeto

```
burgerking-qualita-clone/
├── docs/FASE2-ARQUITETURA-AZURE.md    ← este arquivo
├── database/
│   ├── schema.sql                     ← DDL Azure SQL
│   └── seed-products.mjs              ← seed 166 produtos BK
├── infra/azure/
│   ├── main.bicep                     ← App Service + SQL + Blob + Insights
│   └── parameters.example.json
└── shop/                              ← Next.js (frontend + API)
    ├── src/app/                       ← App Router (páginas + route handlers)
    ├── src/components/                ← UI fiel ao burgerking.it
    ├── src/lib/                       ← DB, auth, pagamentos, tracking
    └── .env.example
```

---

## Variáveis de ambiente (App Service)

| Variável | Uso |
|----------|-----|
| `DATABASE_URL` | Connection string Azure SQL |
| `AZURE_STORAGE_CONNECTION_STRING` | Blob imagens |
| `NEXTAUTH_SECRET` / `AZURE_AD_B2C_*` | Autenticação |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Pagamento cartão |
| `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` | PayPal sandbox |
| `NEXT_PUBLIC_META_PIXEL_ID` | Facebook Ads |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager |
| `APPLICATIONINSIGHTS_CONNECTION_STRING` | Monitoramento |

---

## Deploy rápido

```bash
# 1. Banco
sqlcmd -S bk-shop-sql.database.windows.net -d bk_shop -U admin -i database/schema.sql
node database/seed-products.mjs

# 2. Infra (opcional)
az deployment group create -g bk-shop-rg -f infra/azure/main.bicep -p infra/azure/parameters.example.json

# 3. App
cd shop && npm install && npm run build
# Publicar zip ou GitHub Actions → App Service
```

---

## Rotas principais

| Rota | Descrição |
|------|-----------|
| `/` | Home (design BK) |
| `/prodotti` | Catálogo |
| `/prodotti/[slug]` | Detalhe produto |
| `/carrello` | Carrinho |
| `/checkout` | Pagamento Stripe + PayPal |
| `/ordine/confermato` | Confirmação + evento Purchase |
| `/admin` | Dashboard |
| `/admin/prodotti` | CRUD produtos |
| `/api/products` | API pública catálogo |
| `/api/admin/products` | API admin (auth) |
| `/api/checkout/stripe` | PaymentIntent |
| `/api/webhooks/stripe` | Confirma pedido |