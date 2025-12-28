import React from 'react';
import { ChevronRight, MapPin } from 'lucide-react';

interface AddressFormProps {
    addressDetails: string;
    showAddress: boolean;
    onToggleShowAddress: () => void;
    onAddressChange: (value: string) => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({
    addressDetails,
    showAddress,
    onToggleShowAddress,
    onAddressChange,
}) => {
    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-colors hover:border-blue-100" onClick={onToggleShowAddress}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg">Alamat Pengerjaan</h4>
                </div>
                <ChevronRight className={`w-6 h-6 text-gray-400 transition-transform ${showAddress ? 'rotate-90' : ''}`} />
            </div>
            {showAddress && (
                <div className="pl-[64px] animate-fade-in">
                    <input
                        type="text"
                        placeholder="Ketik detail alamat lengkap..."
                        value={addressDetails}
                        onChange={(e) => onAddressChange(e.target.value)}
                        className="w-full mt-2 p-4 border-2 border-gray-100 rounded-2xl text-base focus:outline-none focus:border-blue-500 transition-all font-medium"
                        onClick={(e) => e.stopPropagation()}
                    />
                    {/* Map Preview Placeholder */}
                    <div className="mt-4 w-full h-32 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-sm font-medium border border-gray-200">
                        <MapPin className="w-4 h-4 mr-2" /> Peta Lokasi
                    </div>
                </div>
            )}
            {!showAddress && addressDetails && (
                <div className="pl-[64px]">
                    <p className="text-sm text-gray-600 truncate">{addressDetails}</p>
                </div>
            )}
        </div>
    );
};
