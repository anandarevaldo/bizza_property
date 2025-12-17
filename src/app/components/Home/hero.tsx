import React from 'react';
import { Search, MapPin, Wrench } from 'lucide-react';

interface HeroProps {
    switchView: (view: 'home' | 'search' | 'login' | 'admin' | 'layanan') => void;
}

const Hero: React.FC<HeroProps> = ({ switchView }) => {
    return (
        <section className="relative w-full h-[600px] md:h-[750px] flex items-center justify-center">
            {/* Background Image with Gradient Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2031&auto=format&fit=crop')",
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
            </div>

            <div className="relative z-10 container mx-auto px-6 md:px-12 text-white h-full flex flex-col justify-center pb-20">
                {/* Hero Text */}
                <div className="max-w-l">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight drop-shadow-lg">
                        Semua Urusan Rumah<br />
                        Serahkan ke Bizza Property
                    </h1>
                    <p className="text-base md:text-lg text-gray-100 max-w-xl leading-relaxed drop-shadow-md">
                        Pesan teknisi profesional untuk servis AC, listrik, plumbing, dan renovasi rumah
                        langsung dari saku anda. Transparan, terjadwal, dan bisa konsultasi dulu.
                    </p>
                </div>
            </div>

            {/* Search/Filter Box - Floating */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20 w-full max-w-4xl px-4">
                <div className="bg-white rounded-xl shadow-2xl p-4 md:p-5 w-full text-gray-800">
                    <div className="flex flex-col md:flex-row gap-4 items-center">

                        {/* Service Selection */}
                        <div className="w-full md:flex-1 border border-gray-200 rounded-lg px-4 py-2 flex items-center relative hover:border-blue-400 transition-colors cursor-pointer group">
                            <Wrench className="w-5 h-5 text-blue-600 mr-3 group-hover:scale-110 transition-transform" />
                            <div className="flex-grow">
                                <label className="block text-xs text-blue-600 font-bold mb-1 uppercase tracking-wider">Layanan</label>
                                <select className="w-full text-sm font-medium outline-none text-gray-700 bg-transparent appearance-none cursor-pointer">
                                    <option>Renovasi Sipil</option>
                                    <option>Service AC</option>
                                    <option>Cleaning</option>
                                </select>
                            </div>
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>

                        {/* Location Selection */}
                        <div className="w-full md:flex-1 border border-gray-200 rounded-lg px-4 py-2 flex items-center relative hover:border-blue-400 transition-colors cursor-pointer group">
                            <MapPin className="w-5 h-5 text-blue-600 mr-3 group-hover:scale-110 transition-transform" />
                            <div className="flex-grow">
                                <label className="block text-xs text-blue-600 font-bold mb-1 uppercase tracking-wider">Lokasi</label>
                                <select className="w-full text-sm font-medium outline-none text-gray-700 bg-transparent appearance-none cursor-pointer">
                                    <option>Denpasar</option>
                                    <option>Badung</option>
                                    <option>Gianyar</option>
                                </select>
                            </div>
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>

                        {/* Search Button */}
                        <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center whitespace-nowrap">
                            Temukan Layanan
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
