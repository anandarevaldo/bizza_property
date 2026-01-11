'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle, ArrowRight, ChevronRight, Home, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '../navbar';
import Footer from '../footer';
import { HistoryDetailModal } from './HistoryDetailModal';
import { DatePicker } from './DatePicker';

interface HistoryItem {
    id: string;
    service: string;
    date: string;
    time: string;
    status: string;
    price: number;
    address: string;
    image: string;
    rabProposed?: number;
    mandor?: string;
    tukang?: string;
}

interface HistoryPageProps {
    switchView?: (view: any) => void;
}

const mockHistory: HistoryItem[] = [
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
        id: 'ORD-20231225-004',
        service: 'Service Kulkas 2 Pintu',
        date: '25 Des 2023',
        time: '16:00',
        status: 'Selesai',
        price: 125000,
        address: 'Jl. Merdeka No. 123, Jakarta Selatan',
        image: 'https://images.unsplash.com/photo-1571175443880-49e1d58bca9d?auto=format&fit=crop&q=80&w=300'
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
    },
    {
        id: 'SRV-TEST-001',
        service: 'Survey Lokasi Renovasi',
        date: '05 Jan 2026',
        time: '10:00',
        status: 'Request Survey',
        price: 0,
        address: 'Jl. Test Drive No. 99',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=300',
        rabProposed: 12500000,
        mandor: 'Pak Slamet'
    },
    {
        id: 'SRV-TEST-002',
        service: 'Instalasi Listrik Rumah Baru',
        date: '05 Jan 2026',
        time: '14:00',
        status: 'Request Survey',
        price: 0,
        address: 'Jl. Bunga Melati No. 45',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=300',
        rabProposed: 8500000,
        mandor: 'Pak Budi'
    },
    {
        id: 'SRV-TEST-003',
        service: 'Renovasi Atap Bocor',
        date: '05 Jan 2026',
        time: '09:00',
        status: 'Request Survey',
        price: 0,
        address: 'Jl. Ahmad Yani No. 88',
        image: 'https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&q=80&w=300',
        rabProposed: 4500000,
        mandor: 'Pak Joko'
    }
];

