
import React from 'react';
import KategoriLayanan from '@/app/user/kategorilayanan/KategoriLayanan';
import Navbar from '@/components/navbar';

import { getServices } from '@/lib/services/layananService';

// Wrapper to adapt KategoriLayanan to App Router
// In a real refactor, we would move KategoriLayanan logic here directly
export default async function LayananPage() {
    const services = await getServices();

    return (
        // We render KategoriLayanan which renders Navbar itself. 
        // We pass a dummy switchView because KategoriLayanan expects it.
        // Ideally we should refactor KategoriLayanan to not use switchView.
        <KategoriLayanan services={services} />
    );
}
