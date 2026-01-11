
import React from 'react';
import PortofolioDetails from '@/components/Portfolio/PortofolioDetails';
import { getProjectById, getProjects } from '@/lib/actions/portfolio';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { notFound } from 'next/navigation';

export default async function PortfolioDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const projectId = parseInt(id);
    const project = await getProjectById(projectId);
    const allProjects = await getProjects(); // For "Related Projects"

    if (!project) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white font-sans animate-fade-in">
            <Navbar currentView="portfolio" />
            
            <section className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${project.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"}')` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-white" />
                </div>

                <div className="relative z-10 container mx-auto px-6 md:px-12 text-white h-full flex flex-col justify-center pb-10">
                    <div className="max-w-3xl">
                        <div className="inline-block px-3 py-1 bg-yellow-400 text-blue-900 rounded-full text-xs font-bold mb-4 shadow-md">
                            {project.category}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight tracking-tight drop-shadow-lg">
                            {project.title}
                        </h1>
                        <p className="text-base md:text-lg text-gray-200 flex items-center gap-2">
                             <span className="w-2 h-2 rounded-full bg-green-400"></span>
                            {project.location}
                        </p>
                    </div>
                </div>
            </section>
            <PortofolioDetails 
                project={project} 
                projects={allProjects} 
            />
            <Footer />
        </div>
    );
}
