import React, { useState } from 'react';
import { ArrowLeft, Search, Plus, Trash2, Check, Package, ShoppingCart, ChevronRight, Info, AlertCircle } from 'lucide-react';

interface Material {
    id: string;
    name: string;
    unit: string;
    category: string;
    image: string;
    price: number;
    description: string;
}

interface SelectedMaterial extends Material {
    quantity: number;
    notes?: string;
}

interface MaterialSelectionProps {
    switchView: (view: any) => void;
    onSaveMaterials: (materials: SelectedMaterial[]) => void;
    initialMaterials: SelectedMaterial[];
}

const commonMaterials: Material[] = [
    {
        id: 'semen_gresik_50kg',
        name: 'Semen Gresik 50kg',
        unit: 'Sak',
        category: 'Material Dasar',
        image: 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/9/5/9e3d9382-747d-4198-8422-04d300eb052b.jpg',
        price: 65000,
        description: 'Semen portland komposit untuk konstruksi umum, plesteran, dan acian.'
    },
    {
        id: 'semen_tiga_roda_50kg',
        name: 'Semen Tiga Roda 50kg',
        unit: 'Sak',
        category: 'Material Dasar',
        image: 'https://images.tokopedia.net/img/cache/700/product-1/2020/7/2/8363784/8363784_3792694b-70c8-479e-b924-118843916965_450_450.webp',
        price: 68000,
        description: 'Semen berkualitas tinggi standar SNI untuk struktur bangunan kuat.'
    },
    {
        id: 'pasir_beton',
        name: 'Pasir Beton',
        unit: 'Kubik',
        category: 'Material Dasar',
        image: 'https://images.tokopedia.net/img/cache/700/VqbcmM/2022/8/29/77d94f78-3162-4309-8806-6552ae0749a0.jpg',
        price: 265000,
        description: 'Pasir butiran kasar, cocok untuk cor pondasi dan struktur beton.'
    },
    {
        id: 'batu_bata_merah',
        name: 'Batu Bata Merah',
        unit: 'Pcs',
        category: 'Material Dasar',
        image: 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/6/17/9966847d-5a82-4113-912f-643bf7aa447d.jpg',
        price: 1000,
        description: 'Bata merah press bakar, ukuran standar, kuat dan presisi.'
    },
    {
        id: 'cat_dulux_interior',
        name: 'Cat Dulux Interior (5kg)',
        unit: 'Kaleng',
        category: 'Cat & Finishing',
        image: 'https://images.tokopedia.net/img/cache/700/product-1/2019/2/25/5361244/5361244_4083a30a-d8c7-4389-9e87-19369d784a96_700_700.jpg',
        price: 165000,
        description: 'Cat tembok interior dengan teknologi Chroma Brite untuk warna cerah tahan lama.'
    },
    {
        id: 'cat_dulux_exterior',
        name: 'Cat Dulux Weathershield (2.5kg)',
        unit: 'Kaleng',
        category: 'Cat & Finishing',
        image: 'https://www.dulux.co.id/id/produk/dulux-weathershield-powerflexx/_jcr_content/root/container/image.coreimg.png/1572337774780/dulux-weathershield-powerflexx-can.png',
        price: 235000,
        description: 'Perlindungan dinding luar dari cuaca ekstrem, anti lumut dan jamur.'
    },
    {
        id: 'kuas_3inch',
        name: 'Kuas Eterna 3 Inch',
        unit: 'Pcs',
        category: 'Alat Tukang',
        image: 'https://images.tokopedia.net/img/cache/700/product-1/2020/4/16/7978644/7978644_9a873836-8b96-41f2-ae6d-5f991f86071a_700_700.jpg',
        price: 18000,
        description: 'Bulu kuas tebal dan tidak mudah rontok, gagang kayu nyaman.'
    },
    {
        id: 'pipa_pvc_3inch',
        name: 'Pipa PVC Rucika 3 Inch',
        unit: 'Batang (4m)',
        category: 'Pipa & Plumbing',
        image: 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/3/23/07542d4a-5028-4122-b26a-861114c2b972.jpg',
        price: 88000,
        description: 'Pipa PVC standar JIS, kuat dan lentur untuk saluran air buangan.'
    },
    {
        id: 'keramik_lantai_60x60',
        name: 'Keramik Lantai 60x60 Marble',
        unit: 'Dus (1.44m2)',
        category: 'Lantai & Dinding',
        image: 'https://images.tokopedia.net/img/cache/700/VqbcmM/2021/11/24/7c050a41-352b-4fc6-868c-2357731761d4.jpg',
        price: 135000,
        description: 'Motif marmer elegan, permukaan glossy, cocok untuk ruang tamu.'
    }
];

