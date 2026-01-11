'use client';

import React, { useState } from 'react';
import MandorSidebar from '../../components/dashboard-mandor/MandorSidebar';
import { Menu } from 'lucide-react';

export default function MandorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#F8FAFC] font-sans selection:bg-blue-100 selection:text-blue-900">
            <MandorSidebar
                onLogout={async () => {
                    const { supabase } = await import('../../lib/supabaseClient');
                    await supabase.auth.signOut();
                    window.location.href = '/';
                }}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="flex-1 overflow-y-auto h-screen scroll-smooth">
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center justify-between p-6 bg-white sticky top-0 z-30 shadow-sm mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-200">
                            M
                        </div>
                        <h1 className="font-extrabold text-gray-900 text-lg tracking-tight">Mandor Area</h1>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-4 lg:p-12 pb-24">
                    {children}
                </div>
            </main>
        </div>
    );
}
