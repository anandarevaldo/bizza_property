import React from 'react';
import { ChevronRight } from 'lucide-react';
import { ServiceType } from './types';

interface ServiceCardProps {
    item: ServiceType;
    onClick: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ item, onClick }) => (
    <div
        onClick={onClick}
        className="bg-gray-50 rounded-xl p-4 border border-transparent hover:bg-white hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer group flex items-center gap-4 py-5"
    >
        <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
            <item.icon className={`w-6 h-6 ${item.color}`} />
        </div>

        <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">{item.name}</h3>
            <p className="text-xs text-gray-500 truncate mt-0.5">{item.desc}</p>
        </div>

        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
            <ChevronRight className="w-4 h-4 text-blue-500" />
        </div>
    </div>
);
