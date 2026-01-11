'use client';

import ServiceRepairBooking from '@/components/FormLayanan/ServiceRepairBooking';
import { useRouter, useSearchParams } from 'next/navigation';

export default function FormLayananPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get('type') || undefined;

    return (
        <div className="bg-white min-h-screen">
            <ServiceRepairBooking 
                switchView={() => router.back()} 
                selectedServiceType={type}
            />
        </div>
    );
}
