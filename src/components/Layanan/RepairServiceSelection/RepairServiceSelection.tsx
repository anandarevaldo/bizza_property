import React, { useState } from 'react';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { RepairServiceSelectionProps, ServiceType } from './types';
import { ServiceHero } from './ServiceHero';
import { ServiceGrid } from './ServiceGrid';

import { ICON_MAP } from '@/lib/constants/serviceTemplates';
import { Wrench } from 'lucide-react';

const RepairServiceSelection: React.FC<RepairServiceSelectionProps> = ({ switchView, onSelectService, services }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Mapping Database ServiceItem to Selection ServiceType
    const mappedServices: ServiceType[] = services.map(s => {
        const IconComponent = ICON_MAP[s.icon_name] || Wrench;
        return {
            id: s.id.toString(),
            name: s.name,
            desc: s.description,
            icon: IconComponent,
            icon_name: s.icon_name,
            color: s.color_class,
            bg: s.bg_gradient.includes(' ') ? s.bg_gradient.split(' ')[0] : s.bg_gradient, // Basic color from gradient
            category: s.category
        };
    });

    const handleSelect = (name: string) => {
        onSelectService(name);
        switchView('service-repair-booking');
    };

    return (
        <div className="min-h-screen bg-white font-sans animate-fade-in pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 py-4 px-6 md:px-12 sticky top-0 z-40 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3 text-sm md:text-base">
                    <div className="flex items-center gap-2 text-gray-500">
                        <span className="cursor-pointer hover:text-blue-600" onClick={() => switchView('home')}>Home</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="font-bold text-gray-900">Pilih Layanan</span>
                    </div>
                </div>
                <div className="ml-auto">
                    <AlertCircle className="w-6 h-6 text-gray-400" />
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-12 py-8 max-w-6xl">
                {/* Hero / Search */}
                <ServiceHero
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />

                {/* CONTENT AREA */}
                <ServiceGrid
                    searchTerm={searchTerm}
                    serviceTypes={mappedServices}
                    onSelectService={handleSelect}
                />
            </div>
        </div>
    );
};

export default RepairServiceSelection;
