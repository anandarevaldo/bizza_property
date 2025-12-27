import React, { useState } from 'react';
import {
    ArrowLeft, Search, PaintBucket, Grid3x3, Zap, HardHat, Square, Hammer, Droplets, ChevronRight, Wrench, Umbrella, PenTool, Layers, Home, DoorOpen, Shield, ChefHat, Fence, Trees, Anchor, Ruler, Palette, Bath, Package, LayoutGrid, BoxSelect, Fan, Wind, Gem, Warehouse, Container, Thermometer, Tent, StopCircle, Sparkles, UserPlus, AlertCircle, Blocks, AirVent, Archive, Frame, Building2, Shovel
} from 'lucide-react';

interface RepairServiceSelectionProps {
    switchView: (view: any) => void;
    onSelectService: (service: string) => void;
}

// Data from ServiceCategories (Image 1 reference)
const serviceTypes = [
    { id: '1', name: 'Kebocoran', desc: 'Jaga Rumah Bebas Bocor', icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: '2', name: 'Cat', desc: 'Warnai Rumahmu', icon: PaintBucket, color: 'text-red-600', bg: 'bg-red-50' },
    { id: '3', name: 'Keramik', desc: 'Percantik Lantai & Dinding', icon: Grid3x3, color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: '4', name: 'Listrik', desc: 'Rumah Terang, Hati Senang', icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { id: '5', name: 'Pipa', desc: 'Air Mengalir Lancar', icon: Wrench, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { id: '6', name: 'Sanitasi', desc: 'Kamar Mandi Bersih', icon: Umbrella, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: '7', name: 'Konsultan', desc: 'Bantu Rencanakan Proyek', icon: PenTool, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: '8', name: 'Plafon', desc: 'Perbaikan Langit-langit', icon: Layers, color: 'text-gray-600', bg: 'bg-gray-50' },
    { id: '9', name: 'Dinding', desc: 'Dinding Kokoh Terjaga', icon: Home, color: 'text-rose-600', bg: 'bg-rose-50' },
    { id: '10', name: 'Pintu', desc: 'Kreasi Pintu & Jendela', icon: DoorOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: '11', name: 'Atap', desc: 'Pelindung Rumahmu', icon: Shield, color: 'text-slate-600', bg: 'bg-slate-50' },
    { id: '12', name: 'Dapur', desc: 'Semangat Memasak', icon: ChefHat, color: 'text-pink-600', bg: 'bg-pink-50' },
    { id: '13', name: 'Konstruksi', desc: 'Bangun Rumah Impian', icon: Building2, color: 'text-teal-600', bg: 'bg-teal-50' },
    { id: '14', name: 'Pagar', desc: 'Keamanan Properti', icon: Fence, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: '15', name: 'Taman', desc: 'Landscape & Taman', icon: Trees, color: 'text-lime-600', bg: 'bg-lime-50' },
    { id: '16', name: 'Pondasi', desc: 'Struktur Kuat Kokoh', icon: Shovel, color: 'text-stone-600', bg: 'bg-stone-50' },
    { id: '17', name: 'Desain', desc: 'Rancang Hunianmu', icon: Ruler, color: 'text-sky-600', bg: 'bg-sky-50' },
    { id: '18', name: 'Interior', desc: 'Desain Interior Elegan', icon: Palette, color: 'text-fuchsia-600', bg: 'bg-fuchsia-50' },
    { id: '19', name: 'Toilet', desc: 'Kamar Mandi Nyaman', icon: Bath, color: 'text-violet-600', bg: 'bg-violet-50' },
    { id: '20', name: 'Jasa Angkat', desc: 'Pindahkan Barangmu', icon: Package, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: '21', name: 'Conblock', desc: 'Pekarangan Rumah Indah', icon: Blocks, color: 'text-green-600', bg: 'bg-green-50' },
    { id: '22', name: 'Aluminium', desc: 'Percantik Interior', icon: Frame, color: 'text-pink-500', bg: 'bg-pink-50' },
    { id: '23', name: 'Exhaust Fan', desc: 'Udara Ruangan Segar', icon: AirVent, color: 'text-teal-500', bg: 'bg-teal-50' },
    { id: '24', name: 'Kipas Angin', desc: 'Rumahmu Lebih Adem', icon: Fan, color: 'text-red-500', bg: 'bg-red-50' },
    { id: '25', name: 'Batu Alam', desc: 'Sentuhan Alam Alami', icon: Gem, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: '26', name: 'Lemari', desc: 'Jaga Barang Pentingmu', icon: Archive, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: '27', name: 'Tangki Air', desc: 'Pasang Tangki Air', icon: Container, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { id: '28', name: 'Water Heater', desc: 'Air Hangat Nyaman', icon: Thermometer, color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: '29', name: 'Kanopi', desc: 'Lindungi Area Luar', icon: Tent, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: '30', name: 'Lantai', desc: 'Lantai Rumah Mulus', icon: Square, color: 'text-stone-500', bg: 'bg-stone-50' },
    { id: '31', name: 'Cuci Toren', desc: 'Air Bersih Mengalir', icon: Sparkles, color: 'text-sky-500', bg: 'bg-sky-50' },
    { id: '32', name: 'Kenek', desc: 'Bantu Pekerjaan Cepat', icon: UserPlus, color: 'text-emerald-500', bg: 'bg-emerald-50' },
];

const RepairServiceSelection: React.FC<RepairServiceSelectionProps> = ({ switchView, onSelectService }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSelect = (name: string) => {
        onSelectService(name);
        switchView('service-repair-booking');
    };

    // Categorization Logic for Services
    const categories = {
        popular: {
            title: "🔥 Paling Sering Dicari",
            ids: ['1', '4', '2', '5', '11', '19']
        },
        interior: {
            title: "🏠 Interior & Finishing",
            ids: ['3', '8', '9', '10', '30', '18', '22', '17', '12', '26']
        },
        utilities: {
            title: "⚡ Utilitas & Kelistrikan",
            ids: ['6', '23', '24', '28', '27', '31']
        },
        construction: {
            title: "🏗️ Konstruksi & Renovasi Berat",
            ids: ['13', '16', '25', '7', '21']
        },
        exterior: {
            title: "🌳 Eksterior & Halaman",
            ids: ['14', '15', '29', '11']
        },
        other: {
            title: "🛠️ Lainnya",
            ids: ['20', '32']
        }
    };

    const filteredServices = serviceTypes.filter(h =>
        h.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Grouping for Display (Only when not searching)
    const getGroupedServices = () => {
        if (searchTerm) return null; // Don't group if searching

        return Object.entries(categories).map(([key, category]) => {
            const items = serviceTypes.filter(h => category.ids.includes(h.id));
            if (items.length === 0) return null;
            return { ...category, items };
        });
    };

    const groupedData = getGroupedServices();

    return (
        <div className="min-h-screen bg-white font-sans animate-fade-in pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 py-4 px-6 md:px-12 sticky top-0 z-40 flex items-center justify-between shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-3 text-sm md:text-base">
                    <button onClick={() => switchView('home')} className="hover:bg-gray-100 p-2 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="flex items-center gap-2 text-gray-500">
                        <span className="cursor-pointer hover:text-blue-600" onClick={() => switchView('home')}>Home</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="font-bold text-gray-900">Pilih Layanan</span>
                    </div>
                </div>
                <div className="ml-auto">
                    <AlertCircle className="w-6 h-6 text-gray-400" />
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-12 py-8 max-w-6xl">
                {/* Hero / Search */}
                <div className="bg-blue-600 rounded-3xl p-8 mb-10 text-white shadow-xl shadow-blue-200 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 flex-1">
                        <h2 className="text-3xl font-extrabold mb-2">Butuh Perbaikan Apa? 🛠️</h2>
                        <p className="text-blue-100 text-lg opacity-90">Kami siap bantu segala masalah properti anda.</p>
                    </div>

                    <div className="relative w-full md:w-96 shrink-0">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari layanan (e.g., Bocor, Listrik)..."
                            className="w-full pl-14 pr-6 py-4 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400/30 font-medium shadow-lg bg-white"
                        />
                    </div>
                </div>

                {/* CONTENT AREA */}
                {searchTerm ? (
                    /* SEARCH RESULTS (Flat Grid) */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
                        {filteredServices.map((item) => (
                            <ServiceCard key={item.id} item={item} onClick={() => handleSelect(item.name)} />
                        ))}
                        {filteredServices.length === 0 && (
                            <div className="col-span-full text-center py-20 text-gray-400">
                                <Search className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p className="text-xl font-bold text-gray-300">Layanan tidak ditemukan</p>
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
                                        <ServiceCard key={item.id} item={item} onClick={() => handleSelect(item.name)} />
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
const ServiceCard = ({ item, onClick }: { item: any, onClick: () => void }) => (
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

export default RepairServiceSelection;
