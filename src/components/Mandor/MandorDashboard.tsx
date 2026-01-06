
import React, { useState } from 'react';
import MandorSidebar from './MandorSidebar';
import { RABManagement } from './RABManagement';
import { TeamManagement } from './TeamManagement';
import { MandorScheduleList } from './MandorScheduleList';
import { MandorOrderList } from './MandorOrderList';
import { MandorOrderDetailModal } from './MandorOrderDetailModal';
import { RABDetailModal } from './RABDetailModal';
import { Menu, DollarSign, Users, Briefcase, CheckCircle, Clock, FileText, X, Save, Edit3, ChevronRight } from 'lucide-react';

interface Project {
    id: string;
    project: string;
    status: 'On Progress' | 'Approved' | 'Pending' | 'Request Survey';
    progress: number;
    budget: string;
    customer: string;
    location: string;
    date: string;
}

interface RAB {
    id: string;
    project: string;
    date: string;
    total: number;
    status: string;
    notes: string;
}

const MandorDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Dashboard Overview Component (Internal)
    const DashboardOverview = ({ onNavigate }: { onNavigate: (tab: string) => void }) => {
        // State for Modals
        const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
        const [isRABModalOpen, setIsRABModalOpen] = useState(false);
        const [selectedOrder, setSelectedOrder] = useState<any>(null);
        const [selectedRAB, setSelectedRAB] = useState<RAB | null>(null);

        // Mock Data for Active Projects
        const [activeProjects, setActiveProjects] = useState<Project[]>([
            {
                id: 'PRJ-001',
                project: 'Renovasi Rumah Cluster A',
                status: 'On Progress',
                progress: 75,
                budget: 'Rp 15.000.000',
                customer: 'Bapak Budi',
                location: 'Jl. Melati No. 10',
                date: '10 Jan 2024'
            },
            {
                id: 'PRJ-002',
                project: 'Pemasangan Kanopi',
                status: 'On Progress',
                progress: 30,
                budget: 'Rp 4.500.000',
                customer: 'Ibu Siti',
                location: 'Jl. Anggrek No. 5',
                date: '15 Jan 2024'
            },
        ]);

        // Mock Data for RABs
        const [rabs, setRabs] = useState<RAB[]>([
            { id: 'RAB-005', project: 'Pembuatan Kolam Ikan', status: 'Disetujui', total: 8500000, date: '2024-01-20', notes: 'Menunggu termin pertama.' },
            { id: 'RAB-008', project: 'Perbaikan Atap Bocor', status: 'Menunggu', total: 2500000, date: '2024-01-22', notes: 'Survey lokasi sudah dilakukan.' },
            { id: 'RAB-009', project: 'Cat Ulang Pagar', status: 'Ditolak', total: 1500000, date: '2024-01-18', notes: 'Budget terlalu tinggi.' },
        ]);

        const handleProjectClick = (project: Project) => {
            // Map Project to Order interface expected by MandorOrderDetailModal
            const orderData = {
                id: project.id,
                orderNumber: project.id,
                customer: project.customer,
                type: 'Borongan' as const,
                total: project.budget,
                date: project.date,
                status: 'Dikerjakan' as const,
                project: project.project,
                progress: project.progress,
                location: project.location,
                description: 'Proyek sedang berjalan.',
                estimation: '30 Hari'
            };
            setSelectedOrder(orderData);
            setIsOrderModalOpen(true);
        };

        const handleRABClick = (rab: RAB) => {
            setSelectedRAB(rab);
            setIsRABModalOpen(true);
        };

        const handleUpdateRAB = (updatedRAB: RAB) => {
            setRabs(prev => prev.map(r => r.id === updatedRAB.id ? updatedRAB : r));
            setIsRABModalOpen(false);
        };

        return (
            <div className="space-y-8 animate-fade-in font-sans pb-10">
                {/* Hero Section */}
                <div className="relative bg-gradient-to-r from-blue-900 to-blue-700 rounded-[2.5rem] p-10 overflow-hidden shadow-2xl shadow-blue-200 text-white">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-md mb-4 border border-white/20">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                <span className="text-xs font-bold tracking-wide uppercase">System Online</span>
                            </div>
                            <h2 className="text-4xl font-black mb-2 tracking-tight">Halo, Pak Mandor! 👷‍♂️</h2>
                            <p className="text-blue-100 text-lg opacity-90 max-w-xl font-medium leading-relaxed">
                                Semua proyek berjalan lancar hari ini. Cek jadwal terbaru dan status tim Anda di bawah ini.
                            </p>
                        </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full -ml-10 -mb-10 blur-3xl"></div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Proyek Berjalan', value: activeProjects.length.toString(), sub: 'Proyek Aktif', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                        { label: 'Total Anggota Tim', value: '12', sub: 'Orang Siap Kerja', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
                        { label: 'RAB Disetujui', value: rabs.filter(r => r.status === 'Disetujui').length.toString(), sub: 'Siap Eksekusi', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                    ].map((stat, i) => (
                        <div key={i} className={`bg-white p-6 rounded-[2.5rem] shadow-xl shadow-gray-100 border ${stat.border} flex items-center gap-6 group hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl`}>
                            <div className={`w-20 h-20 ${stat.bg} ${stat.color} rounded-3xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className="w-9 h-9" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs font-extrabold uppercase tracking-wider mb-2">{stat.label}</p>
                                <h3 className="text-4xl font-black text-gray-900 leading-none mb-1">{stat.value}</h3>
                                <p className="text-xs font-bold text-gray-400">{stat.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* SECTION 1: Proyek Sedang Berjalan */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100 relative overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                    <span className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                                        <Briefcase className="w-5 h-5" />
                                    </span>
                                    Proyek Sedang Berjalan
                                </h3>
                                <p className="text-gray-500 font-bold text-sm mt-2 ml-1">Update progress pekerjaan lapangan.</p>
                            </div>
                        </div>

                        <div className="space-y-4 relative z-10 flex-1">
                            {activeProjects.map((item, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => handleProjectClick(item)}
                                    className="group flex flex-col gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100 transition-all duration-300 cursor-pointer hover:bg-white hover:shadow-xl hover:shadow-blue-50/50 hover:border-blue-100"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-200">
                                            {item.project.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">{item.project}</h4>
                                            <p className="text-xs font-bold text-gray-400 mt-1">{item.id}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold text-gray-500">
                                            <span>Progress</span>
                                            <span className="text-blue-600">{item.progress}%</span>
                                        </div>
                                        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${item.progress}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {activeProjects.length === 0 && (
                                <div className="text-center py-10 text-gray-400 font-bold">Tidak ada proyek aktif.</div>
                            )}
                        </div>
                        <button
                            onClick={() => onNavigate('pemesanan')}
                            className="mt-6 w-full py-3 bg-gray-50 text-gray-500 rounded-2xl font-bold text-sm hover:bg-gray-100 hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
                        >
                            Lihat Semua Proyek <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* SECTION 2: Status Pengajuan RAB */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100 relative overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                    <span className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                                        <FileText className="w-5 h-5" />
                                    </span>
                                    Status Pengajuan RAB
                                </h3>
                                <p className="text-gray-500 font-bold text-sm mt-2 ml-1">Pantau status persetujuan RAB Anda.</p>
                            </div>
                        </div>

                        <div className="space-y-4 relative z-10 flex-1">
                            {rabs.map((item, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => handleRABClick(item)}
                                    className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 transition-all duration-300 cursor-pointer hover:bg-white hover:shadow-xl hover:shadow-indigo-50/50 hover:border-indigo-100"
                                >
                                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-indigo-600 transition-colors">{item.project}</h4>
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                                <span>{item.date}</span>
                                                <span>•</span>
                                                <span className="text-gray-600">
                                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.total)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider
                                            ${item.status === 'Disetujui' ? 'bg-green-100 text-green-600' :
                                                item.status === 'Menunggu' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}
                                        `}>
                                            {item.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {rabs.length === 0 && (
                                <div className="text-center py-10 text-gray-400 font-bold">Belum ada pengajuan RAB.</div>
                            )}
                        </div>
                        <button
                            onClick={() => onNavigate('rab')}
                            className="mt-6 w-full py-3 bg-gray-50 text-gray-500 rounded-2xl font-bold text-sm hover:bg-gray-100 hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
                        >
                            Lihat Semua RAB <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Modals */}
                <MandorOrderDetailModal
                    isOpen={isOrderModalOpen}
                    onClose={() => setIsOrderModalOpen(false)}
                    order={selectedOrder}
                />

                <RABDetailModal
                    isOpen={isRABModalOpen}
                    onClose={() => setIsRABModalOpen(false)}
                    rab={selectedRAB}
                    onSave={handleUpdateRAB}
                />
            </div>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardOverview onNavigate={setActiveTab} />;
            case 'jadwal': return <MandorScheduleList />;
            case 'pemesanan': return <MandorOrderList />;
            case 'rab': return <RABManagement />;
            case 'tim': return <TeamManagement />;
            default: return <DashboardOverview onNavigate={setActiveTab} />;
        }
    };

    return (
        <div className="flex min-h-screen bg-[#F8FAFC] font-sans selection:bg-blue-100 selection:text-blue-900">
            <MandorSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogout={() => alert("Logout Clicked")}
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
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default MandorDashboard;
