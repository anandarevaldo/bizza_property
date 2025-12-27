import React, { useState, useRef } from 'react';
import {
    ArrowLeft, ChevronRight, MessageCircle, Clock, Info,
    Plus, Minus, Calendar, Camera, Image as ImageIcon, MapPin,
    CheckCircle, AlertCircle, X, Search, ChevronDown, Wallet, Upload
} from 'lucide-react';

interface ServiceRepairBookingProps {
    switchView: (view: any) => void;
    selectedServiceType?: string;
}

const problemTypesMap: Record<string, { id: string; label: string }[]> = {
    'Kebocoran': [
        { id: 'plafon_dak', label: "Plafon Bocor (Dak)" },
        { id: 'pipa_pecah', label: "Pipa Pecah / Bocor" },
        { id: 'rembes_pipa', label: "Rembes dari Pipa" },
        { id: 'genteng_bocor', label: "Perbaikan Genteng Bocor" },
        { id: 'dak_bocor', label: "Perbaikan Dak Bocor" },
        { id: 'plafon_genteng', label: "Plafon Bocor (Genteng)" },
        { id: 'plafon_tetes', label: "Perbaikan Plafon Setelah Bocor Teratasi" },
    ],
    'Cat': [
        { id: 'cat_dinding_dalam', label: "Cat Dinding Dalam (Interior)" },
        { id: 'cat_dinding_luar', label: "Cat Dinding Luar (Eksterior)" },
        { id: 'cat_plafon', label: "Cat Plafon" },
        { id: 'cat_pagar', label: "Cat Pagar Besi / Kayu" },
        { id: 'kelupas_cat', label: "Perbaikan Cat Mengelupas / Jamur" },
        { id: 'cat_pintu', label: "Cat Pintu & Jendela" },
    ],
    'Keramik': [
        { id: 'pasang_baru', label: "Pasang Keramik Baru" },
        { id: 'bongkar_pasang', label: "Bongkar & Pasang Keramik" },
        { id: 'keramik_pecah', label: "Perbaikan Keramik Pecah / Retak" },
        { id: 'pasang_granit', label: "Pasang Granit / Marmer" },
        { id: 'nat_keramik', label: "Perbaikan Nat Keramik" },
        { id: 'keramik_kamar_mandi', label: "Keramik Kamar Mandi" },
    ],
    'Listrik': [
        { id: 'korsleting', label: "Perbaikan Korsleting Listrik" },
        { id: 'tambah_titik', label: "Tambah Titik Lampu / Stopkontak" },
        { id: 'ganti_mcb', label: "Ganti MCB / Sekring" },
        { id: 'pasang_lampu', label: "Pasang / Ganti Lampu Gantung" },
        { id: 'instalasi_baru', label: "Instalasi Listrik Baru" },
        { id: 'panel_listrik', label: "Perbaikan Panel Listrik" },
    ],
    'Pipa': [
        { id: 'pipa_mampet', label: "Pipa Saluran Mampet" },
        { id: 'krran_rusak', label: "Ganti Kran Air Rusak" },
        { id: 'pasang_pompa', label: "Pasang / Servis Pompa Air" },
        { id: 'tambah_jalur', label: "Instalasi Jalur Pipa Baru" },
        { id: 'toren_air', label: "Instalasi / Kuras Toren Air" },
    ],
    'Sanitasi': [
        { id: 'wc_mampet', label: "WC / Toilet Mampet" },
        { id: 'pasang_kloset', label: "Pasang Kloset Duduk / Jongkok" },
        { id: 'wastafel', label: "Pasang / Perbaikan Wastafel" },
        { id: 'septictank', label: "Sedot / Perbaikan Septic Tank" },
        { id: 'shower', label: "Instalasi Shower & Water Heater" },
    ],
    'Konsultan': [
        { id: 'konsultasi_bangun', label: "Konsultasi Bangun Rumah Baru" },
        { id: 'konsultasi_renov', label: "Konsultasi Renovasi Total" },
        { id: 'hitung_rab', label: "Perhitungan RAB" },
        { id: 'cek_struktur', label: "Pengecekan Struktur Bangunan" },
    ],
    'Plafon': [
        { id: 'pasang_gypsum', label: "Pasang Plafon Gypsum" },
        { id: 'pasang_pvc', label: "Pasang Plafon PVC" },
        { id: 'plafon_jebol', label: "Perbaikan Plafon Jebol / Retak" },
        { id: 'lis_plafon', label: "Pemasangan Lis Plafon" },
        { id: 'rangka_plafon', label: "Perbaikan Rangka Plafon" },
    ],
    'Dinding': [
        { id: 'tembok_retak', label: "Perbaikan Tembok Retak Rambut" },
        { id: 'tembok_lembab', label: "Perbaikan Tembok Lembab / Rembes" },
        { id: 'plester_aci', label: "Jasa Plester & Aci Dinding" },
        { id: 'partisi', label: "Pembuatan Partisi Ruangan" },
        { id: 'pasang_bata', label: "Pasang Bata / Hebel" },
    ],
    'Pintu': [
        { id: 'pintu_seret', label: "Perbaikan Pintu Turun / Seret" },
        { id: 'ganti_engsel', label: "Ganti Engsel / Kunci Pintu" },
        { id: 'pasang_kusen', label: "Pasang Kusen Pintu / Jendela" },
        { id: 'pintu_aluminium', label: "Pembuatan Pintu Aluminium" },
        { id: 'kaca_jendela', label: "Ganti Kaca Jendela Pecah" },
    ],
    'Atap': [
        { id: 'baja_ringan', label: "Pasang Rangka Baja Ringan" },
        { id: 'ganti_genteng', label: "Ganti Genteng Pecah / Melorot" },
        { id: 'karpet_talang', label: "Perbaikan Karpet / Talang Air" },
        { id: 'cat_genteng', label: "Pengecatan Atap / Genteng" },
        { id: 'pasang_asbes', label: "Pasang Asbes / Spandek" },
    ],
    'Dapur': [
        { id: 'kitchen_set', label: "Pembuatan Kitchen Set" },
        { id: 'meja_dapur', label: "Buat Meja Dapur Cor / Granit" },
        { id: 'pasang_sink', label: "Pasang Kitchen Sink" },
        { id: 'renov_dapur', label: "Renovasi Total Dapur" },
        { id: 'penyedot_asap', label: "Instalasi Cooker Hood" },
    ],
    'Konstruksi': [
        { id: 'tambah_lantai', label: "Ngedak / Tambah Lantai" },
        { id: 'bangun_baru', label: "Bangun Rumah dari Nol" },
        { id: 'renovasi_total', label: "Renovasi Rumah Total" },
        { id: 'garasi', label: "Pembuatan Garasi / Carport" },
        { id: 'kolam_renang', label: "Pembuatan Kolam Renang" },
    ],
    'Pagar': [
        { id: 'las_pagar', label: "Las Pagar Besi Lepas" },
        { id: 'bikin_pagar', label: "Pembuatan Pagar Baru" },
        { id: 'cat_ulang_pagar', label: "Cat Ulang Pagar" },
        { id: 'pagar_tembok', label: "Pembuatan Pagar Tembok" },
        { id: 'ganti_roda', label: "Ganti Roda Pagar" },
    ],
    'Taman': [
        { id: 'potong_rumput', label: "Potong Rumput & Rapikan Taman" },
        { id: 'buat_taman', label: "Pembuatan Taman Baru" },
        { id: 'kolam_ikan', label: "Pembuatan Kolam Ikan" },
        { id: 'tanam_pohon', label: "Jasa Tanam Pohon / Tanaman Hias" },
        { id: 'system_siram', label: "Instalasi Sistem Penyiraman" },
    ],
    'Pondasi': [
        { id: 'cakar_ayam', label: "Pembuatan Cakar Ayam" },
        { id: 'suntik_beton', label: "Suntik Beton / Penguatan Struktur" },
        { id: 'pondasi_batu', label: "Pasang Pondasi Batu Kali" },
        { id: 'sloof', label: "Pengecoran Sloof & Kolom" },
    ],
    'Desain': [
        { id: 'desain_3d', label: "Desain Arsitektur 3D" },
        { id: 'gambar_kerja', label: "Gambar Kerja (DED)" },
        { id: 'desain_interior', label: "Desain Interior 3D" },
        { id: 'konsul_layout', label: "Konsultasi Layout Ruangan" },
    ],
    'Interior': [
        { id: 'wallpaper', label: "Pasang Wallpaper Dinding" },
        { id: 'gorden', label: "Pemasangan Gorden / Blinds" },
        { id: 'parket', label: "Pasang Lantai Kayu / Vinyl" },
        { id: 'backdrop_tv', label: "Pembuatan Backdrop TV" },
        { id: 'plint_lantai', label: "Pemasangan Plint Lantai" },
    ],
    'Toilet': [
        { id: 'renov_toilet', label: "Renovasi Kamar Mandi Total" },
        { id: 'waterproofing_toilet', label: "Waterproofing Lantai Toilet" },
        { id: 'pasang_bathtub', label: "Pasang Bathtub / Shower Box" },
        { id: 'ganti_keramik_wc', label: "Ganti Keramik Toilet" },
    ],
    'Jasa Angkat': [
        { id: 'pindahan', label: "Jasa Angkat Pindahan Rumah" },
        { id: 'buang_puing', label: "Jasa Buang Puing Bangunan" },
        { id: 'angkat_material', label: "Kuli Angkat Material" },
        { id: 'bersih_rumah', label: "Pembersihan Pasca Renovasi" },
    ],
    'Conblock': [
        { id: 'pasang_paving', label: "Pasang Paving Block Baru" },
        { id: 'servis_paving', label: "Perbaikan Paving Ambles" },
        { id: 'pasang_grassblock', label: "Pasang Grass Block" },
        { id: 'cor_jalan', label: "Pengecoran Jalan" },
    ],
    'Aluminium': [
        { id: 'jendela_alum', label: "Pembuatan Jendela Aluminium" },
        { id: 'pintu_alum', label: "Pembuatan Pintu Aluminium" },
        { id: 'partisi_kaca', label: "Partisi Kaca Aluminium" },
        { id: 'servis_alum', label: "Servis Kusen Aluminium" },
    ],
    'Exhaust Fan': [
        { id: 'pasang_exhaust', label: "Pasang Exhaust Fan Dinding/Plafon" },
        { id: 'servis_exhaust', label: "Servis / Bersihkan Exhaust Fan" },
        { id: 'bobok_lubang', label: "Bobok Lubang Exhaust Baru" },
    ],
    'Kipas Angin': [
        { id: 'pasang_kipas', label: "Pasang Kipas Angin Gantung" },
        { id: 'pasang_kipas_dinding', label: "Pasang Kipas Dinding" },
        { id: 'servis_kipas', label: "Perbaikan Instalasi Kipas" },
    ],
    'Batu Alam': [
        { id: 'pasang_batu_alam', label: "Pasang Dinding Batu Alam" },
        { id: 'coating_batu', label: "Coating / Vernis Batu Alam" },
        { id: 'lantai_batu', label: "Pasang Lantai Batu Alam" },
        { id: 'perbaikan_batu', label: "Perbaikan Batu Alam Lepas" },
    ],
    'Lemari': [
        { id: 'lemari_custom', label: "Pembuatan Lemari Custom (Wardrobe)" },
        { id: 'rak_buku', label: "Pembuatan Rak Buku / Display" },
        { id: 'servis_lemari', label: "Perbaikan Pintu / Engsel Lemari" },
        { id: 'bongkar_lemari', label: "Bongkar Pasang Lemari" },
    ],
    'Tangki Air': [
        { id: 'pasang_toren', label: "Instalasi Tangki Air Baru" },
        { id: 'kuras_toren', label: "Kuras / Bersihkan Tangki Air" },
        { id: 'radar_toren', label: "Pasang / Ganti Radar Otomatis" },
        { id: 'buat_menara', label: "Pembuatan Menara Toren Besi/Beton" },
    ],
    'Water Heater': [
        { id: 'pasang_wh_listrik', label: "Pasang Water Heater Listrik" },
        { id: 'pasang_wh_gas', label: "Pasang Water Heater Gas" },
        { id: 'servis_wh', label: "Servis / Perbaikan Water Heater" },
        { id: 'instalasi_pipa_wh', label: "Instalasi Pipa Panas Dingin" },
    ],
    'Kanopi': [
        { id: 'kanopi_baja', label: "Pasang Kanopi Baja Ringan" },
        { id: 'kanopi_besi', label: "Pasang Kanopi Besi Hollow" },
        { id: 'ganti_atap_kanopi', label: "Ganti Atap Kanopi (Alderon/Poly)" },
        { id: 'cat_kanopi', label: "Cat Ulang Rangka Kanopi" },
    ],
    'Lantai': [
        { id: 'poles_lantai', label: "Poles Lantai Marmer / Teraso" },
        { id: 'aci_lantai', label: "Aci Lantai Semen Ekspos" },
        { id: 'epoxy', label: "Cat Epoxy Lantai" },
        { id: 'perataan_lantai', label: "Perataan Lantai (Levelling)" },
    ],
    'Cuci Toren': [
        { id: 'cuci_toren_kecil', label: "Cuci Toren < 1000 Liter" },
        { id: 'cuci_toren_besar', label: "Cuci Toren > 1000 Liter" },
        { id: 'sterilisasi_air', label: "Sterilisasi Saluran Air" },
        { id: 'filter_air', label: "Pasang Filter Air Bersih" },
    ],
    'Kenek': [
        { id: 'bantu_harian', label: "Jasa Kenek Harian" },
        { id: 'aduk_semen', label: "Bantu Aduk Semen / Pasir" },
        { id: 'bersih_material', label: "Bantu Bersihkan Sisa Material" },
    ],
    // Default fallback if other services are selected but not yet mapped
    'default': [
        { id: 'survey', label: "Survey Kerusakan" },
        { id: 'konsultasi', label: "Konsultasi Teknis" },
        { id: 'perbaikan_ringan', label: "Perbaikan Ringan" },
        { id: 'perbaikan_besar', label: "Perbaikan Besar / Renovasi" },
    ]
};

