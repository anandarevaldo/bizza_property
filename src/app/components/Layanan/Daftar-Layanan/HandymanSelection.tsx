import React, { useState } from 'react';
import { ArrowLeft, Search, PaintBucket, Grid3x3, Zap, HardHat, Square, Hammer, Droplets, ChevronRight, Wrench, Umbrella, PenTool, Layers, Home, DoorOpen, Shield, ChefHat, Fence, Trees, Anchor, Ruler, Palette, Bath, Package, LayoutGrid, BoxSelect, Fan, Wind, Gem, Warehouse, Container, Thermometer, Tent, StopCircle, Sparkles, UserPlus, AlertCircle, Shovel, Flame } from 'lucide-react';

interface HandymanSelectionProps {
    switchView: (view: any) => void;
    onSelectHandyman: (type: string) => void;
}

const handymanTypes = [
    { id: 'cat', name: 'Tukang Cat', desc: 'Bantu membuang cat lama, cat dasar, finishing', icon: PaintBucket, color: 'text-pink-500', bg: 'bg-pink-50' },
    { id: 'keramik', name: 'Tukang Keramik', desc: 'Ahli pasang keramik lantai & dinding', icon: Grid3x3, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'listrik', name: 'Tukang Listrik', desc: 'Instalasi, stop kontak & fitting lampu', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { id: 'kenek', name: 'Kenek (Ast. Tukang)', desc: 'Asisten tukang agar pekerjaan cepat selesai', icon: UserPlus, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'aluminium_aksesoris', name: 'Tukang Aluminium Aksesoris', desc: 'Tenaga ahli aksesoris pintu dan jendela', icon: BoxSelect, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'batu', name: 'Tukang Batu', desc: 'Pekerjaan dinding, tembok, batu alam', icon: Hammer, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'pipa', name: 'Tukang Pipa', desc: 'Perbaiki pipa bocor, macet & air bersih', icon: Wrench, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { id: 'waterproofing', name: 'Tukang Waterproofing', desc: 'Betulkan genteng/atap rentan bocor', icon: Umbrella, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'gali', name: 'Tukang Gali', desc: 'Tukang untuk segala keperluan bergali', icon: Shovel, color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 'besi', name: 'Tukang Besi (Las)', desc: 'Ahlinya permasalahan las besi rumah', icon: Flame, color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: 'genteng', name: 'Tukang Genteng', desc: 'Tukang ahli masalah genteng dan atap', icon: Home, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 'plafon', name: 'Tukang Plafon', desc: 'Masalah plafon rusak, berlumut, roboh', icon: Layers, color: 'text-slate-500', bg: 'bg-slate-50' },
    { id: 'sanitair', name: 'Tukang Sanitair', desc: 'Pasang wastafel, kloset, keran, shower', icon: Droplets, color: 'text-teal-500', bg: 'bg-teal-50' },
    { id: 'angkat', name: 'Tukang Angkat', desc: 'Keperluan mengangkat barang rumah', icon: Package, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'listrik_rapih', name: 'Tukang Listrik Perapihan', desc: 'Bongkar, perbaiki kabel listrik & rapikan', icon: Zap, color: 'text-green-500', bg: 'bg-green-50' },
    { id: 'pipa_rapih', name: 'Tukang Pipa Perapihan', desc: 'Bongkar, perbaiki pipa & rapikan', icon: Wrench, color: 'text-sky-500', bg: 'bg-sky-50' },
];

const HandymanSelection: React.FC<HandymanSelectionProps> = ({ switchView, onSelectHandyman }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSelect = (name: string) => {
        onSelectHandyman(name);
        switchView('booking-form-handyman');
    };

    // Categorization Logic
    const categories = {
        popular: {
            title: "🔥 Paling Sering Dicari",
            ids: ['cat', 'keramik', 'listrik', 'pipa', 'genteng', 'batu']
        },
        structure: {
            title: "🏗️ Struktur & Bangunan",
            ids: ['batu', 'genteng', 'plafon', 'waterproofing', 'gali', 'besi']
        },
        finishing: {
            title: "🎨 Finishing & Interior",
            ids: ['cat', 'keramik', 'aluminium_aksesoris', 'sanitair']
        },
        utility: {
            title: "⚡ Utilitas & Perbaikan",
            ids: ['listrik', 'pipa', 'listrik_rapih', 'pipa_rapih']
        },
        helper: {
            title: "🤝 Asisten & Lainnya",
            ids: ['kenek', 'angkat']
        }
    };

    // Filter Logic
    const filteredHandyman = handymanTypes.filter(h =>
        h.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Grouping for Display (Only when not searching)
    const getGroupedHandyman = () => {
        if (searchTerm) return null; // Don't group if searching

        return Object.entries(categories).map(([key, category]) => {
            const items = handymanTypes.filter(h => category.ids.includes(h.id));
            if (items.length === 0) return null;
            return { ...category, items };
        });
    };

    const groupedData = getGroupedHandyman();

    return (
        <div className="min-h-screen bg-white font-sans animate-fade-in pb-20">
            {/* Header (Breadcrumb Style) */}
            <div className="bg-white border-b border-gray-100 py-4 px-6 md:px-12 sticky top-0 z-40 flex items-center justify-between shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-3 text-sm md:text-base">
                    <button onClick={() => switchView('home')} className="hover:bg-gray-100 p-2 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="flex items-center gap-2 text-gray-500">
                        <span className="cursor-pointer hover:text-blue-600" onClick={() => switchView('home')}>Home</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="font-bold text-gray-900">Pilih Tukang</span>
                    </div>
                </div>
                <div className="ml-auto">
                    <AlertCircle className="w-6 h-6 text-gray-400" />
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-12 py-8 max-w-6xl">
                {/* Hero / Intro */}
                <div className="bg-blue-600 rounded-3xl p-8 mb-10 text-white shadow-xl shadow-blue-200 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 flex-1">
                        <h2 className="text-3xl font-extrabold mb-2">Butuh Tukang Apa Hari Ini? 👷</h2>
                        <p className="text-blue-100 text-lg opacity-90">Temukan spesialis tukang yang tepat untuk bereskan masalah rumahmu.</p>
                    </div>

                    {/* Search Bar (Integrated into Hero) */}
                    <div className="relative w-full md:w-96 shrink-0">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari tukang (e.g., Bocor, Listrik)..."
                            className="w-full pl-14 pr-6 py-4 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400/30 font-medium shadow-lg bg-white"
                        />
                    </div>
                </div>

                {/* CONTENT AREA */}
                {searchTerm ? (
                    /* SEARCH RESULTS (Flat Grid) */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
                        {filteredHandyman.map((item) => (
                            <HandymanCard key={item.id} item={item} onClick={() => handleSelect(item.name)} />
                        ))}
                        {filteredHandyman.length === 0 && (
                            <div className="col-span-full text-center py-20 text-gray-400">
                                <Search className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p className="text-xl font-bold text-gray-300">Tukang tidak ditemukan</p>
                            </div>
                        )}
                    </div>
                ) : (
                    /* CATEGORIZED VIEW */
                    <div className="space-y-12 animate-fade-in">
                        {groupedData?.map((group) => group && (
                            <div key={group.title}>
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    {group.title}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {group.items.map((item) => (
                                        <HandymanCard key={item.id} item={item} onClick={() => handleSelect(item.name)} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Extracted Card Component for cleaner code
const HandymanCard = ({ item, onClick }: { item: any, onClick: () => void }) => (
    <div
        onClick={onClick}
        className="bg-gray-50 rounded-xl p-4 border border-transparent hover:bg-white hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer group flex items-center gap-4 py-5"
    >
        <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
            <item.icon className={`w-6 h-6 ${item.color}`} />
        </div>

        <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">{item.name}</h3>
            <p className="text-xs text-gray-500 truncate mt-0.5">{item.desc}</p>
        </div>

        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
            <ChevronRight className="w-4 h-4 text-blue-500" />
        </div>
    </div>
);

export default HandymanSelection;
