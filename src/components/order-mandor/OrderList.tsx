'use client';

import React, { useState, useEffect } from 'react';
import { Search, FileText, CheckCircle, Clock, XCircle, RefreshCcw, Briefcase, Wrench, Package } from 'lucide-react';
import { MandorOrderDetailModal, Order } from './OrderDetailModal';
import { orderService } from '@/lib/services/orderService';

export const MandorOrderList: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterType, setFilterType] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const data = await orderService.getMyMandorOrders(); 

            const formattedOrders: Order[] = (data || []).map((o: any) => {
                // Map DB Type to UI Type
                let uiType: Order['type'] = 'Jasa Tukang';
                if (o.tipe_pesanan === 'Material') uiType = 'Material';
                else if (o.tipe_pesanan === 'Rumah' || o.tipe_pesanan === 'Bisnis') uiType = 'Borongan';
                else uiType = 'Jasa Tukang'; // Layanan & Tukang

                // Map DB Status to UI Status
                let uiStatus: Order['status'] = 'Need Validation';
                if (o.status_pesanan === 'ON_PROGRESS') uiStatus = 'On Progress';
                else if (o.status_pesanan === 'DONE') uiStatus = 'Done';
                else if (o.status_pesanan === 'CANCEL') uiStatus = 'Cancel';
                else if (o.status_pesanan === 'NEED_VALIDATION') uiStatus = 'Need Validation';

                // Map Assignments
                const assignedHandymen = o.assignments?.map((a: any) => ({
                    id: a.anggota?.anggota_id,
                    name: a.anggota?.nama,
                    role: a.anggota?.keahlian // Assuming keahlian is role, or map it if needed
                })) || [];

                return {
                    id: o.pesanan_id?.toString(),
                    orderNumber: `ORD-${new Date(o.tanggal_pesan).getFullYear()}-${(o.pesanan_id || 0).toString().padStart(3, '0')}`,
                    customer: o.customer_name || 'Anonymous',
                    type: uiType,
                    total: o.budget || 'Rp 0',
                    date: o.jadwal_survey 
                        ? new Date(o.jadwal_survey).toLocaleDateString('id-ID')
                        : new Date(o.tanggal_pesan).toLocaleDateString('id-ID'),
                    status: uiStatus,
                    pesananId: o.pesanan_id,
                    project: o.tipe_properti || o.tipe_pesanan,
                    location: o.alamat_proyek || 'Lokasi tidak tersedia',
                    description: o.deskripsi,
                    userBudget: o.budget, // Pass original budget string
                    progress: 0, // Default, ideally fetch from DB if column exists or separate table
                    assignedHandymen: assignedHandymen,
                    assignedHandymanId: o.tukang_id // Legacy
                };
            });
            setOrders(formattedOrders);
        } catch (error: any) {
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

    const handleViewDetail = (order: Order) => {
        setSelectedOrder(order);
        setIsDetailModalOpen(true);
    };

    const handleSaveOrder = async (updatedOrder: Order) => {
        try {
            // 1. Update basic order info (status, progress, etc)
            // Note: DB Status mapping needed if we change status back
            let dbStatus = updatedOrder.status === 'On Progress' ? 'ON_PROGRESS' :
                           updatedOrder.status === 'Done' ? 'DONE' :
                           updatedOrder.status === 'Need Validation' ? 'NEED_VALIDATION' : 'CANCEL';

            await orderService.updateOrder(updatedOrder.pesananId!, {
                status_pesanan: dbStatus,
                progress: updatedOrder.progress,
                // Add other fields if editable like estimation
            });
            
            // 2. Update Assignments
            if (updatedOrder.assignedHandymen) {
                const handymanIds = updatedOrder.assignedHandymen.map(h => h.id);
                await orderService.updateOrderAssignments(updatedOrder.pesananId!, handymanIds);
            }

            // 3. Update local state
            setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
            console.log("Order Updated Successfully:", updatedOrder);
            alert("Perubahan berhasil disimpan!");
        } catch (error) {
            console.error("Failed to save order:", error);
            alert("Gagal menyimpan perubahan.");
        }
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

    const getTypeIcon = (type: string) => {
        switch (type) {
             case 'Jasa Tukang': return { icon: Wrench, color: 'text-blue-500', bg: 'bg-blue-50' };
             case 'Borongan': return { icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-50' };
             case 'Material': return { icon: Package, color: 'text-orange-500', bg: 'bg-orange-50' };
             default: return { icon: FileText, color: 'text-gray-500', bg: 'bg-gray-50' };
        }
    }

    return (
        <>
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-gray-100 border border-gray-100 animate-fade-in relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-gray-900">Tugas Saya</h2>
                        </div>
                        <p className="text-gray-500 font-medium ml-1">Kelola daftar pekerjaan dan update progress.</p>
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
                        <div className="px-5 py-3 bg-blue-50 rounded-2xl border border-blue-100">
                            <p className="text-xs font-bold text-blue-600 uppercase mb-1">Active</p>
                            <p className="text-2xl font-black text-blue-700">{orders.filter(o => o.status === 'On Progress' || o.status === 'Need Validation').length}</p>
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
                        {['All', 'Jasa Tukang', 'Borongan', 'Material'].map(type => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-6 py-4 rounded-2xl font-bold transition-all whitespace-nowrap ${filterType === type
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105'
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
                                <th className="p-6 font-extrabold text-gray-400 text-xs uppercase tracking-wider hidden md:table-cell">Tanggal</th>
                                <th className="p-6 font-extrabold text-gray-400 text-xs uppercase tracking-wider">Status</th>
                                <th className="p-6 font-extrabold text-gray-400 text-xs uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredOrders.map((order) => {
                                const statusStyle = getStatusStyle(order.status);
                                const typeStyle = getTypeIcon(order.type);
                                const StatusIcon = statusStyle.icon;
                                
                                return (
                                    <tr key={order.id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="p-6 font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{order.orderNumber}</td>
                                        <td className="p-6 font-bold text-gray-900">{order.customer}</td>
                                        <td className="p-6">
                                            <div className={`px-4 py-2 rounded-xl text-xs font-bold border inline-flex items-center gap-2 ${typeStyle.bg} ${typeStyle.color} border-transparent`}>
                                                <span className="truncate">{order.type}</span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-gray-400 font-bold text-sm hidden md:table-cell">{order.date}</td>
                                        <td className="p-6">
                                            <div className={`inline-flex items-center gap-2 pl-3 pr-4 py-2 rounded-full text-[10px] font-extrabold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                                                <StatusIcon className="w-3.5 h-3.5" />
                                                <span>{order.status}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <button
                                                onClick={() => handleViewDetail(order)}
                                                className="text-indigo-600 font-bold hover:text-indigo-800 hover:underline transition-all text-sm"
                                            >
                                                Update
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {filteredOrders.length === 0 && (
                        <div className="p-10 text-center text-gray-400">
                            <p className="font-bold">Tidak ada tugas saat ini.</p>
                        </div>
                    )}
                </div>

            </div>
            
            {/* Order Detail Modal */}
            <MandorOrderDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                order={selectedOrder}
                onSave={handleSaveOrder}
            />
        </>
    );
};
