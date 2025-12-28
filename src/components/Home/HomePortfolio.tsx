import React from 'react';
import { Project, PROJECTS, CATEGORIES } from '../Portfolio/PortfolioGrid';
import { ArrowRight } from 'lucide-react';

interface PortfolioProps {
    activePortfolioCategory: string;
    setActivePortfolioCategory: (category: string) => void;
    switchView: (view: any) => void;
    onProjectClick: (project: Project) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ activePortfolioCategory, setActivePortfolioCategory, switchView, onProjectClick }) => {
    // Use first 4 items for the home page display to maintain the grid layout
    const displayProjects = PROJECTS.slice(0, 4);

    const filteredProjects = activePortfolioCategory === 'Semua'
        ? displayProjects
        : displayProjects.filter(p => p.category === activePortfolioCategory);

    // Color helper removed as it is now in data


    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 md:px-12">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">Portfolio Proyek</h2>
                    <p className="text-gray-500">Lihat hasil kerja nyata dari mitra profesional kami</p>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActivePortfolioCategory(category)}
                            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activePortfolioCategory === category
                                ? 'bg-[#1e3a8a] text-white shadow-lg transform scale-105'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1e3a8a] hover:text-[#1e3a8a] hover:shadow-md'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Project Grid - Collage Style */}
                <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[300px] gap-6 grid-flow-dense mb-12">
                    {filteredProjects.map((project, index) => {
                        let spanClasses = "";
                        if (index === 0) spanClasses = "md:col-span-2 md:row-span-2";
                        else if (index === 2) spanClasses = "md:col-span-1 md:row-span-2";
                        else spanClasses = "md:col-span-1 md:row-span-1";

                        return (
                            <div
                                key={project.id}
                                onClick={() => onProjectClick(project)}
                                className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 text-left group cursor-pointer relative ${spanClasses}`}
                            >
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                />
                                {/* Overlay Gradient - Always visible */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-6 text-white">
                                    <span className={`inline-block px-3 py-1 ${project.badgeColor} backdrop-blur-sm rounded-full text-xs font-bold w-fit mb-2 shadow-sm`}>
                                        {project.category}
                                    </span>
                                    <h3 className={`font-bold leading-tight mb-1 ${index === 0 ? 'text-2xl md:text-3xl' : 'text-xl'}`}>{project.title}</h3>
                                    <p className="text-sm text-gray-300 mb-2 font-medium flex items-center">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2"></span>
                                        {project.location}
                                    </p>
                                    <div className={`text-xs text-gray-300/90 italic pt-2 border-t border-white/20 mt-1 ${index === 0 ? 'line-clamp-3' : 'line-clamp-2'}`}>
                                        {project.description}
                                    </div>
                                    <div className="mt-2 text-yellow-400 text-xs font-bold flex items-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                        Lihat Detail <ArrowRight className="w-3 h-3 ml-1" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* View All Button */}
                <div className="text-center">
                    <button
                        onClick={() => switchView('portfolio')}
                        className="px-8 py-3 bg-white border-2 border-[#1e3a8a] text-[#1e3a8a] rounded-full font-bold hover:bg-[#1e3a8a] hover:text-white transition-all shadow-md hover:shadow-xl flex items-center gap-2 mx-auto"
                    >
                        Lihat Seluruh Portfolio <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Portfolio;

