'use client';

import React, { useState, useRef, useEffect, TouchEvent } from 'react';
import { MapPin, Calendar, Clock, DollarSign, User, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Project } from './PortfolioGrid';

interface ComponentProps {
    switchView?: (view: any) => void;
    project?: Project;
    onProjectClick?: (project: Project) => void;
    projects?: Project[];
}

const PortofolioDetails: React.FC<ComponentProps> = ({ switchView, project, onProjectClick, projects = [] }) => {
    // Fallback if no project is selected
    if (!project) return null;

    // Use dynamic gallery images from database, fallback to main image if empty
    const galleryImages = project.galleryImages && project.galleryImages.length > 0
        ? project.galleryImages
        : [project.image];

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


            {/* 2. Main Content Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Story & Gallery (Full Width now) */}
                    <div className="lg:col-span-12 space-y-12">
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

                        {/* Additional Gallery Section */}
                        {galleryImages.length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
                                    Galeri Pengerjaan
                                </h3>

                                {/* Main Carousel */}
                                <div
                                    className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] md:h-[600px] group select-none max-w-5xl mx-auto"
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
                                    {galleryImages.length > 1 && (
                                        <>
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
                                        </>
                                    )}

                                    {/* Slide Counter & Indicators */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full z-10">
                                        {galleryImages.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentSlide(idx)}
                                                className={`w-2.5 h-2.5 rounded-full transition-all ${currentSlide === idx ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                                            />
                                        ))}
                                        <span className="text-white/80 text-xs font-bold ml-2">
                                            {currentSlide + 1} / {galleryImages.length}
                                        </span>
                                    </div>
                                </div>

                                {/* Thumbnail Preview Row */}
                                <div className="grid grid-cols-4 md:grid-cols-6 gap-3 mt-4 max-w-5xl mx-auto">
                                    {galleryImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentSlide(idx)}
                                            className={`rounded-xl overflow-hidden h-20 md:h-24 transition-all border-2 ${currentSlide === idx ? 'border-blue-600 ring-2 ring-blue-200' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                        >
                                            <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-8 flex justify-center">
                            <Link
                                href="/user/layanan"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all flex items-center gap-2 group"
                            >
                                <span>Lihat Layanan Kami</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
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
                        <Link
                            href="/user/portfolio"
                            className="hidden md:flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors"
                        >
                            Lihat Semua <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {projects.filter(p => p.id !== project.id).slice(0, 3).map((relatedProject) => (
                            <Link
                                key={relatedProject.id}
                                href={`/user/portfolio/${relatedProject.id}`}
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
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default PortofolioDetails;
