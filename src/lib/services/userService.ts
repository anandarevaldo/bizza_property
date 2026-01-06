
import { supabase } from '../supabaseClient';

export interface UserProfile {
    user_id: string;
    nama: string;
    email: string;
    no_hp: string;
    alamat: string | null;
    role: 'CLIENT' | 'MANDOR' | 'ADMIN' | 'OWNER';
    avatar_url: string | null;
}

export const userService = {
    async getUserProfile(userId: string) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) throw error;
        return data as UserProfile;
    },

    async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async uploadAvatar(userId: string, file: File) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/avatar.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload to 'avatars' bucket (ensure this bucket exists in Supabase)
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        // Update profile with new avatar URL
        await this.updateUserProfile(userId, { avatar_url: data.publicUrl } as any);

        return data.publicUrl;
    }
};
