import React from 'react';
import { Shield } from 'lucide-react';

const RegisterHero: React.FC = () => {
    return (
        <div className="hidden lg:flex w-1/2 relative bg-blue-900 overflow-hidden items-center justify-center">
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop"
                    alt="Happy Family"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply" />
            </div>

            <div className="relative z-10 p-12 text-white max-w-xl">
                <div className="mb-8">
                    <h1 className="text-5xl font-extrabold mb-6 leading-tight">
                        Wujudkan Rumah Impian Anda <br />
                    </h1>
                    <p className="text-xl text-blue-100 leading-relaxed font-light mb-8">
                        "Layanan yang luar biasa! Tukang datang tepat waktu dan hasil kerjanya sangat rapi. Sangat merekomendasikan Bizza."
                    </p>
                    <div className="flex items-center gap-4">
                        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Client" className="w-12 h-12 rounded-full border-2 border-white" />
                        <div>
                            <p className="font-bold">Sarah Wijaya</p>
                            <p className="text-blue-200 text-sm">Pemilik Rumah di Denpasar</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mt-12 flex items-center gap-4">
                    <Shield className="w-10 h-10 text-yellow-400" />
                    <div>
                        <p className="font-bold text-lg">Garansi Kepuasan 100%</p>
                        <p className="text-blue-200 text-sm">Setiap pekerjaan dilindungi garansi layanan Bizza</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterHero;
