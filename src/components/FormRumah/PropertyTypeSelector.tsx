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
            <div className="grid grid-cols-2 gap-4 max-w-2xl">
                {[
                    { id: 'Apartment', icon: Building, label: 'Apartment' },
                    { id: 'Rumah', icon: Home, label: 'Rumah' } // Removed Office/Ruko if not needed, as per 2 items shown
                ].map((type) => (
                    <div
                        key={type.id}
                        onClick={() => onSelect(type.id)}
                        className={`cursor-pointer rounded-2xl p-4 flex flex-col items-center justify-center gap-3 border-2 transition-all h-36 relative overflow-hidden group
                            ${selectedType === type.id
                                ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md ring-2 ring-blue-100 ring-offset-2'
                                : 'border-gray-200 bg-white text-gray-500 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600 hover:shadow-sm'
                            }
                        `}
                    >
                        {/* Background Decoration for Premium Feel */}
                        {selectedType === type.id && (
                            <div className="absolute top-0 right-0 p-2">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            </div>
                        )}

                        <type.icon
                            className={`w-10 h-10 transition-transform duration-300 group-hover:scale-110 
                            ${selectedType === type.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`}
                        />
                        <span className="font-bold text-lg">{type.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
