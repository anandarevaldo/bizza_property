'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, User, ChevronRight, ChevronLeft, HardHat, Plus } from 'lucide-react';
import { MandorScheduleEditModal } from '../schedule-mandor/MandorScheduleEditModal';
import { MandorScheduleDetailModal } from '../schedule-mandor/MandorScheduleDetailModal';

export interface Schedule {
    id: string;
    customerName: string;
    service: string;
    date: string;
    time: string;
    address: string;
    mandor: string;
    mandorId?: number;
    status: 'Need Validation' | 'On Progress' | 'Cancel' | 'Done';
    assignedHandymanId?: number; // Kept for backward compat
    assignedHandymen?: { id: number; name: string; knownSkill?: string }[]; // New field
    handymanName?: string;
    orderId?: number;
    handymanId?: string;
}

import { scheduleService } from '../../lib/services/scheduleService';
import { orderService } from '@/lib/services/orderService';


// export const initialSchedules: Schedule[] = [
//     { id: '1', customerName: 'Ibu Ratna', service: 'Perbaikan Kebocoran', date: '2025-12-28', time: '10:00', address: 'Jl. Merpati No. 12, Jakarta Selatan', mandor: 'Pak Budi Santoso', status: 'On Progress' },
//     { id: '2', customerName: 'Bapak Hendra', service: 'Instalasi AC', date: '2025-12-28', time: '14:00', address: 'Cluster Harmoni Blok B2, Tangerang', mandor: 'Pak Slamet Riyadi', status: 'On Progress' },
//     { id: '3', customerName: 'Cafe Kopi Kenangan', service: 'Pengecatan Interior', date: '2025-12-29', time: '09:00', address: 'Ruko Mall of Indonesia, Jakarta Utara', mandor: 'Tim Pak Joko', status: 'Done' },
//     { id: '4', customerName: 'Bapak Budi', service: 'Renovasi Dapur', date: '2025-11-15', time: '08:00', address: 'Jl. Melati No. 5, Jakarta Barat', mandor: 'Tim Pak Asep', status: 'Done' },
// ];

