
import React, { useState, useEffect } from 'react';
import { X, ChevronRight, CheckCircle2, Briefcase, DollarSign, AlignLeft, ChevronDown, ListFilter, Activity } from 'lucide-react';
import { Service } from './ServiceList';
import { serviceTypes, categories } from '../Layanan/RepairServiceSelection/constants';

interface ServiceEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: Service | null;
    onSave: (data: Partial<Service>) => void;
}

export const ServiceEditModal: React.FC<ServiceEditModalProps> = ({ isOpen, onClose, service, onSave }) => {
    const [formData, setFormData] = useState<Partial<Service>>({});

    useEffect(() => {
        if (isOpen) {
            if (service) {
                // Strip non-numeric from price to get raw number
                const numericPrice = service.price.replace(/\D/g, '');
                const formattedPrice = numericPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                setFormData({
                    ...service,
                    price: formattedPrice
                });
            } else {
                setFormData({ status: 'Active', category: '', price: '' });
            }
        }
    }, [isOpen, service]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Save price with "Rp" prefix and "Start from" if desired, or simplified to just Rp based on previous request "rupiahnya menetap"
        // The user said "harga dan deskripsi terpisah rupiahnya atau Rp nanti buat tidak bisa di ubah"
        // I will save it as "Rp [Value]" to be consistent with the fixed prefix UI.
        const finalData = {
            ...formData,
            price: `Rp ${formData.price}`
        };
        onSave(finalData);
        onClose();
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Remove non-numeric
        let val = e.target.value.replace(/\D/g, '');
        // Add dots
        val = val.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        setFormData({ ...formData, price: val });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl animate-scale-up border border-gray-100 h-fit max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900">{service ? 'Edit Layanan' : 'Tambah Layanan'}</h3>
                        <p className="text-gray-500 text-sm font-medium mt-1">Lengkapi informasi layanan pengguna.</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors group">
                        <X className="w-6 h-6 text-gray-400 group-hover:text-gray-600" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                    {/* Main Info Group */}
                    <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100 space-y-5">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-blue-600" /> Informasi Dasar
                        </h4>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nama Layanan</label>
                            <div className="relative">
                                <select
                                    value={formData.name || ''}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-800 bg-white appearance-none"
                                    required
                                >
                                    <option value="" disabled>Pilih Layanan</option>
                                    {serviceTypes.map(s => (
                                        <option key={s.id} value={s.name}>{s.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Kategori</label>
                            <div className="relative">
                                <select
                                    value={formData.category || ''}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full pl-4 pr-10 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-800 bg-white appearance-none"
                                    required
                                >
                                    <option value="" disabled>Pilih Kategori</option>
                                    {Object.entries(categories).map(([key, group]) => {
                                        // Ideally we want to select the Category Group Title or something related to it?
                                        // Wait, in ServiceList logic:
                                        // `service.category` is displayed as a badge.
                                        // In `serviceTypes` constant, `categories` groups services into "Popular", "Interior", etc.
                                        // Typically a Service has a BROAD category (like "Renovasi") or specific one.
                                        // In `initialServices` example: name='Kebocoran', category='Perbaikan Umum'.
                                        // If we use the grouped dropdown, we are selecting specific services?
                                        // NO, the user request says: "buat kategori menjadi dropdown ... sesuaikan dengan ... ServiceGrid.tsx".
                                        // ServiceGrid uses `categories` const.
                                        // Let's allow selecting the GROUP TITLE as the category? Or the keys? or just list the group titles?

                                        // RE-READ REQUEST: "warna kategori sesuaikan juga ... jenis layanannya juga di buat drop down"
                                        // Wait, `formData.name` is the Service Name (which we already made a dropdown).
                                        // `formData.category` is the broad Category (e.g. "Renovasi", "Interior").
                                        // In `constants.ts`, `categories` object has titles like "🏠 Interior & Finishing".
                                        // So I should let user pick one of these TITLES as the category.

                                        return (
                                            <option key={key} value={group.title}>{group.title}</option>
                                        );
                                    })}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Deskripsi</label>
                            <textarea
                                value={formData.description || ''}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-medium text-gray-700 bg-white min-h-[100px]"
                                placeholder="Jelaskan detail layanan..."
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Price & Status Group */}
                    <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100 space-y-5">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-green-600" /> Harga & Status
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Harga Dasar</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500 pointer-events-none">Rp</span>
                                    <input
                                        type="text"
                                        value={formData.price || ''}
                                        onChange={handlePriceChange}
                                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-800 bg-white"
                                        required
                                        placeholder="150.000"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</label>
                                <div className="relative">
                                    <select
                                        value={formData.status || 'Active'}
                                        onChange={e => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
                                        className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-800 bg-white appearance-none"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3">
                        <CheckCircle2 className="w-6 h-6" />
                        Simpan Data
                    </button>
                </form>
            </div>
        </div>
    );
};
