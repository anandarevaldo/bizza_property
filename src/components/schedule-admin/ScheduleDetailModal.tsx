'use client';

import React from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, User, HardHat, Phone, MessageSquare, X } from 'lucide-react';

interface Schedule {
    id: string;
    customerName: string;
    service: string;
    date: string;
    time: string;
    address: string;
    mandor: string;
    status: 'Need Validation' | 'On Progress' | 'Cancel' | 'Done';
}

interface ScheduleDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    schedule: Schedule | null;
    onEdit: (schedule: Schedule) => void;
}

export const ScheduleDetailModal: React.FC<ScheduleDetailModalProps> = ({ isOpen, onClose, schedule, onEdit }) => {
    if (!isOpen || !schedule) return null;

    const handleCall = () => {
        window.location.href = `tel:08123456789`; // Placeholder as data doesn't have phone
    };

    const handleChat = () => {
        window.open(`https://wa.me/628123456789`, '_blank'); // Placeholder
    };

    const handleMaps = () => {
        const query = encodeURIComponent(schedule.address);
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-[1.5rem] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up border border-gray-100">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-xl font-black text-gray-900">Detail Jadwal</h2>
                            <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${schedule.status === 'On Progress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                schedule.status === 'Done' ? 'bg-green-50 text-green-600 border-green-100' :
                                    schedule.status === 'Need Validation' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                                        'bg-red-50 text-red-600 border-red-100'
                                }`}>
                                {schedule.status}
                            </span>
                        </div>
                        <p className="text-gray-500 font-medium text-xs">ID: <span className="text-gray-900 font-bold">#{schedule.id}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors group border border-transparent hover:border-gray-200">
                        <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Primary Info Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-blue-600 font-bold mb-1 flex items-center gap-2 text-xs"><CalendarIcon className="w-3.5 h-3.5" /> Tanggal Kunjungan</p>
                                <h3 className="text-xl font-black text-gray-900 mb-1">{new Date(schedule.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}</h3>
                                <p className="text-gray-600 font-medium flex items-center gap-2 text-sm"><Clock className="w-4 h-4" /> Pukul {schedule.time} WIB</p>
                            </div>
                            <div className="bg-white p-3 rounded-xl shadow-sm">
                                <Clock className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    {/* Customer & Location */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-3">
                            <h4 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                                <User className="w-4 h-4 text-blue-600" /> Customer
                            </h4>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Nama</p>
                                <p className="font-bold text-gray-900">{schedule.customerName}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handleCall} className="flex-1 py-1.5 bg-white rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors flex items-center justify-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Hubungi</button>
                                <button onClick={handleChat} className="flex-1 py-1.5 bg-white rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors flex items-center justify-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> Chat</button>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-3">
                            <h4 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-red-500" /> Lokasi
                            </h4>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Alamat</p>
                                <p className="font-medium text-gray-700 text-sm leading-relaxed">{schedule.address}</p>
                            </div>
                            <button onClick={handleMaps} className="w-full py-1.5 bg-white rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center justify-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5" /> Buka di Maps
                            </button>
                        </div>
                    </div>

                    {/* Technician Info */}
                    <div className="bg-white border-2 border-gray-100 p-5 rounded-2xl">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                            <HardHat className="w-4 h-4 text-orange-500" /> Petugas Lapangan
                        </h4>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-lg">
                                {schedule.mandor.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-gray-900 text-sm">{schedule.mandor}</p>
                                <p className="text-gray-500 text-xs font-medium">{schedule.service}</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Footer for Detail */}
                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                        <button onClick={() => { onClose(); onEdit(schedule); }} className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-200">
                            Edit Jadwal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
