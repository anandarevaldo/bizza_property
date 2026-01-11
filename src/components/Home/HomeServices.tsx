import React from 'react';
import { Home, Briefcase, User, Wrench } from 'lucide-react';

import { useRouter } from 'next/navigation';

interface ServiceSectionProps {
    // switchView removed
}

const ServiceSection: React.FC<ServiceSectionProps> = () => {
    const router = useRouter();
    return (
        <section className="pt-12 pb-16 bg-white">
            <div className="container mx-auto px-4 md:px-12">

                {/* Spesialisasi Kami */}
                <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-extrabold mb-3 text-gray-900">Spesialisasi Kami</h2>
                    <p className="text-gray-500 mb-8 max-w-2xl text-lg">Solusi teknis comprehensive untuk setiap kebutuhan bangunan</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Untuk Rumah */}
                        <div
                            onClick={() => router.push('/User/Form/FormRumah')}
                            className="bg-white border-2 border-red-50 rounded-3xl p-6 hover:shadow-xl transition-all duration-500 cursor-pointer shadow-sm relative overflow-hidden group hover:border-red-100 h-52 flex flex-col justify-between hover:-translate-y-2"
                        >
                            <div className="absolute -bottom-6 -right-6 p-4 opacity-5 group-hover:opacity-10 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12">
                                <Home className="w-40 h-40 text-red-500" />
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-2 text-red-500 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                <Home className="w-6 h-6" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-1 text-gray-800 leading-tight">Untuk<br />Rumah</h3>
                                <p className="text-xs text-gray-500 font-medium">Menciptakan kenyamanan hunian anda</p>
                            </div>
                        </div>

                        {/* Untuk Bisnis */}
                        <div
                            onClick={() => router.push('/User/Form/FormBusiness')}
                            className="bg-white border-2 border-green-50 rounded-3xl p-6 hover:shadow-xl transition-all duration-500 cursor-pointer shadow-sm relative overflow-hidden group hover:border-green-100 h-52 flex flex-col justify-between hover:-translate-y-2">
                            <div className="absolute -bottom-6 -right-6 p-4 opacity-5 group-hover:opacity-10 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12">
                                <Briefcase className="w-40 h-40 text-green-500" />
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-2 text-green-500 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-1 text-gray-800 leading-tight">Untuk<br />Bisnis</h3>
                                <p className="text-xs text-gray-500 font-medium">Mengoptimalkan Tempat Kerja Anda</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tukang Saja */}
                    <div
                        onClick={() => router.push('/User/Home/Tukang')}
                        className="bg-white border-2 border-yellow-50 rounded-3xl p-6 hover:shadow-xl transition-all duration-500 cursor-pointer shadow-sm relative overflow-hidden group hover:border-yellow-100 h-52 flex flex-col justify-between hover:-translate-y-2">
                        <div className="absolute -bottom-6 -right-6 p-4 opacity-5 group-hover:opacity-10 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12">
                            <User className="w-40 h-40 text-yellow-500" />
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center mb-2 text-yellow-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
                            <User className="w-6 h-6" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-1 text-gray-800 leading-tight">Tukang<br />Saja</h3>
                            <p className="text-xs text-gray-500 font-medium">Pilih tukang sesuai detail property anda</p>
                        </div>
                    </div>

                    {/* Layanan Perbaikan */}
                    <div
                        onClick={() => router.push('/User/Home/Layanan')}
                        className="bg-white border-2 border-cyan-50 rounded-3xl p-6 hover:shadow-xl transition-all duration-500 cursor-pointer shadow-sm relative overflow-hidden group hover:border-cyan-100 h-52 flex flex-col justify-between hover:-translate-y-2">
                        <div className="absolute -bottom-6 -right-6 p-4 opacity-5 group-hover:opacity-10 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12">
                            <Wrench className="w-40 h-40 text-cyan-500" />
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center mb-2 text-cyan-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
                            <Wrench className="w-6 h-6" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-1 text-gray-800 leading-tight">Layanan<br />Perbaikan</h3>
                            <p className="text-xs text-gray-500 font-medium">Berbagai layanan yang anda butuhkan</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ServiceSection;
