import React from 'react';

interface NavbarProps {
    switchView: (view: 'home' | 'search' | 'login' | 'register' | 'admin' | 'layanan') => void;
}

const Navbar: React.FC<NavbarProps> = ({ switchView }) => {
    return (
        <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 text-white">
            {/* Logo */}
            <div className="text-xl font-bold cursor-pointer" onClick={() => switchView('home')}>
                <span className="text-white">BIZZA</span> <span className="text-yellow-400">PROPERTY</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
                <button onClick={() => switchView('home')} className="hover:text-yellow-400 transition-colors">Home</button>
                <button onClick={() => switchView('layanan')} className="hover:text-yellow-400 transition-colors">Layanan</button>
                <button className="hover:text-yellow-400 transition-colors">Portfolio</button>
                <button className="hover:text-yellow-400 transition-colors">Tentang Kami</button>

                <div className="flex items-center space-x-4 pl-4 border-l border-white/20">
                    <button
                        onClick={() => switchView('login')}
                        className="hover:text-yellow-400 transition-colors font-semibold"
                    >
                        Masuk
                    </button>
                    <button
                        onClick={() => switchView('register')}
                        className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-5 py-2 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg"
                    >
                        Daftar
                    </button>
                </div>
            </div>

            {/* Mobile Menu Button (Placeholder) */}
            <div className="md:hidden">
                <button className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
