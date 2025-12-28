import React from 'react';

const PortfolioHero = () => {
    return (
        <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center">
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2031&auto=format&fit=crop')" }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-white" />
            </div>

            <div className="relative z-10 container mx-auto px-6 md:px-12 text-white h-full flex flex-col justify-center pb-20">
                <div className="max-w-l">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight drop-shadow-lg">
                        Bukti Nyata<br />
                        Kualitas Bizza
                    </h1>
                    <p className="text-base md:text-lg text-gray-100 max-w-xl leading-relaxed drop-shadow-md">
                        Galeri proyek yang telah kami selesaikan dengan standar profesional tinggi dan kepuasan pelanggan sebagai prioritas.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default PortfolioHero;
