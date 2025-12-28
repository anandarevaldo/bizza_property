import React from 'react';
import { MapPin, Search } from 'lucide-react';

interface AddressFormProps {
    addressSearch: string;
    onAddressSearchChange: (value: string) => void;
    addressDetail: string;
    onAddressDetailChange: (value: string) => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({
    addressSearch,
    onAddressSearchChange,
    addressDetail,
    onAddressDetailChange
}) => {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Alamat Survey <span className="text-red-500">*</span>
            </h2>

            {/* Search Box */}
            <div className="relative mb-6">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5" />
                <input
                    type="text"
                    value={addressSearch}
                    onChange={(e) => onAddressSearchChange(e.target.value)}
                    placeholder="Cari alamat survey..."
                    className="w-full pl-12 pr-12 py-4 border-2 border-blue-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all text-gray-700 font-medium"
                />
            </div>

            {/* Map & Detail Layout */}
            <div className="flex flex-col md:flex-row gap-6">
                {/* Map Simulation */}
                <div className="w-full md:w-1/2 h-64 bg-slate-100 rounded-2xl relative overflow-hidden group border-2 border-gray-100">
                    <img
                        src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=2062&auto=format&fit=crop"
                        alt="Map Location"
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Map Pin */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                        <div className="relative">
                            <MapPin className="w-10 h-10 text-blue-600 fill-current drop-shadow-md animate-bounce" />
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/20 blur-sm rounded-[100%]"></div>
                        </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-sm text-xs text-center font-medium">
                        Geser peta untuk menyesuaikan titik
                    </div>
                </div>

                {/* Detail Alamat Input */}
                <div className="w-full md:w-1/2 flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Detail Lokasi</label>
                    <textarea
                        value={addressDetail}
                        onChange={(e) => onAddressDetailChange(e.target.value)}
                        className="flex-1 w-full p-4 border-2 border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:border-blue-500 transition-all resize-none text-sm placeholder-gray-400"
                        placeholder="Masukkan detail lokasi (Contoh: Blok A No. 12, Pagar Hitam, Belakang Pos Satpam)"
                    ></textarea>
                </div>
            </div>
        </div>
    );
};
