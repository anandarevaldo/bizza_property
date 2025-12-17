import React from 'react';
import { Star } from 'lucide-react';

const Review = () => {
    const reviews = [
        {
            id: 1,
            name: 'Budi Santoso',
            role: 'Home Owner',
            initial: 'BS',
            bg: 'bg-blue-500',
            text: '"Sangat profesional! Teknisi AC yang datang sangat paham masalah. Hati-hati memeriksa dan melakukan perbaikan. AC berfungsi dingin maksimal lagi!"'
        },
        {
            id: 2,
            name: 'Andi Wijaya',
            role: 'Store Owner',
            initial: 'AW',
            bg: 'bg-green-500',
            text: '"Renovasi atap wuwungan dikerjakan sangat rapi dan sesuai budget. Pengerjaan cepat dan lokasi ditinggal bersih. Mantap Bizza Team!"'
        },
        {
            id: 3,
            name: 'Siti Aminah',
            role: 'Ibu Rumah Tangga',
            initial: 'SA',
            bg: 'bg-pink-500',
            text: '"Respon admin sangat cepat dan ramah saat konsultasi. Pria laundry memuaskan. Terima Kasih sudah bantu urusan rumah tangga jadi lebih gampang!"'
        }
    ];

    return (
        <section className="py-20 bg-[#172554] text-white overflow-hidden relative">
            {/* Decorative blurs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

            <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
                <h2 className="text-2xl md:text-3xl font-extrabold mb-3 tracking-tight">Apa Kata Klien Kami?</h2>
                <p className="text-blue-200 mb-14 max-w-2xl mx-auto text-lg opacity-80">Testimoni nyata dari kepuasan pelanggan Bizza Property</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-2xl text-left relative hover:bg-white/15 transition-colors duration-300">
                            {/* Quote icon */}
                            <div className="absolute top-6 right-6 text-white/10 font-serif text-6xl leading-none select-none">"</div>

                            <div className="flex space-x-1 mb-6 text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-current drop-shadow-sm" />
                                ))}
                            </div>
                            <p className="text-base font-light italic mb-8 leading-relaxed opacity-90 min-h-[5rem]">
                                {review.text}
                            </p>

                            <div className="flex items-center mt-auto border-t border-white/10 pt-6">
                                <div className={`w-12 h-12 rounded-full ${review.bg} flex items-center justify-center font-bold text-white mr-4 shadow-lg ring-2 ring-white/20 text-lg`}>
                                    {review.initial}
                                </div>
                                <div>
                                    <div className="font-bold text-base tracking-wide">{review.name}</div>
                                    <div className="text-sm text-blue-200 font-medium">{review.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Review;
