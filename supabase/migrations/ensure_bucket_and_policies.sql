-- 1. Ensure the bucket exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'order-documentation', 
    'order-documentation', 
    true, 
    52428800, -- 50MB limit
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

-- 2. DOKUMENTASI TABLE POLICIES -------------------------

-- Enable RLS
ALTER TABLE public.dokumentasi ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to ensure clean slate
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.dokumentasi;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.dokumentasi;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON public.dokumentasi;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.dokumentasi;

-- Create simple, permissive policies for authenticated users
CREATE POLICY "Enable all for authenticated users"
ON public.dokumentasi
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);


-- 3. STORAGE OBJECTS POLICIES ---------------------------

-- Drop ALL existing policies for this bucket
DROP POLICY IF EXISTS "Enable read access for all users" ON storage.objects;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON storage.objects;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON storage.objects;
DROP POLICY IF EXISTS "Give public access to order-documentation" ON storage.objects;

-- Create Policy for VIEWING (SELECT)
-- Allow anyone to view public bucket contents
CREATE POLICY "Give public access to order-documentation"
ON storage.objects FOR SELECT
USING ( bucket_id = 'order-documentation' );

-- Create Policy for UPLOADING (INSERT)
CREATE POLICY "Enable insert access for authenticated users"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'order-documentation' );

-- Create Policy for UPDATING (UPDATE)
CREATE POLICY "Enable update access for authenticated users"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'order-documentation' );

-- Create Policy for DELETING (DELETE)
CREATE POLICY "Enable delete access for authenticated users"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'order-documentation' );
