'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, User, ChevronRight, ChevronLeft, HardHat, Plus } from 'lucide-react';
import { ScheduleEditModal } from './ScheduleEditModal';
import { ScheduleDetailModal } from './ScheduleDetailModal';

export interface Schedule {
    id: string;
    customerName: string;
    service: string;
    date: string;
    time: string;
    address: string;
    mandor: string;
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Request Survey';
}

export const initialSchedules: Schedule[] = [
    { id: '1', customerName: 'Ibu Ratna', service: 'Perbaikan Kebocoran', date: '2025-12-28', time: '10:00', address: 'Jl. Merpati No. 12, Jakarta Selatan', mandor: 'Pak Budi Santoso', status: 'Confirmed' },
    { id: '2', customerName: 'Bapak Hendra', service: 'Instalasi AC', date: '2025-12-28', time: '14:00', address: 'Cluster Harmoni Blok B2, Tangerang', mandor: 'Pak Slamet Riyadi', status: 'Pending' },
    { id: '3', customerName: 'Cafe Kopi Kenangan', service: 'Pengecatan Interior', date: '2025-12-29', time: '09:00', address: 'Ruko Mall of Indonesia, Jakarta Utara', mandor: 'Tim Pak Joko', status: 'Confirmed' },
];

export const ScheduleList: React.FC = () => {
    const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [viewDate, setViewDate] = useState(new Date());

    // Separate states for modals
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const [currentSchedule, setCurrentSchedule] = useState<Schedule | null>(null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Confirmed': return 'bg-blue-600 text-white shadow-blue-200';
            case 'Pending': return 'bg-yellow-500 text-white shadow-yellow-200';
            case 'Completed': return 'bg-green-600 text-white shadow-green-200';
            case 'Cancelled': return 'bg-red-500 text-white shadow-red-200';
            case 'Request Survey': return 'bg-purple-600 text-white shadow-purple-200';
            default: return 'bg-gray-500 text-white';
        }
    };

    const handleDateClick = (day: number) => {
        const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
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

    const getDateStatus = (day: number) => {
        const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset * 60 * 1000));
        const dateString = localDate.toISOString().split('T')[0];

        const daySchedules = schedules.filter(s => s.date === dateString);
        if (daySchedules.length === 0) return null;

        if (daySchedules.some(s => s.status === 'Confirmed')) return 'bg-blue-600';
        if (daySchedules.some(s => s.status === 'Request Survey')) return 'bg-purple-600';
        if (daySchedules.some(s => s.status === 'Pending')) return 'bg-yellow-500';
        if (daySchedules.some(s => s.status === 'Completed')) return 'bg-green-600';
        return 'bg-gray-400';
    };

    const handleAdd = () => {
        setCurrentSchedule(null);
        setIsEditModalOpen(true);
    };

    const handleEdit = (schedule: Schedule) => {
        setCurrentSchedule(schedule);
        setIsEditModalOpen(true);
    };

    const handleViewDetail = (schedule: Schedule) => {
        setCurrentSchedule(schedule);
        setIsDetailModalOpen(true);
    };

    const handleSaveSchedule = (scheduleData: Partial<Schedule>, isNew: boolean) => {
        if (isNew) {
            const newSchedule: Schedule = {
                ...scheduleData as Schedule,
                id: Math.random().toString(36).substr(2, 9),
            };
            setSchedules([...schedules, newSchedule]);
        } else {
            setSchedules(schedules.map(s => s.id === (scheduleData as Schedule).id ? { ...s, ...scheduleData } as Schedule : s));
        }
    };

    const filteredSchedules = schedules.filter(s => s.date === selectedDate);
    const displaySchedules = filteredSchedules;

    const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
    const weekHeaders = ['M', 'S', 'S', 'R', 'K', 'J', 'S'];

    return (
        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-100 border border-gray-100 animate-fade-in relative z-10">
            <div className="flex items-center gap-3 mb-10">
                <div className="p-3 bg-orange-50 rounded-2xl text-orange-600">
                    <CalendarIcon className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900">Jadwal & Detail</h2>
                    <p className="text-gray-500 font-medium">Kalender operasional dan penugasan tukang.</p>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-10">
                {/* Calendar Side */}
                <div className="xl:w-1/3">
                    <div className="bg-white rounded-[2rem] p-8 border-2 border-gray-100 shadow-lg shadow-gray-50 sticky top-4">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-exrabold text-xl text-gray-900 font-bold">
                                {viewDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                            </h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={handlePrevMonth}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <button
                                    onClick={handleNextMonth}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-3 text-center mb-4">
                            {weekHeaders.map(d => <div key={d} className="text-gray-400 font-bold text-sm py-2">{d}</div>)}

                            {[...Array(firstDay)].map((_, i) => (
                                <div key={`empty-${i}`} className="aspect-square"></div>
                            ))}

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
                                        className={`aspect-square flex flex-col items-center justify-center rounded-xl font-bold text-sm cursor-pointer transition-all hover:scale-110 relative
                                            ${isSelected ? 'bg-blue-600 text-white shadow-lg shadow-blue-300' : 'text-gray-700 hover:bg-blue-50'}`}
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
                            <h4 className="font-bold text-gray-900 mb-4">Legenda Status</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                                    <div className="w-3 h-3 rounded-full bg-blue-600 shadow-sm shadow-blue-200"></div> Confirmed
                                </div>
                                <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                                    <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm shadow-yellow-200"></div> Pending
                                </div>
                                <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                                    <div className="w-3 h-3 rounded-full bg-green-600 shadow-sm shadow-green-200"></div> Completed
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* List Side */}
                <div className="xl:w-2/3 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-xl text-gray-900">
                            Jadwal {new Date(selectedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </h3>
                        <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{displaySchedules.length} Appointment</span>
                    </div>

                    {displaySchedules.length === 0 ? (
                        <div className="bg-gray-50 rounded-[2rem] p-10 border-2 border-dashed border-gray-200 text-center flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 text-gray-400">
                                <CalendarIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">Tidak ada jadwal</h3>
                            <p className="text-gray-500">Belum ada penugasan untuk tanggal ini.</p>
                        </div>
                    ) : (
                        displaySchedules.map(schedule => (
                            <div key={schedule.id} className="group relative bg-white border-2 border-gray-50 rounded-[2rem] p-6 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300">
                                <div className="absolute top-6 right-6">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-md ${getStatusColor(schedule.status)}`}>
                                        {schedule.status}
                                    </span>
                                </div>

                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Date Box */}
                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex flex-col items-center justify-center shrink-0 text-blue-600 border border-blue-100 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-xs font-bold uppercase tracking-wider">{new Date(schedule.date).toLocaleString('default', { month: 'short' })}</span>
                                        <span className="text-3xl font-black">{new Date(schedule.date).getDate()}</span>
                                    </div>

                                    <div className="flex-1 pt-1">
                                        <h4 className="font-black text-gray-900 text-xl mb-1">{schedule.service}</h4>
                                        <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-4">
                                            <Clock className="w-4 h-4 text-orange-400" />
                                            <span>{schedule.time} WIB</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                                                    <User className="w-4 h-4 text-blue-500" /> Customer
                                                </div>
                                                <p className="font-bold text-gray-900">{schedule.customerName}</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                                                    <HardHat className="w-4 h-4 text-orange-500" /> Ditugaskan ke
                                                </div>
                                                <p className="font-bold text-gray-900">{schedule.mandor}</p>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-start gap-2 text-gray-500 text-sm font-medium">
                                            <MapPin className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                                            <span>{schedule.address}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(schedule)} className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors">Edit Jadwal</button>
                                    <button onClick={() => handleViewDetail(schedule)} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">Detail Lengkap</button>
                                </div>
                            </div>
                        )))}
                    <button
                        onClick={handleAdd}
                        className="w-full py-6 border-2 border-dashed border-gray-200 rounded-[2rem] text-gray-400 font-bold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 group"
                    >
                        <div className="p-2 bg-gray-100 rounded-full group-hover:bg-blue-200 transition-colors text-white group-hover:text-blue-600"><Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-600" /></div>
                        Tambah Jadwal Manual
                    </button>
                </div>
            </div>

            <ScheduleEditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                schedule={currentSchedule}
                selectedDate={selectedDate}
                onSave={handleSaveSchedule}
            />

            <ScheduleDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                schedule={currentSchedule}
                onEdit={handleEdit}
            />
        </div>
    );
};

