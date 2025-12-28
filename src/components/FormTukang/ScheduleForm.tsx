import React from 'react';
import { Calendar, ChevronDown, ChevronRight, Clock } from 'lucide-react';

interface ScheduleFormProps {
    currentDate: Date;
    selectedDate: Date | null;
    selectedTimeSlot: string | null;
    onDateChange: (date: Date) => void;
    onTimeChange: (time: string) => void;
    onMonthChange: (direction: 'prev' | 'next') => void;
}

export const ScheduleForm: React.FC<ScheduleFormProps> = ({
    currentDate,
    selectedDate,
    selectedTimeSlot,
    onDateChange,
    onTimeChange,
    onMonthChange,
}) => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Tanggal Survey <span className="text-red-500">*</span>
            </h2>

            {/* Calendar UI */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6 px-2">
                    <button onClick={() => onMonthChange('prev')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ChevronDown className="w-5 h-5 text-gray-600 rotate-90" />
                    </button>
                    <h3 className="text-lg font-bold text-gray-900">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h3>
                    <button onClick={() => onMonthChange('next')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Days Header */}
                <div className="grid grid-cols-7 mb-4 text-center">
                    {['M', 'S', 'S', 'R', 'K', 'J', 'S'].map((day, i) => (
                        <div key={i} className="text-sm font-bold text-gray-400 py-2">{day}</div>
                    ))}
                </div>

                {/* Dates Grid */}
                <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center">
                    {[...Array(firstDayOfMonth)].map((_, i) => <div key={`empty-${i}`}></div>)}
                    {[...Array(daysInMonth)].map((_, i) => {
                        const day = i + 1;
                        const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        const isPast = dateToCheck < today;
                        const isSelected = selectedDate
                            ? dateToCheck.toDateString() === selectedDate.toDateString()
                            : false;

                        return (
                            <div key={day} className="flex justify-center">
                                <button
                                    onClick={() => !isPast && onDateChange(dateToCheck)}
                                    disabled={isPast}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
                                    ${isSelected
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110'
                                            : isPast
                                                ? 'text-gray-300 cursor-not-allowed bg-transparent'
                                                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                        }
                                `}
                                >
                                    {day}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Waktu Survey */}
            <div className="pt-6 border-t border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Waktu Survey
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {[
                        '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
                        '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
                    ].map((t) => (
                        <button
                            key={t}
                            onClick={() => onTimeChange(t)}
                            className={`py-2 px-1 rounded-xl border-2 font-bold flex items-center justify-center gap-1 transition-all text-sm
                            ${selectedTimeSlot === t
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 bg-white text-gray-500 hover:border-blue-200 hover:text-blue-600'
                                }
                        `}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
