import { supabase } from '../supabaseClient';

// --- User Side (Categories) ---
export interface ServiceItem {
    id: number;
    name: string;
    description: string;
    category?: string;
    icon_name: string;
    color_class: string;
    bg_gradient: string;
    pattern_color: string;
}

const DEFAULT_STYLE = { icon_name: 'Home', color_class: 'text-gray-600', bg_gradient: 'from-gray-50 to-gray-100', pattern_color: '#4b5563' };

export const getServices = async (): Promise<ServiceItem[]> => {
    // Query the 'layanan' table
    // Now selecting styling columns directly
    const { data, error } = await supabase
        .from('layanan')
        .select('layanan_id, nama_layanan, deskripsi, kategori, icon_name, color_class, bg_gradient, pattern_color')
        .order('layanan_id', { ascending: true });

    if (error) {
        console.error('Error fetching services:', error);
        return [];
    }

    if (!data) return [];

    // Map DB columns to ServiceItem
    return data.map((item: any) => {
        return {
            id: item.layanan_id,
            name: item.nama_layanan,
            description: item.deskripsi,
            category: item.kategori,
            icon_name: item.icon_name || DEFAULT_STYLE.icon_name,
            color_class: item.color_class || DEFAULT_STYLE.color_class,
            bg_gradient: item.bg_gradient || DEFAULT_STYLE.bg_gradient,
            pattern_color: item.pattern_color || DEFAULT_STYLE.pattern_color
        };
    });
};

// --- Admin Side (Services/Jasa) ---
// Restoring likely structure based on ServiceList.tsx usage

export type ServiceData = {
    id?: string;
    name: string;
    category: string;
    price: string;
    priceNumeric?: number;
    description: string;
    status: 'Active' | 'Inactive';
    imageUrl?: string;
    icon?: string;
    // Optional styling fields if we want to support them in Admin later
    color_class?: string;
    bg_gradient?: string;
    pattern_color?: string;
};

// Helper to map DB result to Admin ServiceData
const mapDbToAdmin = (item: any): ServiceData => ({
    id: item.layanan_id?.toString(),
    name: item.nama_layanan,
    category: item.kategori,
    price: `Rp ${item.harga_mulai?.toLocaleString('id-ID') || '0'}`,
    priceNumeric: item.harga_mulai,
    description: item.deskripsi,
    status: item.status_aktif ? 'Active' : 'Inactive',
    icon: item.icon_name,
    color_class: item.color_class,
    bg_gradient: item.bg_gradient,
    pattern_color: item.pattern_color
});

// Helper to map Admin ServiceData to DB Payload
const mapAdminToDb = (service: ServiceData) => {
    // Basic mapping
    const payload: any = {
        nama_layanan: service.name,
        kategori: service.category,
        deskripsi: service.description,
        harga_mulai: service.priceNumeric,
        status_aktif: service.status === 'Active',
        icon_name: service.icon,
    };

    // Only update styling if provided, otherwise let DB defaults (if any) or existing logic handle it.
    // Since Admin UI doesn't have color pickers yet, we preserve existing logic effectively.
    if (service.color_class) payload.color_class = service.color_class;
    if (service.bg_gradient) payload.bg_gradient = service.bg_gradient;
    if (service.pattern_color) payload.pattern_color = service.pattern_color;

    return payload;
};

export const layananService = {
    getAll: async (): Promise<ServiceData[]> => {
        const { data, error } = await supabase
            .from('layanan')
            .select('*')
            .order('layanan_id', { ascending: false });

        if (error) {
            console.error('Error fetching layanan (admin):', error);
            return [];
        }
        return (data || []).map(mapDbToAdmin);
    },

    getById: async (id: string): Promise<ServiceData | null> => {
        const { data, error } = await supabase
            .from('layanan')
            .select('*')
            .eq('layanan_id', id)
            .single();

        if (error) {
            console.error('Error fetching layanan by id:', error);
            return null;
        }
        return mapDbToAdmin(data);
    },

    create: async (service: ServiceData): Promise<ServiceData | null> => {
        const payload = mapAdminToDb(service);

        // Auto-assign random styling if missing (simple round-robin or random logic could go here, 
        // but for now we rely on DB defaults or simple nulls)

        const { data, error } = await supabase
            .from('layanan')
            .insert([payload])
            .select()
            .single();

        if (error) throw error;
        return mapDbToAdmin(data);
    },

    update: async (id: string, service: Partial<ServiceData>): Promise<ServiceData | null> => {
        const payload: any = {};
        if (service.name !== undefined) payload.nama_layanan = service.name;
        if (service.category !== undefined) payload.kategori = service.category;
        if (service.description !== undefined) payload.deskripsi = service.description;
        if (service.priceNumeric !== undefined) payload.harga_mulai = service.priceNumeric;
        if (service.status !== undefined) payload.status_aktif = service.status === 'Active';
        if (service.icon !== undefined) payload.icon_name = service.icon;
        if (service.color_class !== undefined) payload.color_class = service.color_class;
        if (service.bg_gradient !== undefined) payload.bg_gradient = service.bg_gradient;
        if (service.pattern_color !== undefined) payload.pattern_color = service.pattern_color;

        const { data, error } = await supabase
            .from('layanan')
            .update(payload)
            .eq('layanan_id', id) // Assuming layana_id is numeric or string compatible
            .select()
            .single();

        if (error) throw error;
        return mapDbToAdmin(data);
    },

    delete: async (id: string): Promise<void> => {
        const { error } = await supabase
            .from('layanan')
            .delete()
            .eq('layanan_id', id);

        if (error) throw error;
    }
};
