
import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, MapPin, Star, Phone, Hammer, ChevronRight, X, User, HardHat } from 'lucide-react';
import { serviceTypes } from '../Layanan/RepairServiceSelection/constants';
import { Mandor } from '../Admin/types';
import { MandorEditModal } from './MandorEditModal';

export const initialMandors: Mandor[] = [
    { id: '1', name: 'Pak Mandor Budi', specialty: 'Konstruksi Bangunan', rating: 4.9, location: 'Jakarta Selatan', detailedLocation: 'Jl. Fatmawati Raya No. 10', phone: '0812-3333-4444', status: 'Available', totalProjects: 15 },
    { id: '2', name: 'Pak Mandor Slamet', specialty: 'Renovasi Interior', rating: 4.7, location: 'Tangerang', detailedLocation: 'Jl. Hartono Raya, Modernland', phone: '0813-5555-6666', status: 'Busy', totalProjects: 8 },
    { id: '3', name: 'Pak Mandor Joko', specialty: 'Lansekap & Taman', rating: 4.8, location: 'Jakarta Utara', detailedLocation: 'Jl. Yos Sudarso No. 88', phone: '0877-7777-8888', status: 'Available', totalProjects: 12 },
    { id: '4', name: 'Pak Mandor Udin', specialty: 'Kelistrikan & Plumbing', rating: 4.6, location: 'Bekasi', detailedLocation: 'Jl. galaxy Raya Blok A', phone: '0812-9999-0000', status: 'Available', totalProjects: 20 },
    { id: '5', name: 'Pak Mandor Asep', specialty: 'Atap & Baja Ringan', rating: 4.5, location: 'Bogor', detailedLocation: 'Jl. Pajajaran Indah V', phone: '0856-1111-2222', status: 'Off', totalProjects: 5 },
];

export const MandorList: React.FC = () => {
    const [mandors, setMandors] = useState<Mandor[]>(initialMandors);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMandor, setCurrentMandor] = useState<Mandor | null>(null);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleDelete = (id: string) => {
        if (confirm('Apakah anda yakin ingin menghapus data mandor ini?')) {
            setMandors(mandors.filter(m => m.id !== id));
        }
    };

    const handleEdit = (mandor: Mandor) => {
        setCurrentMandor(mandor);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setCurrentMandor(null);
        setIsModalOpen(true);
    };

    const handleSave = (data: Partial<Mandor>) => {
        if (currentMandor) {
            setMandors(mandors.map(m => m.id === currentMandor.id ? { ...m, ...data } as Mandor : m));
        } else {
            const newMandor: Mandor = {
                ...data as Mandor,
                id: Math.random().toString(36).substr(2, 9),
                totalProjects: 0
            };
            setMandors([...mandors, newMandor]);
        }
        setIsModalOpen(false);
    };

    const filteredMandors = mandors.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.location.toLowerCase().includes(searchTerm.toLowerCase())
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
                            <HardHat className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900">Data Mandor</h2>
                    </div>
                    <p className="text-gray-500 font-medium ml-1">Kelola data mitra mandor dan status ketersediaan.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-1 flex items-center gap-3"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Mandor
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

            {/* Grid Card Layout for Mandors */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {filteredMandors.map((mandor) => {
                    // Find the service type to get the icon/color if possible
                    const serviceInfo = serviceTypes.find(s => s.name === mandor.specialty);
                    const Icon = serviceInfo?.icon || HardHat;
                    const iconColor = serviceInfo?.color || 'text-blue-600';
                    const iconBg = serviceInfo?.bg || 'bg-blue-50';

                    return (
                        <div key={mandor.id} className="bg-white rounded-[2rem] p-6 border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition-all group relative overflow-hidden flex flex-col h-full">
                            <div className="absolute top-6 right-6 flex gap-2 z-10">
                                <button onClick={() => handleEdit(mandor)} className="p-2 bg-gray-50 text-blue-600 rounded-full hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(mandor.id)} className="p-2 bg-gray-50 text-red-600 rounded-full hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className={`w-16 h-16 rounded-[1.2rem] ${iconBg} flex items-center justify-center ${iconColor} shadow-sm shrink-0`}>
                                    <User className="w-7 h-7" />
                                </div>
                                <div className="min-w-0 pr-16">
                                    <h3 className="font-black text-gray-900 text-lg leading-tight truncate mb-1.5">{mandor.name}</h3>
                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${iconBg} ${iconColor}`}>
                                        <Icon className="w-3 h-3" />
                                        {mandor.specialty}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50/50 rounded-2xl p-4 space-y-3 mb-6 border border-gray-50">
                                <div className="flex items-center gap-3 text-gray-500 text-sm font-medium">
                                    <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                                    <span className="truncate">{mandor.location}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-500 text-sm font-medium">
                                    <Phone className="w-4 h-4 text-green-500 shrink-0" />
                                    <span>{mandor.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-500 text-sm font-medium">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 shrink-0" />
                                    <span className="font-bold text-gray-900">{mandor.rating}</span>
                                    <span className="text-gray-400 text-xs">/ 5.0 Rating</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-500 text-sm font-medium">
                                    <HardHat className="w-4 h-4 text-orange-500 shrink-0" />
                                    <span className="font-bold text-gray-900">{mandor.totalProjects}</span>
                                    <span className="text-gray-400 text-xs">Proyek Selesai</span>
                                </div>
                            </div>

                            <div className={`mt-auto px-4 py-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-sm transition-colors ${getStatusColor(mandor.status)}`}>
                                <div className={`w-2 h-2 rounded-full ${mandor.status === 'Available' ? 'bg-emerald-500' : mandor.status === 'Busy' ? 'bg-amber-500' : 'bg-slate-500'}`}></div>
                                {mandor.status === 'Available' ? 'Tersedia' : mandor.status === 'Busy' ? 'Sedang Bertugas' : 'Tidak Aktif'}
                            </div>
                        </div>
                    );
                })}
            </div>

            <MandorEditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mandor={currentMandor}
                onSave={handleSave}
            />
        </div>
    );
};
