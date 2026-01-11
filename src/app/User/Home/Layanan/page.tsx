import React from 'react';
import Layanan from './Layanan';
import { getServices } from '@/lib/services/layananService';

export default async function LayananSelectionPage() {
    const services = await getServices();
    
    return (
        <Layanan services={services} />
    );
}
