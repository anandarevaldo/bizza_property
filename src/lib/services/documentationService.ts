import { supabase } from '../supabaseClient';

export interface Documentation {
    id: string;
    orderId: string;
    uploadedBy: string;
    fileUrl: string;
    description: string;
    uploadedAt: string;
}

export const documentationService = {
    // Get all documentation for a specific order
    getByOrderId: async (orderId: string): Promise<Documentation[]> => {
        const { data, error } = await supabase
            .from('dokumentasi')
            .select('*')
            .eq('pesanan_id', orderId)
            .order('uploaded_at', { ascending: false });

        if (error) {
            console.error('Error fetching documentation:', error);
            return [];
        }

        return data.map((doc: any) => ({
            id: doc.dokumentasi_id.toString(),
            orderId: doc.pesanan_id.toString(),
            uploadedBy: doc.uploaded_by,
            fileUrl: doc.file_url,
            description: doc.keterangan || '',
            uploadedAt: doc.uploaded_at
        }));
    },

    // Upload a new progress proof
    uploadProof: async (file: File, orderId: string, description: string) => {
        // 1. Upload file to Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${orderId}/${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Ensure 'documents' bucket exists
        const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(filePath);

        // 3. Get Current User
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // 4. Insert record into database
        const { data, error } = await supabase
            .from('dokumentasi')
            .insert({
                pesanan_id: parseInt(orderId),
                uploaded_by: user.id,
                file_url: publicUrl,
                keterangan: description
            })
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.dokumentasi_id.toString(),
            orderId: data.pesanan_id.toString(),
            uploadedBy: data.uploaded_by,
            fileUrl: data.file_url,
            description: data.keterangan || '',
            uploadedAt: data.uploaded_at
        };
    },

    // Delete documentation
    delete: async (id: string, fileUrl: string) => {
        // 1. Delete from Storage (extract path from URL)
        const path = fileUrl.split('/documents/')[1];
        if (path) {
            await supabase.storage.from('documents').remove([path]);
        }

        // 2. Delete from DB
        const { error } = await supabase
            .from('dokumentasi')
            .delete()
            .eq('dokumentasi_id', id);

        if (error) throw error;
        return true;
    }
};
