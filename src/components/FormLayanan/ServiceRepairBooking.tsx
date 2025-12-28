import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { ServiceRepairBookingProps, PaymentMethod } from './types';
import { paymentMethods } from './constants';
import { ProblemSelector } from './ProblemSelector';
import { ConsultationBanner } from './ConsultationBanner';
import { ProblemDescription } from './ProblemDescription';
import { ScheduleForm } from './ScheduleForm';
import { AddressForm } from './AddressForm';
import { PhotoUpload } from './PhotoUpload';
import { OrderSummary } from './OrderSummary';
import { PaymentMethodModal } from './PaymentMethodModal';

const ServiceRepairBooking: React.FC<ServiceRepairBookingProps> = ({ switchView, selectedServiceType }) => {
    // Selection State
    const [selectedProblem, setSelectedProblem] = useState<string | null>(null);

    // Form State
    const [description, setDescription] = useState('');
    const [addressDetails, setAddressDetails] = useState('');
    const [images, setImages] = useState<File[]>([]);

    // Date & Time Logic
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
    const [showAddress, setShowAddress] = useState(false);

    // Payment State
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [tempSelectedPayment, setTempSelectedPayment] = useState<PaymentMethod | null>(null);

    // Helpers
    const handleMonthChange = (direction: 'prev' | 'next') => {
        if (direction === 'prev') {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        } else {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        }
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

    const handleSubmit = () => {
        alert("Pesanan Perbaikan Berhasil Dikirim! (Simulasi)");
        switchView('home');
    }

    // Pricing
    const basePrice = 0;
    const serviceFee = 5000;
    const finalTotal = basePrice + serviceFee;

    const formattedPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-32 md:pb-12 animate-fade-in">
            {/* Header (Breadcrumb Style) */}
            <div className="bg-white border-b border-gray-200 py-4 px-6 md:px-12 sticky top-0 z-40 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3 text-sm md:text-base">
                    <div className="flex items-center gap-2 text-gray-500">
                        <span className="cursor-pointer hover:text-blue-600" onClick={() => switchView('home')}>Home</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="cursor-pointer hover:text-blue-600" onClick={() => switchView('repair-service-selection')}>Pilih Layanan</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="font-bold text-gray-900">Form Pemesanan</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-5xl px-4 py-6">

                {/* Section 1: Problem Selection */}
                <ProblemSelector
                    selectedServiceType={selectedServiceType}
                    selectedProblem={selectedProblem}
                    onSelectProblem={setSelectedProblem}
                />

                {/* Section 2: Form */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Form Area */}
                    <div className="flex-1 space-y-6">

                        <ConsultationBanner onChatWA={handleChatWA} />

                        <ProblemDescription
                            value={description}
                            onChange={setDescription}
                        />

                        <ScheduleForm
                            currentDate={currentDate}
                            selectedDate={selectedDate}
                            selectedTimeSlot={selectedTimeSlot}
                            onDateChange={setSelectedDate}
                            onTimeChange={setSelectedTimeSlot}
                            onMonthChange={handleMonthChange}
                        />

                        <AddressForm
                            addressDetails={addressDetails}
                            showAddress={showAddress}
                            onToggleShowAddress={() => setShowAddress(!showAddress)}
                            onAddressChange={setAddressDetails}
                        />

                        <PhotoUpload
                            images={images}
                            onImagesChange={setImages}
                            onRemoveImage={(index) => setImages(prev => prev.filter((_, i) => i !== index))}
                        />

                    </div>

                    {/* Sidebar / Summary */}
                    <OrderSummary
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

            {/* Payment Method Modal */}
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
}

export default ServiceRepairBooking;
