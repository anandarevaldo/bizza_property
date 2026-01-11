
'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Briefcase, ChevronRight } from 'lucide-react';
import { ServiceEditModal } from './ServiceEditModal';
import { ICON_MAP } from '@/lib/constants/serviceTemplates';
import { layananService, ServiceData } from '../../lib/services/layananService';

// Re-export type if needed or use from service
export type Service = ServiceData;

export const ServiceList: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentService, setCurrentService] = useState<Service | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchServices = async () => {
        setIsLoading(true);
        try {
            const data = await layananService.getAll();
            setServices(data);
        } catch (error: any) {
            console.error('Error fetching services:', error.message);
            alert('Gagal mengambil data layanan.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Apakah anda yakin ingin menghapus layanan ini?')) {
            try {
                await layananService.delete(id);
                setServices(services.filter(s => s.id !== id));
            } catch (error: any) {
                console.error('Error deleting service:', error.message);
                alert('Gagal menghapus layanan.');
            }
        }
    };

    const handleEdit = (service: Service) => {
        setCurrentService(service);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setCurrentService(null);
        setIsModalOpen(true);
    };

    const handleSave = async (data: Partial<Service>) => {
        try {
            // Data is already prepared by modal, just need to ensure types
            // For safety, force cast or simple check
            const serviceData = data as ServiceData; // Modal ensures correct structure now

            if (currentService && currentService.id) {
                await layananService.update(currentService.id, serviceData);
            } else {
                await layananService.create(serviceData);
            }

            await fetchServices(); // Refresh list
            setIsModalOpen(false);
        } catch (error: any) {
            console.error('Error saving service:', error.message);
            alert(`Gagal menyimpan layanan: ${error.message}`);
        }
    };

    const uniqueCategories = Array.from(new Set(services.map(s => s.category))).filter((cat): cat is string => Boolean(cat));

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-gray-100 border border-gray-100 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900">Daftar Layanan</h2>
                    </div>
                    <p className="text-gray-500 font-medium ml-1">Kelola katalog layanan yang tersedia untuk pelanggan.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-1 flex items-center gap-3"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Layanan
                </button>
            </div>

            {/* Search */}
            <div className="mb-8">
                <div className="relative max-w-lg">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Cari nama layanan atau kategori..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all bg-gray-50 font-medium text-gray-700"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-sm bg-gray-50/50">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white border-b border-gray-100">
                            <th className="p-6 font-extrabold text-gray-600 text-xs uppercase tracking-wider">Nama Layanan</th>
                            <th className="p-6 font-extrabold text-gray-600 text-xs uppercase tracking-wider">Kategori</th>
                            <th className="p-6 font-extrabold text-gray-600 text-xs uppercase tracking-wider">Harga Dasar</th>
                            <th className="p-6 font-extrabold text-gray-600 text-xs uppercase tracking-wider">Deskripsi</th>
                            <th className="p-6 font-extrabold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                            <th className="p-6 font-extrabold text-gray-600 text-xs uppercase tracking-wider text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="p-10 text-center text-gray-500 font-medium">Memuat data...</td>
                            </tr>
                        ) : filteredServices.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-10 text-center text-gray-500 font-medium">Tidak ada layanan ditemukan.</td>
                            </tr>
                        ) : (
                            filteredServices.map((service) => {
                                // Find icon from saved name OR fallback to constant list lookup OR default
                                // Use saved icon name to look up in ICON_MAP
                                const savedIconName = service.icon;
                                const Icon = (savedIconName && ICON_MAP[savedIconName]) || Briefcase;
                                const iconBg = service.bg_gradient?.split(' ')[0] || 'bg-gray-50';
                                const iconColor = service.color_class || 'text-gray-600';

                                return (
                                    <tr
                                        key={service.id}
                                        className="hover:bg-blue-50/30 transition-colors group cursor-default"
                                    >
                                        <td className="p-6 font-bold text-gray-900 text-sm flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl ${service.imageUrl ? 'bg-white border border-gray-100' : iconBg} flex items-center justify-center ${iconColor} shadow-sm overflow-hidden`}>
                                                {service.imageUrl ? (
                                                    <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Icon className="w-5 h-5" />
                                                )}
                                            </div>
                                            {service.name}
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${iconBg} ${iconColor} border-transparent bg-opacity-50`}>
                                                {service.category}
                                            </span>
                                        </td>
                                        <td className="p-6 font-bold text-gray-900 text-sm">{service.price}</td>
                                        <td className="p-6 text-gray-500 text-sm max-w-xs truncate font-medium" title={service.description}>
                                            {service.description}
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 w-fit ${service.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${service.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                {service.status}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => handleEdit(service)}
                                                    className="p-2.5 bg-white border-2 border-gray-100 rounded-xl text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm hover:scale-110"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => service.id && handleDelete(service.id)}
                                                    className="p-2.5 bg-white border-2 border-gray-100 rounded-xl text-red-600 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm hover:scale-110"
                                                    title="Delete"
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

            <ServiceEditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                service={currentService}
                onSave={handleSave}
                availableCategories={uniqueCategories}
            />
        </div>
    );
};
