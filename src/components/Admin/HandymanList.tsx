import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, MapPin, Star, Phone, Hammer, ChevronRight, X, User } from 'lucide-react';
import { serviceTypes } from '../Layanan/RepairServiceSelection/constants';

export interface Handyman {
    id: string;
    name: string;
    specialty: string;
    rating: number;
    location: string;
    detailedLocation?: string;
    phone: string;
    status: 'Available' | 'Busy' | 'Off';
}

export const initialHandymen: Handyman[] = [
    { id: '1', name: 'Pak Budi Santoso', specialty: 'Kebocoran', rating: 4.8, location: 'Jakarta Selatan', detailedLocation: 'Jl. Fatmawati Raya No. 10', phone: '0812-3456-7890', status: 'Available' },
    { id: '2', name: 'Pak Slamet Riyadi', specialty: 'Listrik', rating: 4.5, location: 'Tangerang', detailedLocation: 'Jl. Hartono Raya, Modernland', phone: '0813-9876-5432', status: 'Busy' },
    { id: '3', name: 'Tim Pak Joko', specialty: 'Cat', rating: 4.9, location: 'Jakarta Utara', detailedLocation: 'Jl. Yos Sudarso No. 88', phone: '0877-1234-5678', status: 'Available' },
    { id: '4', name: 'Pak Udin', specialty: 'Keramik', rating: 4.7, location: 'Bekasi', detailedLocation: 'Jl. galaxy Raya Blok A', phone: '0812-1122-3344', status: 'Available' },
    { id: '5', name: 'Kang Asep', specialty: 'Tamana', rating: 4.6, location: 'Bogor', detailedLocation: 'Jl. Pajajaran Indah V', phone: '0856-7788-9900', status: 'Off' },
];

import { HandymanEditModal } from './HandymanEditModal';

export const HandymanList: React.FC = () => {
    const [handymen, setHandymen] = useState<Handyman[]>(initialHandymen);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentHandyman, setCurrentHandyman] = useState<Handyman | null>(null);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleDelete = (id: string) => {
        if (confirm('Apakah anda yakin ingin menghapus data tukang ini?')) {
            setHandymen(handymen.filter(h => h.id !== id));
        }
    };

    const handleEdit = (handyman: Handyman) => {
        setCurrentHandyman(handyman);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setCurrentHandyman(null);
        setIsModalOpen(true);
    };

    const handleSave = (data: Partial<Handyman>) => {
        if (currentHandyman) {
            setHandymen(handymen.map(h => h.id === currentHandyman.id ? { ...h, ...data } as Handyman : h));
        } else {
            const newHandyman: Handyman = {
                ...data as Handyman,
                id: Math.random().toString(36).substr(2, 9),
            };
            setHandymen([...handymen, newHandyman]);
        }
        setIsModalOpen(false);
    };

    const filteredHandymen = handymen.filter(h =>
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Available': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Busy': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Off': return 'bg-slate-100 text-slate-600 border-slate-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    return (
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-gray-100 border border-gray-100 animate-fade-in relative z-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                            <Hammer className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900">Data Tukang</h2>
                    </div>
                    <p className="text-gray-500 font-medium ml-1">Kelola data mitra tukang dan status ketersediaan.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-1 flex items-center gap-3"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Tukang
                </button>
            </div>

            {/* Search */}
            <div className="mb-8">
                <div className="relative max-w-lg">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Cari nama, keahlian, atau lokasi..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all bg-gray-50 font-medium text-gray-700"
                    />
                </div>
            </div>

            {/* Grid Card Layout for Handymen */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {filteredHandymen.map((handyman) => {
                    // Find the service type to get the icon/color if possible
                    const serviceInfo = serviceTypes.find(s => s.name === handyman.specialty);
                    const Icon = serviceInfo?.icon || Hammer;
                    const iconColor = serviceInfo?.color || 'text-blue-600';
                    const iconBg = serviceInfo?.bg || 'bg-blue-50';

                    return (
                        <div key={handyman.id} className="bg-white rounded-[2rem] p-6 border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition-all group relative overflow-hidden flex flex-col h-full">
                            <div className="absolute top-6 right-6 flex gap-2 z-10">
                                <button onClick={() => handleEdit(handyman)} className="p-2 bg-gray-50 text-blue-600 rounded-full hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(handyman.id)} className="p-2 bg-gray-50 text-red-600 rounded-full hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className={`w-16 h-16 rounded-[1.2rem] ${iconBg} flex items-center justify-center ${iconColor} shadow-sm shrink-0`}>
                                    <User className="w-7 h-7" />
                                </div>
                                <div className="min-w-0 pr-16">
                                    <h3 className="font-black text-gray-900 text-lg leading-tight truncate mb-1.5">{handyman.name}</h3>
                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${iconBg} ${iconColor}`}>
                                        <Icon className="w-3 h-3" />
                                        {handyman.specialty}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50/50 rounded-2xl p-4 space-y-3 mb-6 border border-gray-50">
                                <div className="flex items-center gap-3 text-gray-500 text-sm font-medium">
                                    <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                                    <span className="truncate">{handyman.location}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-500 text-sm font-medium">
                                    <Phone className="w-4 h-4 text-green-500 shrink-0" />
                                    <span>{handyman.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-500 text-sm font-medium">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 shrink-0" />
                                    <span className="font-bold text-gray-900">{handyman.rating}</span>
                                    <span className="text-gray-400 text-xs">/ 5.0 Rating</span>
                                </div>
                            </div>

                            <div className={`mt-auto px-4 py-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-sm transition-colors ${getStatusColor(handyman.status)}`}>
                                <div className={`w-2 h-2 rounded-full ${handyman.status === 'Available' ? 'bg-emerald-500' : handyman.status === 'Busy' ? 'bg-amber-500' : 'bg-slate-500'}`}></div>
                                {handyman.status === 'Available' ? 'Tersedia' : handyman.status === 'Busy' ? 'Sedang Bertugas' : 'Tidak Aktif'}
                            </div>
                        </div>
                    );
                })}
            </div>

            <HandymanEditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                handyman={currentHandyman}
                onSave={handleSave}
            />
        </div>
    );
};
