import React from 'react';

interface ProblemDescriptionProps {
    value: string;
    onChange: (value: string) => void;
}

export const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ value, onChange }) => {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Deskripsikan masalah</h3>
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-all">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-base text-gray-700 min-h-[120px] resize-none placeholder-gray-400"
                    placeholder="Jelaskan kebutuhan renovasi atau pembangunan bisnis Anda agar kami dapat memberikan estimasi terbaik..."
                />
            </div>
        </div>
    );
};
