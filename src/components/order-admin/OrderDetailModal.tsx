'use client';

import React, { useState, useEffect } from 'react';
import { X, Package, Calendar, User, CreditCard, MapPin, Phone, Mail, Clock, CheckCircle, Activity, CheckCircle2 } from 'lucide-react';
import { documentationService, Documentation } from '@/lib/services/documentationService';
import { orderService } from '@/lib/services/orderService';

interface Order {
    id: string;
    orderNumber: string;
    customer: string;
    type: 'Jasa Tukang' | 'Borongan' | 'Material' | 'Layanan' | 'Jasa';
    total: string;
    date: string;
    status: 'Paid' | 'Unpaid' | 'Process' | 'Cancelled' | 'Need Validation' | 'On Progress' | 'Done' | 'Cancel';
    progress?: number;
    paymentProof?: string;
}

interface OrderDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
    onRefresh?: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ isOpen, onClose, order, onRefresh }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [documentation, setDocumentation] = useState<Documentation[]>([]);
    const [isValidating, setIsValidating] = useState(false);

    useEffect(() => {
        if (isOpen && order) {
            const fetchDocs = async () => {
                try {
                const docs = await documentationService.getByOrderId(order.id);
                setDocumentation(docs);
                } catch (e) { console.error(e); }
            };
            fetchDocs();
        }
    }, [isOpen, order]);

    const paymentProofs = documentation.filter(doc => doc.description.toLowerCase().includes('bukti pembayaran') || doc.description.toLowerCase().includes('payment'));
    const progressProofs = documentation.filter(doc => !doc.description.toLowerCase().includes('bukti pembayaran') && !doc.description.toLowerCase().includes('payment'));

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

    const handleValidateOrder = async () => {
        if (!order || order.status !== 'Need Validation') return;
        
        try {
            setIsValidating(true);
            await orderService.updateOrder(order.id, {
                status_pesanan: 'ON_PROGRESS'
            });
            
            alert('Pesanan berhasil divalidasi dan status diubah menjadi On Progress!');
            onClose();
            if (onRefresh) {
                onRefresh();
            }
        } catch (error) {
            console.error('Error validating order:', error);
            alert('Gagal memvalidasi pesanan. Silakan coba lagi.');
        } finally {
            setIsValidating(false);
        }
    };


    if (!isOpen || !order) return null;

    return (
        <>
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                {/* ... existing modal content ... */}
                <div className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up border border-gray-100">
                    
                    {/* ... Header ... */}
                     <div className="flex items-center justify-between p-8 border-b border-gray-100 sticky top-0 bg-white z-10">
                        {/* ... existing header code ... */}
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-2xl font-black text-gray-900">Detail Pesanan</h2>
                                <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusStyle(order!.status)}`}>
                                    {order!.status}
                                </span>
                            </div>
                            <p className="text-gray-500 font-medium text-sm">No. Order: <span className="text-gray-900 font-bold">{order!.orderNumber}</span></p>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Validation Button - Only for Need Validation status */}
                            {order!.status === 'Need Validation' && (
                                <button
                                    onClick={handleValidateOrder}
                                    disabled={isValidating}
                                    className="px-4 py-2 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-colors shadow-lg shadow-green-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    {isValidating ? 'Memvalidasi...' : 'Validasi Pesanan'}
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors group"
                            >
                                <X className="w-6 h-6 text-gray-400 group-hover:text-gray-600" />
                            </button>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* ... Customer Info & Timeline ... */}
                        <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-600" />
                                Informasi Pelanggan
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nama Lengkap</p>
                                    <p className="font-bold text-gray-900 text-lg">{order!.customer}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tipe Layanan</p>
                                    <p className="font-bold text-gray-900 text-lg">{order!.type}</p>
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
                                {/* Step 1: Pesanan Dibuat */}
                                <div className="relative">
                                    <div className={`absolute -left-[39px] w-5 h-5 rounded-full border-4 border-white shadow-sm bg-blue-600`}></div>
                                    <p className="font-bold text-gray-900">Pesanan Dibuat</p>
                                    <p className="text-sm text-gray-500">{order!.date}</p>
                                </div>
                                
                                {/* Step 2: Pembayaran Terkonfirmasi */}
                                <div className="relative">
                                    <div className={`absolute -left-[39px] w-5 h-5 rounded-full border-4 border-white shadow-sm ${
                                        order!.status !== 'Need Validation' && order!.status !== 'Unpaid' 
                                        ? 'bg-blue-600' 
                                        : 'bg-gray-300'
                                    }`}></div>
                                    <p className="font-bold text-gray-900">Pembayaran Terkonfirmasi</p>
                                    <p className="text-sm text-gray-500">
                                        {order!.status === 'Need Validation' || order!.status === 'Unpaid' 
                                            ? 'Menunggu konfirmasi' 
                                            : 'Pembayaran telah divalidasi'}
                                    </p>
                                </div>
                                
                                {/* Step 3: Sedang Diproses */}
                                <div className="relative">
                                    <div className={`absolute -left-[39px] w-5 h-5 rounded-full border-4 border-white shadow-sm ${
                                        order!.status === 'On Progress' || order!.status === 'Process' || order!.status === 'Done' 
                                        ? 'bg-blue-600' 
                                        : 'bg-gray-300'
                                    }`}></div>
                                    <p className="font-bold text-gray-900">Sedang Diproses</p>
                                    <p className="text-sm text-gray-500">
                                        {order!.status === 'On Progress' || order!.status === 'Process' 
                                            ? 'Layanan sedang dikerjakan' 
                                            : order!.status === 'Done'
                                            ? 'Pekerjaan telah selesai'
                                            : 'Menunggu proses'}
                                    </p>
                                </div>
                                
                                {/* Step 4: Selesai */}
                                <div className="relative">
                                    <div className={`absolute -left-[39px] w-5 h-5 rounded-full border-4 border-white shadow-sm ${
                                        order!.status === 'Done' 
                                        ? 'bg-green-600' 
                                        : 'bg-gray-300'
                                    }`}></div>
                                    <p className="font-bold text-gray-900">Selesai</p>
                                    <p className="text-sm text-gray-500">
                                        {order!.status === 'Done' 
                                            ? 'Pesanan telah diselesaikan' 
                                            : 'Menunggu penyelesaian'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Progress Detail Section */}
                        <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-blue-600" />
                                Progress Pengerjaan
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-gray-500 font-medium text-sm">Status Penyelesaian</span>
                                    <span className="text-2xl font-black text-blue-600">{order!.progress || 0}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                    <div 
                                        className={`h-4 rounded-full transition-all duration-1000 ${order!.progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`} 
                                        style={{ width: `${order!.progress || 0}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">
                                    <span>Mulai</span>
                                    <span>Selesai</span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Proof Section */}
                        <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-blue-600" />
                                Bukti Progress
                            </h3>

                            {/* Proof Grid */}
                            {progressProofs.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {progressProofs.map((doc) => (
                                        <div 
                                            key={doc.id} 
                                            className="relative group rounded-xl overflow-hidden aspect-video bg-gray-200 border border-gray-200 cursor-pointer"
                                            onClick={() => setSelectedImage(doc.fileUrl)}
                                        >
                                            <img
                                                src={doc.fileUrl}
                                                alt={doc.description}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <p className="text-white text-xs font-bold px-2 text-center">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                                                <div className="absolute top-2 right-2 p-1 bg-white/20 backdrop-blur-sm rounded-full">
                                                    <Clock className="w-3 h-3 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-400">
                                    <p className="text-sm font-medium">Belum ada bukti progress yang diupload oleh Mandor.</p>
                                </div>
                            )}
                        </div>

                        {/* Payment Proof Section */}
                        <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                                Bukti Pembayaran
                            </h3>

                            {/* Proof Grid */}
                            {(order?.paymentProof || paymentProofs.length > 0) ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Primary Proof from Order Table */}
                                    {order?.paymentProof && (
                                        <div 
                                            className="relative group rounded-xl overflow-hidden aspect-video bg-gray-200 border border-gray-200 cursor-pointer"
                                            onClick={() => setSelectedImage(order.paymentProof!)}
                                        >
                                            <img
                                                src={order.paymentProof}
                                                alt="Bukti Pembayaran Utama"
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <p className="text-white text-xs font-bold px-2 text-center">Bukti Utama</p>
                                                <div className="absolute top-2 right-2 p-1 bg-white/20 backdrop-blur-sm rounded-full">
                                                    <CreditCard className="w-3 h-3 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Additional Proofs from Documentation (Legacy or Duplicates) */}
                                    {paymentProofs.map((doc) => (
                                        // Avoid showing the same image twice if URL matches (simple check)
                                        (doc.fileUrl !== order?.paymentProof) && (
                                        <div 
                                            key={doc.id} 
                                            className="relative group rounded-xl overflow-hidden aspect-video bg-gray-200 border border-gray-200 cursor-pointer"
                                            onClick={() => setSelectedImage(doc.fileUrl)}
                                        >
                                            <img
                                                src={doc.fileUrl}
                                                alt={doc.description}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <p className="text-white text-xs font-bold px-2 text-center">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                                                <div className="absolute top-2 right-2 p-1 bg-white/20 backdrop-blur-sm rounded-full">
                                                    <Clock className="w-3 h-3 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                        )
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-400">
                                    <p className="text-sm font-medium">Belum ada bukti pembayaran.</p>
                                </div>
                            )}
                        </div>

                        {/* Payment Summary */}
                        <div className="border-t border-gray-100 pt-8">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-500 font-medium">Subtotal</span>
                                <span className="font-bold text-gray-900">{order!.total}</span>
                            </div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-gray-500 font-medium">Biaya Layanan</span>
                                <span className="font-bold text-gray-900">Rp 0</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
                                <span className="text-blue-800 font-bold">Total Pembayaran</span>
                                <span className="text-2xl font-black text-blue-600">{order!.total}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setSelectedImage(null)}
                >
                    <button 
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <img 
                        src={selectedImage} 
                        alt="Full View" 
                        className="max-w-full max-h-[90vh] rounded-xl shadow-2xl animate-scale-up"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                    />
                </div>
            )}
        </>
    );
};
