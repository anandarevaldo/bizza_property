import React from 'react';
import { Quote } from 'lucide-react';

const PortfolioTestimonials = () => {
    const testimonials = [
        { name: 'Budi Santoso', role: 'PEMILIK RUKO', initial: 'BS', quote: 'Sangat profesional. Teknisi AC yang datang sangat paham masalah, tidak asal menyarankan ganti sparepart.', color: 'bg-blue-600' },
        { name: 'Andi Wijaya', role: 'PEMILIK RUMAH', initial: 'AW', quote: 'Hasil kerjanya sangat rapi dan sangat transparan dari semua budget. Pengerjaan nya pun sesuai estimasi waktu.', color: 'bg-green-600' },
        { name: 'Siti Aminah', role: 'IBU RUMAH TANGGA', initial: 'SA', quote: 'Respon admin sangat cepat saat saya butuh perbaikan instalasi air mendadak. Layanan darurat yang bisa diandalkan.', color: 'bg-rose-600' }
    ];

    return (
        <div className="bg-[#172554] py-24 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

            <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
                <span className="text-blue-300 font-bold tracking-widest uppercase text-xs md:text-sm mb-4 block">Testimonials</span>
                <h2 className="text-3xl md:text-5xl font-extrabold mb-16 tracking-tight">Apa Kata Klien Kami?</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    {testimonials.map((item, i) => (
                        <div key={i} className="bg-blue-900/40 backdrop-blur-sm border border-blue-700/50 p-8 rounded-2xl hover:bg-blue-800/50 transition-all duration-300 hover:-translate-y-2 relative group">
                            <div className="absolute -top-6 left-8 bg-[#172554] p-2 rounded-full border border-blue-700">
                                <Quote className="text-yellow-400 w-6 h-6 md:w-8 md:h-8" />
                            </div>
                            <div className="mt-4 mb-6">
                                <p className="text-gray-200 leading-relaxed italic text-sm md:text-base">"{item.quote}"</p>
                            </div>
                            <div className="flex items-center border-t border-blue-800 pt-6">
                                <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center font-bold text-sm mr-4 shadow-lg ring-2 ring-white/10`}>{item.initial}</div>
                                <div>
                                    <h4 className="font-bold text-white text-sm md:text-base">{item.name}</h4>
                                    <p className="text-[10px] md:text-xs text-blue-300 font-bold tracking-wider">{item.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PortfolioTestimonials;
