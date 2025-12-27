
import React, { useState, useRef } from 'react';
import { ArrowLeft, Minus, Plus, Calendar, Clock, Camera, Image as ImageIcon, MapPin, ChevronRight, Info, AlertCircle, CheckCircle, Hammer, Upload, X, Search, PaintBucket, Grid3x3, Zap, HardHat, Square, Droplets, Wrench, Umbrella, PenTool, Layers, Home, DoorOpen, Shield, ChefHat, Fence, Trees, Anchor, Ruler, Palette, Bath, Package, LayoutGrid, BoxSelect, Fan, Wind, Gem, Warehouse, Container, Thermometer, Tent, StopCircle, Sparkles, UserPlus, ChevronDown, Wallet, CreditCard } from 'lucide-react';

interface BookingFormHandymanProps {
    switchView: (view: any) => void;
    selectedHandymanType: string;
}

interface SelectedHandyman {
    id: number;
    type: string;
    quantity: number;
    shift: 'seharian' | 'pagi' | 'sore';
}

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

const handymanTypes = [
    { id: 'kebocoran', name: 'Tukang Kebocoran', desc: 'Jaga Rumah Bebas Bocor', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'cat', name: 'Tukang Cat', desc: 'Warnai Rumahmu', icon: PaintBucket, color: 'text-pink-500', bg: 'bg-pink-50' },
    { id: 'keramik', name: 'Tukang Keramik', desc: 'Percantik Lantai & Dinding', icon: Grid3x3, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'listrik', name: 'Tukang Listrik', desc: 'Rumah Terang, Hati Senang', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { id: 'pipa', name: 'Tukang Pipa', desc: 'Air Mengalir Lancar', icon: Wrench, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { id: 'sanitasi', name: 'Tukang Sanitasi', desc: 'Kamar Mandi Bersih', icon: Umbrella, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'konsultan', name: 'Tukang Konsultan', desc: 'Bantu Rencanakan Proyek', icon: PenTool, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'plafon', name: 'Tukang Plafon', desc: 'Perbaikan Langit-langit', icon: Layers, color: 'text-slate-500', bg: 'bg-slate-50' },
    { id: 'dinding', name: 'Tukang Dinding', desc: 'Dinding Kokoh Terjaga', icon: Home, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'pintu', name: 'Tukang Pintu', desc: 'Kreasi Pintu & Jendela', icon: DoorOpen, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 'atap', name: 'Tukang Atap', desc: 'Pelindung Rumahmu', icon: Shield, color: 'text-gray-500', bg: 'bg-gray-50' },
    { id: 'dapur', name: 'Tukang Dapur', desc: 'Semangat Memasak', icon: ChefHat, color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: 'konstruksi', name: 'Tukang Konstruksi', desc: 'Bangun Rumah Impian', icon: HardHat, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'pagar', name: 'Tukang Pagar', desc: 'Keamanan Properti', icon: Fence, color: 'text-lime-500', bg: 'bg-lime-50' },
    { id: 'taman', name: 'Tukang Taman', desc: 'Landscape & Taman', icon: Trees, color: 'text-green-500', bg: 'bg-green-50' },
    { id: 'pondasi', name: 'Tukang Pondasi', desc: 'Struktur Kuat Kokoh', icon: Anchor, color: 'text-stone-500', bg: 'bg-stone-50' },
    { id: 'desain', name: 'Tukang Desain', desc: 'Rancang Hunianmu', icon: Ruler, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'interior', name: 'Tukang Interior', desc: 'Desain Interior Elegan', icon: Palette, color: 'text-fuchsia-500', bg: 'bg-fuchsia-50' },
    { id: 'toilet', name: 'Tukang Toilet', desc: 'Kamar Mandi Nyaman', icon: Bath, color: 'text-violet-500', bg: 'bg-violet-50' },
    { id: 'jasa_angkat', name: 'Jasa Angkat', desc: 'Pindahkan Barangmu', icon: Package, color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 'conblock', name: 'Tukang Conblock', desc: 'Pekarangan Rumah Indah', icon: LayoutGrid, color: 'text-teal-500', bg: 'bg-teal-50' },
    { id: 'aluminium', name: 'Tukang Aluminium', desc: 'Percantik Interior', icon: BoxSelect, color: 'text-pink-600', bg: 'bg-pink-50' },
    { id: 'exhaust', name: 'Tukang Exhaust Fan', desc: 'Udara Ruangan Segar', icon: Fan, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { id: 'kipas', name: 'Tukang Kipas Angin', desc: 'Rumahmu Lebih Adem', icon: Wind, color: 'text-red-400', bg: 'bg-red-50' },
    { id: 'batu_alam', name: 'Tukang Batu Alam', desc: 'Sentuhan Alam Alami', icon: Gem, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'lemari', name: 'Tukang Lemari', desc: 'Jaga Barang Pentingmu', icon: Warehouse, color: 'text-blue-400', bg: 'bg-blue-50' },
    { id: 'tangki', name: 'Tukang Tangki Air', desc: 'Pasang Tangki Air', icon: Container, color: 'text-cyan-400', bg: 'bg-cyan-50' },
    { id: 'heater', name: 'Tukang Water Heater', desc: 'Air Hangat Nyaman', icon: Thermometer, color: 'text-rose-400', bg: 'bg-rose-50' },
    { id: 'kanopi', name: 'Tukang Kanopi', desc: 'Lindungi Area Luar', icon: Tent, color: 'text-indigo-400', bg: 'bg-indigo-50' },
    { id: 'lantai', name: 'Tukang Lantai', desc: 'Lantai Rumah Mulus', icon: StopCircle, color: 'text-slate-600', bg: 'bg-slate-50' },
    { id: 'cuci_toren', name: 'Tukang Cuci Toren', desc: 'Air Bersih Mengalir', icon: Sparkles, color: 'text-sky-500', bg: 'bg-sky-50' },
    { id: 'kenek', name: 'Kenek', desc: 'Bantu Pekerjaan Cepat', icon: UserPlus, color: 'text-green-600', bg: 'bg-green-50' },
];

const BookingFormHandyman: React.FC<BookingFormHandymanProps> = ({ switchView, selectedHandymanType: initialHandymanType }) => {
    // State
    const [selectedHandymen, setSelectedHandymen] = useState<SelectedHandyman[]>([
        { id: Date.now(), type: initialHandymanType || '', quantity: 1, shift: 'seharian' }
    ]);
    const [description, setDescription] = useState('');
    const [showDate, setShowDate] = useState(false);
    const [showTime, setShowTime] = useState(false);
    const [showAddress, setShowAddress] = useState(false);

    const [showAddHandymanModal, setShowAddHandymanModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Image Upload State
    const [images, setImages] = useState<File[]>([]);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setImages((prevImages) => {
                const combinedImages = [...prevImages, ...newFiles];
                // Limit to 10 images
                return combinedImages.slice(0, 10);
            });
        }
    };

    const removeImage = (index: number) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    // Date & Time Logic (Simplified for this view)
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

    // Helpers for Calendar
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    // Address
    const [addressDetails, setAddressDetails] = useState('');

    // Payment Logic
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [tempSelectedPayment, setTempSelectedPayment] = useState<PaymentMethod | null>(null); // For modal selection before confirm

    // Pricing
    const prices: Record<string, number> = {
        seharian: 259000,
        pagi: 199000,
        sore: 199000
    };

    // Derived State
    const totalHandymen = selectedHandymen.reduce((acc, curr) => acc + curr.quantity, 0);
    const totalPrice = selectedHandymen.reduce((acc, curr) => {
        const pricePerUnit = prices[curr.shift] || 0;
        return acc + (pricePerUnit * curr.quantity);
    }, 0);
    const serviceFee = 5000;
    const finalTotal = totalPrice + serviceFee;

    const formattedPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
    };

    const handleConfirmPaymentMethod = () => {
        if (tempSelectedPayment) {
            setSelectedPaymentMethod(tempSelectedPayment);
            setShowPaymentModal(false);
        }
    };

    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const handleSubmit = () => {
        alert("Pesanan Tukang Berhasil! (Simulasi)");
        switchView('home');
    }

    const filteredHandyman = handymanTypes.filter(h =>
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedHandymen.some(selected => selected.type === h.name)
    );

    const handleAddHandyman = (name: string) => {
        setSelectedHandymen(prev => [...prev, { id: Date.now(), type: name, quantity: 1, shift: 'seharian' }]);
        setShowAddHandymanModal(false);
    }

    const handleUpdateHandyman = (index: number, field: keyof SelectedHandyman, value: any) => {
        const newHandymen = [...selectedHandymen];
        newHandymen[index] = { ...newHandymen[index], [field]: value };
        setSelectedHandymen(newHandymen);
    };

    const handleRemoveHandyman = (index: number) => {
        const newHandymen = selectedHandymen.filter((_, i) => i !== index);
        setSelectedHandymen(newHandymen);
    };



    return (
        <div className="min-h-screen bg-gray-50 font-sans animate-fade-in pb-32 md:pb-12">
            {/* Header (Breadcrumb Style) */}
            <div className="bg-white border-b border-gray-200 py-4 px-6 md:px-12 sticky top-0 z-40 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3 text-sm md:text-base">
                    <button onClick={() => switchView('home')} className="hover:bg-gray-100 p-2 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="flex items-center gap-2 text-gray-500">
                        <span className="cursor-pointer hover:text-blue-600" onClick={() => switchView('home')}>Home</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="cursor-pointer hover:text-blue-600" onClick={() => switchView('handyman-selection')}>
                            Pilih Tukang
                        </span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="font-bold text-gray-900">Form Pemesanan</span>
                    </div>
                </div>
                <div className="ml-auto">
                    <AlertCircle className="w-6 h-6 text-gray-400" />
                </div>
            </div>


            <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">
                <div className="flex flex-col lg:flex-row gap-8 align-start">

                    {/* Left Column: Form Details */}
                    <div className="flex-1 space-y-6">

                        {/* Banner Material */}
                        <div className="bg-blue-50 p-6 rounded-3xl flex items-center justify-between border-2 border-blue-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full -mr-10 -mt-10 z-0 opacity-50"></div>
                            <div className="flex-1 pr-4 relative z-10">
                                <h3 className="font-bold text-gray-900 text-lg mb-2">Mohon Siapkan Material</h3>
                                <p className="text-sm text-gray-600 leading-relaxed mb-4">Pastikan bahan yang dibutuhkan untuk pengerjaan proyek sudah siap ya!</p>
                                <button className="text-blue-700 text-sm font-bold flex items-center gap-1 hover:underline bg-white/80 px-4 py-2 rounded-xl shadow-sm border border-blue-100 backdrop-blur-sm">
                                    Selengkapnya <ArrowLeft className="w-4 h-4 rotate-180" />
                                </button>
                            </div>
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full p-4 shadow-sm border border-blue-50 relative z-10">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/2821/2821868.png"
                                    alt="Material"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>

                        {/* Deskripsi Masalah */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 text-lg">Deskripsikan masalah</h3>
                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-all">
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Jelaskan kebutuhan perbaikan rumahmu dengan detail agar pengerjaan maksimal"
                                    className="w-full bg-transparent border-none focus:ring-0 text-base text-gray-700 min-h-[100px] resize-none placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Jenis Tukang Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 mb-6">
                                <h3 className="font-bold text-gray-900 text-lg">Jenis Tukang</h3>
                                <Info className="w-5 h-5 text-gray-400" />
                            </div>

                            {selectedHandymen.map((handyman, index) => {
                                const handymanType = handymanTypes.find(h => h.name === handyman.type);
                                const HandymanIcon = handymanType?.icon || Hammer;
                                const iconBg = handymanType?.bg || 'bg-blue-50';
                                const iconColor = handymanType?.color || 'text-blue-600';

                                return (
                                    <div key={handyman.id} className="bg-white rounded-2xl border-2 border-gray-100 p-6 mb-6 hover:border-blue-100 transition-colors relative">
                                        {/* Remove Button (only show if more than 1 item or just allow removing any) */}
                                        {/* Remove Button (only show for additional handymen, keep first one locked) */}
                                        {index > 0 && (
                                            <button
                                                onClick={() => handleRemoveHandyman(index)}
                                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        )}

                                        <div className="flex items-center justify-between mb-8 pr-8">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-20 h-20 ${iconBg} rounded-2xl flex items-center justify-center ${iconColor} shadow-inner`}>
                                                    <HandymanIcon className="w-10 h-10" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Tukang Terpilih</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-gray-900 text-2xl">{handyman.type || 'Pilih Tukang'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-100">
                                                <button
                                                    onClick={() => handleUpdateHandyman(index, 'quantity', Math.max(1, handyman.quantity - 1))}
                                                    className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 text-gray-600 border border-gray-200"
                                                >
                                                    <Minus className="w-5 h-5" />
                                                </button>
                                                <span className="font-bold w-10 text-center text-lg">{handyman.quantity}</span>
                                                <button
                                                    onClick={() => handleUpdateHandyman(index, 'quantity', handyman.quantity + 1)}
                                                    className="w-10 h-10 rounded-lg bg-blue-600 shadow-blue-200 shadow-sm flex items-center justify-center hover:bg-blue-700 text-white"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Shift Selection */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                            {[
                                                { id: 'seharian', label: 'Seharian', time: '08:00 - 17:00', price: 259000 },
                                                { id: 'pagi', label: 'Pagi', time: '08:00 - 12:00', price: 199000 },
                                                { id: 'sore', label: 'Sore', time: '13:00 - 17:00', price: 199000 }
                                            ].map((s) => (
                                                <button
                                                    key={s.id}
                                                    onClick={() => handleUpdateHandyman(index, 'shift', s.id)}
                                                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden
                                                        ${handyman.shift === s.id
                                                            ? 'border-blue-500 bg-blue-50 shadow-md scale-[1.02]'
                                                            : 'border-gray-100 bg-white hover:border-blue-200 hover:bg-blue-50/50'
                                                        }
                                                    `}
                                                >
                                                    {handyman.shift === s.id && <div className="absolute top-0 right-0 p-1 bg-blue-500 rounded-bl-xl"><CheckCircle className="w-3 h-3 text-white" /></div>}
                                                    <span className={`text-sm font-bold mb-1 ${handyman.shift === s.id ? 'text-gray-900' : 'text-gray-500'}`}>{s.label}</span>
                                                    <span className="text-xs text-gray-400 mb-2">{s.time}</span>
                                                    <span className={`text-sm font-extrabold ${handyman.shift === s.id ? 'text-blue-600' : 'text-gray-700'}`}>
                                                        Rp{s.price.toLocaleString('id-ID')}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>


                                    </div>
                                )
                            })}

                            <button
                                onClick={() => setShowAddHandymanModal(true)}
                                className="w-full py-4 border-2 border-dashed border-blue-300 text-blue-600 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-50 hover:border-blue-400 transition-all group"
                            >
                                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Tambah Tukang Lain
                            </button>

                            {/* Banner Peralatan (Moved here) */}
                            <div className="bg-yellow-50 rounded-xl p-4 flex items-center justify-between border border-yellow-100 hover:bg-yellow-100 transition-colors cursor-pointer group mt-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
                                        <img src="https://cdn-icons-png.flaticon.com/512/3063/3063822.png" alt="Tools" className="w-6 h-6 opacity-80" />
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-gray-500">Lihat </span>
                                        <span className="font-bold text-gray-900">peralatan yang kamu siapkan </span>
                                        <span className="text-gray-500">dan perlatan dari tukang</span>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        {/* Foto Masalah (Moved to Left) */}
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

                            {/* Image Previews */}
                            {images.length > 0 && (
                                <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                    {images.map((file, index) => (
                                        <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`Preview ${index}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>


                        {/* Collapsible Sections Container */}
                        <div className="space-y-4">
                            {/* Jadwalkan */}
                            {/* Tanggal Survey */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    Tanggal Survey <span className="text-red-500">*</span>
                                </h2>

                                {/* Calendar UI */}
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

                                    {/* Days Header */}
                                    <div className="grid grid-cols-7 mb-4 text-center">
                                        {['M', 'S', 'S', 'R', 'K', 'J', 'S'].map((day, i) => (
                                            <div key={i} className="text-sm font-bold text-gray-400 py-2">{day}</div>
                                        ))}
                                    </div>

                                    {/* Dates Grid */}
                                    <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center">
                                        {/* Empty slots for start of month */}
                                        {[...Array(firstDayOfMonth)].map((_, i) => <div key={`empty-${i}`}></div>)}

                                        {/* Days */}
                                        {[...Array(daysInMonth)].map((_, i) => {
                                            const day = i + 1;
                                            const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0); // Reset time for accurate date comparison

                                            const isPast = dateToCheck < today;
                                            const isSelected = selectedDate
                                                ? dateToCheck.toDateString() === selectedDate.toDateString()
                                                : false;

                                            return (
                                                <div key={day} className="flex justify-center">
                                                    <button
                                                        onClick={() => !isPast && setSelectedDate(dateToCheck)}
                                                        disabled={isPast}
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
                                                        ${isSelected
                                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110'
                                                                : isPast
                                                                    ? 'text-gray-300 cursor-not-allowed bg-transparent'
                                                                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                                            }
                                                    `}
                                                    >
                                                        {day}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Waktu Survey */}
                                <div className="pt-6 border-t border-gray-100">
                                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-blue-600" />
                                        Waktu Survey
                                    </h2>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                        {[
                                            '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
                                            '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
                                        ].map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setSelectedTimeSlot(t)}
                                                className={`py-2 px-1 rounded-xl border-2 font-bold flex items-center justify-center gap-1 transition-all text-sm
                                                ${selectedTimeSlot === t
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                        : 'border-gray-200 bg-white text-gray-500 hover:border-blue-200 hover:text-blue-600'
                                                    }
                                            `}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Alamat */}
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
                                    {/* Map Preview Placeholder */}
                                    <div className="mt-4 w-full h-32 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-sm font-medium border border-gray-200">
                                        <MapPin className="w-4 h-4 mr-2" /> Peta Lokasi
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>


                    {/* Right Column: Sticky Summary & Action */}
                    <div className="lg:w-[420px] shrink-0">
                        <div className="sticky top-28 space-y-6">

                            {/* Promo Widget */}
                            {/* Promo Widget with Input */}
                            {/* Promo Widget */}
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
                                            <span className="text-gray-500">Jasa Tukang ({totalHandymen}x)</span>
                                            <span className="font-bold text-gray-900">{formattedPrice(totalPrice)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Biaya Layanan</span>
                                            <span className="font-bold text-gray-900">{formattedPrice(serviceFee)}</span>
                                        </div>

                                        <div className="my-4 border-t border-dashed border-gray-200"></div>

                                        {/* Payment Method Selection Card (Moved Up) */}
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

                            {/* Submit Button */}
                            <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 mt-6">
                                Bayar Sekarang
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile-only Sticky Bottom Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
                <div className="container mx-auto max-w-2xl flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-xs mb-1">Total Harga</p>
                        <p className="text-xl font-bold text-blue-600">Rp{(totalPrice + 5000).toLocaleString('id-ID')}</p>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-blue-200"
                    >
                        Selanjutnya
                    </button>
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
                            {/* E-Wallet Section */}
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

                            {/* VA Section */}
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
                                                    <p className="text-sm text-gray-500">{method.description}</p>
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

            {/* Add Handyman Modal */}
            {
                showAddHandymanModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                        <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden min-h-[600px]">
                            {/* Modal Header */}
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                                <div>
                                    <h3 className="text-3xl font-bold text-gray-900">Pesan Tukang Langsung! 👷</h3>
                                    <p className="text-gray-500 text-lg mt-2">Temukan tukang profesional yang cocok untuk kebutuhan spesifik pekerjaan di rumahmu</p>
                                </div>
                                <button
                                    onClick={() => setShowAddHandymanModal(false)}
                                    className="p-3 bg-gray-50 text-gray-400 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
                                >
                                    <X className="w-8 h-8" />
                                </button>
                            </div>

                            {/* Search Bar in Modal */}
                            <div className="p-8 pb-4 shrink-0 bg-white">
                                <div className="relative max-w-2xl mx-auto">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                                    <input
                                        type="text"
                                        placeholder="Cari Tukang Langsung..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-16 pr-6 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-blue-50 transition-all font-bold text-lg shadow-sm placeholder-gray-300"
                                    />
                                </div>
                            </div>

                            {/* Modal Body - Grid of Handymen */}
                            <div className="p-8 overflow-y-auto custom-scrollbar bg-gray-50/50">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredHandyman.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => handleAddHandyman(item.name)}
                                            className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex items-start gap-5 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
                                        >
                                            <div className={`absolute top-0 right-0 w-24 h-24 ${item.bg} rounded-bl-[3rem] opacity-50 -mr-6 -mt-6 transition-transform group-hover:scale-110`}></div>

                                            <div className={`w-20 h-20 ${item.bg} rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
                                                <item.icon className={`w-10 h-10 ${item.color}`} />
                                            </div>

                                            <div className="flex-1 min-w-0 relative z-10 py-1">
                                                <h4 className="font-bold text-gray-900 text-xl mb-1 group-hover:text-blue-600 transition-colors truncate">{item.name}</h4>
                                                <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">{item.desc}</p>

                                                <div className="flex items-center text-sm font-bold text-gray-300 group-hover:text-blue-500 transition-colors">
                                                    Pilih Tukang <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {filteredHandyman.length === 0 && (
                                    <div className="text-center py-20 text-gray-400">
                                        <Search className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                        <p className="text-xl font-bold text-gray-300">Tidak ada tukang yang ditemukan</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }

        </div >
    );
};

export default BookingFormHandyman;
