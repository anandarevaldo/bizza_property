import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate: Date | null;
    onChange: (date: Date) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ isOpen, onClose, selectedDate, onChange }) => {
    const [viewDate, setViewDate] = useState(selectedDate || new Date());
    const containerRef = useRef<HTMLDivElement>(null);

    // Sync viewDate when popup opens or selectedDate changes
    useEffect(() => {
        if (isOpen) {
            setViewDate(selectedDate || new Date());
        }
    }, [isOpen, selectedDate]);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();

    const daysCount = daysInMonth(currentYear, currentMonth);
    const startDay = firstDayOfMonth(currentYear, currentMonth);

    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const generateDays = () => {
        const days = [];

        // Empty slots for previous month
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
        }

        // Days of current month
        for (let day = 1; day <= daysCount; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const isSelected = selectedDate &&
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear();

            const isToday = new Date().toDateString() === date.toDateString();

            days.push(
                <button
                    key={day}
                    onClick={() => {
                        onChange(date);
                        onClose();
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
                        ${isSelected
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                            : isToday
                                ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                >
                    {day}
                </button>
            );
        }
        return days;
    };

    const handlePrevMonth = () => {
        setViewDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(currentYear, currentMonth + 1, 1));
    };

    return (
        <div ref={containerRef} className="absolute top-full left-0 mt-4 bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 z-50 w-[340px] animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-gray-900 font-extrabold text-lg">{monthNames[currentMonth]} {currentYear}</h3>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Event Date</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="w-10 text-xs font-bold text-gray-400 uppercase">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 place-items-center">
                {generateDays()}
            </div>
        </div>
    );
};
