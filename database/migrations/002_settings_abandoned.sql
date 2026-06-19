-- Migration 002: site_settings + abandoned_carts

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'site_settings')
BEGIN
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
END

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'abandoned_carts')
BEGIN
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
  CREATE UNIQUE INDEX IX_abandoned_carts_session ON abandoned_carts(session_id);
  CREATE INDEX IX_abandoned_carts_recovered ON abandoned_carts(recovered, updated_at);
END