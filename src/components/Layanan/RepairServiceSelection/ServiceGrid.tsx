import React from 'react';
import { Search } from 'lucide-react';
import { ServiceType } from './types';
import { categories } from './constants';
import { ServiceCard } from './ServiceCard';

interface ServiceGridProps {
    searchTerm: string;
    serviceTypes: ServiceType[];
    onSelectService: (name: string) => void;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({ searchTerm, serviceTypes, onSelectService }) => {
    const filteredServices = serviceTypes.filter(h =>
        h.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Grouping Logic
    const getGroupedServices = () => {
        if (searchTerm) return null;

        return Object.entries(categories).map(([key, category]) => {
            const items = serviceTypes.filter(h => category.ids.includes(h.id));
            if (items.length === 0) return null;
            return { ...category, items };
        });
    };

    const groupedData = getGroupedServices();

    if (searchTerm) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
                {filteredServices.map((item) => (
                    <ServiceCard key={item.id} item={item} onClick={() => onSelectService(item.name)} />
                ))}
                {filteredServices.length === 0 && (
                    <div className="col-span-full text-center py-20 text-gray-400">
                        <Search className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p className="text-xl font-bold text-gray-300">Layanan tidak ditemukan</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-fade-in">
            {groupedData?.map((group) => group && (
                <div key={group.title}>
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        {group.title}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {group.items.map((item) => (
                            <ServiceCard key={item.id} item={item} onClick={() => onSelectService(item.name)} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
