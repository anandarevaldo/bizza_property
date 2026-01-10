import React, { useState } from 'react';
import { DollarSign, TrendingUp, CreditCard, ArrowUpRight, ArrowDownRight, Wallet, Calendar, Clock, Edit2, Eye, Trash2 } from 'lucide-react';
import { initialOrders, Order } from '../order-admin/OrderList';
import { OrderDetailModal } from '../order-admin/OrderDetailModal';

export const FinanceOverview: React.FC = () => {
    // State
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // Calculate Stats
    const totalRevenueValue = orders
        .filter(o => o.status === 'Paid')
        .reduce((acc, curr) => {
            const val = parseInt(curr.total.replace(/[^0-9]/g, ''), 10);
            return acc + (isNaN(val) ? 0 : val);
        }, 0);

    const totalRevenue = `Rp ${totalRevenueValue.toLocaleString('id-ID')}`;
    const totalTransactions = orders.filter(o => o.status === 'Paid').length;
    const pendingPayment = orders.filter(o => o.status === 'Unpaid').length;

    // Filter only financial transactions (Paid/Unpaid)
    const financialTransactions = orders.filter(o => ['Paid', 'Unpaid'].includes(o.status));

    const handleViewDetail = (order: Order) => {
        setSelectedOrder(order);
        setIsDetailModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Hapus riwayat transaksi ini?')) {
            setOrders(orders.filter(o => o.id !== id));
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-green-50 rounded-2xl text-green-600">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900">Keuangan</h2>
                    </div>
                    <p className="text-gray-500 font-medium ml-1">Laporan pendapatan dan arus kas bisnis.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Bulan Ini
                    </button>
                    <button className="px-5 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-200 hover:shadow-xl hover:-translate-y-1">
                        Download Laporan
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Revenue */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-green-100 relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-bold text-green-100 uppercase tracking-wider text-sm">Total Pendapatan</span>
                        </div>
                        <h3 className="text-4xl font-black mb-2">{totalRevenue}</h3>
                        <div className="flex items-center gap-2 text-green-100 font-medium text-sm">
                            <span className="bg-white/20 px-2 py-0.5 rounded-lg flex items-center gap-1 text-white">
                                <ArrowUpRight className="w-4 h-4" /> +12.5%
                            </span>
                            vs bulan lalu
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-10 -mt-10 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                </div>

                {/* Transaction Count */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100 group hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-start justify-between mb-6">
                        <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform duration-300">
                            <CreditCard className="w-8 h-8" />
                        </div>
                        <span className="text-gray-400 font-bold text-xs bg-gray-50 px-3 py-1 rounded-full">Bulan Ini</span>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 mb-1">{totalTransactions}</h3>
                    <p className="text-gray-400 font-medium text-sm">Transaksi Berhasil</p>
                </div>

                {/* Pending */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100 group hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-start justify-between mb-6">
                        <div className="p-4 bg-orange-50 rounded-2xl text-orange-500 group-hover:scale-110 transition-transform duration-300">
                            <TrendingUp className="w-8 h-8" />
                        </div>
                        <span className="text-gray-400 font-bold text-xs bg-gray-50 px-3 py-1 rounded-full">Pending</span>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 mb-1">{pendingPayment}</h3>
                    <p className="text-gray-400 font-medium text-sm">Menunggu Pembayaran</p>
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-gray-900">Riwayat Transaksi</h3>
                    <button className="text-blue-600 font-bold text-sm hover:underline">Lihat Semua</button>
                </div>

                <div className="space-y-4">
                    {financialTransactions.length > 0 ? (
                        financialTransactions.map(order => (
                            <div key={order.id} className="flex items-center justify-between p-5 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-blue-200 hover:shadow-lg transition-all group">
                                <div className="flex items-center gap-5">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg border border-gray-100 shadow-sm ${order.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                                        }`}>
                                        {order.status === 'Paid' ? <ArrowDownRight className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-base mb-0.5">{order.customer}</h4>
                                        <p className="text-xs font-bold text-gray-400">{order.date} • {order.orderNumber}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <h4 className={`font-black text-base mb-1 ${order.status === 'Paid' ? 'text-green-600' : 'text-gray-900'
                                            }`}>{order.total}</h4>
                                        <span className={`text-[10px] uppercase font-black tracking-wider px-3 py-1 rounded-full ${order.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 border-l border-gray-100 pl-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleViewDetail(order)}
                                            className="p-2 bg-gray-50 text-blue-600 rounded-xl hover:bg-blue-100 hover:scale-110 transition-all font-bold"
                                            title="Lihat Detail"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(order.id)}
                                            className="p-2 bg-gray-50 text-red-500 rounded-xl hover:bg-red-100 hover:scale-110 transition-all font-bold"
                                            title="Hapus"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-400">Tidak ada data transaksi.</div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <OrderDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                order={selectedOrder}
            />
        </div>
    );
};
