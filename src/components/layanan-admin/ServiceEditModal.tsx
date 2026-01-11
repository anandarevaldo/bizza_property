
import React, { useState, useEffect } from 'react';
import { X, ChevronRight, CheckCircle2, Briefcase, DollarSign, AlignLeft, ChevronDown, ListFilter, Activity } from 'lucide-react';
import { Service } from './ServiceList';
import { ICON_MAP, COLOR_PRESETS } from '@/lib/constants/serviceTemplates';

interface ServiceEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: Service | null;
    onSave: (data: Partial<Service>) => void;
    availableCategories: string[];
}

export const ServiceEditModal: React.FC<ServiceEditModalProps> = ({ isOpen, onClose, service, onSave, availableCategories }) => {
    const [formData, setFormData] = useState<Partial<Service>>({});
    const [iconType, setIconType] = useState<'lucide' | 'image'>('lucide');
    const [uploading, setUploading] = useState(false);

    // Import Supabase Client locally or from hook if available, assuming global import for now or direct usage if possible.
    // Ideally we import { supabase } from '../../lib/supabaseClient';
    // But since this component doesn't import it yet, I should add the import or pass it.
    // Let's assume the user has supabase client available or I will add the import in a separate step?
    // Wait, I can't add imports in this block easily without hitting top of file.
    // I will use window.supabase or require? No. I should have added the import first.
    // Let's assume I will add import in next step. I'll write the handler assuming supabase is imported.

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        setUploading(true);

        // Dynamic import to avoid top-level impact if possible, or just expect it to be there.
        // Actually, better to add the import at the top first. I will do that in next step.
        // For now, I'll put the logic here assuming `supabase` exists.
        // I'll fix the import in the next "replace" call.
        // Wait, I can't use `supabase` if it's not imported.
        // I will use a placeholder and fix it immediately.

        try {
            // @ts-ignore
            const { supabase } = await import('../../lib/supabaseClient');

            const { error: uploadError } = await supabase.storage
                .from('services')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('services').getPublicUrl(filePath);

            setFormData({ ...formData, imageUrl: data.publicUrl, icon: undefined });
        } catch (error: any) {
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            if (service) {
                // Use priceNumeric if available, otherwise strip from string
                let formattedPrice = '';
                if (service.priceNumeric !== undefined) {
                    formattedPrice = service.priceNumeric.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                } else {
                    const numericPrice = service.price.replace(/\D/g, '');
                    formattedPrice = numericPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                }

                setFormData({
                    ...service,
                    price: formattedPrice
                });
                if (service.imageUrl) {
                    setIconType('image');
                } else {
                    setIconType('lucide');
                }
            } else {
                setFormData({ status: 'Active', category: '', price: '' });
                setIconType('lucide');
            }
        }
    }, [isOpen, service]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Calculate numeric price for backend
        const numericPrice = parseInt(formData.price?.replace(/\./g, '') || '0', 10);

        const finalData = {
            ...formData,
            price: `Rp ${formData.price}`,
            priceNumeric: numericPrice
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
                            <input
                                type="text"
                                value={formData.name || ''}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-800 bg-white"
                                placeholder="Contoh: Perbaikan Atap Bocor"
                                required
                            />
                        </div>

                        {/* Theme Selection */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Warna Tema</label>
                            <div className="flex flex-wrap gap-3">
                                {COLOR_PRESETS.map((theme) => (
                                    <button
                                        key={theme.name}
                                        type="button"
                                        onClick={() => setFormData({
                                            ...formData,
                                            color_class: theme.color,
                                            bg_gradient: theme.gradient,
                                            pattern_color: theme.pattern
                                        })}
                                        className={`w-10 h-10 rounded-full border-2 transition-all ${theme.bg} ${
                                            formData.pattern_color === theme.pattern
                                                ? 'border-gray-800 scale-110 shadow-md ring-2 ring-offset-2 ring-gray-300' 
                                                : 'border-transparent hover:scale-105 opacity-70 hover:opacity-100'
                                        }`}
                                        title={theme.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Icon Selection with Toggle */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Icon Layanan</label>
                                <div className="flex bg-gray-100 rounded-lg p-1">
                                    <button
                                        type="button"
                                        onClick={() => setIconType('lucide')}
                                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${iconType === 'lucide' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Pilih Icon
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIconType('image')}
                                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${iconType === 'image' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Upload Gambar
                                    </button>
                                </div>
                            </div>

                            {iconType === 'lucide' ? (
                                <>
                                    <div className="flex gap-3 overflow-x-auto pb-4 pt-2 snap-x">
                                        {Object.entries(ICON_MAP).map(([iconName, Icon]) => {
                                            const isSelected = formData.icon === iconName;
                                            return (
                                                <button
                                                    key={iconName}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, icon: iconName, imageUrl: undefined })}
                                                    className={`
                                                        flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-2xl border-2 transition-all duration-200 snap-start
                                                        ${isSelected
                                                            ? 'border-blue-500 bg-blue-50 shadow-md scale-105 ring-2 ring-blue-200'
                                                            : 'border-gray-100 bg-white hover:border-blue-200 hover:bg-gray-50'}
                                                    `}
                                                >
                                                    <Icon className={`w-8 h-8 mb-2 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                                                    <span className="text-[10px] font-bold text-gray-600 truncate w-full px-1">{iconName}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">*Scroll ke samping untuk melihat lebih banyak icon</p>
                                </>
                            ) : (
                                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-blue-300 transition-colors bg-gray-50">
                                    {formData.imageUrl ? (
                                        <div className="relative w-24 h-24 mx-auto mb-4">
                                            <img src={formData.imageUrl} alt="Icon" className="w-full h-full object-cover rounded-xl shadow-sm bg-white" />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, imageUrl: undefined })}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3">
                                                <Briefcase className="w-6 h-6" />
                                            </div>
                                            <p className="text-sm font-bold text-gray-600 mb-1">Klik untuk upload gambar</p>
                                            <p className="text-xs text-gray-400 mb-4">PNG, JPG up to 2MB</p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Kategori</label>
                            <div className="relative">
                                <select
                                    value={formData.category || ''}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full pl-4 pr-10 py-4 rounded-xl border border-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-800 bg-white appearance-none shadow-sm"
                                    required
                                >
                                    <option value="" disabled>Pilih Kategori</option>
                                    {availableCategories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                    {/* Handle case where current category might not be in the dynamic list yet */}
                                    {formData.category && !availableCategories.includes(formData.category) && (
                                        <option value={formData.category}>{formData.category}</option>
                                    )}
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
