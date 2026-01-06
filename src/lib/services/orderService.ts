
import { supabase } from '../supabaseClient';

export interface CreateOrderParams {
    userId: string;
    propertyType: string;
    description: string;
    address: string;
    budget: string;
    selectedDate: string;
    selectedTime: string;
    paymentMethod: string;
}

export const orderService = {
    async createOrder(data: CreateOrderParams) {
        const { data: order, error } = await supabase
            .from('orders')
            .insert({
                user_id: data.userId,
                alamat_proyek: data.address,
                catatan: data.description,
                tanggal_pesan: new Date().toISOString(),
                jadwal_survey: data.selectedDate ? new Date(data.selectedDate).toISOString() : null,
                status_pesanan: 'ON_PROGRESS', // Default status
                // mandor_id is initially null
                // layanan_id needs to be determined or left null for now
            })
            .select()
            .single();

        if (error) throw error;
        return order;
    },

    async uploadOrderImage(file: File, orderId: string, userId: string) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${orderId}/${Math.random()}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('order-documentation')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('order-documentation')
            .getPublicUrl(filePath);

        return data.publicUrl;
    },

    async createDocumentation(orderId: number, userId: string, fileUrl: string) {
        const { error } = await supabase
            .from('dokumentasi')
            .insert({
                pesanan_id: orderId,
                uploaded_by: userId,
                file_url: fileUrl,
                keterangan: 'Initial order documentation',
            });

        if (error) throw error;
    },

    async getUserOrders(userId: string) {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                layanan:layanan_id (nama_layanan),
                mandor:mandor_id (nama)
            `)
            .eq('user_id', userId)
            .order('tanggal_pesan', { ascending: false });

        if (error) throw error;
        return data;
    },

    async getOrderDetail(orderId: string) {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                layanan:layanan_id (nama_layanan, deskripsi),
                mandor:mandor_id (nama, kontak),
                dokumentasi (*)
            `)
            .eq('pesanan_id', orderId)
            .single();

        if (error) throw error;
        return data;
    },

    async getOrderRAB(orderId: number) {
        const { data, error } = await supabase
            .from('rab_order')
            .select('*')
            .eq('pesanan_id', orderId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    async updateRABStatus(rabId: number, status: 'DISETUJUI' | 'DITOLAK') {
        const { data, error } = await supabase
            .from('rab_order')
            .update({ status_rab: status })
            .eq('rab_id', rabId)
            .select()
            .single();

        if (error) throw error;
        // If approved, we might want to update the order status or trigger notification (omitted for now)
        return data;
    },

    async createPayment(orderId: number, amount: number, method: 'SURVEY' | 'TERMIN', proofFile?: File) {
        // 1. Create Payment Record first
        const { data: payment, error } = await supabase
            .from('payment')
            .insert({
                pesanan_id: orderId,
                jumlah: amount,
                payment_method: method,
                status_pembayaran: 'PENDING', // Waiting verification
                paid_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;

        // 2. If proof file matches, upload it (Optional logic if we had a specific storage for payment proofs)
        // For now, let's assume payment proof is handled like documentation or omitted if just gateway simulation.
        return payment;
    },

    async getPreviousAddresses(userId: string) {
        const { data, error } = await supabase
            .from('orders')
            .select('alamat_proyek')
            .eq('user_id', userId)
            .order('tanggal_pesan', { ascending: false })
            .limit(10); // Fetch last 10 orders to get addresses

        if (error) throw error;

        // Filter unique addresses manually
        const addresses = data.map(o => o.alamat_proyek || '').filter(a => a !== '');
        return [...new Set(addresses)];
    }
};
