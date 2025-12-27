import React, { useState, useRef } from 'react';
import { Building, MapPin, Calendar, Clock, ArrowLeft, Home, ChevronRight, Store, Briefcase, Users, FileText, Camera, Upload, X, Search, Wallet, CheckCircle, CreditCard, ChevronDown } from 'lucide-react';

interface BookingFormBusinessProps {
    switchView: (view: 'home' | 'search' | 'login' | 'register' | 'admin' | 'layanan' | 'portfolio' | 'about' | 'booking-form' | 'booking-form-business') => void;
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

const BookingFormBusiness: React.FC<BookingFormBusinessProps> = ({ switchView }) => {
    // State Management
    const [businessType, setBusinessType] = useState('Kantor');
    const [businessName, setBusinessName] = useState('');
    const [picName, setPicName] = useState('');
    const [description, setDescription] = useState('');
    const [addressSearch, setAddressSearch] = useState('');
    const [addressDetail, setAddressDetail] = useState('');
    const [budget, setBudget] = useState('');

    // Date & Time
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    // Images
    const [images, setImages] = useState<File[]>([]);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    // Payment Logic
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [tempSelectedPayment, setTempSelectedPayment] = useState<PaymentMethod | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setImages((prevImages) => {
                const combinedImages = [...prevImages, ...newFiles];
                return combinedImages.slice(0, 10);
            });
        }
    };

    const removeImage = (index: number) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    // Calendar Helpers
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleConfirmPaymentMethod = () => {
        if (tempSelectedPayment) {
            setSelectedPaymentMethod(tempSelectedPayment);
            setShowPaymentModal(false);
        }
    };

    const handleSubmit = () => {
        if (!businessName || !picName || !description || !addressSearch || !selectedDate || !selectedTime || !budget) {
            alert('Mohon lengkapi semua data wajib (*) sebelum melanjutkan.');
            return;
        }
        if (!selectedPaymentMethod) {
            alert('Mohon pilih metode pembayaran.');
            return;
        }

        const formData = {
            businessType,
            businessName,
            picName,
            description,
            address: { search: addressSearch, detail: addressDetail },
            date: `${selectedDate.getDate()} ${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`,
            time: selectedTime,
            budget,
            paymentMethod: selectedPaymentMethod.name
        };

        console.log('Business Form Data:', formData);
        alert('Pesanan Bisnis berhasil dibuat! (Simulasi)');
        switchView('home');
    };

    const formattedPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
    };

    const basePrice = 100000;
    const serviceFee = 5000;
    const finalTotal = basePrice + serviceFee;

    return (
        <div className="min-h-screen bg-gray-50 font-sans animate-fade-in pb-20">
            {/* Header / Breadcrumb */}
            <div className="bg-white border-b border-gray-200 py-4 px-6 md:px-12 sticky top-0 z-40 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3 text-sm md:text-base">
                    <button onClick={() => switchView('home')} className="hover:bg-gray-100 p-2 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="flex items-center gap-2 text-gray-500">
                        <span className="cursor-pointer hover:text-blue-600" onClick={() => switchView('home')}>Home</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="font-bold text-gray-900">Form Pemesanan Bisnis</span>
                    </div>
                </div>
                <button
                    onClick={() => switchView('booking-form')}
                    className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-bold transition-colors text-xs hover:bg-blue-100"
                >
                    <Home className="w-4 h-4" />
                    Untuk Personal?
                </button>
            </div>

            <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Form Details */}
                    <div className="flex-1 space-y-8">

                        {/* Header Title */}
                        <div>
                            <h1 className="text-3xl font-extrabold text-blue-900 mb-2">Solusi Renovasi untuk Bisnis Anda</h1>
                            <p className="text-gray-500">Profesional, Terpercaya, dan Berkualitas untuk kebutuhan komersial.</p>
                        </div>

                        {/* Jenis Bisnis */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Building className="w-5 h-5 text-blue-600" />
                                Jenis Properti Bisnis <span className="text-red-500">*</span>
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { id: 'Kantor', icon: Building, label: 'Kantor' },
                                    { id: 'Ruko', icon: Store, label: 'Ruko' },
                                    { id: 'Gudang', icon: Building, label: 'Gudang' },
                                    { id: 'Restoran', icon: Store, label: 'F&B' }
                                ].map((type) => (
                                    <div
                                        key={type.id}
                                        onClick={() => setBusinessType(type.id)}
                                        className={`cursor-pointer rounded-2xl p-4 flex flex-col items-center justify-center gap-3 border-2 transition-all h-28
                                            ${businessType === type.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200'}
                                        `}
                                    >
                                        <type.icon className={`w-8 h-8 ${businessType === type.id ? 'text-blue-500' : 'text-gray-400'}`} />
                                        <span className="font-bold text-sm">{type.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Identitas Bisnis */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-blue-600" />
                                Identitas Bisnis <span className="text-red-500">*</span>
                            </h2>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Bisnis / Perusahaan</label>
                                <div className="relative">
                                    <Building className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={businessName}
                                        onChange={(e) => setBusinessName(e.target.value)}
                                        placeholder="Contoh: PT. Bizza Indonesia"
                                        className="w-full pl-12 pr-5 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nama PIC (Person in Charge)</label>
                                <div className="relative">
                                    <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={picName}
                                        onChange={(e) => setPicName(e.target.value)}
                                        placeholder="Nama lengkap penanggung jawab"
                                        className="w-full pl-12 pr-5 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 transition-all font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Kebutuhan Renovasi */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                Detail Kebutuhan Renovasi
                            </h2>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full h-40 px-5 py-4 border-2 border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:border-blue-500 transition-all text-base resize-none placeholder-gray-400"
                                placeholder="Jelaskan kebutuhan renovasi bisnis Anda secara detail..."
                            ></textarea>
                        </div>

                        {/* Foto Lokasi */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                                <Camera className="w-5 h-5 text-blue-600" />
                                Foto Lokasi Proyek
                            </h2>
                            <p className="text-gray-500 text-sm mb-6 ml-7">Untuk estimasi yang lebih akurat</p>

                            <div className="flex flex-col items-center justify-center gap-4 py-8 border-2 border-dashed border-blue-200 rounded-2xl bg-blue-50 hover:bg-blue-100/50 hover:border-blue-300 transition-all cursor-pointer group" onClick={() => galleryInputRef.current?.click()}>
                                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform border border-blue-100">
                                    <Upload className="w-8 h-8 text-blue-500" />
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-gray-800">Upload Foto</p>
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

                        {/* Alamat Survey */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-blue-600" />
                                Alamat Lokasi Bisnis <span className="text-red-500">*</span>
                            </h2>

                            <div className="relative mb-6">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5" />
                                <input
                                    type="text"
                                    value={addressSearch}
                                    onChange={(e) => setAddressSearch(e.target.value)}
                                    placeholder="Cari lokasi bisnis..."
                                    className="w-full pl-12 pr-12 py-4 border-2 border-blue-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all font-medium"
                                />
                            </div>

                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="w-full md:w-1/2 h-64 bg-slate-100 rounded-2xl relative overflow-hidden group border-2 border-gray-100">
                                    <img
                                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
                                        alt="Map Location"
                                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                        <div className="relative">
                                            <MapPin className="w-10 h-10 text-blue-600 fill-current drop-shadow-md animate-bounce" />
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/20 blur-sm rounded-[100%]"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full md:w-1/2 flex flex-col">
                                    <label className="text-sm font-bold text-gray-700 mb-2">Detail Alamat Lengkap</label>
                                    <textarea
                                        value={addressDetail}
                                        onChange={(e) => setAddressDetail(e.target.value)}
                                        className="flex-1 w-full p-4 border-2 border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:border-blue-500 transition-all resize-none text-sm placeholder-gray-400"
                                        placeholder="Lantai, Unit, Patokan, dll..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Tanggal Survey */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                Jadwal Survey <span className="text-red-500">*</span>
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

                            <div className="pt-6 border-t border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-blue-600" />
                                    Waktu Survey
                                </h2>
                                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                                    {[
                                        '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
                                        '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
                                    ].map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setSelectedTime(t)}
                                            className={`py-2 px-1 rounded-xl border-2 font-bold flex items-center justify-center gap-1 transition-all text-sm
                                                ${selectedTime === t
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

                        {/* Budget */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-blue-600" />
                                Estimasi Budget <span className="text-red-500">*</span>
                            </h2>
                            <div className="relative">
                                <select
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    className="w-full pl-5 pr-12 py-4 border-2 border-gray-200 rounded-2xl appearance-none bg-white focus:outline-none focus:border-blue-500 font-medium text-gray-700 cursor-pointer"
                                >
                                    <option value="" disabled>Pilih range budget</option>
                                    <option value="5jt-20jt">Rp 5.000.000 - Rp 20.000.000</option>
                                    <option value="20jt-50jt">Rp 20.000.000 - Rp 50.000.000</option>
                                    <option value="50jt-100jt">Rp 50.000.000 - Rp 100.000.000</option>
                                    <option value=">100jt">Di atas Rp 100.000.000</option>
                                </select>
                                <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none rotate-90" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Summary */}
                    <div className="lg:w-[420px] shrink-0">
                        <div className="sticky top-28 space-y-6">

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
                                            <span className="text-gray-500">Biaya Survey Bisnis</span>
                                            <span className="font-bold text-gray-900">{formattedPrice(basePrice)}</span>
                                        </div>
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

                            {/* Submit Button */}
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
        </div>
    );
};

export default BookingFormBusiness;
