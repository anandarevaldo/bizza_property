import { supabase } from '../supabaseClient';

// Database enum values for status_pesanan
// Database enum: ON_PROGRESS, CANCEL, DONE
// Frontend display: On Progress, Cancel, Done

// Schedule interface matching frontend display
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
    // Original order fields
    tipePesanan?: string;
    tipeProperti?: string;
    kategoriLayanan?: 'Borongan' | 'Jasa Tukang';
}

// Database enum values
export type OrderStatusEnum = 'NEED_VALIDATION' | 'ON_PROGRESS' | 'CANCEL' | 'DONE';

// Map database status to frontend display status
const mapOrderStatus = (status: string): Schedule['status'] => {
    switch (status) {
        case 'ON_PROGRESS': return 'On Progress';
        case 'NEED_VALIDATION': return 'Need Validation';
        case 'CANCEL': return 'Cancel';
        case 'DONE': return 'Done';
        default: return 'Need Validation';
    }
};

// Map frontend display status back to database enum
const mapStatusToDb = (status: Schedule['status']): OrderStatusEnum => {
    switch (status) {
        case 'On Progress': return 'ON_PROGRESS';
        case 'Need Validation': return 'NEED_VALIDATION';
        case 'Cancel': return 'CANCEL';
        case 'Done': return 'DONE';
        default: return 'NEED_VALIDATION';
    }
};

// Map database order row to frontend Schedule
const mapOrderToSchedule = (order: any): Schedule => {
    // Extract date from jadwal_survey
    let dateStr = new Date().toISOString().split('T')[0];
    if (order.jadwal_survey) {
        dateStr = new Date(order.jadwal_survey).toISOString().split('T')[0];
    }

    // Build service name - prioritize layanan name, then parse deskripsi
    let serviceName = 'Layanan Umum';
    if (order.layanan?.nama_layanan) {
        serviceName = order.layanan.nama_layanan;
    } else if (order.deskripsi && order.deskripsi.trim() !== '') {
        // Try to parse "Tukang: Tukang Cat (1). Detail: xxx" format
        const tukangMatch = order.deskripsi.match(/Tukang:\s*([^(]+)/);
        if (tukangMatch && tukangMatch[1]) {
            serviceName = tukangMatch[1].trim();
        } else {
            // Just use deskripsi as-is if can't parse
            serviceName = order.deskripsi.substring(0, 50); // Limit length
        }
    } else if (order.tipe_pesanan) {
        serviceName = `Pesanan ${order.tipe_pesanan}`;
    }

    return {
        id: order.pesanan_id?.toString() || '',
        customerName: order.customer_name || 'Unknown Customer',
        service: serviceName,
        date: dateStr,
        time: order.jam_survey || '09:00',
        address: order.alamat_proyek || '',
        mandor: order.mandor?.nama || 'Belum Ditugaskan',
        mandorId: order.mandor_id || undefined,
        status: mapOrderStatus(order.status_pesanan),
        orderId: order.pesanan_id,
        notes: order.deskripsi,
        budget: order.budget,
        tipePesanan: order.tipe_pesanan,
        tipeProperti: order.tipe_properti,
        kategoriLayanan: order.kategori_layanan || 'Borongan',
    };
};

// --- CRUD Operations (reading from orders table) ---

// GET all schedules (from orders that have jadwal_survey)
export const getSchedules = async (): Promise<Schedule[]> => {
    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            layanan:layanan_id (nama_layanan),
            mandor:mandor_id (nama)
        `)
        .not('jadwal_survey', 'is', null)
        .order('jadwal_survey', { ascending: true });

    if (error) {
        console.error('Error fetching schedules from orders:', error);
        return [];
    }

    return (data || []).map(mapOrderToSchedule);
};

// GET all orders as schedules (including those without jadwal_survey)
export const getAllOrdersAsSchedules = async (): Promise<Schedule[]> => {
    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            layanan:layanan_id (nama_layanan),
            mandor:mandor_id (nama)
        `)
        .order('tanggal_pesan', { ascending: false });

    if (error) {
        console.error('Error fetching orders as schedules:', error);
        return [];
    }

    return (data || []).map(mapOrderToSchedule);
};

