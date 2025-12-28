import React from 'react';
import { Package, Trash2 } from 'lucide-react';

interface MaterialPreviewProps {
    selectedMaterials: any[];
    onUpdateMaterials: (materials: any[]) => void;
    switchView: (view: any) => void;
}

export const MaterialPreview: React.FC<MaterialPreviewProps> = ({ selectedMaterials = [], onUpdateMaterials, switchView }) => {
    return (
        <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-3xl flex items-center justify-between border-2 border-blue-100 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-all cursor-pointer" onClick={() => switchView('material-selection')}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full -mr-10 -mt-10 z-0 opacity-50"></div>
                <div className="flex-1 pr-4 relative z-10">
                    <h3 className="font-bold text-gray-900 text-lg mb-2">Mohon Siapkan Material</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">Pastikan bahan yang dibutuhkan untuk pengerjaan proyek sudah siap ya!</p>
                    <button onClick={(e) => { e.stopPropagation(); switchView('material-selection'); }} className="text-blue-700 text-sm font-bold flex items-center gap-1 hover:underline bg-white/80 px-4 py-2 rounded-xl shadow-sm border border-blue-100 backdrop-blur-sm">
                        Selengkapnya
                    </button>
                </div>
                <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full p-4 shadow-sm border border-blue-50 relative z-10 group-hover:scale-105 transition-transform">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/2821/2821868.png"
                        alt="Material"
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>

            {selectedMaterials.length > 0 && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5 text-blue-600" />
                        Material yang Disiapkan ({selectedMaterials.length})
                    </h3>
                    <div className="space-y-3">
                        <div className="space-y-3">
                            {selectedMaterials.map((item: any) => (
                                <div key={item.id} className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm relative group">
                                    <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 p-1 shrink-0 flex items-center justify-center">
                                        <img src={item.image} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm mb-0.5">{item.name}</p>
                                                <p className="text-xs text-gray-500">{item.category} • {item.quantity} {item.unit} {item.priceEstimation && `• ${item.priceEstimation}`}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const newMaterials = selectedMaterials.filter((m: any) => m.id !== item.id);
                                            onUpdateMaterials(newMaterials);
                                        }}
                                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button onClick={() => switchView('material-selection')} className="w-full py-3 text-sm font-bold text-blue-600 border border-blue-100 rounded-xl hover:bg-blue-50 transition-colors mt-2 flex items-center justify-center gap-2">
                            Edit / Tambah Material
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
