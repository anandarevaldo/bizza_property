import React from 'react';
import { Briefcase, Building, Users } from 'lucide-react';

interface BusinessIdentityFormProps {
    businessName: string;
    picName: string;
    onBusinessNameChange: (value: string) => void;
    onPicNameChange: (value: string) => void;
}

export const BusinessIdentityForm: React.FC<BusinessIdentityFormProps> = ({
    businessName,
    picName,
    onBusinessNameChange,
    onPicNameChange,
}) => {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Identitas Bisnis <span className="text-red-500">*</span>
            </h2>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Bisnis / Perusahaan</label>
                <div className="relative">
                    <Building className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={businessName}
                        onChange={(e) => onBusinessNameChange(e.target.value)}
                        placeholder="Contoh: PT. Bizza Indonesia"
                        className="w-full pl-12 pr-5 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 transition-all font-medium"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nama PIC (Person in Charge)</label>
                <div className="relative">
                    <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={picName}
                        onChange={(e) => onPicNameChange(e.target.value)}
                        placeholder="Nama lengkap penanggung jawab"
                        className="w-full pl-12 pr-5 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 transition-all font-medium"
                    />
                </div>
            </div>
        </div>
    );
};
