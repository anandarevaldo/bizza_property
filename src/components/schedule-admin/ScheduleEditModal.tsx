'use client';

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, User, HardHat, CheckCircle2, X, ChevronDown } from 'lucide-react';
import { initialMandors } from '../mandor-admin/MandorList';
import { Mandor } from '../dashboard-admin/types';
import { useServices } from '@/hooks/useServices';

interface Schedule {
    id: string;
    customerName: string;
    service: string;
    date: string;
    time: string;
    address: string;
    mandor: string;
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Request Survey';
}

interface ScheduleEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    schedule: Schedule | null;
    selectedDate: string;
    onSave: (scheduleData: Partial<Schedule>, isNew: boolean) => void;
}

export const ScheduleEditModal: React.FC<ScheduleEditModalProps> = ({ isOpen, onClose, schedule, selectedDate, onSave }) => {
    const [formData, setFormData] = useState<Partial<Schedule>>({});
    const { services: dbServices } = useServices();

    useEffect(() => {
        if (isOpen) {
            if (schedule) {
                setFormData(schedule);
            } else {
                setFormData({ date: selectedDate, status: 'Pending' });
            }
        }
    }, [isOpen, schedule, selectedDate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData, !schedule);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-[1.5rem] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up border border-gray-100">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <div>
                        <h3 className="text-xl font-black text-gray-900">{schedule ? 'Edit Jadwal' : 'Jadwal Baru'}</h3>
                        <p className="text-gray-500 text-xs font-medium mt-1">
                            {schedule ? `Edit data kunjungan` : 'Admin menentukan Mandor untuk proyek ini'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors group border border-transparent hover:border-gray-200">
                        <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Section: Status & Waktu */}
                    <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" /> Waktu & Status
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Tanggal</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={formData.date || ''}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full p-2.5 pl-9 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-bold text-gray-700 text-sm bg-white"
                                        required
                                    />
                                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Jam</label>
                                <div className="relative">
                                    <input
                                        type="time"
                                        value={formData.time || ''}
                                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                                        className="w-full p-2.5 pl-9 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-bold text-gray-700 text-sm bg-white"
                                        required
                                    />
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Status</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['Pending', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
                                    <button
                                        key={status}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, status: status as any })}
                                        className={`px-2 py-2 rounded-lg text-xs font-bold border transition-all ${formData.status === status
                                            ? status === 'Confirmed' ? 'bg-blue-50 border-blue-500 text-blue-700' :
                                                status === 'Pending' ? 'bg-yellow-50 border-yellow-500 text-yellow-700' :
                                                    status === 'Completed' ? 'bg-green-50 border-green-500 text-green-700' :
                                                        'bg-red-50 border-red-500 text-red-700'
                                            : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Section: Customer Info */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-600" /> Informasi Pelanggan
                        </h4>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nama Pelanggan</label>
                                <input
                                    type="text"
                                    value={formData.customerName || ''}
                                    onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-sm"
                                    placeholder="Contoh: Ibu Siti"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Alamat Lengkap</label>
                                <div className="relative">
                                    <textarea
                                        value={formData.address || ''}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full p-3 pl-10 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-sm min-h-[80px]"
                                        placeholder="Jl. Contoh No. 123..."
                                        required
                                    />
                                    <MapPin className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section: Allocation */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <HardHat className="w-4 h-4 text-blue-600" /> Detail Penugasan
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Keahlian</label>
                                <div className="relative">
                                    <select
                                        value={formData.service || ''}
                                        onChange={e => setFormData({ ...formData, service: e.target.value })}
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-sm appearance-none bg-white"
                                        required
                                    >
                                        <option value="" disabled>Pilih Keahlian</option>
                                        {dbServices.map((service) => (
                                            <option key={service.id} value={service.name}>
                                                {service.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Mandor (Penanggung Jawab)</label>
                                <div className="relative">
                                    <select
                                        value={formData.mandor || ''}
                                        onChange={e => setFormData({ ...formData, mandor: e.target.value })}
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-sm appearance-none bg-white"
                                        required
                                    >
                                        <option value="" disabled>Pilih Mandor</option>
                                        {initialMandors.map((mandor: Mandor) => (
                                            <option key={mandor.id} value={mandor.name}>
                                                {mandor.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-3 rounded-xl font-bold text-gray-500 text-sm hover:bg-gray-50 hover:text-gray-700 transition-all"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-200 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