const HistoryPage: React.FC<HistoryPageProps> = () => {
    const router = useRouter();
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Default to null (Show All History)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [historyData, setHistoryData] = useState<HistoryItem[]>(mockHistory);

    // Effect to check for updates from Mandor view (simulated backend)
    useEffect(() => {
        const storedRab = localStorage.getItem('srv_test_001_rab');
        if (storedRab) {
            const rabValue = parseInt(storedRab, 10);
            setHistoryData(prevData => prevData.map(item =>
                item.id === 'SRV-TEST-001' ? { ...item, rabProposed: rabValue } : item
            ));
        }
    }, [isModalOpen]);

    const handleOpenDetail = (item: any) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    // Helper to parse "DD MMM YYYY" to Date object for comparison
    const parseDateString = (dateStr: string) => {
        // ID locale map
        const months: { [key: string]: number } = {
            'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'Mei': 4, 'Jun': 5,
            'Jul': 6, 'Ags': 7, 'Sep': 8, 'Okt': 9, 'Nov': 10, 'Des': 11
        };
        const parts = dateStr.split(' ');
        if (parts.length === 3) {
            const day = parseInt(parts[0]);
            const month = months[parts[1]];
            const year = parseInt(parts[2]);
            return new Date(year, month, day);
        }
        return new Date(dateStr); // Fallback
    };

    // Filter logic: Exact Date Match
    const filteredHistory = historyData.filter(item => {
        if (!selectedDate) return true; // Show all if no date selected

        const itemDate = parseDateString(item.date);

        return itemDate.getDate() === selectedDate.getDate() &&
            itemDate.getMonth() === selectedDate.getMonth() &&
            itemDate.getFullYear() === selectedDate.getFullYear();
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Selesai': return 'text-green-600 bg-green-50 border-green-200';
            case 'Diproses': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'Dibatalkan': return 'text-red-600 bg-red-50 border-red-200';
            case 'Request Survey': return 'text-purple-600 bg-purple-50 border-purple-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Selesai': return <CheckCircle className="w-4 h-4" />;
            case 'Diproses': return <Clock className="w-4 h-4" />;
            case 'Dibatalkan': return <XCircle className="w-4 h-4" />;
            case 'Request Survey': return <Clock className="w-4 h-4 text-purple-600" />;
            default: return <AlertCircle className="w-4 h-4" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Navbar currentView="history" />

            {/* Compact Admin-like Header with Background */}
            <div className="relative bg-gray-900 pt-32 pb-24 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=2000"
                        alt="Background"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/0 to-gray-900/80"></div>
                </div>
                <div className="relative container mx-auto px-6 md:px-12 text-center text-white">
                    <h1 className="text-4xl font-extrabold mb-3 tracking-tight">Riwayat Pesanan</h1>
                    <p className="text-gray-300 text-lg max-w-xl mx-auto font-medium">
                        Pantau status pengerjaan dan detail riwayat servis properti Anda.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow container mx-auto px-4 md:px-12 -mt-12 relative z-10 pb-12">

                {/* Date Filter Card - Full Width Clean Design */}
                <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 max-w-4xl mx-auto mb-8 border border-gray-100">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4 w-full">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl flex-shrink-0">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Filter Tanggal</label>
                                <div className="relative group flex items-center gap-2">
                                    {/* Date Text & Trigger */}
                                    <div className="relative flex-grow">
                                        <div
                                            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                                            className="flex items-center gap-2 cursor-pointer font-black text-xl transition-colors group-hover:text-blue-600 text-gray-900"
                                        >
                                            <span className={selectedDate ? 'text-blue-600' : 'text-gray-900'}>
                                                {selectedDate
                                                    ? selectedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                                                    : 'Tampilkan Semua History'}
                                            </span>
                                            <ChevronRight className={`w-5 h-5 rotate-90 transition-colors ${selectedDate || isDatePickerOpen ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'}`} />
                                        </div>

                                        {/* Custom Date Picker Popup */}
                                        <DatePicker
                                            isOpen={isDatePickerOpen}
                                            onClose={() => setIsDatePickerOpen(false)}
                                            selectedDate={selectedDate}
                                            onChange={(date: Date) => setSelectedDate(date)}
                                        />
                                    </div>

                                    {/* Reset Button - Only shows if date is selected */}
                                    {selectedDate && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedDate(null);
                                            }}
                                            className="p-2 -mr-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all relative"
                                            title="Hapus Filter"
                                        >
                                            <XCircle className="w-6 h-6" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Status Summary (Optional Decoration) */}
                        <div className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-500 border-l border-gray-100 pl-6 h-full">
                            <span>Selesai: <strong className="text-green-600">{historyData.filter(h => h.status === 'Selesai').length}</strong></span>
                            <span>Proses: <strong className="text-blue-600">{historyData.filter(h => h.status === 'Diproses').length}</strong></span>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 max-w-4xl mx-auto">
                    {filteredHistory.length > 0 ? (
                        filteredHistory.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-3xl p-5 shadow-xl shadow-gray-100/50 border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50 transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-stretch gap-6 group"
                            >
                                {/* Compact Image */}
                                <div className="w-full sm:w-32 sm:h-32 rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
                                    <img src={item.image} alt={item.service} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 text-center sm:text-left flex flex-col justify-center gap-1.5 w-full">
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-1">
                                        <div className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border flex items-center gap-1.5 w-fit ${getStatusColor(item.status)}`}>
                                            {getStatusIcon(item.status)}
                                            {item.status}
                                        </div>
                                        <span className="text-xs text-gray-400 font-bold tracking-wide">{item.id}</span>
                                    </div>

                                    <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{item.service}</h3>

                                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-6 text-sm text-gray-500 mt-1 font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4 text-blue-500" />
                                            <span>{item.date}</span>
                                        </div>
                                        <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-300 mt-2"></div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4 text-red-500" />
                                            <span className="line-clamp-1 text-left">{item.address}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Price and Action */}
                                <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end gap-4 w-full sm:w-auto sm:min-w-[140px] border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100">
                                    <div className="text-left sm:text-right">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Total Biaya</p>
                                        <p className="text-lg font-black text-blue-600">
                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.price)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleOpenDetail(item)}
                                        className="px-5 py-2.5 bg-gray-50 text-gray-600 font-bold rounded-xl text-sm hover:bg-blue-600 hover:text-white transition-all shadow-sm flex items-center gap-2 group/btn"
                                    >
                                        Detail <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
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
                            <p className="text-gray-500 mb-6 font-medium">Yuk, mulai pesan jasa pertamamu sekarang!</p>
                            <button onClick={() => router.push('/user/layanan')} className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition-colors">
                            Pesan Jasa
                        </button>
                        </div>
                    )}
                </div>
            </div>

            <Footer />

            <HistoryDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                data={selectedItem}
            />
        </div>
    );
};

export default HistoryPage;
