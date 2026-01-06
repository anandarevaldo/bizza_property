
'use server'

import { orderService } from '../services/orderService';
import { supabase } from '../supabaseClient'; // Ensure we have access to auth if needed here, or pass user ID from client

export async function createHouseOrder(formData: FormData) {
    try {
        // 1. Get User Session (Mocking/Verifying auth)
        // In a real Server Action with Supabase, you might use createServerClient from @supabase/ssr
        // For now, assuming we pass userId or handle it via a secure cookie/header helper if implementing full auth.
        // However, since we used the basic client, let's assume we might need to get the user from the formData or context.
        // For security, it is best to get it from the session. 
        // Let's assume the user ID is passed in formData for this step or we have a way to get it.
        // Ideally: const { data: { user } } = await supabase.auth.getUser();

        const userId = formData.get('userId') as string;
        if (!userId) {
            return { success: false, message: 'User not authenticated' };
        }

        // 2. Extract Data
        const propertyType = formData.get('propertyType') as string;
        const description = formData.get('description') as string;
        const addressSearch = formData.get('addressSearch') as string;
        const addressDetail = formData.get('addressDetail') as string;
        const fullAddress = `${addressSearch}, ${addressDetail}`;
        const budget = formData.get('budget') as string;

        // Date handling might need parsing depending on format received
        const dateStr = formData.get('date') as string;
        const timeStr = formData.get('time') as string;
        const paymentMethod = formData.get('paymentMethod') as string;

        // 3. Create Order Record
        const order = await orderService.createOrder({
            userId,
            propertyType,
            description,
            address: fullAddress,
            budget,
            selectedDate: dateStr, // Ensure this maps to a valid date string
            selectedTime: timeStr,
            paymentMethod
        });

        if (!order) throw new Error('Failed to create order');

        // 4. Handle Images
        const images = formData.getAll('images') as File[];
        for (const image of images) {
            if (image.size > 0) {
                const publicUrl = await orderService.uploadOrderImage(image, order.pesanan_id.toString(), userId);
                await orderService.createDocumentation(order.pesanan_id, userId, publicUrl);
            }
        }

        return { success: true, message: 'Order created successfully', orderId: order.pesanan_id };

    } catch (error: any) {
        console.error('Error creating order:', error);
        return { success: false, message: error.message || 'Internal Server Error' };
    }
}
