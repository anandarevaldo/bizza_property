'use client';

import BookingFormHandyman from '@/components/FormTukang/BookingFormHandyman';
import { useRouter, useSearchParams } from 'next/navigation';

export default function FormTukangPage() {
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
