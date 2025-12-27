
import React from 'react';
import { Instagram, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#0b1120] text-gray-300 py-16 border-t border-gray-800/50">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand & Description */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="text-2xl font-extrabold mb-6 tracking-tight cursor-pointer">
                            <span className="text-white">BIZZA</span> <span className="text-yellow-500">PROPERTY</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
                            Mitra terpercaya untuk solusi perbaikan, perawatan, dan renovasi properti Anda. Mengedepankan kualitas, transparansi harga, dan kepuasan pelanggan.
                        </p>
                        <div className="text-xs text-gray-600">
                            &copy; 2024 Bizza Property. All rights reserved.
                        </div>
                    </div>

                    {/* Spacer */}
                    <div className="hidden md:block"></div>

                    {/* Spesialisasi Kami */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 tracking-wide">Spesialisasi Kami</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-yellow-400 transition-colors duration-200 block">Untuk Rumah</a></li>
                            <li><a href="#" className="hover:text-yellow-400 transition-colors duration-200 block">Untuk Bisnis</a></li>
                            <li><a href="#" className="hover:text-yellow-400 transition-colors duration-200 block">Tukang Saja & Perbaikan Layanan</a></li>
                        </ul>
                    </div>

                    {/* Hubungi Kami */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 tracking-wide">Hubungi Kami</h3>
                        <ul className="space-y-5 text-sm text-gray-400">
                            <li className="flex items-center group">
                                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center mr-3 group-hover:bg-yellow-500/10 group-hover:text-yellow-500 transition-colors">
                                    <Instagram className="w-4 h-4" />
                                </div>
                                <a href="#" className="group-hover:text-white transition-colors">@bizza.property</a>
                            </li>
                            <li className="flex items-center group">
                                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center mr-3 group-hover:bg-green-500/10 group-hover:text-green-500 transition-colors">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <a href="#" className="group-hover:text-white transition-colors">0812-3456-7890</a>
                            </li>
                            <li className="flex items-start group">
                                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center mr-3 mt-1 flex-shrink-0 group-hover:bg-red-500/10 group-hover:text-red-500 transition-colors">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <span className="group-hover:text-white transition-colors">Jl. Merdeka No. 45, Renon,<br />Denpasar, Bali</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
