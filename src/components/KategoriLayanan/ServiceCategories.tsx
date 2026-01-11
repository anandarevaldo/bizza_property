'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home, ChevronDown, ChevronUp } from 'lucide-react';
import { ServiceItem as ServiceItemType } from '@/lib/services/layananService';
import { ICON_MAP } from '@/lib/constants/serviceTemplates';

interface ServiceCategoriesProps {
    services: ServiceItemType[];
}

const ServiceCategories: React.FC<ServiceCategoriesProps> = ({ services = [] }) => {
    const router = useRouter(); 
    const [showAllServices, setShowAllServices] = useState(false);
    
    // If no services provided, fallback to empty or handle it. 
    // Ideally services are passed from parent.
    const displayedServices = showAllServices ? services : services.slice(0, 12);

    return (
        <div className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4 block">Kategori Layanan</span>
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Semua Kebutuhan Properti Anda</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">Pilih dari berbagai kategori layanan profesional kami</p>
                </div>

                {services.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">
                        Memuat layanan...
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                        {displayedServices.map((service, index) => {
                            const IconComponent = ICON_MAP[service.icon_name] || Home; // Fallback icon

                            return (
                                <div
                                    key={service.id}
                                    onClick={() => router.push('/')}
                                    className="group cursor-pointer bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center text-center hover:-translate-y-2 relative overflow-hidden"
                                    style={{
                                        animation: index >= 12 && showAllServices ? `fadeSlideUp 0.4s ease-out ${(index - 12) * 0.05}s both` : 'none'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = service.pattern_color}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#f3f4f6'}
                                >
                                    {/* Decorative Icon - Bottom Right Corner */}
                                    <IconComponent
                                        className="absolute -bottom-4 -right-4 w-24 h-24 opacity-[0.06]"
                                        style={{
                                            color: service.pattern_color,
                                            animation: 'floatSlow 4s ease-in-out infinite'
                                        }}
                                    />

                                    {/* Small Squares Pattern - Top Left Area */}
                                    <div
                                        className="absolute top-2 left-2 w-16 h-16 opacity-[0.15]"
                                        style={{
                                            backgroundImage: `linear-gradient(45deg, ${service.pattern_color} 10%, transparent 10%, transparent 90%, ${service.pattern_color} 90%)`,
                                            backgroundSize: '6px 6px'
                                        }}
                                    ></div>

                                    <div className={`relative z-10 p-4 rounded-2xl bg-gradient-to-br ${service.bg_gradient} mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                                        <IconComponent className={`w-6 h-6 ${service.color_class} transition-transform duration-300 group-hover:rotate-12`} />
                                    </div>
                                    <h3 className="relative z-10 font-bold text-gray-800 text-sm mb-1">{service.name}</h3>
                                    <p className="relative z-10 text-xs text-gray-400 leading-relaxed">{service.description}</p>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* See More Button */}
                {services.length > 12 && (
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
                )}
            </div>
        </div>
    );
};

export default ServiceCategories;
