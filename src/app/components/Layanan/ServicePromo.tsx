import React from 'react';
import { Box, PaintBucket, Layers, Hammer } from 'lucide-react';

const ServicePromo: React.FC = () => {
    return (
        <div className="relative py-20 overflow-hidden">
            {/* Wave Top */}
            <div className="absolute top-0 left-0 right-0 h-16">
                <svg className="w-full h-full" viewBox="0 0 1440 64" preserveAspectRatio="none" fill="none">
                    <path d="M0 64L60 53.3C120 43 240 21 360 16C480 11 600 21 720 32C840 43 960 53 1080 53.3C1200 53 1320 43 1380 37.3L1440 32V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0V64Z" fill="white" />
                </svg>
            </div>

            {/* Background */}
            <div className="absolute inset-0 bg-[#172554]"></div>
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

            {/* Wave Bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-16">
                <svg className="w-full h-full" viewBox="0 0 1440 64" preserveAspectRatio="none" fill="none">
                    <path d="M0 0L60 10.7C120 21 240 43 360 48C480 53 600 43 720 32C840 21 960 11 1080 10.7C1200 11 1320 21 1380 26.7L1440 32V64H1380C1320 64 1200 64 1080 64C960 64 840 64 720 64C600 64 480 64 360 64C240 64 120 64 60 64H0V0Z" fill="white" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Titip Beli Material Bangunan</h2>
                    <p className="text-blue-200 text-lg max-w-2xl mx-auto">Beli material berkualitas dengan harga terbaik, siap antar ke lokasi proyek Anda!</p>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                    {[
                        { name: 'Semen', icon: Box },
                        { name: 'Cat Tembok', icon: PaintBucket },
                        { name: 'Kayu & Papan', icon: Layers },
                        { name: 'Peralatan', icon: Hammer }
                    ].map((item, idx) => (
                        <button key={idx} className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-full font-medium hover:bg-white/20 transition-all flex items-center gap-2">
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServicePromo;
