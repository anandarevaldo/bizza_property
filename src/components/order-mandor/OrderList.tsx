'use client';

import React, { useState } from 'react';
import { Search, FileText, Briefcase, Users } from 'lucide-react';
import { MandorOrderDetailModal } from './OrderDetailModal';

import { scheduleService } from '@/lib/services/scheduleService';

// Mock Team Data (Synced with TeamManagement)
const internalTeam = [
    { id: 1, name: 'Budi Santoso', role: 'Tukang Cat' },
    { id: 2, name: 'Asep Supriyadi', role: 'Tukang Kayu' },
    { id: 3, name: 'Joko Widodo', role: 'Tukang Listrik' },
];

export interface Order {
    id: string;
    orderNumber: string;
    customer: string;
    type: 'Jasa Tukang' | 'Borongan' | 'Material';
    total: string;
    date: string;
    status: 'Need Validation' | 'On Progress' | 'Done' | 'Cancel';
    userBudget?: string;
    rabProposed?: number;
    rabStatus?: 'Pending' | 'Approved' | 'Rejected';
    assignedHandymanId?: number; // Optional, for Jasa Tukang
    // New fields for dashboard-like view
    project?: string;
    progress?: number;
}

// Filtered to only show Projects, removing RABs
export const initialOrders: Order[] = [
    { id: 'PRJ-001', orderNumber: 'PRJ-001', customer: 'Bapak Ahmad Saifuddin', project: 'Renovasi Rumah Cluster A', type: 'Borongan', total: 'Rp 15.000.000', date: '2023-10-12', status: 'On Progress', progress: 75 },
    { id: 'PRJ-002', orderNumber: 'PRJ-002', customer: 'Ibu Siti Aminah', project: 'Pembuatan Kolam Ikan', type: 'Borongan', total: 'Rp 8.500.000', date: '2023-10-15', status: 'Done', progress: 100 },
    { id: 'TKG-001', orderNumber: 'TKG-001', customer: 'Pak Budi Santoso', project: 'Perbaikan Atap Bocor', type: 'Jasa Tukang', total: 'Rp 2.500.000', date: '2023-10-18', status: 'Need Validation', progress: 0, assignedHandymanId: 1 },
    { id: 'SRV-001', orderNumber: 'SRV-001', customer: 'Ibu Ratna', project: 'Survey Lokasi Renovasi', type: 'Borongan', total: 'Rp 0', date: '2023-10-20', status: 'Need Validation', progress: 0, userBudget: '5jt-10jt', rabStatus: 'Pending' },
];

