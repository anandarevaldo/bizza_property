import { supabase } from '../supabaseClient';
import { PortfolioItem } from '../../components/portofolio-admin/PortfolioList';

export const portfolioService = {
    getAll: async (): Promise<PortfolioItem[]> => {
        const { data, error } = await supabase
            .from('portofolio')
            .select('*')
            .order('portofolio_id', { ascending: false });

        if (error) {
            console.error('Error fetching portfolio:', error);
            return [];
        }

        return (data || []).map((item: any) => ({
            id: item.portofolio_id.toString(),
            title: item.judul,
            description: item.deskripsi,
            category: item.kategori,
            images: item.images || (item.cover_image ? [item.cover_image] : []),
            date: item.tanggal_selesai || new Date().toISOString().split('T')[0]
        }));
    },

    getById: async (id: string): Promise<PortfolioItem | null> => {
        const { data, error } = await supabase
            .from('portofolio')
            .select('*')
            .eq('portofolio_id', id)
            .single();

        if (error) {
            console.error('Error fetching portfolio by id:', error);
            return null;
        }

        return {
            id: data.portofolio_id.toString(),
            title: data.judul,
            description: data.deskripsi,
            category: data.kategori,
            images: data.images || (data.cover_image ? [data.cover_image] : []),
            date: data.tanggal_selesai || new Date().toISOString().split('T')[0]
        };
    },

    create: async (item: Omit<PortfolioItem, 'id'>): Promise<PortfolioItem | null> => {
        const payload = {
            judul: item.title,
            deskripsi: item.description,
            kategori: item.category,
            images: item.images,
            cover_image: item.images?.[0] || null, // Auto-set cover image 
            tanggal_selesai: item.date
        };

        const { data, error } = await supabase
            .from('portofolio')
            .insert([payload])
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.portofolio_id.toString(),
            title: data.judul,
            description: data.deskripsi,
            category: data.kategori,
            images: data.images || [],
            date: data.tanggal_selesai
        };
    },

    update: async (id: string, item: Partial<PortfolioItem>): Promise<PortfolioItem | null> => {
        const payload: any = {};
        if (item.title !== undefined) payload.judul = item.title;
        if (item.description !== undefined) payload.deskripsi = item.description;
        if (item.category !== undefined) payload.kategori = item.category;
        if (item.images !== undefined) {
            payload.images = item.images;
            if (item.images.length > 0) {
                payload.cover_image = item.images[0];
            }
        }
        if (item.date !== undefined) payload.tanggal_selesai = item.date;

        const { data, error } = await supabase
            .from('portofolio')
            .update(payload)
            .eq('portofolio_id', id)
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.portofolio_id.toString(),
            title: data.judul,
            description: data.deskripsi,
            category: data.kategori,
            images: data.images || [],
            date: data.tanggal_selesai
        };
    },

    delete: async (id: string): Promise<void> => {
        const { error } = await supabase
            .from('portofolio')
            .delete()
            .eq('portofolio_id', id);

        if (error) throw error;
    }
};
