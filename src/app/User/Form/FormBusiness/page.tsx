'use client';

import BookingFormBusiness from '@/components/FormBusiness/BookingFormBusiness';
import { useRouter } from 'next/navigation';

export default function FormBusinessPage() {
    const router = useRouter();
    return (
        <div className="bg-white min-h-screen">
            <BookingFormBusiness switchView={() => router.back()} />
        </div>
    );
}
