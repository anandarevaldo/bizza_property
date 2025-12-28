import React from 'react';

const LoginHero: React.FC = () => {
    return (
        <div className="hidden lg:flex w-1/2 relative bg-blue-900 overflow-hidden items-center justify-center">
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop"
                    alt="Modern Home Interior"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply" />
            </div>

            <div className="relative z-10 p-12 text-white max-w-xl">
                <div className="mb-8">

                    <h1 className="text-5xl font-extrabold mb-6 leading-tight">
                        Solusi Properti Terpercaya<br />
                    </h1>
                    <p className="text-xl text-blue-100 leading-relaxed font-light mb-8">
                        "Bergabunglah dengan ribuan pemilik rumah yang telah mempercayakan perbaikan dan renovasi hunian mereka kepada Bizza Property."
                    </p>
                </div>

                <div className="flex -space-x-4 mb-4">
                    {[1, 2, 3, 4].map((i) => (
                        <img
                            key={i}
                            src={`https://randomuser.me/api/portraits/men/${30 + i}.jpg`}
                            alt="User"
                            className="w-10 h-10 rounded-full border-2 border-blue-900 object-cover"
                        />
                    ))}
                    <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-blue-900 font-bold text-xs border-2 border-blue-900">
                        10+
                    </div>
                </div>
                <p className="text-sm text-blue-200 font-medium">Bergabung bersama 10+ klien puas lainnya</p>
            </div>
        </div>
    );
};

export default LoginHero;
