import React, { useState } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';
import { HandymanType } from './types';

interface AddHandymanModalProps {
    isOpen: boolean;
    onClose: () => void;
    handymanTypes: HandymanType[];
    selectedHandymanTypes: string[];
    onAddHandyman: (name: string) => void;
}

export const AddHandymanModal: React.FC<AddHandymanModalProps> = ({
    isOpen,
    onClose,
    handymanTypes,
    selectedHandymanTypes,
    onAddHandyman,
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    if (!isOpen) return null;

    const filteredHandyman = handymanTypes.filter(h =>
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedHandymanTypes.includes(h.name)
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden min-h-[600px]">
                {/* Modal Header */}
                <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900">Pesan Tukang Langsung! 👷</h3>
                        <p className="text-gray-500 text-lg mt-2">Temukan tukang profesional yang cocok untuk kebutuhan spesifik pekerjaan di rumahmu</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-gray-50 text-gray-400 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                        <X className="w-8 h-8" />
                    </button>
                </div>

                {/* Search Bar in Modal */}
                <div className="p-8 pb-4 shrink-0 bg-white">
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                        <input
                            type="text"
                            placeholder="Cari Tukang Langsung..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-16 pr-6 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-blue-50 transition-all font-bold text-lg shadow-sm placeholder-gray-300"
                        />
                    </div>
                </div>

                {/* Modal Body - Grid of Handymen */}
                <div className="p-8 overflow-y-auto custom-scrollbar bg-gray-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredHandyman.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => onAddHandyman(item.name)}
                                className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex items-start gap-5 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-24 h-24 ${item.bg} rounded-bl-[3rem] opacity-50 -mr-6 -mt-6 transition-transform group-hover:scale-110`}></div>

                                <div className={`w-20 h-20 ${item.bg} rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
                                    <item.icon className={`w-10 h-10 ${item.color}`} />
                                </div>

                                <div className="flex-1 min-w-0 relative z-10 py-1">
                                    <h4 className="font-bold text-gray-900 text-xl mb-1 group-hover:text-blue-600 transition-colors truncate">{item.name}</h4>
                                    <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">{item.desc}</p>

                                    <div className="flex items-center text-sm font-bold text-gray-300 group-hover:text-blue-500 transition-colors">
                                        Pilih Tukang <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {filteredHandyman.length === 0 && (
                        <div className="text-center py-20 text-gray-400">
                            <Search className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <p className="text-xl font-bold text-gray-300">Tidak ada tukang yang ditemukan</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