export const MandorScheduleList: React.FC = () => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [viewDate, setViewDate] = useState(new Date()); // State for the current month view

    // Separate states for modals
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const [currentSchedule, setCurrentSchedule] = useState<Schedule | null>(null);

    // Fetch schedules for Mandor
    React.useEffect(() => {
        const fetchSchedules = async () => {
            setIsLoading(true);
            try {
                // Use the new OrderService method that handles Auth/Fallback
                const data = await orderService.getMyMandorOrders();
                
                const mappedSchedules: Schedule[] = (data || []).map((o: any) => {
                    // Map Status
                    let status: Schedule['status'] = 'Need Validation';
                    if (o.status_pesanan === 'ON_PROGRESS') status = 'On Progress';
                    else if (o.status_pesanan === 'DONE') status = 'Done';
                    else if (o.status_pesanan === 'CANCEL') status = 'Cancel';
                    
                    // Format Date (Use jadwal_survey if exists, else tanggal_pesan)
                    const dateObj = o.jadwal_survey ? new Date(o.jadwal_survey) : new Date(o.tanggal_pesan);
                    const dateStr = dateObj.toISOString().split('T')[0];

                    // Map Assignments
                    const assignedHandymen = o.assignments?.map((a: any) => ({
                        id: a.anggota?.anggota_id,
                        name: a.anggota?.nama,
                        knownSkill: a.anggota?.keahlian
                    })) || [];

                    // Fallback for single assignment (legacy/admin view compatibility)
                    // If assignedHandymen is empty but o.handyman (joined via tukang_id) exists, use it?
                    // But orderService fetch was updated to return assignments. 
                    // Let's rely on assignments mostly, but if empty, check legacy ID for robustness.
                    
                    return {
                        id: o.pesanan_id?.toString(),
                        customerName: o.customer_name || 'Anonymous',
                        service: o.layanan?.nama_layanan || o.tipe_pesanan,
                        date: dateStr,
                        time: o.jam_survey || '09:00', // Default time if missing
                        address: o.alamat_proyek || 'Lokasi tidak tersedia',
                        mandor: o.mandor?.nama || 'Saya',
                        mandorId: o.mandor_id,
                        status: status,
                        orderId: o.pesanan_id,
                        assignedHandymanId: o.tukang_id, // Map DB column to UI model
                        assignedHandymen: assignedHandymen,
                        handymanName: assignedHandymen.map((h: any) => h.name).join(', '), // Display comma separated names
                        handymanSkill: assignedHandymen.length > 0 ? assignedHandymen[0].knownSkill : '' // Just show first skill or mix
                    };
                });

                setSchedules(mappedSchedules);
            } catch (error) {
                console.error('Error fetching schedules:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSchedules();
    }, [isEditModalOpen]); // Re-fetch when edit modal closes

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'On Progress': return 'bg-yellow-500 text-white shadow-yellow-200';
            case 'Need Validation': return 'bg-blue-500 text-white shadow-blue-200';
            case 'Cancel': return 'bg-red-500 text-white shadow-red-200';
            case 'Done': return 'bg-green-600 text-white shadow-green-200';
            default: return 'bg-gray-500 text-white';
        }
    };

    const handleDateClick = (day: number) => {
        const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        // Adjust for timezone offset to get correct YYYY-MM-DD
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset * 60 * 1000));
        const dateString = localDate.toISOString().split('T')[0];
        setSelectedDate(dateString);
    };

    const handlePrevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay(); // 0 = Sunday
    };

    // Helper to check status for a specific date
    const getDateStatus = (day: number) => {
        const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset * 60 * 1000));
        const dateString = localDate.toISOString().split('T')[0];

        const daySchedules = schedules.filter(s => s.date === dateString);
        if (daySchedules.length === 0) return null;

        // Return status priority: On Progress > Done
        if (daySchedules.some(s => s.status === 'On Progress')) return 'bg-yellow-500';
        if (daySchedules.some(s => s.status === 'Need Validation')) return 'bg-blue-500';
        if (daySchedules.some(s => s.status === 'Done')) return 'bg-green-600';
        if (daySchedules.some(s => s.status === 'Cancel')) return 'bg-red-500';
        return 'bg-gray-400';
    };

    const handleEdit = (schedule: Schedule) => {
        setCurrentSchedule(schedule);
        setIsEditModalOpen(true);
    };

    const handleViewDetail = (schedule: Schedule) => {
        setCurrentSchedule(schedule);
        setIsDetailModalOpen(true);
    };

    const handleSaveSchedule = async (scheduleData: Partial<Schedule> & { assignedHandymenIds?: number[] }, isNew: boolean) => {
        try {
            if (isNew) {
                // Should not happen in Mandor view usually, but if enabled
                // await scheduleService.create(scheduleData as any);
                console.warn('Creating new schedules not implemented for Mandor view yet');
            } else {
                // Use orderService to update the real database
                const orderId = (scheduleData as Schedule).id;
                
                // 1. Update basic info
                await orderService.updateOrder(orderId, {
                    // Update allowed fields
                    status_pesanan: scheduleData.status === 'On Progress' ? 'ON_PROGRESS' : 
                                  scheduleData.status === 'Done' ? 'DONE' : 
                                  scheduleData.status === 'Cancel' ? 'CANCEL' : 'NEED_VALIDATION',
                    jam_survey: scheduleData.time,
                    jadwal_survey: scheduleData.date ? new Date(scheduleData.date).toISOString() : undefined,
                    customer_name: scheduleData.customerName,
                    alamat_proyek: scheduleData.address,
                    // tukang_id: scheduleData.assignedHandymanId // REMOVED: Now handled by updateOrderAssignments
                });

                // 2. Update Assignments if provided
                if (scheduleData.assignedHandymenIds) {
                    await orderService.updateOrderAssignments(parseInt(orderId), scheduleData.assignedHandymenIds);
                }
            }
            // Refresh logic handles the update via useEffect dependency or manual refresh
            setIsEditModalOpen(false);
            // Trigger refresh manually or rely on useEffect depend on isEditModalOpen toggle
        } catch (error) {
            console.error('Error saving:', error);
            alert('Gagal menyimpan perubahan. Silakan coba lagi.');
        }
    };

    const filteredSchedules = schedules.filter(s => s.date === selectedDate);
    const displaySchedules = filteredSchedules;

    const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
    // M S S R K J S correspond to Sunday(0) to Saturday(6)

    const weekHeaders = ['M', 'S', 'S', 'R', 'K', 'J', 'S']; // Minggu, Senin, Selasa, Rabu, Kamis, Jum'at, Sabtu

    return (
        <div className="space-y-8 animate-fade-in font-sans">
            {/* Header */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-gray-100 border border-gray-100 relative overflow-hidden">
                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-orange-50 rounded-2xl text-orange-600">
                                <CalendarIcon className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-gray-900">Jadwal Tugas Tim</h2>
                        </div>
                        <p className="text-gray-500 font-medium ml-1">Kelola penugasan dan jadwal harian tim Anda.</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-8">
                {/* Calendar Side */}
                <div className="xl:w-1/3">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100 sticky top-6">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-black text-xl text-gray-900">
                                {viewDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                            </h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={handlePrevMonth}
                                    className="p-2.5 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100"
                                >
                                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <button
                                    onClick={handleNextMonth}
                                    className="p-2.5 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100"
                                >
                                    <ChevronRight className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-2 text-center mb-4">
                            {weekHeaders.map((d, i) => <div key={`${d}-${i}`} className="text-gray-400 font-extrabold text-xs py-2">{d}</div>)}

                            {/* Empty slots for previous month */}
                            {[...Array(firstDay)].map((_, i) => (
                                <div key={`empty-${i}`} className="aspect-square"></div>
                            ))}

                            {/* Days */}
                            {[...Array(daysInMonth)].map((_, i) => {
                                const day = i + 1;
                                const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
                                const offset = date.getTimezoneOffset();
                                const localDate = new Date(date.getTime() - (offset * 60 * 1000));
                                const dateString = localDate.toISOString().split('T')[0];
                                const isSelected = selectedDate === dateString;
                                const statusDot = getDateStatus(day);

                                return (
                                    <div
                                        key={day}
                                        onClick={() => handleDateClick(day)}
                                        className={`aspect-square flex flex-col items-center justify-center rounded-2xl font-bold text-sm cursor-pointer transition-all hover:scale-110 relative
                                            ${isSelected ? 'bg-blue-600 text-white shadow-lg shadow-blue-300' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
                                    >
                                        {day}
                                        {statusDot && !isSelected && (
                                            <div className={`w-1.5 h-1.5 rounded-full mt-1 ${statusDot}`}></div>
                                        )}
                                        {statusDot && isSelected && (
                                            <div className="w-1.5 h-1.5 rounded-full mt-1 bg-white/70"></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <h4 className="font-extrabold text-gray-900 mb-4 text-sm uppercase tracking-wider">Status</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                                    <div className="w-3 h-3 rounded-full bg-blue-600 shadow-sm shadow-blue-200"></div> Confirmed
                                </div>
                                <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                                    <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm shadow-yellow-200"></div> Pending
                                </div>
                                <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                                    <div className="w-3 h-3 rounded-full bg-green-600 shadow-sm shadow-green-200"></div> Completed
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* List Side */}
                <div className="xl:w-2/3 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="font-black text-2xl text-gray-900">Jadwal {new Date(selectedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</h3>
                        <span className="text-xs font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">{displaySchedules.length} Appointment</span>
                    </div>

                    {displaySchedules.length === 0 ? (
                        <div className="bg-white rounded-[2.5rem] p-16 border border-gray-100 shadow-xl shadow-gray-100 text-center flex flex-col items-center justify-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6 text-gray-300">
                                <CalendarIcon className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">Tidak ada jadwal</h3>
                            <p className="text-gray-500 font-medium max-w-xs mx-auto">Belum ada penugasan kerja untuk tim pada tanggal ini.</p>
                        </div>
                    ) : (
                        displaySchedules.map(schedule => (
                            <div key={schedule.id} className="group relative bg-white border border-gray-100 rounded-[2.5rem] p-8 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50 transition-all duration-300">
                                <div className="absolute top-8 right-8 z-10">
                                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm ${getStatusColor(schedule.status)}`}>
                                        {schedule.status}
                                    </span>
                                </div>

                                <div className="flex flex-col md:flex-row gap-8">
                                    {/* Date Box */}
                                    <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[2rem] flex flex-col items-center justify-center shrink-0 text-blue-600 border border-blue-100 shadow-inner group-hover:scale-105 transition-transform duration-300">
                                        <span className="text-xs font-black uppercase tracking-wider text-blue-400">{new Date(schedule.date).toLocaleString('default', { month: 'short' })}</span>
                                        <span className="text-4xl font-black">{new Date(schedule.date).getDate()}</span>
                                    </div>

                                    <div className="flex-1 pt-1">
                                        <h4 className="font-black text-gray-900 text-2xl mb-2">{schedule.service}</h4>
                                        <div className="flex items-center gap-2 text-gray-500 text-sm font-bold mb-6">
                                            <Clock className="w-4 h-4 text-orange-500" />
                                            <span>{schedule.time} WIB</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 group-hover:bg-white group-hover:border-blue-100 transition-colors">
                                                <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                                                    <User className="w-3.5 h-3.5" /> Customer
                                                </div>
                                                <p className="font-bold text-gray-900 ml-1">{schedule.customerName}</p>
                                            </div>
                                            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 group-hover:bg-white group-hover:border-blue-100 transition-colors">
                                                <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                                                    <HardHat className="w-3.5 h-3.5" /> Ditugaskan ke
                                                </div>
                                                <p className="font-bold text-gray-900">{schedule.mandor}</p>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex items-start gap-3 text-gray-500 text-sm font-medium bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
                                            <MapPin className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                                            <span className="leading-relaxed">{schedule.address}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(schedule)} className="px-6 py-3 rounded-2xl bg-white border-2 border-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-50 hover:border-gray-200 transition-all">Edit Jadwal</button>
                                    <button onClick={() => handleViewDetail(schedule)} className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:-translate-y-0.5">Detail Lengkap</button>
                                </div>
                            </div>
                        )))}
                </div>
            </div>

            <MandorScheduleEditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                schedule={currentSchedule}
                selectedDate={selectedDate}
                onSave={handleSaveSchedule}
            />

            <MandorScheduleDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                schedule={currentSchedule}
                onEdit={handleEdit}
            />
        </div>
    );
};
