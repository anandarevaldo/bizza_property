-- Enable RLS on the table
ALTER TABLE public.dokumentasi ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to select/view documentation
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.dokumentasi;
CREATE POLICY "Enable read access for authenticated users"
ON public.dokumentasi FOR SELECT
TO authenticated
USING (true);

-- Allow all authenticated users to insert documentation
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.dokumentasi;
CREATE POLICY "Enable insert access for authenticated users"
ON public.dokumentasi FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow all authenticated users to delete documentation
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON public.dokumentasi;
CREATE POLICY "Enable delete access for authenticated users"
ON public.dokumentasi FOR DELETE
TO authenticated
USING (true);

-- STORAGE POLICIES for 'order-documentation' bucket

-- Ensure bucket exists (idempotent usually treated in storage schema but good to have policy)
-- Note: We cannot create bucket via SQL easily in standard migrations without raw functions, 
-- but we can set policies.

-- Policy for SELECT (View)
DROP POLICY IF EXISTS "Enable read access for all users" ON storage.objects;
CREATE POLICY "Enable read access for all users"
ON storage.objects FOR SELECT
USING ( bucket_id = 'order-documentation' );

-- Policy for INSERT (Upload)
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON storage.objects;
CREATE POLICY "Enable insert access for authenticated users"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'order-documentation' );

-- Policy for DELETE
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON storage.objects;
CREATE POLICY "Enable delete access for authenticated users"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'order-documentation' );
