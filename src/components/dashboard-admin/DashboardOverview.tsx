'use client';

import React, { useState } from 'react';
import { Menu, Search, Filter, Monitor, ArrowUpRight, TrendingUp, Users, DollarSign, Calendar, Star, MoreVertical, Briefcase, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { initialMandors } from '../mandor-admin/MandorList';
import { initialOrders } from '../order-admin/OrderList';
import { Schedule } from '../schedule-admin/ScheduleList';
import { ScheduleDetailModal } from '../schedule-admin/ScheduleDetailModal';
import { OrderDetailModal } from '../order-admin/OrderDetailModal';
import Link from 'next/link';

interface DashboardOverviewProps {
    // setActiveTab removed as now we use Links
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = () => {
    const activeMandors = initialMandors.filter(m => m.status === 'Available').length;
    const workingMandors = initialMandors.filter(m => m.status === 'Busy').length;

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
                        <h2 className="text-4xl font-black mb-2 tracking-tight">Halo, Admin Bizza! 👋</h2>
                        <p className="text-blue-100 text-lg opacity-90 max-w-xl font-medium leading-relaxed">
                            Pantau semua aktivitas properti dan kinerja tim dalam satu dashboard terintegrasi.
                        </p>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full -ml-10 -mb-10 blur-3xl"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Pendapatan', value: 'Rp 850jt', sub: '+12% bulan ini', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
                    { label: 'Mandor Aktif', value: activeMandors.toString(), sub: 'Siap bekerja', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                    { label: 'Proyek Berjalan', value: '24', sub: 'On Progress', icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
                    { label: 'Rating Layanan', value: '4.8', sub: 'Dari 150 ulasan', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
                ].map((stat, i) => (
                    <div key={i} className={`bg-white p-6 rounded-[2.5rem] shadow-xl shadow-gray-100 border ${stat.border} flex items-center gap-6 group hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl`}>
                        <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                            <stat.icon className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs font-extrabold uppercase tracking-wider mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-black text-gray-900 leading-none mb-1">{stat.value}</h3>
                            <p className="text-xs font-bold text-gray-400">{stat.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <div className="xl:col-span-2 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                <span className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                                    <FileText className="w-5 h-5" />
                                </span>
                                Pesanan Terbaru
                            </h3>
                            <p className="text-gray-500 font-bold text-sm mt-2 ml-1">Transaksi yang masuk hari ini.</p>
                        </div>
                        <Link href="/admin/order" className="px-5 py-2.5 bg-gray-50 text-gray-600 rounded-xl font-bold text-xs hover:bg-gray-100 hover:text-gray-900 transition-colors flex items-center gap-2">
                            Lihat Semua <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="space-y-4 relative z-10">
                        {[
                            { id: 'ORD-001', customer: 'Bapak Budi', type: 'Renovasi', status: 'Survey', date: 'Baru saja', price: 'Rp 15.000.000' },
                            { id: 'ORD-002', customer: 'Ibu Siti', type: 'Perbaikan', status: 'Pending', date: '2 jam lalu', price: 'Rp 450.000' },
                            { id: 'ORD-003', customer: 'Cafe Kopi', type: 'Instalasi', status: 'Selesai', date: '5 jam lalu', price: 'Rp 2.500.000' },
                        ].map((order, i) => (
                            <div key={i} className="group flex items-center justify-between p-5 bg-gray-50 rounded-3xl border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-blue-50/50 hover:border-blue-100 transition-all duration-300">
                                <div className="flex items-center gap-5">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm
                                        ${order.status === 'Selesai' ? 'bg-green-100 text-green-600' :
                                            order.status === 'Survey' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}
                                    `}>
                                        {order.customer.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-base">{order.customer}</h4>
                                        <p className="text-xs text-gray-400 font-bold mt-0.5">{order.type} • {order.id}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-gray-900 text-base">{order.price}</p>
                                    <p className="text-xs text-gray-400 font-bold mt-0.5">{order.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mandor Availability */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                <span className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                                    <Users className="w-5 h-5" />
                                </span>
                                Tim Mandor
                            </h3>
                            <p className="text-gray-500 font-bold text-sm mt-2 ml-1">Ketersediaan tim saat ini.</p>
                        </div>
                    </div>

                    <div className="space-y-4 relative z-10">
                        {initialMandors.slice(0, 4).map((mandor, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:bg-white hover:shadow-lg transition-all duration-300">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-gray-200 rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(https://i.pravatar.cc/150?u=${mandor.name})` }}></div>
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white
                                         ${mandor.status === 'Available' ? 'bg-green-500' :
                                            mandor.status === 'Busy' ? 'bg-red-500' : 'bg-gray-400'}
                                     `}></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 text-sm truncate">{mandor.name}</h4>
                                    <p className="text-xs text-gray-400 truncate">{mandor.specialty}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Link href="/admin/mandor" className="mt-6 w-full py-3 bg-gray-50 text-gray-500 rounded-2xl font-bold text-sm hover:bg-gray-100 hover:text-gray-900 transition-colors flex items-center justify-center gap-2">
                        Kelola Semua Tim <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
};
