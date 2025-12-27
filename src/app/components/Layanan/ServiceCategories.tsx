'use client';

import React, { useState } from 'react';
import {
    Zap, Droplets, Umbrella, PaintBucket, Hammer, Layers,
    DoorOpen, Wind, Home, PenTool, Box, Shield,
    Fan, Thermometer, Truck, Grid, Wrench, ChefHat,
    ShoppingCart, HardHat, ArrowRight, CheckCircle, Phone, MessageCircle, Star, Users, Clock, Building2, Fence, TreeDeciduous, Shovel, Ruler, Palette, ChevronDown, ChevronUp, Bath, Package, Blocks, Frame, AirVent, Gem, Archive, Container, Waves, Tent, Square, Sparkles, UserPlus
} from 'lucide-react';

interface ServiceItem {
    id: string;
    name: string;
    desc: string;
    icon: React.ElementType;
    colorClass: string;
    bgGradient: string;
    patternColor: string;
}

const ALL_SERVICES: ServiceItem[] = [
    { id: '1', name: 'Kebocoran', desc: 'Jaga Rumah Bebas Bocor', icon: Droplets, colorClass: 'text-blue-600', bgGradient: 'from-blue-50 to-blue-100', patternColor: '#3b82f6' },
    { id: '2', name: 'Cat', desc: 'Warnai Rumahmu', icon: PaintBucket, colorClass: 'text-red-600', bgGradient: 'from-red-50 to-red-100', patternColor: '#dc2626' },
    { id: '3', name: 'Keramik', desc: 'Percantik Lantai & Dinding', icon: Grid, colorClass: 'text-orange-600', bgGradient: 'from-orange-50 to-orange-100', patternColor: '#ea580c' },
    { id: '4', name: 'Listrik', desc: 'Rumah Terang, Hati Senang', icon: Zap, colorClass: 'text-yellow-600', bgGradient: 'from-yellow-50 to-yellow-100', patternColor: '#ca8a04' },
    { id: '5', name: 'Pipa', desc: 'Air Mengalir Lancar', icon: Wrench, colorClass: 'text-cyan-600', bgGradient: 'from-cyan-50 to-cyan-100', patternColor: '#0891b2' },
    { id: '6', name: 'Sanitasi', desc: 'Kamar Mandi Bersih', icon: Umbrella, colorClass: 'text-indigo-600', bgGradient: 'from-indigo-50 to-indigo-100', patternColor: '#4f46e5' },
    { id: '7', name: 'Konsultan', desc: 'Bantu Rencanakan Proyek', icon: PenTool, colorClass: 'text-amber-600', bgGradient: 'from-amber-50 to-amber-100', patternColor: '#d97706' },
    { id: '8', name: 'Plafon', desc: 'Perbaikan Langit-langit', icon: Layers, colorClass: 'text-gray-600', bgGradient: 'from-gray-50 to-gray-100', patternColor: '#4b5563' },
    { id: '9', name: 'Dinding', desc: 'Dinding Kokoh Terjaga', icon: Home, colorClass: 'text-rose-600', bgGradient: 'from-rose-50 to-rose-100', patternColor: '#e11d48' },
    { id: '10', name: 'Pintu', desc: 'Kreasi Pintu & Jendela', icon: DoorOpen, colorClass: 'text-purple-600', bgGradient: 'from-purple-50 to-purple-100', patternColor: '#9333ea' },
    { id: '11', name: 'Atap', desc: 'Pelindung Rumahmu', icon: Shield, colorClass: 'text-slate-600', bgGradient: 'from-slate-50 to-slate-100', patternColor: '#475569' },
    { id: '12', name: 'Dapur', desc: 'Semangat Memasak', icon: ChefHat, colorClass: 'text-pink-600', bgGradient: 'from-pink-50 to-pink-100', patternColor: '#db2777' },
    { id: '13', name: 'Konstruksi', desc: 'Bangun Rumah Impian', icon: Building2, colorClass: 'text-teal-600', bgGradient: 'from-teal-50 to-teal-100', patternColor: '#0d9488' },
    { id: '14', name: 'Pagar', desc: 'Keamanan Properti', icon: Fence, colorClass: 'text-emerald-600', bgGradient: 'from-emerald-50 to-emerald-100', patternColor: '#059669' },
    { id: '15', name: 'Taman', desc: 'Landscape & Taman', icon: TreeDeciduous, colorClass: 'text-lime-600', bgGradient: 'from-lime-50 to-lime-100', patternColor: '#65a30d' },
    { id: '16', name: 'Pondasi', desc: 'Struktur Kuat Kokoh', icon: Shovel, colorClass: 'text-stone-600', bgGradient: 'from-stone-50 to-stone-100', patternColor: '#57534e' },
    { id: '17', name: 'Desain', desc: 'Rancang Hunianmu', icon: Ruler, colorClass: 'text-sky-600', bgGradient: 'from-sky-50 to-sky-100', patternColor: '#0284c7' },
    { id: '18', name: 'Interior', desc: 'Desain Interior Elegan', icon: Palette, colorClass: 'text-fuchsia-600', bgGradient: 'from-fuchsia-50 to-fuchsia-100', patternColor: '#c026d3' },
    { id: '19', name: 'Toilet', desc: 'Kamar Mandi Nyaman', icon: Bath, colorClass: 'text-violet-600', bgGradient: 'from-violet-50 to-violet-100', patternColor: '#7c3aed' },
    { id: '20', name: 'Jasa Angkat', desc: 'Pindahkan Barangmu', icon: Package, colorClass: 'text-orange-500', bgGradient: 'from-orange-50 to-orange-100', patternColor: '#f97316' },
    { id: '21', name: 'Conblock', desc: 'Pekarangan Rumah Indah', icon: Blocks, colorClass: 'text-green-600', bgGradient: 'from-green-50 to-green-100', patternColor: '#16a34a' },
    { id: '22', name: 'Aluminium', desc: 'Percantik Interior', icon: Frame, colorClass: 'text-pink-500', bgGradient: 'from-pink-50 to-pink-100', patternColor: '#ec4899' },
    { id: '23', name: 'Exhaust Fan', desc: 'Udara Ruangan Segar', icon: AirVent, colorClass: 'text-teal-500', bgGradient: 'from-teal-50 to-teal-100', patternColor: '#14b8a6' },
    { id: '24', name: 'Kipas Angin', desc: 'Rumahmu Lebih Adem', icon: Fan, colorClass: 'text-red-500', bgGradient: 'from-red-50 to-red-100', patternColor: '#ef4444' },
    { id: '25', name: 'Batu Alam', desc: 'Sentuhan Alam Alami', icon: Gem, colorClass: 'text-amber-600', bgGradient: 'from-amber-50 to-amber-100', patternColor: '#d97706' },
    { id: '26', name: 'Lemari', desc: 'Jaga Barang Pentingmu', icon: Archive, colorClass: 'text-blue-500', bgGradient: 'from-blue-50 to-blue-100', patternColor: '#3b82f6' },
    { id: '27', name: 'Tangki Air', desc: 'Pasang Tangki Air', icon: Container, colorClass: 'text-cyan-500', bgGradient: 'from-cyan-50 to-cyan-100', patternColor: '#06b6d4' },
    { id: '28', name: 'Water Heater', desc: 'Air Hangat Nyaman', icon: Thermometer, colorClass: 'text-rose-500', bgGradient: 'from-rose-50 to-rose-100', patternColor: '#f43f5e' },
    { id: '29', name: 'Kanopi', desc: 'Lindungi Area Luar', icon: Tent, colorClass: 'text-indigo-500', bgGradient: 'from-indigo-50 to-indigo-100', patternColor: '#6366f1' },
    { id: '30', name: 'Lantai', desc: 'Lantai Rumah Mulus', icon: Square, colorClass: 'text-stone-500', bgGradient: 'from-stone-50 to-stone-100', patternColor: '#78716c' },
    { id: '31', name: 'Cuci Toren', desc: 'Air Bersih Mengalir', icon: Sparkles, colorClass: 'text-sky-500', bgGradient: 'from-sky-50 to-sky-100', patternColor: '#0ea5e9' },
    { id: '32', name: 'Kenek', desc: 'Bantu Pekerjaan Cepat', icon: UserPlus, colorClass: 'text-emerald-500', bgGradient: 'from-emerald-50 to-emerald-100', patternColor: '#10b981' },
];

