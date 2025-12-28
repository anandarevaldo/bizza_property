import React from 'react';
import { ChevronRight } from 'lucide-react';
import { problemTypesMap } from './constants';

interface ProblemSelectorProps {
    selectedServiceType?: string;
    selectedProblem: string | null;
    onSelectProblem: (id: string) => void;
}

export const ProblemSelector: React.FC<ProblemSelectorProps> = ({ selectedServiceType, selectedProblem, onSelectProblem }) => {
    const problemTypes = problemTypesMap[selectedServiceType || 'default'] || problemTypesMap['default'];

    return (
        <div className="mb-8">
            <div className="relative mb-6 rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-white shadow-xl">
                <div className="relative z-10 max-w-xl">
                    <h2 className="text-2xl font-bold mb-2">Solusi {selectedServiceType || 'Perbaikan'} untuk Rumahmu</h2>
                    <p className="text-blue-100">Mohon isi masalah yang butuh perbaikan secara detail agar kami bisa membantu dengan tepat.</p>
                </div>
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900 text-lg">Perbaikan apa yang dibutuhkan?</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {problemTypes.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onSelectProblem(item.id)}
                            className={`text-left p-6 rounded-2xl border-2 transition-all group flex items-start justify-between ${selectedProblem === item.id
                                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                : 'border-gray-100 hover:border-blue-500 hover:bg-blue-50'
                                }`}
                        >
                            <span className={`font-semibold ${selectedProblem === item.id ? 'text-blue-700' : 'text-gray-700 group-hover:text-blue-700'}`}>
                                {item.label}
                            </span>
                            <ChevronRight className={`w-5 h-5 transition-colors ${selectedProblem === item.id ? 'text-blue-500' : 'text-gray-300 group-hover:text-blue-500'}`} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
