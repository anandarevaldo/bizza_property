'use client';

import React, { useState } from 'react';
import Sidebar from './sidebar';
import { DollarSign, ShoppingBag, Users, TrendingUp, Clock, ArrowRight, Activity, CalendarDays, Wallet, ArrowDownRight, CreditCard, Menu, HardHat, Briefcase } from 'lucide-react';

// Import sub-components
import { ServiceList } from '../layanan-admin/ServiceList';
import { JasaList } from '../jasa-admin/JasaList';
import { MandorList } from '../mandor-admin/MandorList';
import { ScheduleList } from '../schedule-admin/ScheduleList';
import { PortfolioList } from '../portofolio-admin/PortfolioList';
import { OrderList, initialOrders } from '../order-admin/OrderList';
import { initialMandors } from '../mandor-admin/MandorList';
import { initialSchedules } from '../schedule-admin/ScheduleList';
import { ScheduleDetailModal } from '../schedule-admin/ScheduleDetailModal';
import { OrderDetailModal } from '../order-admin/OrderDetailModal';
import { AdminRABApproval } from '../RAB/AdminRABApproval';

interface MainDashboardParams {
    setActiveTab: (tab: string) => void;
}

// Sub-component for the dashboard overview (Home)
const DashboardOverview: React.FC<MainDashboardParams> = ({ setActiveTab }) => {
    // State for Schedule Detail Modal
    const [selectedSchedule, setSelectedSchedule] = useState<any | null>(null);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

    // State for Order Detail Modal
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    // Calculate Stats
    // 1. Total Pendapatan from Orders (Paid only or all? Assuming Paid for revenue)
    // Parsing "Rp 450.000" -> 450000
    const totalRevenueValue = initialOrders
        .filter(o => o.status === 'Paid')
        .reduce((acc, curr) => {
            const val = parseInt(curr.total.replace(/[^0-9]/g, ''), 10);
            return acc + (isNaN(val) ? 0 : val);
        }, 0);

    const totalRevenue = `Rp ${totalRevenueValue.toLocaleString('id-ID')}`;

    // 2. Total Pesanan
    const totalOrders = initialOrders.length;
    const newOrdersToday = initialOrders.filter(o => o.date === new Date().toISOString().split('T')[0]).length; // Simply checking if matches today for demo

    // 3. Tukang Aktif (Renamed to Mandor)
    const activeMandors = initialMandors.filter(h => h.status !== 'Off').length;
    const workingMandors = initialMandors.filter(h => h.status === 'Busy').length;

    // 4. Growth - Mocked for now as we don't have historical data
    const growth = "+15.4%";

    // Get Recent Schedules (Top 5)
    const recentSchedules = initialSchedules.slice(0, 5);

    // Get Financial Transactions (Paid/Unpaid) for History
    const financialTransactions = initialOrders.filter(o => ['Paid', 'Unpaid'].includes(o.status));

    // Dynamic Status Calculation for "Status Pengerjaan"
    const statusCounts = {
        Selesai: initialOrders.filter(o => o.status === 'Paid').length,
        SedangDikerjakan: initialOrders.filter(o => o.status === 'Process').length,
        Menunggu: initialOrders.filter(o => o.status === 'Unpaid').length,
        Dibatalkan: initialOrders.filter(o => o.status === 'Cancelled').length,
    };

    // Determine Completion Rate (Paid / Total * 100)
    const completionRate = totalOrders > 0 ? Math.round((statusCounts.Selesai / totalOrders) * 100) : 0;

    const handleScheduleClick = (schedule: any) => {
        setSelectedSchedule(schedule);
        setIsScheduleModalOpen(true);
    };

    const handleOrderClick = (order: any) => {
        setSelectedOrder(order);
        setIsOrderModalOpen(true);
    };

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Hero Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 rounded-[2.5rem] p-10 overflow-hidden shadow-2xl shadow-blue-200 text-white">
                <div className="relative z-10">
                    <h2 className="text-3xl font-extrabold mb-2">Selamat Datang, Admin! 👋</h2>
                    <p className="text-blue-100 text-lg opacity-90 max-w-xl">
                        Overview performa bisnis properti Anda hari ini. Semua sistem berjalan lancar.
                    </p>
                </div>
                {/* Decorative Circles */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>
            </div>

            {/* Financial & Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Pendapatan', value: totalRevenue, icon: DollarSign, color: 'text-white', bg: 'bg-gradient-to-br from-green-500 to-emerald-600', sub: '+12% dari bulan lalu' },
                    { label: 'Total Pesanan', value: `${totalOrders} Order`, icon: ShoppingBag, color: 'text-white', bg: 'bg-gradient-to-br from-blue-500 to-indigo-600', sub: `${newOrdersToday} order baru hari ini` },
                    { label: 'Mandor Aktif', value: `${activeMandors} Orang`, icon: Users, color: 'text-white', bg: 'bg-gradient-to-br from-purple-500 to-violet-600', sub: `${workingMandors} sedang bertugas` },
                    { label: 'Pertumbuhan', value: growth, icon: TrendingUp, color: 'text-white', bg: 'bg-gradient-to-br from-orange-500 to-red-500', sub: 'Tren positif' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100 hover:shadow-2xl hover:shadow-gray-200 transition-all duration-300 group hover:-translate-y-1">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                            <span className="bg-gray-50 text-gray-400 p-2 rounded-full cursor-pointer hover:bg-gray-100">
                                <Activity className="w-4 h-4" />
                            </span>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-black text-gray-900 mb-1">{stat.value}</h3>
                            <p className="text-xs font-medium text-gray-400 flex items-center gap-1">
                                {stat.sub}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Appointments */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-exrabold text-gray-900 text-xl font-bold flex items-center gap-2">
                                <CalendarDays className="w-6 h-6 text-blue-600" />
                                Jadwal Terbaru
                            </h3>
                            <p className="text-gray-400 text-sm mt-1">{recentSchedules.length} Appointment akan datang</p>
                        </div>
                        <button onClick={() => setActiveTab('jadwal')} className="group flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 rounded-full text-sm font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                            Lihat Semua
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {recentSchedules.map((app, i) => (
                            <div
                                key={app.id}
                                onClick={() => handleScheduleClick(app)}
                                className="flex items-center justify-between p-5 rounded-3xl bg-gray-50 border border-gray-100 hover:scale-[1.02] hover:bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300 group cursor-pointer"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 font-black text-lg border border-gray-100 shadow-sm group-hover:scale-110 transition-transform">
                                        {app.customerName.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-base mb-0.5">{app.customerName}</h4>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            <p className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 flex items-center gap-1">
                                                <Briefcase className="w-3 h-3" /> {app.service}
                                            </p>
                                            <p className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md border border-orange-100 flex items-center gap-1">
                                                <HardHat className="w-3 h-3" /> {app.mandor}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 justify-end mb-1 font-medium bg-white px-3 py-1 rounded-full shadow-sm">
                                        <Clock className="w-3.5 h-3.5 text-orange-500" /> {app.time} • {new Date(app.date).toDateString() === new Date().toDateString() ? 'Hari Ini' : app.date}
                                    </div>
                                    <span className={`text-[10px] uppercase font-black tracking-wider px-3 py-1 rounded-full ${app.status === 'Confirmed' ? 'bg-green-100 text-green-600' :
                                        app.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                                            'bg-blue-100 text-blue-600'
                                        }`}>
                                        {app.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {recentSchedules.length === 0 && (
                            <div className="text-center py-10 text-gray-400 font-medium">Belum ada jadwal terbaru.</div>
                        )}
                    </div>
                </div>

                {/* Status Overview (Progres) - DYNAMIC DATA */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100 h-full">
                    <h3 className="font-bold text-gray-900 text-xl mb-2">Status Pengerjaan</h3>
                    <p className="text-gray-400 text-sm mb-8">Statistik status pengerjaan keseluruhan</p>

                    <div className="space-y-8 relative">
                        {/* Decorative Line */}
                        <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-gray-100 -z-10"></div>

                        {[
                            { label: 'Selesai', count: statusCounts.Selesai, color: 'bg-green-500', track: 'bg-green-100', icon: 'Done' },
                            { label: 'Sedang Dikerjakan', count: statusCounts.SedangDikerjakan, color: 'bg-blue-500', track: 'bg-blue-100', icon: 'Work' },
                            { label: 'Menunggu Konfirmasi', count: statusCounts.Menunggu, color: 'bg-yellow-500', track: 'bg-yellow-100', icon: 'Wait' },
                            { label: 'Dibatalkan', count: statusCounts.Dibatalkan, color: 'bg-red-500', track: 'bg-red-100', icon: 'Cancel' },
                        ].map((status, i) => (
                            <div key={i} className="group cursor-default">
                                <div className="flex justify-between items-end mb-2">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{status.label}</p>
                                        <h4 className="text-2xl font-black text-gray-900">{status.count} <span className="text-xs text-gray-400 font-medium">Order</span></h4>
                                    </div>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status.track} ${status.color.replace('bg-', 'text-')} font-bold text-xs`}>
                                        {totalOrders > 0 ? ((status.count / totalOrders) * 100).toFixed(0) : 0}%
                                    </div>
                                </div>
                                <div className="w-full h-4 rounded-full bg-gray-50 overflow-hidden border border-gray-100 p-0.5">
                                    <div
                                        className={`h-full rounded-full ${status.color} shadow-sm transition-all duration-1000 ease-out group-hover:scale-x-105 origin-left`}
                                        style={{ width: `${totalOrders > 0 ? (status.count / totalOrders) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}

                        <div className="pt-4 border-t border-gray-100 mt-4">
                            <div className="flex justify-between items-center bg-gray-900 text-white p-5 rounded-2xl shadow-lg">
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Total Order</p>
                                    <p className="text-2xl font-black">{totalOrders}</p>
                                </div>
                                <div className="h-10 w-[1px] bg-gray-700"></div>
                                <div className="text-right">
                                    <p className="text-xs text-green-400 font-bold uppercase">Completion Rate</p>
                                    <p className="text-2xl font-black">{completionRate}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Daftar Pemesanan Terbaru (Replaces Riwayat Transaksi) */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="font-exrabold text-gray-900 text-xl font-bold flex items-center gap-2">
                            <ShoppingBag className="w-6 h-6 text-blue-600" />
                            Daftar Pemesanan Terbaru
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">Status pesanan terbaru yang masuk sistem.</p>
                    </div>
                    <button onClick={() => setActiveTab('pemesanan')} className="group flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 rounded-full text-sm font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                        Lihat Semua
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-gray-100">
                                <th className="p-4 font-extrabold text-gray-400 text-xs uppercase tracking-wider">No. Order</th>
                                <th className="p-4 font-extrabold text-gray-400 text-xs uppercase tracking-wider">Customer</th>
                                <th className="p-4 font-extrabold text-gray-400 text-xs uppercase tracking-wider">Tipe</th>
                                <th className="p-4 font-extrabold text-gray-400 text-xs uppercase tracking-wider">Total</th>
                                <th className="p-4 font-extrabold text-gray-400 text-xs uppercase tracking-wider">Tanggal</th>
                                <th className="p-4 font-extrabold text-gray-400 text-xs uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {initialOrders.slice(0, 5).map((order) => {
                                let statusStyle = { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-100', icon: Clock };
                                switch (order.status) {
                                    case 'Paid': statusStyle = { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', icon: ArrowDownRight }; break;
                                    case 'Process': statusStyle = { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', icon: Clock }; break;
                                    case 'Unpaid': statusStyle = { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', icon: Clock }; break;
                                    case 'Cancelled': statusStyle = { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', icon: CreditCard }; break;
                                }
                                const StatusIcon = statusStyle.icon;

                                return (
                                    <tr key={order.id} className="hover:bg-gray-50/80 transition-colors group cursor-pointer" onClick={() => handleOrderClick(order)}>
                                        <td className="p-4 font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{order.orderNumber}</td>
                                        <td className="p-4 font-bold text-gray-900">{order.customer}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${order.type === 'Material' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                order.type === 'Layanan' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'
                                                }`}>
                                                {order.type}
                                            </span>
                                        </td>
                                        <td className="p-4 font-black text-gray-900">{order.total}</td>
                                        <td className="p-4 text-gray-400 font-bold text-sm">{order.date}</td>
                                        <td className="p-4">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-extrabold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                                                <StatusIcon className="w-3.5 h-3.5" />
                                                <span>{order.status}</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {initialOrders.length === 0 && (
                        <div className="text-center py-10 text-gray-400">Belum ada pesanan terbaru.</div>
                    )}
                </div>
            </div>

            {/* Modal Detail Jadwal */}
            {selectedSchedule && (
                <ScheduleDetailModal
                    isOpen={isScheduleModalOpen}
                    onClose={() => setIsScheduleModalOpen(false)}
                    schedule={selectedSchedule}
                    onEdit={() => {
                        console.log("Edit clicked from dashboard");
                        setIsScheduleModalOpen(false);
                        setActiveTab('jadwal');
                    }}
                />
            )}

            {/* Modal Detail Order */}
            <OrderDetailModal
                isOpen={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
                order={selectedOrder}
            />
        </div>
    );
};

const DashboardAdmin = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardOverview setActiveTab={setActiveTab} />;
            case 'layanan':
                return <ServiceList />;
            case 'jasa':
                return <JasaList />;
            case 'mandor':
                return <MandorList />;
            case 'jadwal':
                return <ScheduleList />;
            case 'portofolio':
                return <PortfolioList />;
            case 'pemesanan':
                return <OrderList />;
            case 'rab':
                return <AdminRABApproval />;
            default:
                return <DashboardOverview setActiveTab={setActiveTab} />;
        }
    };

    return (
        <div className="flex min-h-screen bg-[#F8FAFC] font-sans selection:bg-blue-100 selection:text-blue-900">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogout={async () => {
                    const { supabase } = await import('../../lib/supabaseClient'); // Dynamic import to avoid cycles if any, or just consistent
                    await supabase.auth.signOut();
                    window.location.href = '/'; // Hard reload to clear client state
                }}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="flex-1 overflow-y-auto h-screen scroll-smooth">
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center justify-between p-6 bg-white sticky top-0 z-30 shadow-sm mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-200">
                            B
                        </div>
                        <h1 className="font-extrabold text-gray-900 text-lg tracking-tight">Bizza Admin</h1>
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

export default DashboardAdmin;
