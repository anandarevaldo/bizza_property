import React from 'react';
import { LayoutGrid, Users, LogOut, X, Calendar, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MandorSidebarProps {
    onLogout: () => void;
    isOpen: boolean;
    onClose: () => void;
}

const MandorSidebar: React.FC<MandorSidebarProps> = ({ onLogout, isOpen, onClose }) => {
    const pathname = usePathname();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, href: '/mandor/dashboard' },
        { id: 'jadwal', label: 'Jadwal & Detail', icon: Calendar, href: '/mandor/jadwal' },
        { id: 'order', label: 'Pemesanan / Order', icon: ShoppingBag, href: '/mandor/order' },
        { id: 'team', label: 'Tim Saya', icon: Users, href: '/mandor/team' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-30 w-72 bg-white flex flex-col h-screen shadow-2xl font-sans
                transform transition-transform duration-300 ease-in-out
                lg:translate-x-0 lg:shadow-none lg:h-screen lg:static
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Brand Logo & Close Button */}
                <div className="p-8 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-200">
                            M
                        </div>
                        <div>
                            <h1 className="font-extrabold text-gray-900 text-xl tracking-tight">Mandor Area</h1>
                            <p className="text-xs text-gray-500 font-medium tracking-wide text-blue-600">PROJECT LEADER</p>
                        </div>
                    </div>
                    {/* Close Button (Mobile Only) */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="px-6 py-2 overflow-y-auto flex-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 ml-2">Main Menu</p>
                    <div className="space-y-2">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    onClick={onClose}
                                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm relative overflow-hidden group
                                        ${isActive
                                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 translate-x-2'
                                            : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                                        }
                                    `}
                                >
                                    <item.icon
                                        className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                    <span className="relative z-10">{item.label}</span>
                                    {isActive && (
                                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/20 blur-sm"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-50 hover:shadow-lg hover:shadow-red-100 transition-all font-bold text-sm group"
                    >
                        <div className="p-2 bg-red-100 rounded-xl group-hover:bg-red-200 transition-colors">
                            <LogOut className="w-4 h-4" />
                        </div>
                        Keluar
                    </button>
                </div>
            </div>
        </>
    );
};

export default MandorSidebar;

