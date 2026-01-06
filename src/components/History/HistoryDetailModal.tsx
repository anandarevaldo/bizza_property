import React, { useState } from 'react';
import { X, Star, Calendar, Clock, MapPin, CheckCircle, Circle, Map, User, CreditCard } from 'lucide-react';

interface HistoryItem {
    id: string;
    service: string;
    date: string;
    time: string;
    status: string;
    price: number;
    address: string;
    image: string;
    tukang?: string;
    mandor?: string;
    rabProposed?: number;
    rabStatus?: 'Pending' | 'Approved' | 'Rejected';
}

interface HistoryDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: HistoryItem | null;
}

export const HistoryDetailModal: React.FC<HistoryDetailModalProps> = ({ isOpen, onClose, data }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    if (!isOpen || !data) return null;

    // Helper to determine active step index
    const getStepStatus = (status: string) => {
        if (status === 'Selesai') return 4;
        if (status === 'Diproses') return 2; // Assuming step 3 is active/processing
        return 0; // Default/Start
    };

    const currentStep = getStepStatus(data.status);

    // Progress Steps
    const steps = [
        { label: 'Menunggu Pembayaran', date: data.date }, // Mock backdates if needed
        { label: 'Verifikasi', date: data.date },
        { label: 'Sedang Dikerjakan', date: 'In Progress' },
        { label: 'Selesai', date: 'Completed' }
    ];

    const handleSubmitReview = () => {
        alert(`Rating: ${rating}, Comment: ${comment}`);
        // Here you would typically send to backend
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up border border-gray-100 relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                {/* Header Text Only */}
                <div className="p-8 pt-12 pb-4 border-b border-gray-100 relative">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block ${data.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                                data.status === 'Diproses' ? 'bg-blue-100 text-blue-700' :
                                    data.status === 'Request Survey' ? 'bg-purple-100 text-purple-700' :
                                        'bg-red-100 text-red-700'
                                }`}>
                                {data.status}
                            </span>
                            <h2 className="text-3xl font-black text-gray-900 mb-1">{data.service}</h2>
                            <p className="text-gray-500 font-medium">Order ID: #{data.id}</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-8">

                    {/* Assigned Team Info */}
                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-600" /> Tim Yang Bertugas
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs text-blue-500 font-bold uppercase tracking-wider mb-1">Mandor (Penanggung Jawab)</p>
                                <p className="font-bold text-gray-900 text-lg">{data.mandor || 'Belum Ditentukan'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-blue-500 font-bold uppercase tracking-wider mb-1">Tukang Pelaksana</p>
                                <p className="font-bold text-gray-900 text-lg">{data.tukang || 'Belum Ditentukan'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar (Only show if not Cancelled) */}
                    {data.status !== 'Dibatalkan' && (
                        <div>
                            <div className="relative flex justify-between">
                                {/* Connecting Line */}
                                <div className="absolute top-[14px] left-0 right-0 h-1 bg-gray-100 -z-10 rounded-full">
                                    <div
                                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                        style={{ width: `${(Math.min(currentStep, 3) / 3) * 100}%` }}
                                    ></div>
                                </div>

                                {steps.map((step, idx) => {
                                    const isCompleted = idx <= currentStep;
                                    const isCurrent = idx === currentStep;

                                    return (
                                        <div key={idx} className="flex flex-col items-center gap-2 w-1/4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 transition-all ${isCompleted ? 'bg-blue-600 border-blue-100 text-white' : 'bg-white border-gray-100 text-gray-300'
                                                }`}>
                                                {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                                            </div>
                                            <div className="text-center">
                                                <p className={`text-[10px] uppercase font-bold tracking-wider mb-0.5 ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                                                {/* <p className="text-[10px] text-gray-400">{step.date}</p> */}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Order Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-600" /> Detail Pemesan
                            </h3>
                            <div className="bg-gray-50 rounded-2xl p-5 space-y-3 border border-gray-100">
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">No. Order</p>
                                    <p className="font-bold text-gray-900">{data.id}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Tanggal & Waktu</p>
                                    <p className="font-medium text-gray-700">{data.date}, {data.time}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Alamat Pengerjaan</p>
                                    <p className="font-medium text-gray-700">{data.address}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-blue-600" /> Pembayaran
                            </h3>
                            <div className="bg-gray-50 rounded-2xl p-5 space-y-3 border border-gray-100">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 text-sm">Metode Pembayaran</span>
                                    <span className="font-bold text-gray-900">Transfer Bank / E-Wallet</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 text-sm">Status</span>
                                    <span className={`font-bold ${data.status === 'Selesai' ? 'text-green-600' : 'text-blue-600'}`}>Lunas</span>
                                </div>
                                <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                                    <span className="font-bold text-gray-900">Total Biaya</span>
                                    <span className="text-xl font-black text-blue-600">
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(data.price)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RAB Approval Section (For Request Survey with RAB) */}
                    {data.status === 'Request Survey' && data.rabProposed && (
                        <div className="bg-blue-50 rounded-[2rem] p-8 border border-blue-100 relative overflow-hidden text-center space-y-6">
                            <div className="relative z-10">
                                <h3 className="text-xl font-black text-gray-900 mb-2">Penawaran Biaya (RAB)</h3>
                                <p className="text-gray-500 text-sm mb-6">Mandor telah mengajukan Rencana Anggaran Biaya untuk proyek ini.</p>

                                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/50 inline-block min-w-[200px] mb-6 shadow-sm">
                                    <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Total Biaya</p>
                                    <p className="text-3xl font-black text-blue-900">
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(data.rabProposed)}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => alert('RAB Ditolak')}
                                        className="py-3 px-4 bg-white text-red-600 font-bold rounded-xl border border-red-100 hover:bg-red-50 hover:border-red-200 transition-all"
                                    >
                                        Tolak Penawaran
                                    </button>
                                    <button
                                        onClick={() => alert('RAB Disetujui! Lanjut ke Pembayaran')}
                                        className="py-3 px-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
                                    >
                                        Setujui & Bayar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Review Section (Only for Completed Orders) */}
                    {data.status === 'Selesai' && (
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[2rem] p-8 border border-blue-100 text-center space-y-6">
                            <div>
                                <h3 className="text-xl font-black text-blue-900 mb-2">Beri Ulasan Layanan</h3>
                                <p className="text-blue-600/80 text-sm">Bagaimana kepuasan Anda terhadap hasil kerja tukang kami?</p>
                            </div>

                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className="transition-transform hover:scale-110 focus:outline-none"
                                    >
                                        <Star
                                            className={`w-10 h-10 ${star <= rating ? 'fill-yellow-400 text-yellow-500' : 'text-gray-300'}`}
                                        />
                                    </button>
                                ))}
                            </div>

                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Tulis pengalaman Anda di sini... (opsional)"
                                className="w-full h-32 p-4 rounded-2xl border-2 border-blue-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all resize-none bg-white placeholder:text-gray-400"
                            />

                            <button
                                onClick={handleSubmitReview}
                                disabled={rating === 0}
                                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 transition-all"
                            >
                                Kirim Ulasan
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