// GET schedules by date
export const getSchedulesByDate = async (date: string): Promise<Schedule[]> => {
    // Filter by date portion of jadwal_survey
    const startOfDay = `${date}T00:00:00`;
    const endOfDay = `${date}T23:59:59`;

    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            layanan:layanan_id (nama_layanan),
            mandor:mandor_id (nama)
        `)
        .gte('jadwal_survey', startOfDay)
        .lte('jadwal_survey', endOfDay)
        .order('jam_survey', { ascending: true });

    if (error) {
        console.error('Error fetching schedules by date:', error);
        return [];
    }

    return (data || []).map(mapOrderToSchedule);
};

// GET schedules by mandor
export const getSchedulesByMandor = async (mandorId: number): Promise<Schedule[]> => {
    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            layanan:layanan_id (nama_layanan),
            mandor:mandor_id (nama)
        `)
        .eq('mandor_id', mandorId)
        .not('jadwal_survey', 'is', null)
        .order('jadwal_survey', { ascending: true });

    if (error) {
        console.error('Error fetching schedules by mandor:', error);
        return [];
    }

    return (data || []).map(mapOrderToSchedule);
};

// UPDATE schedule (updates the order)
export const updateSchedule = async (id: string, updates: Partial<Schedule>): Promise<Schedule | null> => {
    const updateData: Record<string, any> = {};

    if (updates.customerName !== undefined) updateData.customer_name = updates.customerName;
    if (updates.address !== undefined) updateData.alamat_proyek = updates.address;
    if (updates.notes !== undefined) updateData.deskripsi = updates.notes;
    if (updates.mandorId !== undefined) updateData.mandor_id = updates.mandorId;
    if (updates.time !== undefined) updateData.jam_survey = updates.time;

    // Map schedule status back to order status using helper
    if (updates.status !== undefined) {
        updateData.status_pesanan = mapStatusToDb(updates.status);
    }

    // Handle date update
    if (updates.date !== undefined) {
        updateData.jadwal_survey = new Date(updates.date).toISOString();
    }

    const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('pesanan_id', parseInt(id))
        .select(`
            *,
            layanan:layanan_id (nama_layanan),
            mandor:mandor_id (nama)
        `)
        .single();

    if (error) {
        console.error('Error updating schedule:', error);
        return null;
    }

    return data ? mapOrderToSchedule(data) : null;
};

// CREATE schedule is actually creating an order (not typically done from schedule view)
// For manual schedule creation, we'd create an order
export const createSchedule = async (schedule: Omit<Schedule, 'id'>): Promise<Schedule | null> => {
    const { data, error } = await supabase
        .from('orders')
        .insert({
            customer_name: schedule.customerName,
            tipe_pesanan: 'Manual',
            deskripsi: schedule.notes || schedule.service,
            alamat_proyek: schedule.address,
            jadwal_survey: schedule.date ? new Date(schedule.date).toISOString() : null,
            jam_survey: schedule.time,
            status_pesanan: 'ON_PROGRESS',
            mandor_id: schedule.mandorId || null,
            tanggal_pesan: new Date().toISOString(),
        })
        .select(`
            *,
            layanan:layanan_id (nama_layanan),
            mandor:mandor_id (nama)
        `)
        .single();

    if (error) {
        console.error('Error creating schedule:', error);
        return null;
    }

    return data ? mapOrderToSchedule(data) : null;
};

// DELETE schedule (deletes the order - use with caution)
export const deleteSchedule = async (id: string): Promise<boolean> => {
    const { error } = await supabase
        .from('orders')
        .delete()
        .eq('pesanan_id', parseInt(id));

    if (error) {
        console.error('Error deleting schedule:', error);
        return false;
    }

    return true;
};

// Export as service object
export const scheduleService = {
    getAll: getSchedules,
    getAllOrders: getAllOrdersAsSchedules,
    getByDate: getSchedulesByDate,
    getByMandor: getSchedulesByMandor,
    create: createSchedule,
    update: updateSchedule,
    delete: deleteSchedule,
};
