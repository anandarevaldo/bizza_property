
import React, { useEffect, useState } from 'react';
import { MapPin, Plus, History } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { orderService } from '../../lib/services/orderService';

interface AddressSelectorProps {
    addressSearch: string;
    onAddressSearchChange: (value: string) => void;
    addressDetail: string;
    onAddressDetailChange: (value: string) => void;
}

export const AddressSelector: React.FC<AddressSelectorProps> = ({
    addressSearch,
    onAddressSearchChange,
    addressDetail,
    onAddressDetailChange
}) => {
    const [savedAddresses, setSavedAddresses] = useState<string[]>([]);
    const [mode, setMode] = useState<'SAVED' | 'NEW'>('NEW');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchSavedAddresses();
    }, []);

    const fetchSavedAddresses = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const addresses = await orderService.getPreviousAddresses(user.id);
                setSavedAddresses(addresses);
                if (addresses.length > 0) {
                    setMode('SAVED');
                }
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    const handleSelectAddress = (addr: string) => {
        onAddressSearchChange(addr);
        // Maybe try to split detail if possible, otherwise user fills detail manually or we assume addr is full.
        // For now, we put the selected address in the main "Search" field (Method) 
        // and let user refine Detail if needed.
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Alamat Survey <span className="text-red-500">*</span>
            </h2>

            {/* Toggle Mode */}
            {savedAddresses.length > 0 && (
                <div className="flex gap-2 mb-6 bg-gray-50 p-1 rounded-xl w-fit">
                    <button
                        onClick={() => setMode('SAVED')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'SAVED'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Pilih Alamat Disimpan
                    </button>
                    <button
                        onClick={() => {
                            setMode('NEW');
                            onAddressSearchChange('');
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'NEW'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Input Alamat Baru
                    </button>
                </div>
            )}

            {mode === 'SAVED' && savedAddresses.length > 0 ? (
                <div className="space-y-3 mb-6">
                    {savedAddresses.map((addr, idx) => (
                        <div
                            key={idx}
                            onClick={() => handleSelectAddress(addr)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${addressSearch === addr
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-100 hover:border-blue-200'
                                }`}
                        >
                            <History className={`w-5 h-5 ${addressSearch === addr ? 'text-blue-600' : 'text-gray-400'}`} />
                            <span className={`font-medium ${addressSearch === addr ? 'text-blue-900' : 'text-gray-600'}`}>
                                {addr}
                            </span>
                        </div>
                    ))}
                    <button
                        onClick={() => setMode('NEW')}
                        className="text-sm text-blue-600 font-bold flex items-center gap-1 mt-2 hover:underline"
                    >
                        <Plus className="w-4 h-4" />
                        Gunakan Alamat Lain
                    </button>
                </div>
            ) : (
                <div className="mb-6">
                    <label className="text-sm font-bold text-gray-700 mb-2 block">Cari / Masukkan Alamat</label>
                    <input
                        type="text"
                        value={addressSearch}
                        onChange={(e) => onAddressSearchChange(e.target.value)}
                        placeholder="Contoh: Jl. Sudirman No. 45, Jakarta Selatan"
                        className="w-full p-4 border-2 border-blue-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all text-gray-700 font-medium"
                    />
                </div>
            )}

            {/* Detail Address Always Visible */}
            <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-700 mb-2">Detail Lokasi / Patokan</label>
                <textarea
                    value={addressDetail}
                    onChange={(e) => onAddressDetailChange(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:border-blue-500 transition-all resize-none text-sm placeholder-gray-400 h-24"
                    placeholder="Masukkan detail lokasi (Contoh: Blok A No. 12, Pagar Hitam, Belakang Pos Satpam)"
                ></textarea>
            </div>
        </div>
    );
};
