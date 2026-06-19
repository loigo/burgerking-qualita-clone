-- Satispay payment id on orders
IF NOT EXISTS (
  SELECT 1 FROM sys.columns
  WHERE object_id = OBJECT_ID('orders') AND name = 'satispay_payment_id'
)
BEGIN
  ALTER TABLE orders ADD satispay_payment_id NVARCHAR(128) NULL;
  CREATE INDEX IX_orders_satispay ON orders(satispay_payment_id);
END
GO