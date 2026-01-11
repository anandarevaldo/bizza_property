'use client';

import { Suspense } from 'react';
import BookingFormHandyman from '@/components/FormTukang/BookingFormHandyman';
import { useRouter, useSearchParams } from 'next/navigation';

function FormTukangContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get('type') || '';

    const handleUpdateMaterials = (materials: any[]) => {
        console.log('Update materials', materials);
    };

    return (
        <div className="bg-white min-h-screen">
            <BookingFormHandyman
                switchView={() => router.back()}
                selectedHandymanType={type}
                selectedMaterials={[]}
                onUpdateMaterials={handleUpdateMaterials}
            />
        </div>
    );
}

export default function FormTukangPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <FormTukangContent />
        </Suspense>
    );
}
