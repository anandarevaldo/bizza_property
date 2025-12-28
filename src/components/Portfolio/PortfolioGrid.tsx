'use client';

import React, { useState } from 'react';
import { SearchX, ArrowRight, MapPin } from 'lucide-react';

export interface Project {
    id: number;
    category: 'Renovasi' | 'Service AC' | 'Electrical' | 'Pengecatan' | 'Plumbing';
    title: string;
    description: string;
    location: string;
    image: string;
    badgeColor: string;
}

export const PROJECTS: Project[] = [
    {
        id: 1,
        category: 'Renovasi',
        title: 'Renovasi Tembok',
        location: 'Tukad Balian, Denpasar, Bali',
        description: 'Pengerjaan 1 Bulan. Renovasi total tembok pembatas dengan finishing batu alam.',
        image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop',
        badgeColor: 'bg-blue-600'
    },
    {
        id: 2,
        category: 'Electrical',
        title: 'Instalasi Kelistrikan',
        location: 'Renon, Denpasar, Bali',
        description: 'Pengerjaan 3 hari, 15 titik lampu. Instalasi baru untuk ruko 2 lantai.',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop',
        badgeColor: 'bg-yellow-500 text-blue-900'
    },
    {
        id: 3,
        category: 'Plumbing', // Corrected from Pengecatan/Plumbing ambiguity
        title: 'Perbaikan Pipa Bocor',
        location: 'Jimbaran, Badung, Bali',
        description: 'Pengerjaan 4 jam, garansi 1 bulan. Penanganan kebocoran pipa tanam.',
        image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop',
        badgeColor: 'bg-purple-600'
    },
    {
        id: 4,
        category: 'Service AC',
        title: 'Instalasi Air Conditioner',
        location: 'Sanur, Denpasar, Bali',
        description: 'Pengerjaan 2 Unit, Daikin 1PK Inverter. Pemasangan rapi dan vacum.',
        image: 'https://images.unsplash.com/photo-1574359611100-c081e64c3c26?q=80&w=1854&auto=format&fit=crop',
        badgeColor: 'bg-cyan-500'
    },
    {
        id: 5,
        category: 'Renovasi',
        title: 'Bongkar Tembok Open Space',
        location: 'Tukad Balian, Denpasar',
        description: 'Pembongkaran tembok untuk perluasan ruang keluarga modern.',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop',
        badgeColor: 'bg-rose-600'
    },
    {
        id: 6,
        category: 'Electrical',
        title: 'Instalasi Smart Home',
        location: 'Renon, Denpasar',
        description: 'Integrasi sistem kelistrikan pintar dengan kontrol suara.',
        image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=2070&auto=format&fit=crop',
        badgeColor: 'bg-yellow-500 text-blue-900'
    },
    {
        id: 7,
        category: 'Plumbing',
        title: 'Perbaikan Pipa Dapur',
        location: 'Jimbaran, Badung',
        description: 'Penanganan kebocoran pipa sink dapur dengan material anti-karat.',
        image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=2070&auto=format&fit=crop',
        badgeColor: 'bg-blue-600'
    },
    {
        id: 8,
        category: 'Service AC',
        title: 'Instalasi AC Split 2PK',
        location: 'Sanur, Denpasar',
        description: 'Pemasangan unit AC baru dengan jalur pipa tanam estetis.',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop',
        badgeColor: 'bg-cyan-500'
    },
    {
        id: 9,
        category: 'Renovasi',
        title: 'Renovasi Atap',
        location: 'Dalung, Kuta Utara',
        description: 'Restorasi struktur atap dan penggantian genteng keramik.',
        image: 'https://images.unsplash.com/photo-1632759145351-1d592919f522?q=80&w=2070&auto=format&fit=crop',
        badgeColor: 'bg-rose-600'
    },
    {
        id: 10,
        category: 'Service AC',
        title: 'Cuci AC Berkala',
        location: 'Panjer, Denpasar',
        description: 'Deep cleaning unit indoor dan outdoor untuk kualitas udara.',
        image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=2069&auto=format&fit=crop',
        badgeColor: 'bg-cyan-500'
    }
];

export const CATEGORIES = ['Semua', 'Renovasi', 'Service AC', 'Electrical', 'Pengecatan', 'Plumbing'];

interface PortfolioGridProps {
    onProjectClick?: (project: Project) => void;
}

const PortfolioGrid: React.FC<PortfolioGridProps> = ({ onProjectClick }) => {
    const [activeCategory, setActiveCategory] = useState('Semua');

    const filteredProjects = activeCategory === 'Semua'
        ? PROJECTS
        : PROJECTS.filter(project => project.category === activeCategory);

    return (
        <div className="container mx-auto px-4 md:px-12 pb-32 pt-12">
            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
                {CATEGORIES.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeCategory === category
                            ? 'bg-[#1e3a8a] text-white shadow-lg transform scale-105'
                            : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1e3a8a] hover:text-[#1e3a8a] hover:shadow-md'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Projects Grid or Empty State */}
            {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project) => (
                        <div
                            key={project.id}
                            onClick={() => onProjectClick && onProjectClick(project)}
                            className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 h-[400px] cursor-pointer bg-gray-900 border border-gray-100"
                        >
                            {/* Background Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: `url('${project.image}')` }}
                            >
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6"></div>
                            </div>

                            {/* Content Overlay */}
                            <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 text-white shadow-sm w-fit ${project.badgeColor}`}>
                                        {project.category}
                                    </span>
                                    <h3 className="text-2xl font-bold text-white mb-1 leading-tight">{project.title}</h3>
                                    <p className="text-sm text-gray-300 mb-3 flex items-center font-medium">
                                        <MapPin className="w-4 h-4 mr-1 text-yellow-400" />
                                        {project.location}
                                    </p>
                                    <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100">
                                        <p className="text-gray-300 text-sm leading-relaxed mb-3 border-t border-white/20 pt-2">
                                            {project.description}
                                        </p>
                                        <button className="text-yellow-400 text-sm font-bold flex items-center hover:underline">
                                            Lihat Detail <ArrowRight className="ml-2 w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Empty State UI */
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-center animate-fade-in">
                    <div className="bg-gray-50 p-6 rounded-full shadow-inner mb-6">
                        <SearchX className="w-16 h-16 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Belum ada proyek di kategori ini</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                        Kami terus mengerjakan proyek baru. Cek kategori lain untuk melihat hasil karya kami.
                    </p>
                    <button
                        onClick={() => setActiveCategory('Semua')}
                        className="text-[#1e3a8a] font-bold hover:underline bg-blue-50 px-6 py-2 rounded-full"
                    >
                        Lihat Semua Proyek
                    </button>
                </div>
            )}
        </div>
    );
};

export default PortfolioGrid;
