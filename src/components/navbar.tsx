'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';

interface NavbarProps {
    switchView: (view: 'home' | 'search' | 'login' | 'register' | 'admin' | 'layanan' | 'portfolio' | 'about' | 'history') => void;
    currentView?: string;
}

const Navbar: React.FC<NavbarProps> = ({ switchView, currentView }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Auth Listener
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        // Click outside listener
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            subscription.unsubscribe();
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsDropdownOpen(false);
        switchView('home');
    };

    const isActive = (view: string) => currentView === view ? 'text-yellow-400 font-bold' : 'hover:text-yellow-400 transition-colors';

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 text-white transition-all duration-300 ${isScrolled ? 'bg-black/40 backdrop-blur-md shadow-md py-4' : 'bg-transparent py-6'}`}>
            {/* Logo */}
            <div className="text-xl font-bold cursor-pointer" onClick={() => switchView('home')}>
                <span className="text-white">BIZZA</span> <span className="text-yellow-400">PROPERTY</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
                <button onClick={() => switchView('home')} className={isActive('home')}>Beranda</button>
                <button onClick={() => switchView('layanan')} className={isActive('layanan')}>Layanan</button>
                <button onClick={() => switchView('portfolio')} className={isActive('portfolio')}>Portfolio</button>
                <button onClick={() => switchView('about')} className={isActive('about')}>Tentang Kami</button>
                <button onClick={() => switchView('history')} className={isActive('history')}>Riwayat</button>

                <div className="flex items-center space-x-4 pl-4 border-l border-white/20">
                    {user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 hover:bg-white/10 rounded-full py-1 px-2 transition-colors focus:outline-none"
                            >
                                <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-blue-900 font-bold">
                                    {user.email?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <span className="text-sm font-semibold max-w-[100px] truncate hidden lg:block">
                                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                                </span>
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 text-gray-800 animate-fade-in origin-top-right border border-gray-100">
                                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                                        <p className="text-xs text-gray-500">Masuk sebagai</p>
                                        <p className="text-sm font-bold truncate">{user.email}</p>
                                    </div>

                                    <button
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                                        onClick={() => { setIsDropdownOpen(false); /* Navigate to Account */ }}
                                    >
                                        <UserIcon className="w-4 h-4" /> Account
                                    </button>
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                                        onClick={() => { setIsDropdownOpen(false); /* Navigate to Settings */ }}
                                    >
                                        <Settings className="w-4 h-4" /> Settings
                                    </button>

                                    <div className="border-t border-gray-100 my-1"></div>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" /> Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
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
                        </>
                    )}
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
