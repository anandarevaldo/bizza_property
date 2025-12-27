'use client';

import React, { useState, useEffect } from 'react';

interface NavbarProps {
    switchView: (view: 'home' | 'search' | 'login' | 'register' | 'admin' | 'layanan' | 'portfolio' | 'about' | 'history') => void;
    currentView?: string;
}

const Navbar: React.FC<NavbarProps> = ({ switchView, currentView }) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (view: string) => currentView === view ? 'text-yellow-400 font-bold' : 'hover:text-yellow-400 transition-colors';

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 text-white transition-all duration-300 ${isScrolled ? 'bg-black/40 backdrop-blur-md shadow-md py-4' : 'bg-transparent py-6'}`}>
            {/* Logo */}
            <div className="text-xl font-bold cursor-pointer" onClick={() => switchView('home')}>
                <span className="text-white">BIZZA</span> <span className="text-yellow-400">PROPERTY</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
                <button onClick={() => switchView('home')} className={isActive('home')}>Home</button>
                <button onClick={() => switchView('layanan')} className={isActive('layanan')}>Layanan</button>
                <button onClick={() => switchView('portfolio')} className={isActive('portfolio')}>Portfolio</button>
                <button onClick={() => switchView('history')} className={isActive('history')}>Riwayat</button>
                <button onClick={() => switchView('about')} className={isActive('about')}>Tentang Kami</button>

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
