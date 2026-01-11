'use client';

import React from 'react';
import Navbar from '../../../components/navbar';
import Footer from '../../../components/footer';
import ServiceHero from '../../../components/KategoriLayanan/ServiceHero';
import ServiceCategories from '../../../components/KategoriLayanan/ServiceCategories';
import ServicePromo from '../../../components/KategoriLayanan/ServicePromo';
import ServiceHighlights from '../../../components/KategoriLayanan/ServiceHighlights';

import { ServiceItem } from '@/lib/services/layananService';

interface KategoriLayananProps {
    switchView?: (view: any) => void;
    services?: ServiceItem[];
}

const KategoriLayanan: React.FC<KategoriLayananProps> = ({ services = [] }) => {
    return (
        <div className="font-sans animate-fade-in bg-slate-50 text-slate-800">
            <Navbar currentView="layanan" />
            <ServiceHero />
            <ServiceCategories services={services} />
            <ServicePromo />
            <ServiceHighlights />
            <Footer />
        </div>
    );
};

export default KategoriLayanan;
