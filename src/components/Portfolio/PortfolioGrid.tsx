'use client';

import React, { useState } from 'react';
import { SearchX, ArrowRight, MapPin } from 'lucide-react';

export interface Project {
    id: number;
    category: string;
    title: string;
    description: string;
    location: string;
    image: string;
    galleryImages: string[];
    badgeColor: string;
}

export const CATEGORIES = ['Semua', 'Renovasi', 'Service AC', 'Electrical', 'Pengecatan', 'Plumbing'];

import Link from 'next/link';

interface PortfolioGridProps {
    onProjectClick?: (project: Project) => void; // Deprecated
    projects: Project[];
}

const PortfolioGrid: React.FC<PortfolioGridProps> = ({ onProjectClick, projects }) => {
    const [activeCategory, setActiveCategory] = useState('Semua');

    const filteredProjects = activeCategory === 'Semua'
        ? projects
        : projects.filter(project => project.category === activeCategory);

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
                        <Link
                            key={project.id}
                            href={`/user/portfolio/${project.id}`}
                            className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-[400px] cursor-pointer bg-gray-900 border border-gray-100"
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
                        </Link>
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
