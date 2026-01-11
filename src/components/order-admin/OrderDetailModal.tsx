'use client';

import React from 'react';
import { X, Package, Calendar, User, CreditCard, MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react';

interface Order {
    id: string;
    orderNumber: string;
    customer: string;
    type: 'Jasa Tukang' | 'Borongan' | 'Material' | 'Layanan' | 'Jasa';
    total: string;
    date: string;
    status: 'Paid' | 'Unpaid' | 'Process' | 'Cancelled' | 'Need Validation' | 'On Progress' | 'Done' | 'Cancel';
}

interface OrderDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ isOpen, onClose, order }) => {
    if (!isOpen || !order) return null;

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Done': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'On Progress': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Need Validation': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Cancel': return 'bg-red-50 text-red-600 border-red-100';
            // Legacy fallbacks
            case 'Paid': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Process': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Unpaid': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up border border-gray-100">

                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-2xl font-black text-gray-900">Detail Pesanan</h2>
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusStyle(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-gray-500 font-medium text-sm">No. Order: <span className="text-gray-900 font-bold">{order.orderNumber}</span></p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors group"
                    >
                        <X className="w-6 h-6 text-gray-400 group-hover:text-gray-600" />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {/* Customer Info */}
                    <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" />
                            Informasi Pelanggan
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nama Lengkap</p>
                                <p className="font-bold text-gray-900 text-lg">{order.customer}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tipe Layanan</p>
                                <p className="font-bold text-gray-900 text-lg">{order.type}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email</p>
                                <p className="font-medium text-gray-600">customer@example.com</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No. Telepon</p>
                                <p className="font-medium text-gray-600">0812-3456-7890</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Timeline/Status */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-600" />
                            Timeline Status
                        </h3>
                        <div className="relative pl-8 border-l-2 border-gray-100 space-y-8">
                            <div className="relative">
                                <div className={`absolute -left-[39px] w-5 h-5 rounded-full border-4 border-white shadow-sm ${order.status !== 'Unpaid' && order.status !== 'Need Validation' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                                <p className="font-bold text-gray-900">Pesanan Dibuat</p>
                                <p className="text-sm text-gray-500">{order.date}</p>
                            </div>
                            <div className="relative">
                                <div className={`absolute -left-[39px] w-5 h-5 rounded-full border-4 border-white shadow-sm ${order.status === 'Done' || order.status === 'On Progress' || order.status === 'Paid' || order.status === 'Process' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                                <p className="font-bold text-gray-900">Pembayaran Terkonfirmasi</p>
                                <p className="text-sm text-gray-500">Menunggu konfirmasi</p>
                            </div>
                            <div className="relative">
                                <div className={`absolute -left-[39px] w-5 h-5 rounded-full border-4 border-white shadow-sm ${order.status === 'On Progress' || order.status === 'Process' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                                <p className="font-bold text-gray-900">Sedang Diproses</p>
                                <p className="text-sm text-gray-500">Layanan sedang dikerjakan</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="border-t border-gray-100 pt-8">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-500 font-medium">Subtotal</span>
                            <span className="font-bold text-gray-900">{order.total}</span>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-500 font-medium">Biaya Layanan</span>
                            <span className="font-bold text-gray-900">Rp 0</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
                            <span className="text-blue-800 font-bold">Total Pembayaran</span>
                            <span className="text-2xl font-black text-blue-600">{order.total}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
