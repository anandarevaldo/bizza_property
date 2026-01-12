-- 1. Disable RLS on the table (Ultimate Fix for Table Insert)
ALTER TABLE public.dokumentasi DISABLE ROW LEVEL SECURITY;

-- 2. Storage Policies for PUBLIC (Anon) access ---------------------------

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public select order-documentation" ON storage.objects;
DROP POLICY IF EXISTS "Public insert order-documentation" ON storage.objects;
DROP POLICY IF EXISTS "Public update order-documentation" ON storage.objects;
DROP POLICY IF EXISTS "Public delete order-documentation" ON storage.objects;

-- Create Policy for VIC (View, Insert, Change/Update, Delete) for PUBLIC (anon)
-- This allows anyone to upload if they know the bucket ID.
-- Use this ONLY for debugging or if strict auth is failing.

CREATE POLICY "Public select order-documentation"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'order-documentation' );

CREATE POLICY "Public insert order-documentation"
ON storage.objects FOR INSERT
TO public
WITH CHECK ( bucket_id = 'order-documentation' );

CREATE POLICY "Public update order-documentation"
ON storage.objects FOR UPDATE
TO public
USING ( bucket_id = 'order-documentation' );

CREATE POLICY "Public delete order-documentation"
ON storage.objects FOR DELETE
TO public
USING ( bucket_id = 'order-documentation' );
