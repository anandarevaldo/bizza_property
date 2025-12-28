'use client';

import React from 'react';
import Navbar from '../../../components/navbar';
import Footer from '../../../components/footer';
import ServiceHero from '../../../components/KategoriLayanan/ServiceHero';
import ServiceCategories from '../../../components/KategoriLayanan/ServiceCategories';
import ServicePromo from '../../../components/KategoriLayanan/ServicePromo';
import ServiceHighlights from '../../../components/KategoriLayanan/ServiceHighlights';

interface KategoriLayananProps {
    switchView: (view: any) => void;
}

const KategoriLayanan: React.FC<KategoriLayananProps> = ({ switchView }) => {
    return (
        <div className="font-sans animate-fade-in bg-slate-50 text-slate-800">
            <Navbar switchView={switchView} currentView="layanan" />
            <ServiceHero />
            <ServiceCategories switchView={switchView} />
            <ServicePromo />
            <ServiceHighlights switchView={switchView} />
            <Footer />
        </div>
    );
};

export default KategoriLayanan;
