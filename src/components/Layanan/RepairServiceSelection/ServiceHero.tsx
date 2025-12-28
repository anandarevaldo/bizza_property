import React from 'react';
import { Search } from 'lucide-react';

interface ServiceHeroProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export const ServiceHero: React.FC<ServiceHeroProps> = ({ searchTerm, onSearchChange }) => {
    return (
        <div className="bg-blue-600 rounded-3xl p-8 mb-10 text-white shadow-xl shadow-blue-200 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex-1">
                <h2 className="text-3xl font-extrabold mb-2">Butuh Perbaikan Apa? 🛠️</h2>
                <p className="text-blue-100 text-lg opacity-90">Kami siap bantu segala masalah properti anda.</p>
            </div>

            <div className="relative w-full md:w-96 shrink-0">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Cari layanan (e.g., Bocor, Listrik)..."
                    className="w-full pl-14 pr-6 py-4 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400/30 font-medium shadow-lg bg-white"
                />
            </div>
        </div>
    );
};
