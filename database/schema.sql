/* ==========================================================================
   Burger King Italia — Loja Virtual Fase 2
   Azure SQL Database
   ========================================================================== */

-- Categorias (Best Seller, Manzo, Pollo, etc.)
CREATE TABLE categories (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    [key]         NVARCHAR(64)  NOT NULL UNIQUE,
    title         NVARCHAR(128) NOT NULL,
    description   NVARCHAR(MAX) NULL,
    image_url     NVARCHAR(512) NULL,
    sort_order    INT           NOT NULL DEFAULT 0,
    is_active     BIT           NOT NULL DEFAULT 1,
    created_at    DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
    updated_at    DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME()
);

-- Produtos (catálogo fiel burgerking.it)
CREATE TABLE products (
    id              INT IDENTITY(1,1) PRIMARY KEY,
    slug            NVARCHAR(128)  NOT NULL UNIQUE,
    title           NVARCHAR(256)  NOT NULL,
    description     NVARCHAR(MAX)  NULL,
    thumb_url       NVARCHAR(512)  NULL,
    main_image_url  NVARCHAR(512)  NULL,
    hero_image_url  NVARCHAR(512)  NULL,
    blob_thumb_url  NVARCHAR(512)  NULL,  -- Azure Blob (opcional, substitui CDN)
    price_cents     INT            NOT NULL DEFAULT 0,
    currency        CHAR(3)        NOT NULL DEFAULT 'EUR',
    is_active       BIT            NOT NULL DEFAULT 1,
    is_featured     BIT            NOT NULL DEFAULT 0,
    metadata_json   NVARCHAR(MAX)  NULL,   -- ingredienti, allergeni
    created_at      DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME(),
    updated_at      DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE product_categories (
    product_id   INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    category_id  INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

-- Utilizadores (NextAuth / Azure AD B2C)
CREATE TABLE users (
    id            NVARCHAR(128) PRIMARY KEY,
    email         NVARCHAR(256) NOT NULL UNIQUE,
    name          NVARCHAR(256) NULL,
    role          NVARCHAR(32)  NOT NULL DEFAULT 'customer', -- customer | admin
    created_at    DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME()
);

-- Carrinho (sessão ou utilizador autenticado)
CREATE TABLE carts (
    id            UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id       NVARCHAR(128) NULL REFERENCES users(id),
    session_id    NVARCHAR(128) NULL,
    created_at    DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    updated_at    DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE cart_items (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    cart_id       UNIQUEIDENTIFIER NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id    INT NOT NULL REFERENCES products(id),
    quantity      INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price_cents INT NOT NULL,
    created_at    DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UNIQUE (cart_id, product_id)
);

-- Pedidos
CREATE TABLE orders (
    id                UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    order_number      NVARCHAR(32) NOT NULL UNIQUE,
    user_id           NVARCHAR(128) NULL REFERENCES users(id),
    email             NVARCHAR(256) NOT NULL,
    status            NVARCHAR(32)  NOT NULL DEFAULT 'pending',
    -- pending | paid | shipped | failed | refunded | cancelled
    subtotal_cents    INT NOT NULL,
    tax_cents         INT NOT NULL DEFAULT 0,
    total_cents       INT NOT NULL,
    currency          CHAR(3) NOT NULL DEFAULT 'EUR',
    payment_provider  NVARCHAR(32) NULL,  -- stripe | paypal
    payment_intent_id NVARCHAR(128) NULL,
    paypal_order_id   NVARCHAR(128) NULL,
    satispay_payment_id NVARCHAR(128) NULL,
    shipping_name     NVARCHAR(256) NULL,
    shipping_address  NVARCHAR(512) NULL,
    created_at        DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    paid_at           DATETIME2 NULL
);

CREATE TABLE order_items (
    id               INT IDENTITY(1,1) PRIMARY KEY,
    order_id         UNIQUEIDENTIFIER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id       INT NOT NULL REFERENCES products(id),
    product_title    NVARCHAR(256) NOT NULL,
    product_slug     NVARCHAR(128) NOT NULL,
    quantity         INT NOT NULL,
    unit_price_cents INT NOT NULL,
    line_total_cents INT NOT NULL
);

-- Auditoria admin
CREATE TABLE admin_audit_log (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    user_id     NVARCHAR(128) NOT NULL,
    action      NVARCHAR(64)  NOT NULL,
    entity      NVARCHAR(64)  NOT NULL,
    entity_id   NVARCHAR(128) NULL,
    payload     NVARCHAR(MAX) NULL,
    created_at  DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

-- Configurações do site (nome, logo, moeda)
CREATE TABLE site_settings (
    [key]         NVARCHAR(64)  PRIMARY KEY,
    value         NVARCHAR(MAX) NOT NULL,
    updated_at    DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME()
);

INSERT INTO site_settings ([key], value) VALUES
    ('site_name', 'Burger King Italia'),
    ('currency', 'EUR'),
    ('logo_url', 'https://www.burgerking.it/assets/images/logo-bk.svg'),
    ('support_email', 'ordini@burgerking.it');

-- Carrinhos abandonados (tracking real)
CREATE TABLE abandoned_carts (
    id            UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    session_id    NVARCHAR(128) NOT NULL,
    email         NVARCHAR(256) NULL,
    items_json    NVARCHAR(MAX) NOT NULL,
    total_cents   INT NOT NULL DEFAULT 0,
    recovered     BIT NOT NULL DEFAULT 0,
    created_at    DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    updated_at    DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

-- Índices
CREATE INDEX IX_products_slug ON products(slug);
CREATE INDEX IX_products_active ON products(is_active);
CREATE INDEX IX_orders_status ON orders(status);
CREATE INDEX IX_orders_email ON orders(email);
CREATE INDEX IX_cart_items_cart ON cart_items(cart_id);
CREATE UNIQUE INDEX IX_abandoned_carts_session ON abandoned_carts(session_id);
CREATE INDEX IX_abandoned_carts_recovered ON abandoned_carts(recovered, updated_at);

-- View para relatórios GA4 / admin
CREATE VIEW vw_order_summary AS
SELECT
    o.id,
    o.order_number,
    o.email,
    o.status,
    o.total_cents,
    o.currency,
    o.payment_provider,
    o.created_at,
    o.paid_at,
    COUNT(oi.id) AS item_count
FROM orders o
LEFT JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id, o.order_number, o.email, o.status, o.total_cents, o.currency,
         o.payment_provider, o.created_at, o.paid_at;