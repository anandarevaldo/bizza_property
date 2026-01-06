
import { supabase } from '../supabaseClient';

export interface CreateReviewParams {
    orderId: number;
    userId: string;
    rating: number;
    comment: string;
}

export const reviewService = {
    async createReview(data: CreateReviewParams) {
        const { data: review, error } = await supabase
            .from('ulasan_user')
            .insert({
                pesanan_id: data.orderId,
                client_id: data.userId,
                rating: data.rating,
                komentar: data.comment
            })
            .select()
            .single();

        if (error) throw error;
        return review;
    },

    async getOrderReview(orderId: number) {
        const { data, error } = await supabase
            .from('ulasan_user')
            .select('*')
            .eq('pesanan_id', orderId)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // Ignore 'Not found' error
        return data; // Returns null if not found (which is valid)
    }
};
