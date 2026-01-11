
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

// Service role key is usually needed for writes if RLS is on, but we'll try with anon key first 
// or assume the user has appropriate policies/service key available.
// Ideally, for a seed script, we should use the SERVICE_ROLE_KEY if RLS blocks anon inserts.
// However, the user provided ANON_KEY in .env.local. I will try to use that.
const supabase = createClient(supabaseUrl, supabaseKey);

const PROJECTS = [
    {
        id: 1,
        category: 'Renovasi',
        title: 'Renovasi Tembok',
        location: 'Tukad Balian, Denpasar, Bali',
        description: 'Pengerjaan 1 Bulan. Renovasi total tembok pembatas dengan finishing batu alam.',
        image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop',
        badgeColor: 'bg-blue-600'
    },
    {
        id: 2,
        category: 'Electrical',
        title: 'Instalasi Kelistrikan',
        location: 'Renon, Denpasar, Bali',
        description: 'Pengerjaan 3 hari, 15 titik lampu. Instalasi baru untuk ruko 2 lantai.',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop',
        badgeColor: 'bg-yellow-500 text-blue-900'
    },
    {
        id: 3,
        category: 'Plumbing',
        title: 'Perbaikan Pipa Bocor',
        location: 'Jimbaran, Badung, Bali',
        description: 'Pengerjaan 4 jam, garansi 1 bulan. Penanganan kebocoran pipa tanam.',
        image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop',
        badgeColor: 'bg-purple-600'
    },
    {
        id: 4,
        category: 'Service AC',
        title: 'Instalasi Air Conditioner',
        location: 'Sanur, Denpasar, Bali',
        description: 'Pengerjaan 2 Unit, Daikin 1PK Inverter. Pemasangan rapi dan vacum.',
        image: 'https://images.unsplash.com/photo-1574359611100-c081e64c3c26?q=80&w=1854&auto=format&fit=crop',
        badgeColor: 'bg-cyan-500'
    },
    {
        id: 5,
        category: 'Renovasi',
        title: 'Bongkar Tembok Open Space',
        location: 'Tukad Balian, Denpasar',
        description: 'Pembongkaran tembok untuk perluasan ruang keluarga modern.',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop',
        badgeColor: 'bg-rose-600'
    },
    {
        id: 6,
        category: 'Electrical',
        title: 'Instalasi Smart Home',
        location: 'Renon, Denpasar',
        description: 'Integrasi sistem kelistrikan pintar dengan kontrol suara.',
        image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=2070&auto=format&fit=crop',
        badgeColor: 'bg-yellow-500 text-blue-900'
    },
    {
        id: 7,
        category: 'Plumbing',
        title: 'Perbaikan Pipa Dapur',
        location: 'Jimbaran, Badung',
        description: 'Penanganan kebocoran pipa sink dapur dengan material anti-karat.',
        image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=2070&auto=format&fit=crop',
        badgeColor: 'bg-blue-600'
    },
    {
        id: 8,
        category: 'Service AC',
        title: 'Instalasi AC Split 2PK',
        location: 'Sanur, Denpasar',
        description: 'Pemasangan unit AC baru dengan jalur pipa tanam estetis.',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop',
        badgeColor: 'bg-cyan-500'
    },
    {
        id: 9,
        category: 'Renovasi',
        title: 'Renovasi Atap',
        location: 'Dalung, Kuta Utara',
        description: 'Restorasi struktur atap dan penggantian genteng keramik.',
        image: 'https://images.unsplash.com/photo-1632759145351-1d592919f522?q=80&w=2070&auto=format&fit=crop',
        badgeColor: 'bg-rose-600'
    },
    {
        id: 10,
        category: 'Service AC',
        title: 'Cuci AC Berkala',
        location: 'Panjer, Denpasar',
        description: 'Deep cleaning unit indoor dan outdoor untuk kualitas udara.',
        image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=2069&auto=format&fit=crop',
        badgeColor: 'bg-cyan-500'
    }
];

async function seed() {
    console.log('Seeding projects...');

    for (const project of PROJECTS) {
        const { error } = await supabase
            .from('portofolio')
            .upsert({
                portofolio_id: project.id,
                judul: project.title,
                kategori: project.category, // Assuming this column exists
                deskripsi: project.description,
                lokasi: project.location,
                cover_image: project.image,
                // layanan_id: 1 // Defaulting if needed, but trying without first
            });

        if (error) {
            console.error(`Error inserting project ${project.id}:`, error);
        } else {
            console.log(`Inserted project ${project.id}: ${project.title}`);
        }
    }

    console.log('Seeding complete.');
}

seed();
