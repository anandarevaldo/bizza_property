
import React, { useState, useEffect } from 'react';
import { X, ChevronRight, CheckCircle2, Hammer, Calendar, DollarSign, AlignLeft, ChevronDown } from 'lucide-react';
import { Jasa } from './JasaList';
import { serviceTypes, categories } from '../Layanan/RepairServiceSelection/constants';

interface JasaEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    jasa: Jasa | null;
    onSave: (data: Partial<Jasa>) => void;
}

export const JasaEditModal: React.FC<JasaEditModalProps> = ({ isOpen, onClose, jasa, onSave }) => {
    const [formData, setFormData] = useState<Partial<Jasa>>({});

    useEffect(() => {
        if (isOpen) {
            if (jasa) {
                // Strip existing Rp and text, keep only numbers
                const numericPrice = jasa.price.replace(/\D/g, '');
                // Format with dots
                const formattedPrice = numericPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                setFormData({ ...jasa, price: formattedPrice });
            } else {
                setFormData({ status: 'Active', type: 'Harian', price: '' });
            }
        }
    }, [isOpen, jasa]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Reconstruct price with Rp prefix for saving
        const finalData = {
            ...formData,
            price: `Rp ${formData.price}`
        };
        onSave(finalData);
        onClose();
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Remove non-numeric chars
        let val = e.target.value.replace(/\D/g, '');
        // Add dots every 3 digits
        val = val.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        setFormData({ ...formData, price: val });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl animate-scale-up border border-gray-100 h-fit max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900">{jasa ? 'Edit Jasa' : 'Tambah Jasa'}</h3>
                        <p className="text-gray-500 text-sm font-medium mt-1">Atur harga dan tipe layanan jasa.</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors group">
                        <X className="w-6 h-6 text-gray-400 group-hover:text-gray-600" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                    {/* Service Selection */}
                    <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100 space-y-5">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                            <Hammer className="w-5 h-5 text-blue-600" /> Informasi Layanan
                        </h4>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nama Jasa / Kategori</label>
                            <div className="relative">
                                <select
                                    value={formData.name || ''}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-800 bg-white appearance-none"
                                    required
                                >
                                    <option value="" disabled>Pilih Kategori Jasa</option>
                                    {Object.entries(categories).map(([key, group]) => {
                                        const groupServices = serviceTypes.filter(s => group.ids.includes(s.id));
                                        if (groupServices.length === 0) return null;
                                        return (
                                            <optgroup key={key} label={group.title}>
                                                {groupServices.map(service => (
                                                    <option key={service.id} value={service.name}>
                                                        {service.name}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        );
                                    })}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Deskripsi (Opsional)</label>
                            <textarea
                                value={formData.description || ''}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-medium text-gray-700 bg-white min-h-[100px]"
                                placeholder="Jelaskan detail cakupan pekerjaan..."
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Pricing Group */}
                    <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100 space-y-5">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-green-600" /> Harga & Durasi
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tipe</label>
                                <div className="relative">
                                    <select
                                        value={formData.type || 'Harian'}
                                        onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                        className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-800 bg-white appearance-none"
                                    >
                                        <option value="Harian">Harian</option>
                                        <option value="Bulanan">Bulanan</option>
                                        <option value="Tahunan">Tahunan</option>
                                        <option value="Borongan">Borongan</option>
                                        <option value="Satuan">Satuan</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Harga</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500 pointer-events-none">Rp</span>
                                    <input
                                        type="text"
                                        value={formData.price?.replace(/[^0-9.]/g, '') || ''}
                                        onChange={handlePriceChange}
                                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-800 bg-white"
                                        required
                                        placeholder="150.000"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Toggle */}
                    <div className="flex items-center justify-between bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                        <span className="font-bold text-gray-700 text-sm">Status Aktif</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={formData.status === 'Active'}
                                onChange={e => setFormData({ ...formData, status: e.target.checked ? 'Active' : 'Inactive' })}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
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
