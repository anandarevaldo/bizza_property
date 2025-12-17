import React from 'react';

interface PortfolioProps {
    activePortfolioCategory: string;
    setActivePortfolioCategory: (category: string) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ activePortfolioCategory, setActivePortfolioCategory }) => {
    const categories = ['Semua', 'Renovasi', 'Service AC', 'Electrical', 'Pengecatan'];

    const projects = [
        {
            id: 1,
            category: 'Renovasi',
            title: 'Renovasi Tembok',
            location: 'Tukad Balian, Denpasar, Bali',
            description: 'Pengerjaan 1 Bulan',
            image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop',
        },
        {
            id: 2,
            category: 'Electrical',
            title: 'Instalasi Kelistrikan',
            location: 'Renon, Denpasar, Bali',
            description: 'Pengerjaan 3 hari, 15 titik lampu',
            image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop',
        },
        {
            id: 3,
            category: 'Pengecatan', // Changed to match category for demo
            title: 'Perbaikan Pipa Bocor',
            location: 'Jimbaran, Badung, Bali',
            description: 'Pengerjaan 4 jam, garansi 1 bulan',
            image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop',
        },
        {
            id: 4,
            category: 'Service AC',
            title: 'Instalasi Air Conditioner',
            location: 'Sanur, Denpasar, Bali',
            description: 'Pengerjaan 2 Unit, Daikin 1PK Inverter',
            image: 'https://images.unsplash.com/photo-1574359611100-c081e64c3c26?q=80&w=1854&auto=format&fit=crop',
        }
    ];

    const filteredProjects = activePortfolioCategory === 'Semua'
        ? projects
        : projects.filter(p => p.category === activePortfolioCategory);

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Renovasi': return 'bg-blue-600';
            case 'Electrical': return 'bg-yellow-500';
            case 'Pengecatan': return 'bg-purple-600';
            case 'Service AC': return 'bg-cyan-500';
            default: return 'bg-gray-600';
        }
    };

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 md:px-12">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">Portfolio Proyek</h2>
                    <p className="text-gray-500">Lihat hasil kerja nyata dari mitra profesional kami</p>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {categories.map((category) => (
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
                <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[300px] gap-6 grid-flow-dense">
                    {filteredProjects.map((project, index) => {
                        // Logic for collage layout pattern
                        /* 
                           Pattern:
                           0: Large (2x2)
                           1: Standard (1x1)
                           2: Tall (1x2)
                           3: Standard (1x1) - if more items
                        */
                        let spanClasses = "";
                        if (index === 0) spanClasses = "md:col-span-2 md:row-span-2";
                        else if (index === 2) spanClasses = "md:col-span-1 md:row-span-2";
                        else spanClasses = "md:col-span-1 md:row-span-1";

                        return (
                            <div key={project.id} className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 text-left group cursor-pointer relative ${spanClasses}`}>
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                />
                                {/* Overlay Gradient - Always visible */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-6 text-white">
                                    <span className={`inline-block px-3 py-1 ${getCategoryColor(project.category)} backdrop-blur-sm rounded-full text-xs font-bold w-fit mb-2 shadow-sm`}>
                                        {project.category}
                                    </span>
                                    <h3 className={`font-bold leading-tight mb-1 ${index === 0 ? 'text-2xl md:text-3xl' : 'text-xl'}`}>{project.title}</h3>
                                    <p className="text-sm text-gray-300 mb-2 font-medium flex items-center">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2"></span>
                                        {project.location}
                                    </p>
                                    <p className={`text-xs text-gray-300/90 italic pt-2 border-t border-white/20 mt-1 ${index === 0 ? 'line-clamp-3' : 'line-clamp-2'}`}>
                                        {project.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>


        </section>
    );
};

export default Portfolio;

