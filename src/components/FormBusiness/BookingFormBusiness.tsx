import React, { useState } from 'react';
import { Home, ChevronRight } from 'lucide-react';
import { BookingFormBusinessProps, PaymentMethod } from './types';
import { BusinessTypeSelector } from './BusinessTypeSelector';
import { BusinessIdentityForm } from './BusinessIdentityForm';
import { ProblemDescription } from './ProblemDescription';
import { LocationPhotos } from './LocationPhotos';
import { AddressForm } from './AddressForm';
import { ScheduleSelector } from './ScheduleSelector';
import { BudgetSelector } from './BudgetSelector';
import { OrderSummary } from './OrderSummary';
import { PaymentMethodModal } from './PaymentMethodModal';

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

    // Payment Logic
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [tempSelectedPayment, setTempSelectedPayment] = useState<PaymentMethod | null>(null);

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

        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

        const formData = {
            businessType,
            businessName,
            picName,
            description,
            address: { search: addressSearch, detail: addressDetail },
            date: selectedDate ? `${selectedDate.getDate()} ${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}` : null,
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

    const handleMonthChange = (direction: 'prev' | 'next') => {
        if (direction === 'prev') {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        } else {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans animate-fade-in pb-20">
            {/* Header / Breadcrumb */}
            <div className="bg-white border-b border-gray-200 py-4 px-6 md:px-12 sticky top-0 z-40 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3 text-sm md:text-base">
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
                        <div className="mb-8">
                            <div className="relative mb-6 rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-white shadow-xl">
                                <div className="relative z-10 max-w-xl">
                                    <h2 className="text-2xl font-bold mb-2">Solusi Renovasi untuk Bisnis Anda</h2>
                                    <p className="text-blue-100">Profesional, Terpercaya, dan Berkualitas untuk kebutuhan komersial.</p>
                                </div>
                                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                            </div>
                        </div>

                        <BusinessTypeSelector value={businessType} onChange={setBusinessType} />

                        <BusinessIdentityForm
                            businessName={businessName}
                            picName={picName}
                            onBusinessNameChange={setBusinessName}
                            onPicNameChange={setPicName}
                        />

                        <ProblemDescription value={description} onChange={setDescription} />

                        <LocationPhotos
                            images={images}
                            onImagesChange={(newImages) => setImages(newImages)}
                            onRemoveImage={handleRemoveImage}
                        />

                        <AddressForm
                            addressSearch={addressSearch}
                            addressDetail={addressDetail}
                            onAddressSearchChange={setAddressSearch}
                            onAddressDetailChange={setAddressDetail}
                        />

                        <ScheduleSelector
                            currentDate={currentDate}
                            selectedDate={selectedDate}
                            selectedTime={selectedTime}
                            onDateChange={setSelectedDate}
                            onTimeChange={setSelectedTime}
                            onMonthChange={handleMonthChange}
                        />

                        <BudgetSelector value={budget} onChange={setBudget} />
                    </div>

                    <OrderSummary
                        basePrice={basePrice}
                        serviceFee={serviceFee}
                        finalTotal={finalTotal}
                        selectedPaymentMethod={selectedPaymentMethod}
                        onSelectPaymentClick={() => {
                            setTempSelectedPayment(selectedPaymentMethod);
                            setShowPaymentModal(true);
                        }}
                        onSubmit={handleSubmit}
                        formattedPrice={formattedPrice}
                    />
                </div>
            </div>

            <PaymentMethodModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                paymentMethods={paymentMethods}
                tempSelectedPayment={tempSelectedPayment}
                onSelectTempPayment={setTempSelectedPayment}
                onConfirmSelection={handleConfirmPaymentMethod}
                formattedPrice={formattedPrice}
            />
        </div>
    );
};

export default BookingFormBusiness;
