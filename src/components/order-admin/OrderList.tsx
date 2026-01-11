'use client';


import React, { useState } from 'react';
import { Search, FileText, ChevronDown, CheckCircle, Clock, XCircle, Eye, X, RefreshCcw } from 'lucide-react';
import { OrderDetailModal } from './OrderDetailModal';
import { orderService } from '@/lib/services/orderService';
import { useEffect } from 'react';

export interface Order {
    id: string;
    orderNumber: string;
    customer: string;
    type: 'Material' | 'Layanan' | 'Jasa';
    total: string;
    date: string;
    status: 'Paid' | 'Unpaid' | 'Process' | 'Cancelled' | 'Need Validation' | 'On Progress' | 'Done' | 'Cancel';
}

export const initialOrders: Order[] = [
    { id: '1', orderNumber: 'ORD-2025-001', customer: 'Bapak Santoso', type: 'Layanan', total: 'Rp 450.000', date: '2025-12-28', status: 'Done' },
    { id: '2', orderNumber: 'ORD-2025-002', customer: 'Ibu Linda', type: 'Material', total: 'Rp 1.250.000', date: '2025-12-28', status: 'On Progress' },
    { id: '3', orderNumber: 'ORD-2025-003', customer: 'Cafe Kopi Kita', type: 'Jasa', total: 'Rp 3.000.000', date: '2025-12-27', status: 'Need Validation' },
];

export const OrderList: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterType, setFilterType] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const data = await orderService.getAllOrders();
            const formattedOrders: Order[] = (data || []).map((o: any) => ({
                id: o.id,
                orderNumber: `ORD-${new Date(o.tanggal_pesan).getFullYear()}-${o.pesanan_id?.toString().padStart(3, '0')}`,
                customer: o.customer_name || 'Anonymous',
                type: (o.tipe_pesanan === 'Rumah' || o.tipe_pesanan === 'Bisnis' || o.tipe_pesanan === 'Tukang') ? 'Jasa' : 'Layanan',
                total: o.budget || 'Rp 0',
                date: new Date(o.tanggal_pesan).toLocaleDateString('id-ID'),
                status: o.status_pesanan === 'ON_PROGRESS' ? 'On Progress' :
                    o.status_pesanan === 'DONE' ? 'Done' :
                        o.status_pesanan === 'CANCEL' ? 'Cancel' :
                            o.status_pesanan === 'NEED_VALIDATION' ? 'Need Validation' : 'Need Validation'
            }));
            setOrders(formattedOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(order =>
        (filterType === 'All' || order.type === filterType) &&
        (order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleStatusChange = (id: string, newStatus: Order['status']) => {
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    };

    const handleViewDetail = (order: Order) => {
        setSelectedOrder(order);
        setIsDetailModalOpen(true);
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Done': return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', icon: CheckCircle };
            case 'On Progress': return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', icon: Clock };
            case 'Need Validation': return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', icon: Clock };
            case 'Cancel': return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', icon: XCircle };
            default: return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-100', icon: Clock };
        }
    };

    return (
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-gray-100 border border-gray-100 animate-fade-in relative z-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-teal-50 rounded-2xl text-teal-600">
                            <FileText className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900">Pemesanan</h2>
                    </div>
                    <p className="text-gray-500 font-medium ml-1">Monitor semua transaksi yang masuk.</p>
                </div>

                {/* Stats Mini Cards */}
                <div className="flex gap-4 items-center">
                    <button
                        onClick={fetchOrders}
                        className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl text-gray-400 transition-colors"
                        title="Refresh Data"
                    >
                        <RefreshCcw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <div className="px-5 py-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Paid Orders</p>
                        <p className="text-2xl font-black text-emerald-700">{orders.filter(o => o.status === 'Done').length}</p>
                    </div>
                    <div className="px-5 py-3 bg-blue-50 rounded-2xl border border-blue-100">
                        <p className="text-xs font-bold text-blue-600 uppercase mb-1">On Process</p>
                        <p className="text-2xl font-black text-blue-700">{orders.filter(o => o.status === 'On Progress').length}</p>
                    </div>
                </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Cari No. Order atau Nama Customer..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all bg-gray-50 font-medium text-gray-700"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {['All', 'Layanan', 'Jasa'].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-6 py-4 rounded-2xl font-bold transition-all whitespace-nowrap ${filterType === type
                                ? 'bg-gray-900 text-white shadow-lg shadow-gray-200 scale-105'
                                : 'bg-white border-2 border-gray-100 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-visible rounded-3xl border border-gray-100 shadow-sm bg-white">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white border-b border-gray-100">
                            <th className="p-6 font-extrabold text-gray-400 text-xs uppercase tracking-wider">No. Order</th>
                            <th className="p-6 font-extrabold text-gray-400 text-xs uppercase tracking-wider">Customer</th>
                            <th className="p-6 font-extrabold text-gray-400 text-xs uppercase tracking-wider">Tipe</th>
                            <th className="p-6 font-extrabold text-gray-400 text-xs uppercase tracking-wider">Total</th>
                            <th className="p-6 font-extrabold text-gray-400 text-xs uppercase tracking-wider">Tanggal</th>
                            <th className="p-6 font-extrabold text-gray-400 text-xs uppercase tracking-wider">Status</th>
                            <th className="p-6 font-extrabold text-gray-400 text-xs uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredOrders.map((order) => {
                            const statusStyle = getStatusStyle(order.status);
                            const StatusIcon = statusStyle.icon;
                            return (
                                <tr key={order.id} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="p-6 font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{order.orderNumber}</td>
                                    <td className="p-6 font-bold text-gray-900">{order.customer}</td>
                                    <td className="p-6">
                                        <span className={`px-4 py-2 rounded-xl text-xs font-bold border ${order.type === 'Material' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                            order.type === 'Layanan' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'
                                            }`}>
                                            {order.type}
                                        </span>
                                    </td>
                                    <td className="p-6 font-black text-gray-900 text-lg">{order.total}</td>
                                    <td className="p-6 text-gray-400 font-bold text-sm">{order.date}</td>
                                    <td className="p-6 relative">
                                        {/* Status Pill - Static display */}
                                        <div className={`inline-flex items-center gap-3 pl-4 pr-6 py-2.5 rounded-full text-xs font-extrabold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                                            <StatusIcon className="w-4 h-4" />
                                            <span>{order.status}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <button
                                            onClick={() => handleViewDetail(order)}
                                            className="text-blue-600 font-bold hover:text-blue-800 hover:underline transition-all text-sm"
                                        >
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filteredOrders.length === 0 && (
                    <div className="p-10 text-center text-gray-400">
                        <p className="font-bold">Tidak ada pesanan yang ditemukan.</p>
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            <OrderDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                order={selectedOrder}
            />
        </div>
    );
};
