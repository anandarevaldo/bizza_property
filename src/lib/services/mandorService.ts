import { supabase } from '../supabaseClient';
import { Mandor } from '../../components/dashboard-admin/types';

export const mandorService = {
    getAll: async (): Promise<Mandor[]> => {
        const { data, error } = await supabase
            .from('data_mandor')
            .select('*')
            .order('mandor_id', { ascending: true });

        if (error) {
            console.error('Error fetching mandor:', error);
            return [];
        }

        return (data || []).map((item: any) => {
            // Determine status string from status_aktif and status_operasional
            let computedStatus: 'Available' | 'Busy' | 'Off' = 'Off';
            if (item.status_aktif) {
                computedStatus = (item.status_operasional as 'Available' | 'Busy') || 'Available';
            }

            return {
                id: item.mandor_id.toString(),
                name: item.nama,
                specialty: item.keahlian || 'Umum',
                rating: Number(item.rating || 0),
                location: item.lokasi_basis || '',
                detailedLocation: item.alamat_lengkap || '',
                phone: item.kontak || '',
                status: computedStatus,
                totalProjects: item.total_proyek || 0
            };
        });
    },

    getById: async (id: string): Promise<Mandor | null> => {
        const { data, error } = await supabase
            .from('data_mandor')
            .select('*')
            .eq('mandor_id', id)
            .single();

        if (error) {
            console.error('Error fetching mandor by id:', error);
            return null;
        }

        let computedStatus: 'Available' | 'Busy' | 'Off' = 'Off';
        if (data.status_aktif) {
            computedStatus = (data.status_operasional as 'Available' | 'Busy') || 'Available';
        }

        return {
            id: data.mandor_id.toString(),
            name: data.nama,
            specialty: data.keahlian || 'Umum',
            rating: Number(data.rating || 0),
            location: data.lokasi_basis || '',
            detailedLocation: data.alamat_lengkap || '',
            phone: data.kontak || '',
            status: computedStatus,
            totalProjects: data.total_proyek || 0
        };
    },

    create: async (mandor: Omit<Mandor, 'id'>): Promise<Mandor | null> => {
        // Map frontend "status" back to DB fields
        const isActive = mandor.status !== 'Off';
        const operationalStatus = mandor.status === 'Off' ? 'Available' : mandor.status;
        // fallback to Available if Off, so when turned Active it defaults to Available.

        const payload = {
            nama: mandor.name,
            keahlian: mandor.specialty,
            lokasi_basis: mandor.location,
            alamat_lengkap: mandor.detailedLocation,
            kontak: mandor.phone,
            rating: mandor.rating,
            total_proyek: mandor.totalProjects,
            status_aktif: isActive,
            status_operasional: operationalStatus
        };

        const { data, error } = await supabase
            .from('data_mandor')
            .insert([payload])
            .select()
            .single();

        if (error) throw error;

        // Map back to frontend
        let computedStatus: 'Available' | 'Busy' | 'Off' = 'Off';
        if (data.status_aktif) {
            computedStatus = (data.status_operasional as 'Available' | 'Busy') || 'Available';
        }

        return {
            id: data.mandor_id.toString(),
            name: data.nama,
            specialty: data.keahlian,
            rating: Number(data.rating),
            location: data.lokasi_basis,
            detailedLocation: data.alamat_lengkap,
            phone: data.kontak,
            status: computedStatus,
            totalProjects: data.total_proyek
        };
    },

    update: async (id: string, mandor: Partial<Mandor>): Promise<Mandor | null> => {
        const payload: any = {};
        if (mandor.name !== undefined) payload.nama = mandor.name;
        if (mandor.specialty !== undefined) payload.keahlian = mandor.specialty;
        if (mandor.location !== undefined) payload.lokasi_basis = mandor.location;
        if (mandor.detailedLocation !== undefined) payload.alamat_lengkap = mandor.detailedLocation;
        if (mandor.phone !== undefined) payload.kontak = mandor.phone;
        if (mandor.rating !== undefined) payload.rating = mandor.rating;
        if (mandor.totalProjects !== undefined) payload.total_proyek = mandor.totalProjects;

        if (mandor.status !== undefined) {
            payload.status_aktif = mandor.status !== 'Off';
            if (mandor.status !== 'Off') {
                payload.status_operasional = mandor.status;
            }
        }

        const { data, error } = await supabase
            .from('data_mandor')
            .update(payload)
            .eq('mandor_id', id)
            .select()
            .single();

        if (error) throw error;

        let computedStatus: 'Available' | 'Busy' | 'Off' = 'Off';
        if (data.status_aktif) {
            computedStatus = (data.status_operasional as 'Available' | 'Busy') || 'Available';
        }

        return {
            id: data.mandor_id.toString(),
            name: data.nama,
            specialty: data.keahlian,
            rating: Number(data.rating),
            location: data.lokasi_basis,
            detailedLocation: data.alamat_lengkap,
            phone: data.kontak,
            status: computedStatus,
            totalProjects: data.total_proyek
        };
    },

    delete: async (id: string): Promise<void> => {
        const { error } = await supabase
            .from('data_mandor')
            .delete()
            .eq('mandor_id', id);

        if (error) throw error;
    }
};
