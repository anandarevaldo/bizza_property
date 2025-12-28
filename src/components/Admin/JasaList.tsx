

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Hammer, ChevronRight } from 'lucide-react';
import { JasaEditModal } from './JasaEditModal';
import { serviceTypes } from '../Layanan/RepairServiceSelection/constants';

export interface Jasa {
    id: string;
    name: string;
    type: 'Harian' | 'Bulanan' | 'Tahunan' | 'Borongan' | 'Satuan';
    price: string;
    description: string;
    status: 'Active' | 'Inactive';
}

const initialJasa: Jasa[] = [
    { id: '1', name: 'Kebocoran', type: 'Harian', price: 'Rp 150.000 / hari', description: 'Perbaikan atap bocor ringan hingga sedang.', status: 'Active' },
    { id: '2', name: 'Cat', type: 'Harian', price: 'Rp 140.000 / hari', description: 'Pengecatan dinding interior dan eksterior.', status: 'Active' },
    { id: '3', name: 'Listrik', type: 'Satuan', price: 'Rp 75.000 / titik', description: 'Instalasi dan perbaikan kelistrikan rumah.', status: 'Active' },
    { id: '4', name: 'Konstruksi', type: 'Borongan', price: 'Rp 3.500.000', description: 'Renovasi kecil dan perbaikan struktur.', status: 'Active' },
];

export const JasaList: React.FC = () => {
    const [jasaList, setJasaList] = useState<Jasa[]>(initialJasa);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentJasa, setCurrentJasa] = useState<Jasa | null>(null);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleDelete = (id: string) => {
        if (confirm('Apakah anda yakin ingin menghapus jasa ini?')) {
            setJasaList(jasaList.filter(j => j.id !== id));
        }
    };

    const handleEdit = (jasa: Jasa) => {
        setCurrentJasa(jasa);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setCurrentJasa(null);
        setIsModalOpen(true);
    };

    const handleSave = (data: Partial<Jasa>) => {
        if (currentJasa) {
            setJasaList(jasaList.map(j => j.id === currentJasa.id ? { ...j, ...data } as Jasa : j));
        } else {
            const newJasa: Jasa = {
                ...data as Jasa,
                id: Math.random().toString(36).substr(2, 9),
            };
            setJasaList([...jasaList, newJasa]);
        }
        setIsModalOpen(false);
    };

    const filteredJasa = jasaList.filter(jasa =>
        jasa.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jasa.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-gray-100 border border-gray-100 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
                            <Hammer className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900">Daftar Jasa</h2>
                    </div>
                    <p className="text-gray-500 font-medium ml-1">Kelola daftar harga jasa pertukangan dan borongan.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-1 flex items-center gap-3"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Jasa
                </button>
            </div>

            {/* Search */}
            <div className="mb-8">
                <div className="relative max-w-lg">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Cari nama jasa atau deskripsi..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all bg-gray-50 font-medium text-gray-700"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-3xl border border-gray-100 shadow-sm bg-gray-50/50">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white border-b border-gray-100">
                            <th className="p-6 font-extrabold text-gray-600 text-xs uppercase tracking-wider">Nama Jasa</th>
                            <th className="p-6 font-extrabold text-gray-600 text-xs uppercase tracking-wider">Tipe</th>
                            <th className="p-6 font-extrabold text-gray-600 text-xs uppercase tracking-wider">Harga</th>
                            <th className="p-6 font-extrabold text-gray-600 text-xs uppercase tracking-wider">Deskripsi</th>
                            <th className="p-6 font-extrabold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                            <th className="p-6 font-extrabold text-gray-600 text-xs uppercase tracking-wider text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {filteredJasa.map((jasa) => {
                            const service = serviceTypes.find(s => s.name === jasa.name);
                            const Icon = service?.icon || Hammer;
                            const iconBg = service?.bg || 'bg-gray-100';
                            const iconColor = service?.color || 'text-gray-500';

                            return (
                                <tr key={jasa.id} className="hover:bg-blue-50/30 transition-colors group cursor-default">
                                    <td className="p-6 font-bold text-gray-900 text-sm flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center ${iconColor}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        {jasa.name}
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${jasa.type === 'Harian' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                            jasa.type === 'Borongan' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                jasa.type === 'Bulanan' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                    jasa.type === 'Tahunan' ? 'bg-pink-50 text-pink-600 border-pink-100' :
                                                        'bg-blue-50 text-blue-600 border-blue-100'
                                            }`}>
                                            {jasa.type}
                                        </span>
                                    </td>
                                    <td className="p-6 font-bold text-gray-900 text-sm">{jasa.price}</td>
                                    <td className="p-6 text-gray-500 text-sm max-w-xs truncate font-medium" title={jasa.description}>
                                        {jasa.description}
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 w-fit ${jasa.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${jasa.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                            {jasa.status}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => handleEdit(jasa)}
                                                className="p-2.5 bg-white border-2 border-gray-100 rounded-xl text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm hover:scale-110"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(jasa.id)}
                                                className="p-2.5 bg-white border-2 border-gray-100 rounded-xl text-red-600 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm hover:scale-110"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <JasaEditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                jasa={currentJasa}
                onSave={handleSave}
            />
        </div>
    );
};

