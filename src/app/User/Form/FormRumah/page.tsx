'use client';

import BookingForm from '@/components/FormRumah/BookingForm';
import { useRouter } from 'next/navigation';

export default function FormRumahPage() {
    const router = useRouter();
    return (
        <div className="bg-white min-h-screen">
            <BookingForm switchView={() => router.back()} />
        </div>
    );
}
