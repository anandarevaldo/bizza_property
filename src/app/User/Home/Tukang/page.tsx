'use client';

import React, { useState } from 'react';
import { ChevronRight, AlertCircle, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { handymanTypes } from '@/components/Layanan/data';
import HandymanCard from '@/components/Layanan/HandymanCard';
import SearchBar from '@/components/Layanan/SearchBar';
import TopSearch from '@/components/Layanan/TopSearch';
import StrukturBangunan from '@/components/Layanan/StrukturBangunan';
import FinisihingInterior from '@/components/Layanan/FinisihingInterior';
import UtilitasPerbaikan from '@/components/Layanan/UtilitasPerbaikan';
import AssistenLainnnya from '@/components/Layanan/AssistenLainnnya';

export default function TukangSelectionPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSelect = (name: string) => {
        router.push(`/User/Form/FormTukang?type=${encodeURIComponent(name)}`);
    };

    // Filter Logic for Search Results
    const filteredHandyman = handymanTypes.filter(h =>
        h.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white font-sans animate-fade-in pb-20">
            {/* Header (Breadcrumb Style) */}
            <div className="bg-white border-b border-gray-200 py-4 px-6 md:px-12 sticky top-0 z-40 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3 text-sm md:text-base">
                    <div className="flex items-center gap-2 text-gray-500">
                        <span className="cursor-pointer hover:text-blue-600" onClick={() => router.push('/')}>Home</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="font-bold text-gray-900">Pilih Tukang</span>
                    </div>
                </div>
                <div className="ml-auto">
                    <AlertCircle className="w-6 h-6 text-gray-400" />
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-12 py-8 max-w-6xl">
                {/* Hero / Search Section */}
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                {/* CONTENT AREA */}
                {searchTerm ? (
                    /* SEARCH RESULTS (Flat Grid) */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
                        {filteredHandyman.map((item) => (
                            <HandymanCard key={item.id} item={item} onClick={() => handleSelect(item.name)} />
                        ))}
                        {filteredHandyman.length === 0 && (
                            <div className="col-span-full text-center py-20 text-gray-400">
                                <Search className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p className="text-xl font-bold text-gray-300">Tukang tidak ditemukan</p>
                            </div>
                        )}
                    </div>
                ) : (
                    /* CATEGORIZED VIEW */
                    <div className="space-y-12 animate-fade-in">
                        <TopSearch onSelectHandyman={handleSelect} />
                        <StrukturBangunan onSelectHandyman={handleSelect} />
                        <FinisihingInterior onSelectHandyman={handleSelect} />
                        <UtilitasPerbaikan onSelectHandyman={handleSelect} />
                        <AssistenLainnnya onSelectHandyman={handleSelect} />
                    </div>
                )}
            </div>
        </div>
    );
}
