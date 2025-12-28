'use client';

import React, { useState, useRef, useEffect, TouchEvent } from 'react';
import { MapPin, Calendar, Clock, DollarSign, User, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

import { Project, PROJECTS } from './PortfolioGrid';

interface ComponentProps {
    switchView?: (view: any) => void;
    project?: Project;
    onProjectClick?: (project: Project) => void;
}

const PortofolioDetails: React.FC<ComponentProps> = ({ switchView, project, onProjectClick }) => {
    // Fallback if no project is selected
    if (!project) return null;

    // Gallery images for carousel - using verified working Unsplash URLs
    const galleryImages = [
        project.image,
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
    ];
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const wheelTimeout = useRef<NodeJS.Timeout | null>(null);

    // Auto-slide every 5 seconds
    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [isPaused, galleryImages.length]);

    // Touch swipe handling
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);

    const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
        touchStartX.current = e.touches[0].clientX;
        setIsPaused(true);
    };

    const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
        setTimeout(() => setIsPaused(false), 2000);
    };

    // Wheel/trackpad swipe handling
    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        // Prevent default to stop page scroll
        e.preventDefault();

        // Debounce wheel events
        if (wheelTimeout.current) return;

        setIsPaused(true);

        // Detect horizontal swipe (deltaX) or vertical with shift
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

        if (Math.abs(delta) > 30) {
            if (delta > 0) nextSlide();
            else prevSlide();

            wheelTimeout.current = setTimeout(() => {
                wheelTimeout.current = null;
            }, 300);
        }

        setTimeout(() => setIsPaused(false), 2000);
    };

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            {/* 1. Impactful Hero Section */}
            <div className="relative h-[60vh] w-full bg-slate-900 group overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                </div>

                <div className="absolute bottom-0 left-0 w-full pb-16 pt-32 bg-gradient-to-t from-slate-900 to-transparent">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="max-w-3xl">
                                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-sm mb-4 ${project.badgeColor} bg-opacity-90 backdrop-blur-md`}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                    {project.category}
                                </span>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight tracking-tight">
                                    {project.title}
                                </h1>
                                <div className="flex items-center text-slate-300 gap-3 text-sm md:text-base font-medium">
                                    <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/5">
                                        <MapPin className="w-4 h-4 text-blue-400" />
                                        <span>{project.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Main Content Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Story & Gallery (8 cols) */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Project Story */}
                        <div className="prose prose-lg prose-slate max-w-none">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
                                Cerita Proyek
                            </h2>
                            <p className="text-slate-600 leading-8 text-[17px]">
                                {project.description} ini merupakan salah satu karya terbaik tim kami. Fokus utama dalam pengerjaan ini adalah menggabungkan fungsionalitas dengan estetika modern yang tak lekang oleh waktu.
                            </p>
                            <p className="text-slate-600 leading-8 text-[17px]">
                                Kami memulai dengan perencanaan matang, memilih material premium yang tahan lama, hingga eksekusi detail oleh tenaga ahli bersertifikat. Setiap sudut dirancang untuk memberikan kenyamanan maksimal bagi pemiliknya.
                            </p>

                            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 md:p-8 rounded-r-2xl my-8">
                                <p className="text-blue-900 font-bold italic text-lg leading-relaxed">
                                    "Prioritas kami bukan hanya selesai tepat waktu, tapi memberikan hasil yang membuat klien kami tersenyum puas."
                                </p>
                            </div>
                        </div>

                        {/* Featured Gallery Carousel */}
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
                                Galeri Pengerjaan
                            </h3>

                            {/* Main Carousel */}
                            <div
                                className="relative rounded-3xl overflow-hidden shadow-2xl h-[350px] md:h-[450px] group select-none"
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                                onWheel={handleWheel}
                            >
                                <img
                                    src={galleryImages[currentSlide]}
                                    alt={`Slide ${currentSlide + 1}`}
                                    className="w-full h-full object-cover transition-all duration-500 pointer-events-none"
                                    draggable="false"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors pointer-events-none"></div>

                                {/* Left/Right Navigation with Glass Effect */}
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>

                                {/* Slide Counter & Indicators */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full z-10">
                                    {galleryImages.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentSlide(idx)}
                                            className={`w-2.5 h-2.5 rounded-full transition-all ${currentSlide === idx ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                                                }`}
                                        />
                                    ))}
                                    <span className="text-white/80 text-xs font-bold ml-2">
                                        {currentSlide + 1} / {galleryImages.length}
                                    </span>
                                </div>
                            </div>

                            {/* Thumbnail Preview Row */}
                            <div className="grid grid-cols-4 gap-3 mt-4">
                                {galleryImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentSlide(idx)}
                                        className={`rounded-xl overflow-hidden h-20 md:h-24 transition-all border-2 ${currentSlide === idx ? 'border-blue-600 ring-2 ring-blue-200' : 'border-transparent opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Sidebar (4 cols) */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Detail Info Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 sticky top-28">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-gray-100 pb-4">
                                Detail Spesifikasi
                            </h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Klien</p>
                                        <p className="font-bold text-slate-900 text-base">Bapak Hendra</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Selesai</p>
                                        <p className="font-bold text-slate-900 text-base">Januari 2025</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Durasi</p>
                                        <p className="font-bold text-slate-900 text-base">3 Bulan Pengerjaan</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                        <DollarSign className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Estimasi Nilai</p>
                                        <p className="font-bold text-blue-700 text-lg">Rp 150.000.000</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group">
                                    <span>Konsultasi Gratis</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => switchView && switchView('layanan')}
                                    className="w-full mt-3 bg-white border border-slate-200 text-slate-600 hover:border-blue-600 hover:text-blue-600 font-bold py-3.5 rounded-xl transition-all"
                                >
                                    Lihat Layanan
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* 3. Related Projects Footer */}
            <div className="bg-white border-t border-slate-100 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Inspirasi Lainnya</span>
                            <h2 className="text-3xl font-bold text-slate-900 mt-2">Proyek Serupa</h2>
                        </div>
                        <button
                            onClick={() => switchView && switchView('portfolio')}
                            className="hidden md:flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors"
                        >
                            Lihat Semua <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {PROJECTS.filter(p => p.id !== project.id).slice(0, 3).map((relatedProject) => (
                            <div
                                key={relatedProject.id}
                                onClick={() => onProjectClick && onProjectClick(relatedProject)}
                                className="group cursor-pointer"
                            >
                                <div className="rounded-2xl overflow-hidden h-64 mb-4 relative shadow-md">
                                    <img
                                        src={relatedProject.image}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        alt={relatedProject.title}
                                    />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
                                    <span className={`absolute bottom-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-sm ${relatedProject.badgeColor}`}>
                                        {relatedProject.category}
                                    </span>
                                </div>
                                <h3 className="font-bold text-xl text-slate-900 group-hover:text-blue-600 transition-colors mb-1">{relatedProject.title}</h3>
                                <p className="text-sm text-slate-500 font-medium flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> {relatedProject.location}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default PortofolioDetails;
