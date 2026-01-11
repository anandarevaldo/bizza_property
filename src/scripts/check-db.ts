
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function checkLayanan() {
    const { data, error } = await supabase.from('layanan').select('*');
    if (error) console.error(error);
    else {
        console.log(`Found ${data.length} services.`);
        const categories = Array.from(new Set(data.map(s => s.kategori)));
        console.log('Categories in DB:', categories);
    }
}

checkLayanan();
