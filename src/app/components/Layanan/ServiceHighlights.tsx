'use client';

import React from 'react';
import { Hammer, Users, Shield, CheckCircle, MessageCircle, ArrowRight, Zap, Clock } from 'lucide-react';

interface ServiceHighlightsProps {
    switchView: (view: 'home' | 'search' | 'login' | 'admin' | 'layanan' | 'portfolio' | 'about') => void;
}

const ServiceHighlights: React.FC<ServiceHighlightsProps> = ({ switchView }) => {
    return (
        <div className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                {/* Highlight 1: Renovasi - Compact Premium Design */}
                <div className="group relative bg-[#eff6ff] rounded-[3rem] p-8 md:p-12 border border-blue-50 shadow-2xl shadow-blue-100/50 transition-all duration-500 overflow-hidden">
                    {/* Decorative Background Pattern */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>

                    <div className="flex flex-col md:flex-row-reverse items-center gap-10 lg:gap-16">
                        {/* Image Section */}
                        <div className="md:w-1/2 relative w-full h-72 lg:h-80">
                            <div className="absolute inset-0 bg-blue-600 rounded-[2.5rem] transform rotate-3 transition-transform opacity-5"></div>
                            <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden shadow-lg border-4 border-white">
                                <img
                                    src="https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=2568&auto=format&fit=crop"
                                    alt="Renovasi Rumah"
                                    className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="md:w-1/2">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-200">
                                    <Hammer className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xs font-bold text-blue-600 tracking-widest uppercase bg-blue-100/50 px-4 py-1.5 rounded-full">Spesialis Renovasi</span>
                            </div>

                            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 leading-[1.2]">
                                Rumah Impian, <span className="text-blue-600">Tanpa Drama</span>
                            </h2>
                            <p className="text-slate-500 mb-8 text-base leading-relaxed">
                                Layanan renovasi profesional dengan transparansi penuh. Kami menangani perbaikan kecil hingga renovasi total dengan hasil memuaskan.
                            </p>

                            <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-8">
                                {[
                                    { l: 'Tukang Senior', v: '> 5 Thn', i: Users },
                                    { l: 'Garansi', v: '30 Hari', i: Shield },
                                    { l: 'Material', v: 'Transparan', i: CheckCircle },
                                    { l: 'Konsultasi', v: 'Gratis', i: MessageCircle }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <item.i className="w-6 h-6 text-blue-600" />
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">{item.l}</p>
                                            <p className="text-sm font-bold text-slate-900">{item.v}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button onClick={() => switchView('search')} className="w-fit bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-sm shadow-xl shadow-blue-500/20 transition-all flex items-center gap-3 group/btn hover:-translate-y-1">
                                <span>Mulai Proyek Sekarang</span>
                                <ArrowRight className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Highlight 2: Kelistrikan - Compact Premium Design */}
                <div className="group relative bg-[#fffbeb] rounded-[3rem] p-8 md:p-12 border border-yellow-50 shadow-2xl shadow-yellow-100/50 transition-all duration-500 overflow-hidden">
                    {/* Decorative Background Pattern */}
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-100/50 rounded-full blur-3xl -z-10 transform -translate-x-1/2 translate-y-1/2"></div>

                    <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-16">
                        {/* Image Section */}
                        <div className="md:w-1/2 relative w-full h-72 lg:h-80">
                            <div className="absolute inset-0 bg-yellow-400 rounded-[2.5rem] transform -rotate-3 transition-transform opacity-5"></div>
                            <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden shadow-lg border-4 border-white">
                                <img
                                    src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2669&auto=format&fit=crop"
                                    alt="Instalasi Listrik"
                                    className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="md:w-1/2">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-yellow-500 p-2.5 rounded-xl shadow-lg shadow-yellow-200">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xs font-bold text-yellow-700 tracking-widest uppercase bg-yellow-100/50 px-4 py-1.5 rounded-full">Ahli Kelistrikan</span>
                            </div>

                            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 leading-[1.2]">
                                Listrik Aman, <span className="text-yellow-500">Keluarga Tenang</span>
                            </h2>
                            <p className="text-slate-500 mb-8 text-base leading-relaxed">
                                Teknisi bersertifikasi SNI siap 24/7 untuk segala masalah kelistrikan. Keamanan instalasi dan keluarga Anda adalah prioritas kami.
                            </p>

                            <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-8">
                                {[
                                    { l: 'Sertifikasi', v: 'Resmi', i: Users },
                                    { l: 'Peralatan', v: 'Modern', i: Shield },
                                    { l: 'Layanan', v: '24 Jam', i: Clock },
                                    { l: 'Garansi', v: 'Instalasi', i: CheckCircle }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <item.i className="w-6 h-6 text-yellow-500" />
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">{item.l}</p>
                                            <p className="text-sm font-bold text-slate-900">{item.v}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button onClick={() => switchView('search')} className="w-fit bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 rounded-xl font-bold text-sm shadow-xl shadow-yellow-500/20 transition-all flex items-center gap-3 group/btn hover:-translate-y-1">
                                <span>Panggil Teknisi Sekarang</span>
                                <ArrowRight className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceHighlights;
