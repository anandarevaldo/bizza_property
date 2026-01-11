
import React from 'react';
import PortfolioGrid from '@/components/Portfolio/PortfolioGrid';
import { getProjects } from '@/lib/actions/portfolio';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default async function PortfolioPage() {
    const projects = await getProjects();

    return (
        <div className="bg-white min-h-screen font-sans">
            {/* Navbar matches Layanan page style (transparent over Hero) */}
            <Navbar currentView="portfolio" />
            
            <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop')" }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-white" />
                </div>

                <div className="relative z-10 container mx-auto px-6 md:px-12 text-white h-full flex flex-col justify-center pb-20">
                    <div className="max-w-l">
                         <span className="text-yellow-400 font-bold tracking-wider uppercase text-sm mb-2 block">Portofolio Kami</span>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight drop-shadow-lg">
                            Hasil Karya <span className="text-yellow-400">Terbaik</span>
                        </h1>
                        <p className="text-base md:text-lg text-gray-100 max-w-xl leading-relaxed drop-shadow-md">
                            Lihat bagaimana kami mentransformasi ide menjadi kenyataan dengan standar kualitas tertinggi.
                        </p>
                    </div>
                </div>
            </section>
            
            <div className="pt-12 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Title and Intro removed from here as it's now in Hero */}
                
                <PortfolioGrid projects={projects} />
            </div>
            <Footer />
        </div>
    );
}
