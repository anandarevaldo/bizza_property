'use client';

import React from 'react';
import Navbar from '../../../components/navbar';
import Footer from '../../../components/footer';
import { Target, Eye, Heart, Shield, Users, Award, Clock, Zap, CheckCircle, Quote } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AboutUsPageProps {
    // switchView?: (view: any) => void; // Removed as per instruction
}

const AboutUsPage: React.FC<AboutUsPageProps> = () => { // switchView removed from destructuring
    const router = useRouter();
    const coreValues = [
        { icon: Shield, title: 'Kepercayaan', description: 'Membangun hubungan jangka panjang berdasarkan integritas dan transparansi.', color: 'bg-blue-600' },
        { icon: Award, title: 'Kualitas', description: 'Standar tinggi dalam setiap proyek, tanpa kompromi.', color: 'bg-yellow-500' },
        { icon: Clock, title: 'Tepat Waktu', description: 'Menghargai waktu Anda dengan penyelesaian sesuai jadwal.', color: 'bg-green-600' },
        { icon: Zap, title: 'Inovasi', description: 'Menerapkan teknologi terbaru untuk hasil terbaik.', color: 'bg-purple-600' },
    ];

    const milestones = [
        { year: '2018', event: 'Bizza Property didirikan di Bali' },
        { year: '2019', event: 'Mencapai 10 proyek pertama' },
        { year: '2021', event: 'Ekspansi layanan ke seluruh Bali' },
        { year: '2023', event: 'Melayani 20+ klien dengan 96% tingkat kepuasan' },
    ];

    return (
        <div className="min-h-screen bg-white font-sans animate-fade-in">
            <Navbar currentView="about" /> {/* switchView prop removed as it's no longer passed */}

            {/* Hero Section - Consistent with Home */}
            <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop')" }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-white" />
                </div>

                <div className="relative z-10 container mx-auto px-6 md:px-12 text-white h-full flex flex-col justify-center pb-20">
                    <div className="max-w-l">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight drop-shadow-lg">
                            Membangun Kepercayaan,<br />
                            Mewujudkan Impian
                        </h1>
                        <p className="text-base md:text-lg text-gray-100 max-w-xl leading-relaxed drop-shadow-md">
                            Lebih dari sekadar jasa properti — kami adalah mitra terpercaya untuk setiap kebutuhan hunian Anda.
                        </p>
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <div className="py-24 bg-white relative">
                <div className="container mx-auto px-6 md:px-12">
                    {/* Story Narrative */}
                    <div className="max-w-4xl mx-auto mb-20 text-center md:text-left">
                        <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4 block">Cerita Kami</span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
                            Dari Bali, <span className="text-blue-600">Untuk Indonesia</span>
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8 md:gap-16 text-gray-600 text-lg leading-relaxed">
                            <div>
                                <p className="mb-6">
                                    Bizza Property berawal dari sebuah visi sederhana: menyediakan solusi properti yang mudah diakses, terpercaya, dan berkualitas tinggi untuk semua orang di Bali.
                                </p>
                                <p>
                                    Didirikan pada 2018, kami memulai dengan misi merubah stigma konstruksi konvensional yang seringkali rumit dan tidak transparan menjadi pengalaman yang menyenangkan.
                                </p>
                            </div>
                            <div>
                                <p className="mb-6">
                                    Kini, Bizza Property telah berkembang menjadi platform terkemuka yang menghubungkan pemilik properti dengan tenaga ahli profesional, memastikan setiap proyek berjalan mulus.
                                </p>
                                <p className="flex items-center gap-2 font-bold text-gray-900">
                                    <CheckCircle className="w-5 h-5 text-blue-600" />
                                    20+ Proyek Selesai & 96% Client Satisfaction
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Milestones - Story Line UI */}
                    <div className="relative mt-24">
                        <div className="text-center mb-16">
                            <h3 className="text-3xl font-bold text-gray-900">Perjalanan Kami</h3>
                            <p className="text-blue-600 mt-2 font-medium">Setiap langkah adalah dedikasi untuk Anda</p>
                        </div>

                        <div className="relative max-w-5xl mx-auto">
                            {/* Central Connecting Line */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 -translate-y-1/2 hidden md:block rounded-full"></div>

                            {/* Decorative Dashed Line Overlay */}
                            <div className="absolute top-1/2 left-0 w-full h-1 border-t-2 border-dashed border-blue-400/30 -translate-y-1/2 hidden md:block"></div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10 h-auto md:h-[450px]">
                                {milestones.map((m, i) => (
                                    <div key={i} className={`group relative h-full flex flex-col ${i % 2 === 0 ? 'md:justify-start' : 'md:justify-end'} justify-center`}>
                                        {/* Timeline Node - Always Centered Vertically on Desktop */}
                                        <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-white border-4 border-blue-600 rounded-full -translate-x-1/2 -translate-y-1/2 hidden md:block z-20 group-hover:scale-125 transition-transform duration-300 shadow-md">
                                            {/* Inner Dot */}
                                            <div className="w-full h-full bg-blue-100 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                        </div>

                                        {/* Vertical Connector Line */}
                                        <div className={`
                                            absolute left-1/2 w-0.5 bg-blue-200/50 -translate-x-1/2 hidden md:block transition-all duration-300 group-hover:bg-blue-400
                                            ${i % 2 === 0 ? 'top-[45%] h-[5%] bottom-1/2' : 'top-1/2 h-[5%]'}
                                        `}></div>

                                        {/* Content Card */}
                                        <div className="relative bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col items-center text-center z-10">
                                            {/* Year Pill */}
                                            <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold mb-4 shadow-blue-200 shadow-md">
                                                {m.year}
                                            </div>

                                            {/* Icon Placeholder (If added later) */}
                                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-3 group-hover:bg-blue-100 transition-colors">
                                                <CheckCircle className="w-6 h-6" />
                                            </div>

                                            <p className="text-gray-700 font-medium leading-relaxed text-sm">
                                                {m.event}
                                            </p>

                                            {/* Decorative Arrow for Card */}
                                            <div className={`hidden md:block absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-white transform rotate-45 border-r border-b border-gray-100 
                                                ${i % 2 === 0 ? '-bottom-2 border-t-0 border-l-0 shadow-[2px_2px_2px_-1px_rgba(0,0,0,0.05)]' : '-top-2 border-b-0 border-r-0 shadow-[-1px_-1px_1px_rgba(0,0,0,0.02)]'}
                                            `}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="bg-[#172554] py-24 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Mission */}
                        <div className="bg-blue-900/40 backdrop-blur-sm border border-blue-700/50 p-10 rounded-3xl">
                            <div className="w-16 h-16 rounded-2xl bg-yellow-400 flex items-center justify-center mb-6">
                                <Target className="w-8 h-8 text-blue-900" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Misi Kami</h3>
                            <p className="text-blue-100 leading-relaxed">
                                Menyediakan solusi properti terintegrasi yang menghubungkan pemilik rumah dengan tenaga profesional berkualitas, dengan fokus pada kemudahan, transparansi, dan kepuasan pelanggan.
                            </p>
                        </div>

                        {/* Vision */}
                        <div className="bg-blue-900/40 backdrop-blur-sm border border-blue-700/50 p-10 rounded-3xl">
                            <div className="w-16 h-16 rounded-2xl bg-yellow-400 flex items-center justify-center mb-6">
                                <Eye className="w-8 h-8 text-blue-900" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Visi Kami</h3>
                            <p className="text-blue-100 leading-relaxed">
                                Menjadi platform properti nomor satu di Indonesia yang dikenal karena inovasi, kualitas layanan, dan dampak positif terhadap komunitas serta industri properti nasional.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Values */}
            <div className="py-24 bg-white">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="text-center mb-16">
                        <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4 block">Prinsip Kami</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Nilai-Nilai Inti</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {coreValues.map((value, i) => (
                            <div key={i} className="bg-gray-50 rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 group">
                                <div className={`w-16 h-16 rounded-2xl ${value.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform text-white`}>
                                    <value.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Founder Spotlight - Replaced Team Grid */}
            <div className="py-24 bg-[#172554] relative overflow-hidden">
                {/* Background Pattern similar to Visi Misi if needed, or simple dark blue */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-yellow-400 font-bold tracking-widest uppercase text-sm mb-4 block">Leadership</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Meet the Founder</h2>
                    </div>

                    <div className="relative bg-blue-900/40 backdrop-blur-sm rounded-[3rem] p-8 md:p-12 border border-blue-700/50 shadow-2xl">

                        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                            {/* Image Side - Transparent Background */}
                            <div className="md:w-5/12 relative">
                                {/* Removed solid colored backgrounds for transparency */}
                                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl ring-4 ring-blue-500/30 aspect-[4/5] bg-transparent">
                                    <img
                                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1887&auto=format&fit=crop"
                                        alt="Revaldo Pratama"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* Floating Badge - Adjusted for Dark Theme */}
                                <div className="absolute -bottom-6 -right-6 bg-[#1e3a8a] p-4 rounded-xl shadow-xl border border-blue-700/50 flex items-center gap-3 animate-bounce-slow">
                                    <div className="bg-yellow-400 p-2 rounded-full">
                                        <Award className="w-6 h-6 text-blue-900" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-blue-200 font-bold uppercase tracking-wider">Experience</p>
                                        <p className="text-lg font-bold text-white">10+ Years</p>
                                    </div>
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="md:w-7/12 text-center md:text-left">
                                <h3 className="text-4xl font-bold text-white mb-2">Revaldo Pratama</h3>
                                <p className="text-yellow-400 font-bold text-lg mb-8 tracking-wide uppercase">Founder & CEO</p>

                                <div className="relative mb-8">
                                    <Quote className="w-12 h-12 text-blue-400/30 absolute -top-6 -left-6 transform -scale-x-100" />
                                    <p className="relative z-10 text-xl md:text-2xl text-blue-100 italic leading-relaxed font-light">
                                        "Visi saya sederhana: Menjadikan layanan properti di Indonesia transparan, mudah diakses, dan professional. Rumah Anda adalah investasi terbesar Anda, dan kami di sini untuk menjaganya dengan standar tertinggi."
                                    </p>
                                </div>

                                <div className="space-y-6 text-blue-200 leading-relaxed max-w-2xl">
                                    <p>
                                        Memulai karir sebagai kontraktor independen, Revaldo melihat celah besar di industri layanan rumah tangga: sulitnya menemukan tukang yang terpercaya dan transparan.
                                    </p>
                                    <p>
                                        Di Bizza Property, ia memimpin tim dengan filosofi "Customer Obsession" — memastikan setiap keluhan didengar dan setiap pekerjaan diselesaikan dengan tuntas. Di bawah kepemimpinannya, Bizza telah melayani lebih dari 100+ klien puas di seluruh Bali.
                                    </p>
                                </div>

                                {/* Stats Removed as requested */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Choose Us */}
            <div className="py-24 bg-white">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4 block">Mengapa Bizza?</span>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                                Alasan Klien <span className="text-blue-600">Memilih Kami</span>
                            </h2>
                            <div className="space-y-4">
                                {[
                                    'Tenaga ahli terverifikasi dan berpengalaman',
                                    'Harga transparan tanpa biaya tersembunyi',
                                    'Garansi kepuasan untuk setiap proyek',
                                    'Respons cepat dan layanan 24/7',
                                    'Teknologi modern untuk kemudahan pemesanan',
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center">
                                        <CheckCircle className="w-6 h-6 text-green-500 mr-3 shrink-0" />
                                        <span className="text-gray-700 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => router.push('/user/layanan')}
                                className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold shadow-lg transition-all transform hover:scale-105"
                            >
                                Lihat Layanan Kami
                            </button>
                        </div>
                        <div className="relative">
                            <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-yellow-100 rounded-full opacity-50 blur-3xl"></div>
                            <img
                                src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=987&auto=format&fit=crop"
                                alt="Bizza Team"
                                className="relative rounded-3xl shadow-2xl w-full h-[400px] object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-[#172554] py-20 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Siap Memulai Proyek Anda?</h2>
                    <p className="text-blue-200 mb-8 max-w-2xl mx-auto">Hubungi kami sekarang dan konsultasikan kebutuhan properti Anda dengan tim ahli kami.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => router.push('/user/layanan')}
                            className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-8 py-4 rounded-full font-bold shadow-lg transition-all transform hover:scale-105"
                        >
                            Jelajahi Layanan
                        </button>
                        <button
                            onClick={() => router.push('/user/portfolio')}
                            className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-full font-bold transition-all"
                        >
                            Lihat Portfolio
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div >
    );
};

export default AboutUsPage;
