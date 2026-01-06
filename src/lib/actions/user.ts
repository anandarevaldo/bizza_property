
'use server'

import { userService } from '../services/userService';

export async function updateUserProfile(formData: FormData) {
    try {
        const userId = formData.get('userId') as string;
        if (!userId) throw new Error('User ID is required');

        const updates = {
            nama: formData.get('nama') as string,
            no_hp: formData.get('no_hp') as string,
            alamat: formData.get('alamat') as string,
        };

        const updatedUser = await userService.updateUserProfile(userId, updates);
        return { success: true, user: updatedUser };

    } catch (error: any) {
        console.error('Error updating profile:', error);
        return { success: false, message: error.message };
    }
}

export async function uploadUserAvatar(formData: FormData) {
    try {
        const userId = formData.get('userId') as string;
        const file = formData.get('avatar') as File;

        if (!userId || !file) throw new Error('Missing required fields');

        const publicUrl = await userService.uploadAvatar(userId, file);
        return { success: true, avatarUrl: publicUrl };

    } catch (error: any) {
        console.error('Error uploading avatar:', error);
        return { success: false, message: error.message };
    }
}
