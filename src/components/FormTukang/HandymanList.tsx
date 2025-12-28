import React from 'react';
import { Info, Minus, Plus, X, CheckCircle, Hammer } from 'lucide-react';
import { SelectedHandyman, HandymanType } from './types';
// In a real app you might want to move these to a shared constants file, but for now we pass them in or import them.
// Importing large lists is better, but since I'm splitting components, I'll assume the parent passes the data or I can refactor data out.
// Let's create a small local interface or import the large list if it was separate.
// For now, I'll accept the handymanTypes as a prop to keep it pure, or import it if I create a constants file.
// I'll create a constants file in next step to cleaner code.

interface HandymanListProps {
    selectedHandymen: SelectedHandyman[];
    handymanTypes: HandymanType[];
    onUpdateHandyman: (index: number, field: keyof SelectedHandyman, value: any) => void;
    onRemoveHandyman: (index: number) => void;
    onAddHandymanClick: () => void;
}

export const HandymanList: React.FC<HandymanListProps> = ({
    selectedHandymen,
    handymanTypes,
    onUpdateHandyman,
    onRemoveHandyman,
    onAddHandymanClick,
}) => {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
                <h3 className="font-bold text-gray-900 text-lg">Jenis Tukang</h3>
                <Info className="w-5 h-5 text-gray-400" />
            </div>

            {selectedHandymen.map((handyman, index) => {
                const handymanType = handymanTypes.find(h => h.name === handyman.type);
                const HandymanIcon = handymanType?.icon || Hammer;
                const iconBg = handymanType?.bg || 'bg-blue-50';
                const iconColor = handymanType?.color || 'text-blue-600';

                return (
                    <div key={handyman.id} className="bg-white rounded-2xl border-2 border-gray-100 p-6 mb-6 hover:border-blue-100 transition-colors relative">
                        {index > 0 && (
                            <button
                                onClick={() => onRemoveHandyman(index)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}

                        <div className="flex items-center justify-between mb-8 pr-8">
                            <div className="flex items-center gap-4">
                                <div className={`w-20 h-20 ${iconBg} rounded-2xl flex items-center justify-center ${iconColor} shadow-inner`}>
                                    <HandymanIcon className="w-10 h-10" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Tukang Terpilih</p>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-gray-900 text-2xl">{handyman.type || 'Pilih Tukang'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-100">
                                <button
                                    onClick={() => onUpdateHandyman(index, 'quantity', Math.max(1, handyman.quantity - 1))}
                                    className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 text-gray-600 border border-gray-200"
                                >
                                    <Minus className="w-5 h-5" />
                                </button>
                                <span className="font-bold w-10 text-center text-lg">{handyman.quantity}</span>
                                <button
                                    onClick={() => onUpdateHandyman(index, 'quantity', handyman.quantity + 1)}
                                    className="w-10 h-10 rounded-lg bg-blue-600 shadow-blue-200 shadow-sm flex items-center justify-center hover:bg-blue-700 text-white"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Shift Selection */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            {[
                                { id: 'seharian', label: 'Seharian', time: '08:00 - 17:00', price: 259000 },
                                { id: 'pagi', label: 'Pagi', time: '08:00 - 12:00', price: 199000 },
                                { id: 'sore', label: 'Sore', time: '13:00 - 17:00', price: 199000 }
                            ].map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => onUpdateHandyman(index, 'shift', s.id)}
                                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden
                                        ${handyman.shift === s.id
                                            ? 'border-blue-500 bg-blue-50 shadow-md scale-[1.02]'
                                            : 'border-gray-100 bg-white hover:border-blue-200 hover:bg-blue-50/50'
                                        }
                                    `}
                                >
                                    {handyman.shift === s.id && <div className="absolute top-0 right-0 p-1 bg-blue-500 rounded-bl-xl"><CheckCircle className="w-3 h-3 text-white" /></div>}
                                    <span className={`text-sm font-bold mb-1 ${handyman.shift === s.id ? 'text-gray-900' : 'text-gray-500'}`}>{s.label}</span>
                                    <span className="text-xs text-gray-400 mb-2">{s.time}</span>
                                    <span className={`text-sm font-extrabold ${handyman.shift === s.id ? 'text-blue-600' : 'text-gray-700'}`}>
                                        Rp{s.price.toLocaleString('id-ID')}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )
            })}

            <button
                onClick={onAddHandymanClick}
                className="w-full py-4 border-2 border-dashed border-blue-300 text-blue-600 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-50 hover:border-blue-400 transition-all group"
            >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Tambah Tukang Lain
            </button>
        </div>
    );
};
