-- Promoções
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'promotions')
BEGIN
  CREATE TABLE promotions (
    id              INT IDENTITY(1,1) PRIMARY KEY,
    code            NVARCHAR(64)  NOT NULL UNIQUE,
    title           NVARCHAR(256) NOT NULL,
    discount_type   NVARCHAR(16)  NOT NULL,
    discount_value  INT NOT NULL,
    starts_at       DATETIME2 NULL,
    ends_at         DATETIME2 NULL,
    is_active       BIT NOT NULL DEFAULT 1,
    usage_limit     INT NULL,
    usage_count     INT NOT NULL DEFAULT 0,
    created_at      DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    updated_at      DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
  );
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('orders') AND name = 'satispay_payment_id')
BEGIN
  ALTER TABLE orders ADD satispay_payment_id NVARCHAR(128) NULL;
END
GO