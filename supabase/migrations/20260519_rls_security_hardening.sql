-- ─────────────────────────────────────────────────────────
-- SUPABASE ROW LEVEL SECURITY (RLS) & DATABASE OPTIMIZATION
-- ─────────────────────────────────────────────────────────

-- 1. Enable RLS on all tenant-specific tables
ALTER TABLE tp_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE tp_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tp_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE tp_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE tp_payments_received ENABLE ROW LEVEL SECURITY;
ALTER TABLE tp_advances ENABLE ROW LEVEL SECURITY;
ALTER TABLE tp_bill_shares ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Users can manage their own profile" ON tp_profile;
DROP POLICY IF EXISTS "Users can manage their own customers" ON tp_customers;
DROP POLICY IF EXISTS "Users can manage their own products" ON tp_products;
DROP POLICY IF EXISTS "Users can manage their own sales" ON tp_sales;
DROP POLICY IF EXISTS "Users can manage their own payments" ON tp_payments_received;
DROP POLICY IF EXISTS "Users can manage their own advances" ON tp_advances;
DROP POLICY IF EXISTS "Users can manage their own bill shares" ON tp_bill_shares;

-- 3. Create comprehensive RLS Policies for Multi-Tenancy isolation

-- TP Profile: Users can only see/edit their own profile (keyed by primary key 'id')
CREATE POLICY "Users can manage their own profile" ON tp_profile
  FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- TP Customers: Users can only see/edit their own customers (keyed by 'user_id')
CREATE POLICY "Users can manage their own customers" ON tp_customers
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- TP Products: Users can only see/edit their own products (keyed by 'user_id')
CREATE POLICY "Users can manage their own products" ON tp_products
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- TP Sales: Users can only see/edit their own sales ledgers (keyed by 'user_id')
CREATE POLICY "Users can manage their own sales" ON tp_sales
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- TP Payments Received: Users can only see/edit their own dynamic statements (keyed by 'user_id')
CREATE POLICY "Users can manage their own payments" ON tp_payments_received
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- TP Advances: Users can only see/edit their own advance transactions (keyed by 'user_id')
CREATE POLICY "Users can manage their own advances" ON tp_advances
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- TP Bill Shares: Users can only see/edit their own shared bills (keyed by 'user_id')
CREATE POLICY "Users can manage their own bill shares" ON tp_bill_shares
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Create Performance Indexes for ultra-fast query times
CREATE INDEX IF NOT EXISTS idx_tp_customers_user_id ON tp_customers(user_id);
CREATE INDEX IF NOT EXISTS idx_tp_products_user_id ON tp_products(user_id);
CREATE INDEX IF NOT EXISTS idx_tp_sales_user_id ON tp_sales(user_id);
CREATE INDEX IF NOT EXISTS idx_tp_sales_customer_id ON tp_sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_tp_payments_received_user_id ON tp_payments_received(user_id);
CREATE INDEX IF NOT EXISTS idx_tp_advances_user_id ON tp_advances(user_id);
CREATE INDEX IF NOT EXISTS idx_tp_bill_shares_user_id ON tp_bill_shares(user_id);

-- 5. Create Materialized Dashboard View for extreme speed
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_tenant_dashboard_stats AS
SELECT 
  user_id,
  COALESCE(SUM(grand_total), 0) as total_sales,
  COALESCE((SELECT SUM(amount) FROM tp_payments_received WHERE tp_payments_received.user_id = tp_sales.user_id), 0) as total_payments
FROM tp_sales
GROUP BY user_id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_tenant_dashboard_stats_user_id ON mv_tenant_dashboard_stats(user_id);

-- 6. Enable Audit Logging
CREATE TABLE IF NOT EXISTS tp_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL,
  table_name VARCHAR(50) NOT NULL,
  row_id UUID,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE tp_audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own audit logs" ON tp_audit_logs;
CREATE POLICY "Users can view their own audit logs" ON tp_audit_logs FOR SELECT USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION log_tenant_action() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO tp_audit_logs (user_id, action, table_name, row_id, old_data, new_data)
  VALUES (
    COALESCE(NEW.user_id, OLD.user_id),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_audit_sales ON tp_sales;
CREATE TRIGGER trg_audit_sales
  AFTER INSERT OR UPDATE OR DELETE ON tp_sales
  FOR EACH ROW EXECUTE FUNCTION log_tenant_action();

DROP TRIGGER IF EXISTS trg_audit_payments ON tp_payments_received;
CREATE TRIGGER trg_audit_payments
  AFTER INSERT OR UPDATE OR DELETE ON tp_payments_received
  FOR EACH ROW EXECUTE FUNCTION log_tenant_action();
