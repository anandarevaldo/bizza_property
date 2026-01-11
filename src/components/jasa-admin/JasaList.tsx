'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Hammer, Loader2 } from 'lucide-react';
import { JasaEditModal } from './JasaEditModal';
import { useServices } from '@/hooks/useServices';
import { ICON_MAP } from '@/lib/constants/serviceTemplates';
import { jasaService, Jasa } from '@/lib/services/jasaService';

export type { Jasa };

export const JasaList: React.FC = () => {
    const [jasaList, setJasaList] = useState<Jasa[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentJasa, setCurrentJasa] = useState<Jasa | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const { services } = useServices();

    // Fetch jasa list on mount
    useEffect(() => {
        fetchJasaList();
    }, []);

    const fetchJasaList = async () => {
        setIsLoading(true);
        try {
            const data = await jasaService.getAll();
            setJasaList(data);
        } catch (error) {
            console.error('Error fetching jasa:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Apakah anda yakin ingin menghapus jasa ini?')) {
            const success = await jasaService.delete(id);
            if (success) {
                setJasaList(jasaList.filter(j => j.id !== id));
            } else {
                alert('Gagal menghapus jasa. Silakan coba lagi.');
            }
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

    const handleSave = async (data: Partial<Jasa>) => {
        setIsSaving(true);
        try {
            if (currentJasa) {
                // Update existing
                const updated = await jasaService.update(currentJasa.id, data);
                if (updated) {
                    setJasaList(jasaList.map(j => j.id === currentJasa.id ? updated : j));
                } else {
                    alert('Gagal mengupdate jasa. Silakan coba lagi.');
                }
            } else {
                // Create new
                const newJasa = await jasaService.create(data as Omit<Jasa, 'id'>);
                if (newJasa) {
                    setJasaList([...jasaList, newJasa]);
                } else {
                    alert('Gagal menambah jasa. Silakan coba lagi.');
                }
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving jasa:', error);
            alert('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setIsSaving(false);
        }
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

            {/* Loading State */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    <span className="ml-4 text-gray-500 font-medium">Memuat data jasa...</span>
                </div>
            ) : (
                /* Table */
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
                            {filteredJasa.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-500">
                                        {searchTerm ? 'Tidak ada jasa yang cocok dengan pencarian.' : 'Belum ada data jasa. Klik "Tambah Jasa" untuk menambah.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredJasa.map((jasa) => {
                                    const service = services.find(s => s.name === jasa.name);
                                    const Icon = service ? (ICON_MAP[service.icon_name] || Hammer) : Hammer;
                                    const iconBg = service?.bg_gradient.split(' ')[0] || 'bg-gray-100';
                                    const iconColor = service?.color_class || 'text-gray-500';

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
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <JasaEditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                jasa={currentJasa}
                onSave={handleSave}
                isSaving={isSaving}
            />
        </div>
    );
};
