import React from 'react';

const Stats = () => {
    return (
        <section className="bg-[#172554] py-16 text-white relative overflow-hidden">
            {/* Background Pattern effect */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-blue-800/30">
                    <div className="p-4">
                        <div className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">2018</div>
                        <div className="text-sm md:text-base text-blue-200 font-medium tracking-wide uppercase">Didirikan</div>
                    </div>
                    <div className="p-4">
                        <div className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">10+</div>
                        <div className="text-sm md:text-base text-blue-200 font-medium tracking-wide uppercase">Jumlah Klien</div>
                    </div>
                    <div className="p-4">
                        <div className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">20+</div>
                        <div className="text-sm md:text-base text-blue-200 font-medium tracking-wide uppercase">Proyek Selesai</div>
                    </div>
                    <div className="p-4">
                        <div className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">96%</div>
                        <div className="text-sm md:text-base text-blue-200 font-medium tracking-wide uppercase">Klien Puas</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Stats;
