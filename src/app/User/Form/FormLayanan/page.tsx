'use client';

import { Suspense } from 'react';
import ServiceRepairBooking from '@/components/FormLayanan/ServiceRepairBooking';
import { useRouter, useSearchParams } from 'next/navigation';

function FormLayananContent() {
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

export default function FormLayananPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <FormLayananContent />
        </Suspense>
    );
}
