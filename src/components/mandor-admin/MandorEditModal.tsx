'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronRight, CheckCircle2, User, Hammer, MapPin, Phone, StickyNote, Activity, ChevronDown, HardHat, Users, Star } from 'lucide-react';
import { Mandor } from '../dashboard-admin/types';
import { serviceTypes } from '../Layanan/RepairServiceSelection/constants';
import { TeamMember } from '../team-mandor/TeamList';

interface MandorEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    mandor: Mandor | null;
    onSave: (data: Partial<Mandor>) => void;
}

const REGIONS = [
    'Jakarta Selatan',
    'Jakarta Barat',
    'Jakarta Timur',
    'Jakarta Utara',
    'Jakarta Pusat',
    'Tangerang',
    'Tangerang Selatan',
    'Bekasi',
    'Depok',
    'Bogor'
];

export const MandorEditModal: React.FC<MandorEditModalProps> = ({ isOpen, onClose, mandor, onSave }) => {
    const [formData, setFormData] = useState<Partial<Mandor>>({});

    useEffect(() => {
        if (isOpen) {
            if (mandor) {
                setFormData(mandor);
            } else {
                setFormData({ status: 'Available', rating: 5.0, specialty: 'Konstruksi Bangunan', totalProjects: 0 });
            }
        }
    }, [isOpen, mandor]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl animate-scale-up border border-gray-100 h-fit max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900">{mandor ? 'Edit Mandor' : 'Tambah Mandor'}</h3>
                        <p className="text-gray-500 text-sm font-medium mt-1">Lengkapi data mitra mandor.</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors group">
                        <X className="w-6 h-6 text-gray-400 group-hover:text-gray-600" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                    {/* Personal Info Group */}
                    <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100 space-y-5">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" /> Informasi Pribadi
                        </h4>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nama Lengkap</label>
                            <input
                                type="text"
                                value={formData.name || ''}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-800 bg-white"
                                required
                                placeholder="Contoh: Pak Mandor Budi"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Keahlian Utama (Spesialisasi)</label>
                            <div className="relative">
                                {/* Extended specialties for Mandor */}
                                <select
                                    value={formData.specialty || ''}
                                    onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                                    className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-800 bg-white appearance-none"
                                    required
                                >
                                    <option value="" disabled>Pilih Keahlian</option>
                                    <option value="Konstruksi Bangunan">Konstruksi Bangunan</option>
                                    <option value="Renovasi Interior">Renovasi Interior</option>
                                    <option value="Renovasi Eksterior">Renovasi Eksterior</option>
                                    <option value="Lansekap & Taman">Lansekap & Taman</option>
                                    <option value="Kelistrikan & Plumbing">Kelistrikan & Plumbing</option>
                                    <option value="Atap & Baja Ringan">Atap & Baja Ringan</option>
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Contact & Location Group */}
                    <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100 space-y-5">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-orange-500" /> Kontak & Lokasi
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Wilayah</label>
                                <div className="relative">
                                    <select
                                        value={formData.location || ''}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-800 bg-white appearance-none"
                                        required
                                    >
                                        <option value="" disabled>Pilih Wilayah</option>
                                        {REGIONS.map(region => (
                                            <option key={region} value={region}>{region}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">No. WhatsApp</label>
                                <input
                                    type="text"
                                    value={formData.phone || ''}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-800 bg-white"
                                    required
                                    placeholder="08..."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Alamat Detail (Opsional)</label>
                            <textarea
                                value={formData.detailedLocation || ''}
                                onChange={e => setFormData({ ...formData, detailedLocation: e.target.value })}
                                className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-medium text-gray-700 bg-white min-h-[100px]"
                                placeholder="Nama jalan, nomor rumah, RT/RW..."
                            />
                        </div>
                    </div>

                    {/* Status Group */}
                    <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100 space-y-5">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-green-500" /> Status Operasional
                        </h4>
                        <div>
                            <div className="relative">
                                <select
                                    value={formData.status || 'Available'}
                                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                    className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-800 bg-white appearance-none"
                                >
                                    <option value="Available">Available (Siap Proyek)</option>
                                    <option value="Busy">Busy (Sedang Proyek)</option>
                                    <option value="Off">Off (Cuti / Tidak Aktif)</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Team Members Section (Info Only) */}
                    <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100 space-y-3">
                        <div className="flex items-center gap-3">
                             <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                                <Users className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-gray-900">Anggota Tim</h4>
                        </div>
                        
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">
                            Manajemen anggota tim dapat dilakukan secara terpisah melalui menu <strong>Data Mandor</strong> di dashboard utama. Anda dapat menambahkan atau menghapus anggota tim setelah data mandor tersimpan.
                        </p>

                        <div className="pt-2">
                             <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1">
                                Kelola Tim via Dashboard <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3">
                        <CheckCircle2 className="w-6 h-6" />
                        Simpan Data Mandor
                    </button>
                </form>
            </div>
        </div>
    );
};
