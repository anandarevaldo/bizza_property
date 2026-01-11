
import { supabase } from '../supabaseClient';

export interface CreateOrderParams {
    userId: string;
    customerName?: string;
    tipe_pesanan?: 'Rumah' | 'Bisnis' | 'Layanan' | 'Tukang';
    propertyType: string;
    description: string;
    address: string;
    budget: string;
    selectedDate: string;
    selectedTime: string;
    paymentMethod: string;
    kategori_layanan?: 'Borongan' | 'Jasa Tukang';
    // status is set automatically to NEED_VALIDATION or ON_PROGRESS depending on logic
}

export const orderService = {
    async createOrder(data: CreateOrderParams) {
        const { data: order, error } = await supabase
            .from('orders')
            .insert({
                user_id: data.userId,
                customer_name: data.customerName,
                tipe_pesanan: data.tipe_pesanan || 'Rumah',
                tipe_properti: data.propertyType,
                deskripsi: data.description,
                alamat_proyek: data.address,
                budget: data.budget,
                jadwal_survey: data.selectedDate ? new Date(data.selectedDate).toISOString() : null,
                jam_survey: data.selectedTime,
                status_pesanan: 'NEED_VALIDATION',
                payment_method: data.paymentMethod,
                tanggal_pesan: new Date().toISOString(),
                kategori_layanan: data.kategori_layanan || 'Borongan',
            })
            .select()
            .single();

        if (error) throw error;
        return order;
    },

    async getAllOrders() {
        // Helper to map DB status to UI status
        const mapStatus = (status: string) => {
            switch (status) {
                case 'ON_PROGRESS': return 'On Progress';
                case 'NEED_VALIDATION': return 'Need Validation';
                case 'DONE': return 'Done';
                case 'CANCEL': return 'Cancel';
                case 'CANCELLED': return 'Cancel'; // Handle legacy
                case 'COMPLETED': return 'Done'; // Handle legacy
                default: return 'Need Validation';
            }
        };

        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                layanan:layanan_id (nama_layanan)
            `)
            .order('tanggal_pesan', { ascending: false });

        if (error) throw error;

        // Map status in the returned data locally if needed, but better to do it in component.
        // However, if component expects raw data, we return raw data.
        // Wait, OrderList.tsx does the mapping itself on line 46!
        // So we just need to return the data here.
        return data;
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

    async createDocumentation(orderId: number, userId: string, fileUrl: string, keterangan = 'Initial order documentation') {
        const { error } = await supabase
            .from('dokumentasi')
            .insert({
                pesanan_id: orderId,
                uploaded_by: userId,
                file_url: fileUrl,
                keterangan: keterangan,
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
