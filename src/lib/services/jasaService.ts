import { supabase } from '../supabaseClient';

// Jasa interface matching the frontend component
export interface Jasa {
    id: string;
    name: string;
    type: 'Harian' | 'Bulanan' | 'Tahunan' | 'Borongan' | 'Satuan';
    price: string;
    priceNumeric?: number;
    description: string;
    status: 'Active' | 'Inactive';
    icon_name?: string;
}

// Database row type (matching Supabase jasa table)
interface JasaDbRow {
    jasa_id: number;
    nama_jasa: string;
    tipe_jasa: string;
    harga: number;
    deskripsi: string;
    status_aktif: boolean;
    icon_name?: string;
    created_at?: string;
    updated_at?: string;
}

// Format price with type suffix
const formatPrice = (price: number, type: string): string => {
    const formatted = `Rp ${price.toLocaleString('id-ID')}`;
    switch (type) {
        case 'Harian': return `${formatted} / hari`;
        case 'Bulanan': return `${formatted} / bulan`;
        case 'Tahunan': return `${formatted} / tahun`;
        case 'Satuan': return `${formatted} / titik`;
        default: return formatted;
    }
};

// Map database row to frontend Jasa object
const mapDbToJasa = (row: JasaDbRow): Jasa => ({
    id: row.jasa_id.toString(),
    name: row.nama_jasa,
    type: row.tipe_jasa as Jasa['type'],
    price: formatPrice(row.harga, row.tipe_jasa),
    priceNumeric: row.harga,
    description: row.deskripsi,
    status: row.status_aktif ? 'Active' : 'Inactive',
    icon_name: row.icon_name,
});

// --- CRUD Operations ---

// GET all jasa
export const getJasaList = async (): Promise<Jasa[]> => {
    const { data, error } = await supabase
        .from('jasa')
        .select('*')
        .order('jasa_id', { ascending: true });

    if (error) {
        console.error('Error fetching jasa:', error);
        return [];
    }

    return (data || []).map(mapDbToJasa);
};

// GET single jasa by ID
export const getJasaById = async (id: string): Promise<Jasa | null> => {
    const { data, error } = await supabase
        .from('jasa')
        .select('*')
        .eq('jasa_id', parseInt(id))
        .single();

    if (error) {
        console.error('Error fetching jasa:', error);
        return null;
    }

    return data ? mapDbToJasa(data) : null;
};

// CREATE new jasa
export const createJasa = async (jasa: Omit<Jasa, 'id'>): Promise<Jasa | null> => {
    // Parse price from formatted string (e.g., "Rp 150.000 / hari" -> 150000)
    let priceValue = jasa.priceNumeric || 0;
    if (!priceValue && jasa.price) {
        const match = jasa.price.replace(/\./g, '').match(/\d+/);
        priceValue = match ? parseInt(match[0]) : 0;
    }

    const { data, error } = await supabase
        .from('jasa')
        .insert({
            nama_jasa: jasa.name,
            tipe_jasa: jasa.type,
            harga: priceValue,
            deskripsi: jasa.description,
            status_aktif: jasa.status === 'Active',
            icon_name: jasa.icon_name || null,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating jasa:', error);
        return null;
    }

    return data ? mapDbToJasa(data) : null;
};

// UPDATE existing jasa
export const updateJasa = async (id: string, updates: Partial<Jasa>): Promise<Jasa | null> => {
    const updateData: Record<string, any> = {};

    if (updates.name !== undefined) updateData.nama_jasa = updates.name;
    if (updates.type !== undefined) updateData.tipe_jasa = updates.type;
    if (updates.description !== undefined) updateData.deskripsi = updates.description;
    if (updates.status !== undefined) updateData.status_aktif = updates.status === 'Active';
    if (updates.icon_name !== undefined) updateData.icon_name = updates.icon_name;

    // Handle price update
    if (updates.priceNumeric !== undefined) {
        updateData.harga = updates.priceNumeric;
    } else if (updates.price !== undefined) {
        const match = updates.price.replace(/\./g, '').match(/\d+/);
        updateData.harga = match ? parseInt(match[0]) : 0;
    }

    const { data, error } = await supabase
        .from('jasa')
        .update(updateData)
        .eq('jasa_id', parseInt(id))
        .select()
        .single();

    if (error) {
        console.error('Error updating jasa:', error);
        return null;
    }

    return data ? mapDbToJasa(data) : null;
};

// DELETE jasa
export const deleteJasa = async (id: string): Promise<boolean> => {
    const { error } = await supabase
        .from('jasa')
        .delete()
        .eq('jasa_id', parseInt(id));

    if (error) {
        console.error('Error deleting jasa:', error);
        return false;
    }

    return true;
};

// Export all functions as a service object
export const jasaService = {
    getAll: getJasaList,
    getById: getJasaById,
    create: createJasa,
    update: updateJasa,
    delete: deleteJasa,
};
