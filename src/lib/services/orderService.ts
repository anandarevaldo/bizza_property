
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
                layanan:layanan_id (nama_layanan),
                mandor:mandor_id (nama),
                handyman:tukang_id (nama, keahlian),
                assignments:order_assignments (
                    anggota:data_anggota (
                        anggota_id,
                        nama,
                        keahlian
                    )
                )
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

    async updateOrderAssignments(orderId: number, handymanIds: number[]) {
        // 1. Delete existing assignments for this order
        const { error: deleteError } = await supabase
            .from('order_assignments')
            .delete()
            .eq('pesanan_id', orderId);

        if (deleteError) throw deleteError;

        // 2. Insert new assignments
        if (handymanIds.length > 0) {
            const updates = handymanIds.map(id => ({
                pesanan_id: orderId,
                anggota_id: id
            }));

            const { error: insertError } = await supabase
                .from('order_assignments')
                .insert(updates);

            if (insertError) throw insertError;
        }

        // 3. IMPORTANT: Update the legacy 'tukang_id' column for backward compatibility 
        // with Admin views I haven't updated yet, picking the first one or null.
        // Also updates timestamp/trigger if any.
        const firstId = handymanIds.length > 0 ? handymanIds[0] : null;
        await this.updateOrder(orderId, { tukang_id: firstId });
    },

    async updateOrder(orderId: string | number, updates: {
        status_pesanan?: string;
        mandor_id?: number | null;
        tukang_id?: number | null;
        jadwal_survey?: string;
        jam_survey?: string;
        customer_name?: string;
        alamat_proyek?: string;
        progress?: number;
        payment_proof?: string;
    }) {
        const { data, error } = await supabase
            .from('orders')
            .update(updates)
            .eq('pesanan_id', orderId)
            .select()
            .single();

        if (error) throw error;
        return data;
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
    },

    async getMyMandorOrders() {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        // Fallback for Mock/Dev Mode if Auth fails or mock login is used
        if (userError || !user) {
            console.warn('Authentication failed or missing. Using Fallback Mandor ID: 1');

            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    layanan:layanan_id (nama_layanan),
                    mandor:mandor_id (nama),
                    assignments:order_assignments (
                        anggota:data_anggota (
                            anggota_id,
                            nama,
                            keahlian
                        )
                    )
                `)
                .eq('mandor_id', 1)
                .order('tanggal_pesan', { ascending: false });

            if (error) throw error;
            return data;
        }

        // Real Auth Flow
        const { data: mandorData, error: mandorError } = await supabase
            .from('data_mandor')
            .select('mandor_id')
            .eq('user_id', user.id)
            .single();

        if (mandorError || !mandorData) {
            console.error('Error fetching mandor profile:', mandorError);
            return [];
        }

        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                layanan:layanan_id (nama_layanan),
                mandor:mandor_id (nama),
                assignments:order_assignments (
                    anggota:data_anggota (
                        anggota_id,
                        nama,
                        keahlian
                    )
                )
            `)
            .eq('mandor_id', mandorData.mandor_id)
            .order('tanggal_pesan', { ascending: false });

        if (error) throw error;
        return data;
    }
};
