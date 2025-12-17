import React from 'react';
import {
    Zap, Droplets, Umbrella, PaintBucket, Hammer, Layers,
    DoorOpen, Wind, Home, PenTool, Box, Shield,
    Fan, Thermometer, Truck, Grid, Wrench, ChefHat
} from 'lucide-react';
import Navbar from '../navbar';
import Footer from '../footer';

interface ServiceItem {
    id: string;
    name: string;
    desc: string;
    icon: React.ElementType;
    colorClass: string;
}

const ALL_SERVICES: ServiceItem[] = [
    { id: '1', name: 'Kebocoran', desc: 'Jaga Rumah Bebas Bocor', icon: Droplets, colorClass: 'bg-blue-100 text-blue-600' },
    { id: '2', name: 'Cat', desc: 'Warnai Rumahmu', icon: PaintBucket, colorClass: 'bg-red-100 text-red-600' },
    { id: '3', name: 'Keramik', desc: 'Percantik Lantai dan Dindingmu', icon: Grid, colorClass: 'bg-orange-100 text-orange-600' },
    { id: '4', name: 'Listrik', desc: 'Rumah Terang, Hati Senang', icon: Zap, colorClass: 'bg-yellow-100 text-yellow-600' },
    { id: '5', name: 'Pipa', desc: 'Air Mengalir Lancar', icon: Wrench, colorClass: 'bg-cyan-100 text-cyan-600' },
    { id: '6', name: 'Toilet', desc: 'Kamar Mandi Bersih dan Nyaman', icon: Umbrella, colorClass: 'bg-indigo-100 text-indigo-600' }, // Using Umbrella as placeholder for Toilet/Sanitation if specific icon not available
    { id: '7', name: 'Konsultan', desc: 'Bantu Rencanakan Proyekmu', icon: PenTool, colorClass: 'bg-amber-100 text-amber-600' },
    { id: '8', name: 'Plafon', desc: 'Kebutuhan Langit-langit Rumahmu', icon: Layers, colorClass: 'bg-gray-100 text-gray-600' },
    { id: '9', name: 'Dinding/Tembok', desc: 'Dinding Kokoh dan Terjaga', icon: Home, colorClass: 'bg-rose-100 text-rose-600' },
    { id: '10', name: 'Pintu/Jendela', desc: 'Kreasi Pintu dan Jendela Rumahmu', icon: DoorOpen, colorClass: 'bg-purple-100 text-purple-600' },
    { id: '11', name: 'Atap/Dak Beton', desc: 'Atap Pelindung Rumahmu', icon: Shield, colorClass: 'bg-slate-100 text-slate-600' },
    { id: '12', name: 'Dapur', desc: 'Biar Lebih Semangat Memasak', icon: ChefHat, colorClass: 'bg-pink-100 text-pink-600' },
    { id: '13', name: 'Jasa Angkat', desc: 'Bantu Pindahkan Barang-barangmu', icon: Truck, colorClass: 'bg-orange-200 text-orange-700' },
    { id: '14', name: 'Conblock', desc: 'Agar Pekarangan Rumahmu Indah', icon: Grid, colorClass: 'bg-stone-100 text-stone-600' },
    { id: '15', name: 'Aluminium Aksesoris', desc: 'Percantik Interior Rumahmu', icon: Box, colorClass: 'bg-zinc-100 text-zinc-600' },
    { id: '16', name: 'Exhaust Fan', desc: 'Udara Ruangan Segar dan Bersih', icon: Fan, colorClass: 'bg-green-100 text-green-600' },
    { id: '17', name: 'Kipas Angin', desc: 'Biar Rumahmu Lebih Adem', icon: Wind, colorClass: 'bg-teal-100 text-teal-600' },
    { id: '18', name: 'Batu Alam', desc: 'Sentuhan Alam di Rumahmu', icon: Hammer, colorClass: 'bg-emerald-100 text-emerald-600' },
    { id: '19', name: 'Lemari', desc: 'Jaga Barang-barang Pentingmu', icon: Box, colorClass: 'bg-amber-50 text-amber-800' },
    { id: '20', name: 'Tangki Air Toren', desc: 'Pasang Tangki Air di Rumahmu', icon: Droplets, colorClass: 'bg-blue-50 text-blue-800' },
    { id: '21', name: 'Tangki Air Bawah', desc: 'Solusi Penampungan Air Bawah Tanah', icon: Layers, colorClass: 'bg-indigo-50 text-indigo-800' },
    { id: '22', name: 'Water Heater', desc: 'Air Mandi Hangat dan Nyaman', icon: Thermometer, colorClass: 'bg-red-50 text-red-800' },
    { id: '23', name: 'Kanopi', desc: 'Lindungi Bagian Luar Rumahmu', icon: Umbrella, colorClass: 'bg-sky-100 text-sky-700' },
    { id: '24', name: 'Lantai', desc: 'Agar Lantai Rumah Mulus', icon: Layers, colorClass: 'bg-neutral-100 text-neutral-700' },
    { id: '25', name: 'Cuci Toren', desc: 'Toren Kotor Jadi Bersih', icon: Droplets, colorClass: 'bg-cyan-50 text-cyan-800' },
    { id: '26', name: 'Kenek', desc: 'Bantu Pekerjaan Cepat Selesai', icon: Hammer, colorClass: 'bg-lime-100 text-lime-700' },
];

interface ServicePageProps {
    switchView: (view: 'home' | 'search' | 'login' | 'admin' | 'layanan') => void;
}

const ServicePage: React.FC<ServicePageProps> = ({ switchView }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col animate-fade-in">
            <Navbar switchView={switchView} />

            <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Layanan Kami</h1>
                        <p className="mt-4 text-lg text-gray-600">Temukan solusi profesional untuk setiap kebutuhan rumah Anda</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
                        {ALL_SERVICES.map((service) => (
                            <div key={service.id} onClick={() => switchView('search')} className="group cursor-pointer bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 flex flex-col items-start text-left relative overflow-hidden">
                                {/* Hover Background Pattern */}
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                                <div className={`relative z-10 p-3 rounded-xl mb-4 transition-transform duration-300 group-hover:scale-105 ${service.colorClass}`}>
                                    <service.icon className="w-8 h-8" />
                                </div>
                                <h3 className="relative z-10 font-bold text-gray-900 text-lg mb-1 group-hover:text-[#1e3a8a] transition-colors">{service.name}</h3>

                                {/* Description - Hidden by default, shown on hover */}
                                <div className="relative z-10 max-h-0 opacity-0 group-hover:max-h-[100px] group-hover:opacity-100 transition-all duration-500 ease-in-out overflow-hidden">
                                    <p className="text-sm text-gray-500 leading-snug pt-2">{service.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ServicePage;
