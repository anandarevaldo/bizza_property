import React from 'react';
import { Building, Store } from 'lucide-react';

interface BusinessTypeSelectorProps {
    value: string;
    onChange: (value: string) => void;
}

export const BusinessTypeSelector: React.FC<BusinessTypeSelectorProps> = ({ value, onChange }) => {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                Jenis Properti Bisnis <span className="text-red-500">*</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { id: 'Kantor', icon: Building, label: 'Kantor' },
                    { id: 'Ruko', icon: Store, label: 'Ruko' },
                    { id: 'Gudang', icon: Building, label: 'Gudang' },
                    { id: 'Restoran', icon: Store, label: 'F&B' }
                ].map((type) => (
                    <div
                        key={type.id}
                        onClick={() => onChange(type.id)}
                        className={`cursor-pointer rounded-2xl p-4 flex flex-col items-center justify-center gap-3 border-2 transition-all h-28
                        ${value === type.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200'}
                    `}
                    >
                        <type.icon className={`w-8 h-8 ${value === type.id ? 'text-blue-500' : 'text-gray-400'}`} />
                        <span className="font-bold text-sm">{type.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
