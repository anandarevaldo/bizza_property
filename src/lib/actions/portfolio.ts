
'use server';

import { supabase } from '@/lib/supabaseClient';

export interface Project {
    id: number;
    category: string;
    title: string;
    description: string;
    location: string;
    image: string;
    galleryImages: string[];
    badgeColor: string;
}

export async function getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
        .from('portofolio')
        .select('*')
        .order('portofolio_id', { ascending: true });

    if (error) {
        console.error('Error fetching projects:', error);
        return [];
    }

    return data.map((item: any) => ({
        id: item.portofolio_id,
        category: item.kategori || 'Uncategorized', // Fallback if column empty
        title: item.judul,
        description: item.deskripsi,
        location: item.lokasi,
        image: item.cover_image,
        galleryImages: item.gallery_images || [item.cover_image], // Fallback to cover image if empty
        badgeColor: getBadgeColor(item.kategori)
    }));
}

export async function getProjectById(id: number): Promise<Project | null> {
    const { data, error } = await supabase
        .from('portofolio')
        .select('*')
        .eq('portofolio_id', id)
        .single();

    if (error) {
        console.error(`Error fetching project ${id}:`, error);
        return null;
    }

    return {
        id: data.portofolio_id,
        category: data.kategori || 'Uncategorized',
        title: data.judul,
        description: data.deskripsi,
        location: data.lokasi,
        image: data.cover_image,
        galleryImages: data.gallery_images || [data.cover_image],
        badgeColor: getBadgeColor(data.kategori)
    };
}

function getBadgeColor(category: string): string {
    switch (category) {
        case 'Renovasi': return 'bg-blue-600';
        case 'Service AC': return 'bg-cyan-500';
        case 'Electrical': return 'bg-yellow-500 text-blue-900';
        case 'Plumbing': return 'bg-purple-600'; // Or 'bg-blue-600' as in one item
        case 'Pengecatan': return 'bg-orange-500'; // Default guess
        default: return 'bg-gray-600';
    }
}
