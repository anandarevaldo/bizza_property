import React from 'react';
import { Wallet, ChevronRight } from 'lucide-react';

interface BudgetSelectorProps {
    value: string;
    onChange: (value: string) => void;
}

export const BudgetSelector: React.FC<BudgetSelectorProps> = ({ value, onChange }) => {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-blue-600" />
                Budget yang kamu siapkan <span className="text-red-500">*</span>
            </h2>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full pl-5 pr-12 py-4 border-2 border-gray-200 rounded-2xl appearance-none bg-white focus:outline-none focus:border-blue-500 font-medium text-gray-700 cursor-pointer"
                >
                    <option value="" disabled>Pilih budget</option>
                    <option value="<1jt">Di bawah Rp 1.000.000</option>
                    <option value="1jt-5jt">Rp 1.000.000 - Rp 5.000.000</option>
                    <option value="5jt-10jt">Rp 5.000.000 - Rp 10.000.000</option>
                    <option value=">10jt">Di atas Rp 10.000.000</option>
                </select>
                <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none rotate-90" />
            </div>
        </div>
    );
};
