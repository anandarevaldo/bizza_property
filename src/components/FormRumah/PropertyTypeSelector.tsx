import React from 'react';
import { Building, Store, Home } from 'lucide-react';

interface PropertyTypeSelectorProps {
    selectedType: string;
    onSelect: (type: string) => void;
}

export const PropertyTypeSelector: React.FC<PropertyTypeSelectorProps> = ({ selectedType, onSelect }) => {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                Jenis Bangunan <span className="text-red-500">*</span>
            </h2>
            <div className="grid grid-cols-3 gap-4">
                {[
                    { id: 'Apartment', icon: Building, label: 'Apartment' },
                    { id: 'Rumah', icon: Home, label: 'Rumah' }
                ].map((type) => (
                    <div
                        key={type.id}
                        onClick={() => onSelect(type.id)}
                        className={`cursor-pointer rounded-2xl p-4 flex flex-col items-center justify-center gap-3 border-2 transition-all h-32
                            ${selectedType === type.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200'}
                        `}
                    >
                        <type.icon className={`w-8 h-8 ${selectedType === type.id ? 'text-blue-500' : 'text-gray-400'}`} />
                        <span className="font-bold">{type.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