interface PaymentMethod {
    id: string;
    name: string;
    type: 'ewallet' | 'va' | 'manual';
    icon: string;
    balance?: number;
    description?: string;
}

const paymentMethods: PaymentMethod[] = [
    { id: 'gopay', name: 'GoPay', type: 'ewallet', icon: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/gopay_logo_icon_169325.png', balance: 2500000 },
    { id: 'ovo', name: 'OVO', type: 'ewallet', icon: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/ovo_logo_icon_169328.png', balance: 150000 },
    { id: 'dana', name: 'DANA', type: 'ewallet', icon: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/dana_logo_icon_169327.png', balance: 50000 },
    { id: 'bca', name: 'BCA Virtual Account', type: 'va', icon: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/bca_logo_icon_169326.png', description: 'Cek otomatis' },
    { id: 'mandiri', name: 'Mandiri Virtual Account', type: 'va', icon: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/mandiri_logo_icon_169329.png', description: 'Cek otomatis' },
];

const ServiceRepairBooking: React.FC<ServiceRepairBookingProps> = ({ switchView, selectedServiceType }) => {
    // Selection State
    const [selectedProblem, setSelectedProblem] = useState<string | null>(null);

    // Dynamic Problem List
    const problemTypes = problemTypesMap[selectedServiceType || 'default'] || problemTypesMap['default'];

    // Form State (matching BookingFormHandyman)
    const [description, setDescription] = useState('');
    const [addressDetails, setAddressDetails] = useState('');

    // Date & Time Logic
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
    const [showAddress, setShowAddress] = useState(false);

    // Image Upload State
    const [images, setImages] = useState<File[]>([]);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    // Payment State
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [tempSelectedPayment, setTempSelectedPayment] = useState<PaymentMethod | null>(null);

    // Helpers
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages([...images, ...Array.from(e.target.files)].slice(0, 10));
        }
    };

    const removeImage = (index: number) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const handleConfirmPaymentMethod = () => {
        if (tempSelectedPayment) {
            setSelectedPaymentMethod(tempSelectedPayment);
            setShowPaymentModal(false);
        }
    };

    const handleChatWA = () => {
        const phoneNumber = '628123456789';
        const message = encodeURIComponent('Halo Admin, saya bingung dengan masalah perbaikan rumah saya...');
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    };

    // Pricing (Mock)
    const basePrice = 0; // Starts at 0 until confirmed by survey? Or maybe simulated
    const serviceFee = 5000;
    const finalTotal = basePrice + serviceFee;

    const formattedPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
    };

    const handleSubmit = () => {
        alert("Pesanan Perbaikan Berhasil Dikirim! (Simulasi)");
        switchView('home');
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-32 md:pb-12 animate-fade-in">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-40 flex items-center gap-4 shadow-sm">
                <button onClick={() => switchView('repair-service-selection')} className="hover:bg-gray-100 p-2 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>
                <div>
                    <h1 className="font-bold text-gray-900 text-lg">Buat Pesanan Kamu</h1>
                    <p className="text-xs text-gray-500">{selectedServiceType ? `Layanan: ${selectedServiceType}` : 'Pilih Layanan'}</p>
                </div>
            </div>

            <div className="container mx-auto max-w-5xl px-4 py-6">

                {/* Section 1: Problem Selection (Merged) */}
                <div className="mb-8">
                    <div className="relative mb-6 rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-white shadow-xl">
                        <div className="relative z-10 max-w-xl">
                            <h2 className="text-2xl font-bold mb-2">Solusi {selectedServiceType || 'Perbaikan'} untuk Rumahmu</h2>
                            <p className="text-blue-100">Mohon isi masalah yang butuh perbaikan secara detail agar kami bisa membantu dengan tepat.</p>
                        </div>
                        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-900 text-lg">Perbaikan apa yang dibutuhkan?</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {problemTypes.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setSelectedProblem(item.id)}
                                    className={`text-left p-6 rounded-2xl border-2 transition-all group flex items-start justify-between ${selectedProblem === item.id
                                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                        : 'border-gray-100 hover:border-blue-500 hover:bg-blue-50'
                                        }`}
                                >
                                    <span className={`font-semibold ${selectedProblem === item.id ? 'text-blue-700' : 'text-gray-700 group-hover:text-blue-700'}`}>
                                        {item.label}
                                    </span>
                                    <ChevronRight className={`w-5 h-5 transition-colors ${selectedProblem === item.id ? 'text-blue-500' : 'text-gray-300 group-hover:text-blue-500'}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Section 2: Form */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Form Area */}
                    <div className="flex-1 space-y-6">

                        {/* Consultation Banner -> Chat WA */}
                        <div onClick={handleChatWA} className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-2xl p-4 flex items-center justify-between border border-pink-100 cursor-pointer hover:shadow-md transition-shadow group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                    <MessageCircle className="w-6 h-6 text-pink-500" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-base">Bingung masalahmu?</p>
                                    <p className="text-xs text-gray-500">Konsultasi langsung via WA</p>
                                </div>
                            </div>
                            <button className="text-pink-600 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                                Chat WA <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 text-lg">Deskripsikan masalah</h3>
                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-all">
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-transparent border-none focus:ring-0 text-base text-gray-700 min-h-[120px] resize-none placeholder-gray-400"
                                    placeholder="Jelaskan kebutuhan perbaikan rumahmu dengan detail agar pengerjaan maksimal..."
                                />
                            </div>
                        </div>

                        {/* Date & Time */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                Tanggal Survey <span className="text-red-500">*</span>
                            </h2>

                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-6 px-2">
                                    <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                        <ChevronDown className="w-5 h-5 text-gray-600 rotate-90" />
                                    </button>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                                    </h3>
                                    <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                        <ChevronRight className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-7 mb-4 text-center">
                                    {['M', 'S', 'S', 'R', 'K', 'J', 'S'].map((day, i) => (
                                        <div key={i} className="text-sm font-bold text-gray-400 py-2">{day}</div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center">
                                    {[...Array(firstDayOfMonth)].map((_, i) => <div key={`empty-${i}`}></div>)}
                                    {[...Array(daysInMonth)].map((_, i) => {
                                        const day = i + 1;
                                        const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);

                                        const isPast = dateToCheck < today;
                                        const isSelected = selectedDate ? dateToCheck.toDateString() === selectedDate.toDateString() : false;

                                        return (
                                            <div key={day} className="flex justify-center">
                                                <button
                                                    onClick={() => !isPast && setSelectedDate(dateToCheck)}
                                                    disabled={isPast}
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
                                                    ${isSelected ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110' : isPast ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
                                                >
                                                    {day}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-blue-600" />
                                    Waktu Survey
                                </h2>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                    {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setSelectedTimeSlot(t)}
                                            className={`py-2 px-1 rounded-xl border-2 font-bold flex items-center justify-center transition-all text-sm
                                            ${selectedTimeSlot === t ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-500 hover:border-blue-200 hover:text-blue-600'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-colors hover:border-blue-100" onClick={() => setShowAddress(!showAddress)}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-lg">Alamat Pengerjaan</h4>
                                </div>
                                <ChevronRight className={`w-6 h-6 text-gray-400 transition-transform ${showAddress ? 'rotate-90' : ''}`} />
                            </div>
                            <div className="pl-[64px]">
                                <input
                                    type="text"
                                    placeholder="Ketik detail alamat lengkap..."
                                    value={addressDetails}
                                    onChange={(e) => setAddressDetails(e.target.value)}
                                    className="w-full mt-2 p-4 border-2 border-gray-100 rounded-2xl text-base focus:outline-none focus:border-blue-500 transition-all font-medium"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>

                        {/* Photos */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h4 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                                <Camera className="w-5 h-5 text-blue-600" />
                                Foto Masalah
                            </h4>
                            <div className="flex flex-col items-center justify-center gap-4 py-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer group" onClick={() => galleryInputRef.current?.click()}>
                                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform border border-gray-100">
                                    <Upload className="w-8 h-8 text-blue-500" />
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-gray-800">Upload dari Device</p>
                                    <p className="text-xs text-gray-500 mt-1">Format JPG, PNG (Max 5MB)</p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    ref={galleryInputRef}
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>

                            {images.length > 0 && (
                                <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                    {images.map((file, index) => (
                                        <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200">
                                            <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                                            <button onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Sidebar / Summary */}
                    <div className="lg:w-[420px] shrink-0">
                        <div className="sticky top-28 space-y-6">
                            {/* Promo */}
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg flex items-center justify-between cursor-pointer hover:border-blue-200 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                                        <span className="text-white font-bold text-lg">%</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Makin Hemat</p>
                                        <p className="text-xs text-gray-500">Pakai promo biar lebih murah</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                            </div>

                            {/* Summary Card */}
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>

                                <div className="relative z-10">
                                    <h3 className="font-bold text-gray-900 text-xl mb-6">Ringkasan Pesanan</h3>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Biaya Layanan</span>
                                            <span className="font-bold text-gray-900">{formattedPrice(serviceFee)}</span>
                                        </div>

                                        <div className="my-4 border-t border-dashed border-gray-200"></div>

                                        {/* Payment Method Selection Card */}
                                        <div className="mb-6 bg-blue-50 p-4 rounded-2xl border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors flex items-center justify-between group" onClick={() => { setTempSelectedPayment(selectedPaymentMethod); setShowPaymentModal(true); }}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
                                                    {selectedPaymentMethod ? <img src={selectedPaymentMethod.icon} alt={selectedPaymentMethod.name} className="w-6 h-6 object-contain" /> : <Wallet className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Metode Pembayaran</p>
                                                    <p className="font-bold text-gray-900">{selectedPaymentMethod ? selectedPaymentMethod.name : 'Pilih Metode Pembayaran'}</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                        </div>

                                        <div className="flex justify-between items-center pt-2">
                                            <span className="font-bold text-gray-900 text-lg">Total Pembayaran</span>
                                            <span className="font-bold text-blue-600 text-2xl">{formattedPrice(finalTotal)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleSubmit} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 mt-6">
                                Bayar Sekarang
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Payment Method Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <h3 className="text-xl font-bold text-gray-900">Pilih Metode Pembayaran</h3>
                            <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 space-y-6">
                            {/* E-Wallet */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">E-Wallet</h4>
                                <div className="space-y-3">
                                    {paymentMethods.filter(p => p.type === 'ewallet').map(method => (
                                        <div
                                            key={method.id}
                                            onClick={() => setTempSelectedPayment(method)}
                                            className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${tempSelectedPayment?.id === method.id ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-blue-200'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 border border-gray-100">
                                                    <img src={method.icon} alt={method.name} className="w-full h-full object-contain" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{method.name}</p>
                                                    {method.balance !== undefined && (
                                                        <p className="text-sm text-gray-500">Saldo: {formattedPrice(method.balance)}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${tempSelectedPayment?.id === method.id ? 'border-blue-600' : 'border-gray-300'}`}>
                                                {tempSelectedPayment?.id === method.id && <div className="w-3 h-3 rounded-full bg-blue-600" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* VA */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Virtual Account</h4>
                                <div className="space-y-3">
                                    {paymentMethods.filter(p => p.type === 'va').map(method => (
                                        <div
                                            key={method.id}
                                            onClick={() => setTempSelectedPayment(method)}
                                            className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${tempSelectedPayment?.id === method.id ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-blue-200'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 border border-gray-100">
                                                    <img src={method.icon} alt={method.name} className="w-full h-full object-contain" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{method.name}</p>
                                                </div>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${tempSelectedPayment?.id === method.id ? 'border-blue-600' : 'border-gray-300'}`}>
                                                {tempSelectedPayment?.id === method.id && <div className="w-3 h-3 rounded-full bg-blue-600" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-white sticky bottom-0">
                            <button
                                onClick={handleConfirmPaymentMethod}
                                disabled={!tempSelectedPayment}
                                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${tempSelectedPayment ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'}`}
                            >
                                Pilih Metode Pembayaran
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ServiceRepairBooking;
