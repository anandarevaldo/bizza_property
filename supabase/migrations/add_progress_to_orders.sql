ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0;

-- Optional: Add check constraint to ensure percentage
ALTER TABLE public.orders 
DROP CONSTRAINT IF EXISTS check_progress_percentage;

ALTER TABLE public.orders 
ADD CONSTRAINT check_progress_percentage CHECK (progress >= 0 AND progress <= 100);