const MaterialSelection: React.FC<MaterialSelectionProps> = ({ switchView, onSaveMaterials, initialMaterials }) => {
    const [selectedMaterials, setSelectedMaterials] = useState<SelectedMaterial[]>(initialMaterials || []);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('Semua');
    const [customMaterialName, setCustomMaterialName] = useState('');
    const [materialNote, setMaterialNote] = useState('');

    const filteredMaterials = commonMaterials.filter(m =>
        (activeCategory === 'Semua' || m.category === activeCategory) &&
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const categories = ['Semua', ...Array.from(new Set(commonMaterials.map(m => m.category)))];

    const handleAddMaterial = (material: Material) => {
        if (selectedMaterials.some(m => m.id === material.id)) return;
        setSelectedMaterials([...selectedMaterials, { ...material, quantity: 1 }]);
    };

    const handleUpdateQuantity = (id: string, delta: number) => {
        setSelectedMaterials(prev => prev.map(m => {
            if (m.id === id) {
                const newQty = Math.max(1, m.quantity + delta);
                return { ...m, quantity: newQty };
            }
            return m;
        }));
    };

    const handleRemoveMaterial = (id: string) => {
        setSelectedMaterials(prev => prev.filter(m => m.id !== id));
    };

    const handleAddCustomMaterial = () => {
        if (!customMaterialName.trim()) return;
        const newId = `custom_${Date.now()}`;
        const newMaterial: SelectedMaterial = {
            id: newId,
            name: customMaterialName,
            unit: 'Unit',
            category: 'Custom',
            quantity: 1,
            image: 'https://cdn-icons-png.flaticon.com/512/2821/2821868.png', // Default icon for custom
            price: 0,
            description: 'Material tambahan manual'
        };
        setSelectedMaterials([newMaterial, ...selectedMaterials]);
        setCustomMaterialName('');
    };

    const handleSave = () => {
        onSaveMaterials(selectedMaterials);
        switchView('booking-form-handyman');
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-32 font-sans animate-fade-in">
            {/* Header / Breadcrumb Navbar */}
            <div className="bg-white border-b border-gray-200 py-4 px-6 md:px-12 sticky top-0 z-50 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3 text-sm md:text-base">
                    <div className="flex items-center gap-2 text-gray-500">
                        <span className="cursor-pointer hover:text-blue-600" onClick={() => switchView('home')}>Home</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="cursor-pointer hover:text-blue-600" onClick={() => switchView('handyman-selection')}>Pilih Tukang</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="cursor-pointer hover:text-blue-600" onClick={() => switchView('booking-form-handyman')}>Form Pemesanan</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="font-bold text-gray-900">Pilih Material</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 pt-8 max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Left Column: Main Content */}
                    <div className="flex-1 w-full min-w-0">
                        {/* Search Bar Only */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 sticky top-20 z-40">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Cari material (Semen, Cat, Pipa...)"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-900"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Categories (Slideable) */}
                        <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar mb-6 -mx-4 px-4 scroll-smooth">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all shrink-0
                                        ${activeCategory === cat
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105'
                                            : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'}
                                    `}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Available Materials List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
                            {filteredMaterials.map(material => {
                                const isSelected = selectedMaterials.some(m => m.id === material.id);
                                return (
                                    <div key={material.id} className={`bg-white p-5 rounded-[2rem] border transition-all flex flex-col gap-4 group hover:shadow-xl hover:-translate-y-1 duration-300 h-full relative
                                ${isSelected ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-100 hover:border-blue-100'}
                            `}>
                                        {/* Image */}
                                        <div className="w-full h-40 shrink-0 bg-white rounded-2xl border border-gray-100 overflow-hidden p-6 flex items-center justify-center relative">
                                            <img
                                                src={material.image}
                                                alt={material.name}
                                                className="w-full h-full object-contain mix-blend-multiply"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 flex flex-col">
                                            <h3 className="font-bold text-lg text-gray-900 mb-1 leading-tight">{material.name}</h3>
                                            <p className="text-blue-600 font-bold text-sm mb-2">Rp {material.price.toLocaleString('id-ID')}</p>
                                            <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed mb-4 flex-1">{material.description}</p>

                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                                <span className="text-xs font-bold px-3 py-1.5 bg-gray-100 rounded-lg text-gray-600 border border-gray-200 uppercase tracking-wide">
                                                    {material.unit}
                                                </span>
                                                {/* Add Button or Quantity Controller */}
                                                {isSelected ? (
                                                    <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-2 py-1 border border-gray-200">
                                                        <button
                                                            onClick={() => handleUpdateQuantity(material.id, -1)}
                                                            className="w-8 h-8 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold transition-all"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="font-bold text-gray-900 w-6 text-center text-lg">{selectedMaterials.find(m => m.id === material.id)?.quantity}</span>
                                                        <button
                                                            onClick={() => handleUpdateQuantity(material.id, 1)}
                                                            className="w-8 h-8 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold transition-all"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleAddMaterial(material)}
                                                        className="h-10 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center bg-white border-2 border-blue-50 text-blue-600 hover:border-blue-100 hover:bg-blue-50 shadow-sm"
                                                    >
                                                        Tambah
                                                    </button>
                                                )}
                                            </div>
                                        </div>        </div>
                                );
                            })}
                        </div>

                        {/* Manual Input Section (Bottom) */}
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-8">
                            <h3 className="font-bold text-gray-900 mb-4 text-lg">Tidak menemukan material?</h3>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    placeholder="Tambah manual (Contoh: Semen Holcim 1 sak)..."
                                    className="flex-1 px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-900 text-base"
                                    value={customMaterialName}
                                    onChange={(e) => setCustomMaterialName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustomMaterial()}
                                />
                                <button
                                    onClick={handleAddCustomMaterial}
                                    disabled={!customMaterialName.trim()}
                                    className="bg-blue-600 text-white px-6 rounded-2xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200 shrink-0"
                                >
                                    <Plus className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Catatan Material Section (New - Image 2 Style) */}
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 mb-12">
                            <h3 className="font-bold text-gray-900 mb-4 text-lg">Catatan Material</h3>
                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-all">
                                <textarea
                                    value={materialNote}
                                    onChange={(e) => setMaterialNote(e.target.value)}
                                    placeholder="Tulis catatan tambahan untuk material yang dipilih..."
                                    className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-base text-gray-700 min-h-[120px] resize-none placeholder-gray-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Desktop Sidebar Summary */}
                    <div className="hidden lg:block w-96 shrink-0 sticky top-32 space-y-4">
                        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                                    {selectedMaterials.length} Material
                                </h3>
                                {selectedMaterials.length > 0 && (
                                    <button onClick={() => setSelectedMaterials([])} className="text-sm text-red-500 font-bold hover:bg-red-50 px-3 py-1 rounded-lg transition-colors">
                                        Hapus Semua
                                    </button>
                                )}
                            </div>

                            {selectedMaterials.length === 0 ? (
                                <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-400 font-medium">Belum ada material dipilih</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                    {selectedMaterials.map(item => (
                                        <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-start gap-4 relative group">
                                            <div className="w-14 h-14 bg-gray-50 rounded-xl border border-gray-200 p-2 shrink-0 flex items-center justify-center">
                                                <img src={item.image} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-gray-900 text-sm mb-1 truncate pr-6">{item.name}</p>
                                                {/* Add Price here */}
                                                <p className="text-blue-600 font-bold text-xs mb-2">Rp {item.price.toLocaleString('id-ID')}</p>

                                                {/* Counter Style - Image 2 */}
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.id, -1)}
                                                        className="w-10 h-10 bg-white border-2 border-gray-100 rounded-xl text-gray-600 flex items-center justify-center hover:bg-gray-50 hover:border-blue-100 font-bold text-lg transition-colors pb-1"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-base font-bold w-4 text-center text-gray-900">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.id, 1)}
                                                        className="w-10 h-10 bg-white border-2 border-gray-100 rounded-xl text-gray-600 flex items-center justify-center hover:bg-gray-50 hover:border-blue-100 font-bold text-lg transition-colors pb-1"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                            <button onClick={() => handleRemoveMaterial(item.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons (Moved to Sidebar) */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => switchView('booking-form-handyman')}
                                className="flex-1 py-4 rounded-2xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all text-sm"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-[2] py-4 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                Simpan Material
                                <ArrowLeft className="w-5 h-5 rotate-180" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Floating Horizontal Bar (lg:hidden) */}
                {selectedMaterials.length > 0 && (
                    <div className="fixed bottom-6 left-4 right-4 z-50 animate-slide-up lg:hidden">
                        <div className="bg-white rounded-[1.5rem] shadow-2xl border border-gray-100 p-4 flex items-center gap-4">

                            {/* Left: Summary */}
                            <div className="shrink-0 flex flex-col justify-center border-r border-gray-100 pr-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <ShoppingCart className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="font-extrabold text-gray-900 text-sm whitespace-nowrap">{selectedMaterials.length} Material</span>
                                </div>
                                <button onClick={() => setSelectedMaterials([])} className="text-xs text-red-500 font-bold hover:bg-red-50 px-2 py-1 rounded transition-colors text-left">
                                    Hapus Semua
                                </button>
                            </div>

                            {/* Middle: Horizontal List */}
                            <div className="flex-1 overflow-x-auto no-scrollbar flex gap-3">
                                {selectedMaterials.map(item => (
                                    <div key={item.id} className="shrink-0 w-48 bg-gray-50 rounded-xl border border-gray-100 p-2 flex items-center gap-3 relative">
                                        <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 p-1 shrink-0">
                                            <img src={item.image} alt="" className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-xs text-gray-800 truncate mb-1">{item.name}</p>
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => handleUpdateQuantity(item.id, -1)} className="w-5 h-5 bg-white border border-gray-200 rounded text-gray-600 flex items-center justify-center text-xs">-</button>
                                                <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                <button onClick={() => handleUpdateQuantity(item.id, 1)} className="w-5 h-5 bg-white border border-gray-200 rounded text-gray-600 flex items-center justify-center text-xs">+</button>
                                            </div>
                                        </div>
                                        <button onClick={() => handleRemoveMaterial(item.id)} className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm text-gray-400 hover:text-red-500 border border-gray-100">
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MaterialSelection;
