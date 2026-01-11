-- Migration Script: Update existing 'orders' table to the unified schema

-- 1. Add missing columns to 'orders' table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS tipe_pesanan TEXT DEFAULT 'Rumah',
ADD COLUMN IF NOT EXISTS tipe_properti TEXT,
ADD COLUMN IF NOT EXISTS budget TEXT,
ADD COLUMN IF NOT EXISTS jam_survey TEXT,
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'QRIS';

-- 2. Ensure 'catatan' can be used as 'deskripsi'
-- If you want to rename it:
-- ALTER TABLE orders RENAME COLUMN catatan TO deskripsi;
-- But since code might already use 'deskripsi', and DB has 'catatan', 
-- it's safer to add 'deskripsi' or keep using 'catatan' and map it in the service.
-- Let's add 'deskripsi' for better alignment with the new logic.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS deskripsi TEXT;

-- 3. Modify 'jadwal_survey' to support time if needed (currently date in image)
-- Change date to timestamp with time zone
ALTER TABLE orders 
ALTER COLUMN jadwal_survey TYPE TIMESTAMP WITH TIME ZONE USING jadwal_survey::timestamp with time zone;

-- 4. Create 'dokumentasi' table if not exists
CREATE TABLE IF NOT EXISTS dokumentasi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pesanan_id INTEGER REFERENCES orders(pesanan_id),
    file_url TEXT NOT NULL,
    keterangan TEXT,
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Set up RLS (Row Level Security)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE dokumentasi ENABLE ROW LEVEL SECURITY;

-- 6. Re-create or Update Policies
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own orders" ON orders;
CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (
    EXISTS (SELECT 1 FROM auth.users WHERE auth.uid() = id AND (raw_user_meta_data->>'role' = 'admin'))
);

DROP POLICY IF EXISTS "Users can view documentation for own orders" ON dokumentasi;
CREATE POLICY "Users can view documentation for own orders" ON dokumentasi FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.pesanan_id = dokumentasi.pesanan_id AND orders.user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can insert documentation for own orders" ON dokumentasi;
CREATE POLICY "Users can insert documentation for own orders" ON dokumentasi FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.pesanan_id = dokumentasi.pesanan_id AND orders.user_id = auth.uid())
);