interface ServiceCategoriesProps {
    switchView: (view: 'home' | 'search' | 'login' | 'admin' | 'layanan' | 'portfolio' | 'about') => void;
}

const ServiceCategories: React.FC<ServiceCategoriesProps> = ({ switchView }) => {
    const [showAllServices, setShowAllServices] = useState(false);
    const displayedServices = showAllServices ? ALL_SERVICES : ALL_SERVICES.slice(0, 12);

    return (
        <div className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4 block">Kategori Layanan</span>
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Semua Kebutuhan Properti Anda</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">Pilih dari berbagai kategori layanan profesional kami</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                    {displayedServices.map((service, index) => (
                        <div
                            key={service.id}
                            onClick={() => switchView('search')}
                            className="group cursor-pointer bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center text-center hover:-translate-y-2 relative overflow-hidden"
                            style={{
                                animation: index >= 12 && showAllServices ? `fadeSlideUp 0.4s ease-out ${(index - 12) * 0.05}s both` : 'none'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = service.patternColor}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#f3f4f6'}
                        >
                            {/* Decorative Icon - Bottom Right Corner */}
                            <service.icon
                                className="absolute -bottom-4 -right-4 w-24 h-24 opacity-[0.06]"
                                style={{
                                    color: service.patternColor,
                                    animation: 'floatSlow 4s ease-in-out infinite'
                                }}
                            />

                            {/* Small Squares Pattern - Top Left Area */}
                            <div
                                className="absolute top-2 left-2 w-16 h-16 opacity-[0.15]"
                                style={{
                                    backgroundImage: `linear-gradient(45deg, ${service.patternColor} 10%, transparent 10%, transparent 90%, ${service.patternColor} 90%)`,
                                    backgroundSize: '6px 6px'
                                }}
                            ></div>

                            <div className={`relative z-10 p-4 rounded-2xl bg-gradient-to-br ${service.bgGradient} mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                                <service.icon className={`w-6 h-6 ${service.colorClass} transition-transform duration-300 group-hover:rotate-12`} />
                            </div>
                            <h3 className="relative z-10 font-bold text-gray-800 text-sm mb-1">{service.name}</h3>
                            <p className="relative z-10 text-xs text-gray-400 leading-relaxed">{service.desc}</p>
                        </div>
                    ))}
                </div>

                {/* See More Button */}
                <div className="text-center mt-12">
                    <button
                        onClick={() => setShowAllServices(!showAllServices)}
                        className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                    >
                        {showAllServices ? 'Tampilkan Lebih Sedikit' : 'Lihat Semua Layanan'}
                        {showAllServices ? (
                            <ChevronUp className="w-5 h-5 ml-2 transition-transform group-hover:-translate-y-1" />
                        ) : (
                            <ChevronDown className="w-5 h-5 ml-2 transition-transform group-hover:translate-y-1" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceCategories;
