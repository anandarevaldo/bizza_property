import React from 'react';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle, ArrowRight, ChevronRight, Home, Search } from 'lucide-react';
import Navbar from '../navbar';
import Footer from '../footer';

interface HistoryPageProps {
    switchView: (view: any) => void;
}

const mockHistory = [
    {
        id: 'ORD-20231225-001',
        service: 'Cuci AC Split 1PK',
        date: '25 Des 2023',
        time: '14:00',
        status: 'Selesai',
        price: 75000,
        address: 'Jl. Merdeka No. 123, Jakarta Selatan',
        image: 'https://images.unsplash.com/photo-1621905252507-b35a830ce50e?auto=format&fit=crop&q=80&w=300'
    },
    {
        id: 'ORD-20231210-002',
        service: 'Perbaikan Kebocoran Pipa',
        date: '10 Des 2023',
        time: '09:30',
        status: 'Diproses',
        price: 150000,
        address: 'Komplek Permata Hijau Blok A5, Jakarta Barat',
        image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=300'
    },
    {
        id: 'ORD-20231128-003',
        service: 'Renovasi Kamar Mandi',
        date: '28 Nov 2023',
        time: '10:00',
        status: 'Dibatalkan',
        price: 2500000,
        address: 'Apartemen Sudirman Park, Jakarta Pusat',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300'
    }
];

const HistoryPage: React.FC<HistoryPageProps> = ({ switchView }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Selesai': return 'text-green-600 bg-green-50 border-green-200';
            case 'Diproses': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'Dibatalkan': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Selesai': return <CheckCircle className="w-4 h-4" />;
            case 'Diproses': return <Clock className="w-4 h-4" />;
            case 'Dibatalkan': return <XCircle className="w-4 h-4" />;
            default: return <AlertCircle className="w-4 h-4" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Navbar switchView={switchView} currentView="history" />

            {/* Header Content */}
            <div className="bg-white pt-28 pb-8 px-6 md:px-12 border-b border-gray-200 shadow-sm">
                <div className="container mx-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <span className="cursor-pointer hover:text-blue-600 transition-colors" onClick={() => switchView('home')}>Home</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="font-bold text-gray-900">Riwayat Pesanan</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Riwayat Pesanan Saya</h1>
                    <p className="text-gray-500 mt-2">Lihat dan kelola pesanan jasa Anda di sini.</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow container mx-auto px-4 md:px-12 py-8">
                <div className="grid gap-6">
                    {mockHistory.length > 0 ? (
                        mockHistory.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6">
                                {/* Image */}
                                <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                                    <img src={item.image} alt={item.service} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col justify-center gap-2">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 w-fit ${getStatusColor(item.status)}`}>
                                            {getStatusIcon(item.status)}
                                            {item.status}
                                        </div>
                                        <span className="text-xs text-gray-400 font-mono">{item.id}</span>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mt-1">{item.service}</h3>

                                    <div className="flex flex-col gap-1 text-sm text-gray-500 mt-1">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span>{item.date} • {item.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            <span className="line-clamp-1">{item.address}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Price and Action */}
                                <div className="flex flex-col justify-between items-end gap-4 border-t pt-4 md:border-t-0 md:pt-0 md:border-l md:pl-6 border-gray-100 min-w-[150px]">
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 mb-1">Total Harga</p>
                                        <p className="text-lg font-bold text-blue-600">
                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.price)}
                                        </p>
                                    </div>
                                    <button className="w-full md:w-auto px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-xl text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                                        Detail <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada pesanan</h3>
                            <p className="text-gray-500 mb-6">Yuk, mulai pesan jasa pertamamu sekarang!</p>
                            <button onClick={() => switchView('layanan')} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                                Cari Jasa
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default HistoryPage;
