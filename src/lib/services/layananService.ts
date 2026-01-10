
import { supabase } from '../supabaseClient';

export interface ServiceData {
    id?: string; // Optional for new records
    name: string;
    category: string;
    description: string;
    price: string; // 'Rp 150.000' formatted string
    priceNumeric: number; // 150000 raw number
    status: 'Active' | 'Inactive';
    icon?: string; // Icon name from Lucide
    imageUrl?: string; // URL from Storage
}

// Database schema mapping helper (internal)
const mapToDb = (data: ServiceData) => ({
    nama_layanan: data.name,
    kategori: data.category,
    deskripsi: data.description,
    harga_mulai: data.priceNumeric,
    status_aktif: data.status === 'Active',
    icon: data.icon || 'Briefcase',
    image_url: data.imageUrl
});

const mapFromDb = (item: any): ServiceData => ({
    id: item.layanan_id.toString(),
    name: item.nama_layanan,
    category: item.kategori,
    price: `Rp ${item.harga_mulai?.toLocaleString('id-ID') || '0'}`,
    priceNumeric: item.harga_mulai,
    description: item.deskripsi,
    status: item.status_aktif ? 'Active' : 'Inactive',
    icon: item.icon || 'Briefcase',
    imageUrl: item.image_url
});

export const layananService = {
    async getAll() {
        const { data, error } = await supabase
            .from('layanan')
            .select('*')
            .order('layanan_id', { ascending: false });

        if (error) throw error;
        return (data || []).map(mapFromDb);
    },

    async create(data: ServiceData) {
        const payload = mapToDb(data);
        const { error } = await supabase
            .from('layanan')
            .insert([payload]);

        if (error) throw error;
        return true;
    },

    async update(id: string, data: ServiceData) {
        const payload = mapToDb(data);
        const { error } = await supabase
            .from('layanan')
            .update(payload)
            .eq('layanan_id', id);

        if (error) throw error;
        return true;
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('layanan')
            .delete()
            .eq('layanan_id', id);

        if (error) throw error;
        return true;
    }
};