export const MandorOrderList: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // Fetch orders for Mandor (ID 1 for demo)
    React.useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                // Simulate Mandor ID 1 (Pak Mandor Budi)
                const data = await scheduleService.getByMandor(1);

                const mappedOrders: Order[] = data.map(schedule => ({
                    id: schedule.id,
                    orderNumber: `ORD-${schedule.id}`,
                    customer: schedule.customerName,
                    type: (schedule.kategoriLayanan as any) || 'Borongan',
                    total: schedule.budget || 'Rp 0',
                    date: schedule.date,
                    status: schedule.status as any,
                    project: schedule.service,
                    progress: schedule.status === 'Done' ? 100 : schedule.status === 'On Progress' ? 50 : 0,
                    userBudget: schedule.budget
                }));

                setOrders(mappedOrders);
            } catch (error) {
                console.error('Error fetching details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [isDetailModalOpen]);

    const handleViewDetail = (order: Order) => {
        setSelectedOrder(order);
        setIsDetailModalOpen(true);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'On Progress': return { label: 'ON PROGRESS', bg: 'bg-blue-600', text: 'text-blue-600', pillBg: 'bg-blue-100' };
            case 'Done': return { label: 'DONE', bg: 'bg-green-500', text: 'text-green-600', pillBg: 'bg-green-100' };
            case 'Need Validation': return { label: 'NEED VALIDATION', bg: 'bg-yellow-400', text: 'text-yellow-600', pillBg: 'bg-yellow-100' };
            case 'Cancel': return { label: 'CANCELLED', bg: 'bg-red-500', text: 'text-red-600', pillBg: 'bg-red-100' };
            default: return { label: status, bg: 'bg-gray-400', text: 'text-gray-600', pillBg: 'bg-gray-100' };
        }
    };

    // Card Renderer Component
    const OrderCard = ({ order }: { order: Order }) => {
        const statusMeta = getStatusBadge(order.status);

        return (
            <div
                onClick={() => handleViewDetail(order)}
                className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-50 hover:border-blue-100 transition-all duration-300 cursor-pointer mb-4"
            >
                <div className="flex items-center gap-5 mb-4 md:mb-0">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl border shadow-sm
                        ${order.status === 'On Progress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            order.status === 'Done' ? 'bg-green-50 text-green-600 border-green-100' :
                                order.status === 'Need Validation' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                                    'bg-red-50 text-red-600 border-red-100'
                        }
`}>
                        {order.project ? order.project.charAt(0) : 'P'}
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">
                            {order.project || order.customer}
                        </h4>
                        <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                            <span className="bg-gray-50 px-2 py-1 rounded-md border border-gray-100 text-gray-500">{order.orderNumber}</span>
                            <span>•</span>
                            <span>{order.total}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    {order.status !== 'Need Validation' && ( // Only show progress bar if not pending/0
                        <div className="w-32 hidden sm:block">
                            <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
                                <span>Progress</span>
                                <span>{order.progress || 0}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-500 ${statusMeta.bg}`} style={{ width: `${order.progress || 0}%` }}></div>
                            </div>
                        </div>
                    )}
                    <div className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider ${statusMeta.pillBg} ${statusMeta.text}`}>
                        {statusMeta.label}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-12 animate-fade-in">
            {/* Header */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-gray-100 border border-gray-100 relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-teal-50 rounded-2xl text-teal-600">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-gray-900">Daftar Proyek & Pesanan</h2>
                        </div>
                        <p className="text-gray-500 font-medium ml-1">Kelola status proyek berjalan dan pesanan jasa tukang.</p>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-full px-4">
                <Search className="absolute left-9 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Cari No. Order atau Customer..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all bg-gray-50 font-medium text-gray-700"
                />
            </div>

            {/* Section 1: Jasa Tukang */}
            <div>
                <div className="flex items-center gap-3 mb-6 px-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                        <Users className="w-5 h-5" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900">Pekerjaan Jasa Tukang</h3>
                </div>

                <div className="space-y-4 px-4">
                    {isLoading ? (
                        <div className="text-center py-8 text-gray-500">Memuat data...</div>
                    ) : (
                        <>
                            {orders.filter(o => o.type === 'Jasa Tukang' && (
                                o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (o.project && o.project.toLowerCase().includes(searchTerm.toLowerCase()))
                            )).map(order => (
                                <OrderCard key={order.id} order={order} />
                            ))}
                            {orders.filter(o => o.type === 'Jasa Tukang' && (
                                o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (o.project && o.project.toLowerCase().includes(searchTerm.toLowerCase()))
                            )).length === 0 && (
                                    <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                        Tidak ada pekerjaan jasa tukang.
                                    </div>
                                )}
                        </>
                    )}
                </div>
            </div>

            {/* Section 2: Borongan */}
            <div>
                <div className="flex items-center gap-3 mb-6 px-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                        <FileText className="w-5 h-5" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900">Pekerjaan Borongan</h3>
                </div>

                <div className="space-y-4 px-4">
                    {isLoading ? (
                        <div className="text-center py-8 text-gray-500">Memuat data...</div>
                    ) : (
                        <>
                            {orders.filter(o => o.type !== 'Jasa Tukang' && (
                                o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (o.project && o.project.toLowerCase().includes(searchTerm.toLowerCase()))
                            )).map(order => (
                                <OrderCard key={order.id} order={order} />
                            ))}
                            {orders.filter(o => o.type !== 'Jasa Tukang' && (
                                o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (o.project && o.project.toLowerCase().includes(searchTerm.toLowerCase()))
                            )).length === 0 && (
                                    <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                        Tidak ada pekerjaan borongan/lainnya.
                                    </div>
                                )}
                        </>
                    )}
                </div>
            </div>

            {/* Mandor Order Detail Modal */}
            <MandorOrderDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                order={selectedOrder}
            />
        </div>
    );
};
