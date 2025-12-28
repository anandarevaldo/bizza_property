
import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Trash2, CheckCircle2, Save, Calendar, FolderOpen, AlignLeft, ChevronDown } from 'lucide-react';
import { PortfolioItem } from './PortfolioList';
import { categories, serviceTypes } from '../Layanan/RepairServiceSelection/constants';

interface PortfolioEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    portfolio: PortfolioItem | null;
    onSave: (data: Partial<PortfolioItem>) => void;
}

export const PortfolioEditModal: React.FC<PortfolioEditModalProps> = ({ isOpen, onClose, portfolio, onSave }) => {
    const [formData, setFormData] = useState<Partial<PortfolioItem>>({ images: [] });
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            if (portfolio) {
                setFormData(portfolio);
            } else {
                setFormData({ images: [], date: new Date().toISOString().split('T')[0] });
            }
        }
    }, [isOpen, portfolio]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newImages: string[] = [];
            Array.from(e.target.files).forEach(file => {
                const url = URL.createObjectURL(file);
                newImages.push(url);
            });
            setFormData(prev => ({
                ...prev,
                images: [...(prev.images || []), ...newImages]
            }));
        }
    };

    const removeImage = (index: number) => {
        const updatedImages = [...(formData.images || [])];
        updatedImages.splice(index, 1);
        setFormData({ ...formData, images: updatedImages });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    // Extract categories for dropdown
    const categoryOptions = Object.values(categories).map(c => c.title);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl animate-scale-up border border-gray-100 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-100 bg-white rounded-t-[2rem]">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900">{portfolio ? 'Edit Proyek' : 'Tambah Proyek'}</h3>
                        <p className="text-gray-500 text-sm font-medium mt-1">Bagikan hasil karya terbaikmu.</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors group">
                        <X className="w-6 h-6 text-gray-400 group-hover:text-gray-600" />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 md:p-8 space-y-8">
                    <form id="portfolio-form" onSubmit={handleSubmit} className="space-y-6">

                        {/* Image Upload Section */}
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-gray-700">Galeri Foto</label>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {formData.images?.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm border border-gray-100">
                                        <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}

                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
                                >
                                    <div className="p-3 bg-gray-50 rounded-full mb-2 group-hover:bg-blue-100 transition-colors">
                                        <Upload className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 group-hover:text-blue-600">Upload Foto</span>
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                multiple
                                accept="image/*"
                                className="hidden"
                            />
                            <p className="text-xs text-gray-400 font-medium">* Bisa upload lebih dari 1 foto. Format: JPG, PNG.</p>
                        </div>

                        {/* Info Group */}
                        <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100 space-y-5">
                            <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                <FolderOpen className="w-5 h-5 text-blue-600" /> Detail Proyek
                            </h4>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Judul Proyek</label>
                                <input
                                    type="text"
                                    value={formData.title || ''}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-800 bg-white"
                                    placeholder="Contoh: Renovasi Rumah Minimalis"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Kategori</label>
                                    <div className="relative">
                                        <select
                                            value={formData.category || ''}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-800 bg-white appearance-none"
                                            required
                                        >
                                            <option value="" disabled>Pilih Jenis Layanan</option>
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
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tanggal Selesai</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={formData.date || ''}
                                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-800 bg-white"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Deskripsi Pekerjaan</label>
                                <textarea
                                    value={formData.description || ''}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-medium text-gray-700 bg-white min-h-[120px]"
                                    placeholder="Jelaskan detail pekerjaan yang dilakukan..."
                                    rows={4}
                                    required
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer Action */}
                <div className="p-6 md:p-8 border-t border-gray-100 bg-white rounded-b-[2rem]">
                    <button
                        type="submit"
                        form="portfolio-form"
                        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3"
                    >
                        <CheckCircle2 className="w-6 h-6" />
                        Simpan Proyek
                    </button>
                </div>
            </div>
        </div>
    );
};
