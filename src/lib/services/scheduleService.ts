import { supabase } from '../supabaseClient';

export interface Schedule {
    id: string;
    customerName: string;
    service: string;
    date: string;
    time: string;
    address: string;
    mandor: string;
    mandorId?: number;
    status: 'Need Validation' | 'On Progress' | 'Cancel' | 'Done';
    orderId?: number;
    notes?: string;
    budget?: string;
    tipePesanan?: string;
    tipeProperti?: string;
    kategoriLayanan?: 'Borongan' | 'Jasa Tukang';
    assignedHandymanId?: number;
    assignedHandymen?: { id: number; name: string; knownSkill?: string }[];
    handymanName?: string;
    handymanSkill?: string;
}

export const scheduleService = {
    getAll: async (): Promise<Schedule[]> => {
        const { data, error } = await supabase
            .from('jadwal')
            .select('*, data_anggota(nama)')
            .order('tanggal', { ascending: false });

        if (error) {
            console.error('Error fetching schedules:', error);
            return [];
        }

        return data.map(mapToSchedule);
    },

    getByMandor: async (mandorId: number): Promise<Schedule[]> => {
        const { data, error } = await supabase
            .from('jadwal')
            .select('*, data_anggota(nama)')
            .eq('mandor_id', mandorId)
            .order('tanggal', { ascending: false });

        if (error) {
            console.error('Error fetching schedules for mandor:', error);
            return [];
        }

        return data.map(mapToSchedule);
    },

    // ... inside create and update, usually need to return single with join too, or just basic. 
    // For simplicity, let's update mapToSchedule first. 

    create: async (schedule: Partial<Schedule>) => {
        const { data, error } = await supabase
            .from('jadwal')
            .insert({
                nama_customer: schedule.customerName,
                layanan: schedule.service,
                tanggal: schedule.date,
                jam: schedule.time,
                alamat: schedule.address || '',
                nama_mandor: schedule.mandor,
                mandor_id: schedule.mandorId,
                status: schedule.status, // Allow saving 'Need Validation' if needed, but UI will restrict
                catatan: schedule.notes,
                kategori_layanan: schedule.kategoriLayanan || 'Borongan',
                anggota_id: schedule.assignedHandymanId
            })
            .select()
            .single();

        if (error) throw error;
        return mapToSchedule(data);
    },

    update: async (id: string, updates: Partial<Schedule>) => {
        const updatePayload: any = {};
        if (updates.date) updatePayload.tanggal = updates.date;
        if (updates.time) updatePayload.jam = updates.time;
        if (updates.status) updatePayload.status = updates.status;
        if (updates.mandorId) updatePayload.mandor_id = updates.mandorId;
        if (updates.mandor) updatePayload.nama_mandor = updates.mandor;
        if (updates.customerName) updatePayload.nama_customer = updates.customerName;
        if (updates.service) updatePayload.layanan = updates.service;
        if (updates.address) updatePayload.alamat = updates.address;

        // Add new fields to update payload if needed, e.g. anggota_id
        if (updates.assignedHandymanId) updatePayload.anggota_id = updates.assignedHandymanId;

        if (Object.keys(updatePayload).length === 0) return null;

        const { data, error } = await supabase
            .from('jadwal')
            .update(updatePayload)
            .eq('jadwal_id', id)
            .select()
            .single();

        if (error) throw error;
        return mapToSchedule(data);
    },

    getMySchedules: async (): Promise<Schedule[]> => {
        // 1. Get current logged in user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.error('Error getting user:', userError);
            throw new Error('Not authenticated');
        }

        // 2. Get mandor_id from data_mandor
        const { data: mandorData, error: mandorError } = await supabase
            .from('data_mandor')
            .select('mandor_id')
            .eq('user_id', user.id)
            .single();

        if (mandorError || !mandorData) {
            console.error('Error fetching mandor profile:', mandorError);
            // Return empty if not a mandor (or throw custom error)
            return [];
        }

        // 3. Fetch schedules for this mandor
        return scheduleService.getByMandor(mandorData.mandor_id);
    }
};

function mapToSchedule(dbRecord: any): Schedule {
    return {
        id: dbRecord.jadwal_id?.toString(),
        customerName: dbRecord.nama_customer || 'Unknown',
        service: dbRecord.layanan || 'Service',
        date: dbRecord.tanggal,
        time: dbRecord.jam || '09:00',
        address: dbRecord.alamat || '',
        mandor: dbRecord.nama_mandor || 'Belum Ditugaskan',
        mandorId: dbRecord.mandor_id,
        status: dbRecord.status as any || 'Need Validation',
        orderId: dbRecord.pesanan_id,
        notes: dbRecord.catatan,
        budget: undefined,
        tipePesanan: undefined,
        tipeProperti: undefined,
        kategoriLayanan: dbRecord.kategori_layanan || 'Borongan',
        assignedHandymanId: dbRecord.anggota_id,
        handymanName: dbRecord.data_anggota?.nama
    };
}

function mapStatusToDb(status?: string): string {
    switch (status) {
        case 'Need Validation': return 'NEED_VALIDATION';
        case 'On Progress': return 'ON_PROGRESS';
        case 'Done': return 'DONE';
        case 'Cancel': return 'CANCELLED';
        default: return 'NEED_VALIDATION';
    }
}

function mapStatusFromDb(status: string): 'Need Validation' | 'On Progress' | 'Cancel' | 'Done' {
    switch (status) {
        case 'NEED_VALIDATION': return 'Need Validation';
        case 'ON_PROGRESS': return 'On Progress';
        case 'DONE': return 'Done';
        case 'CANCELLED': return 'Cancel';
        default: return 'Need Validation';
    }
}
