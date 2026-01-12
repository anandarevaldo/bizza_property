import React, { useState } from 'react';
import { ChevronRight, Building } from 'lucide-react';
import { BookingFormProps, PaymentMethod } from './types';
import { PropertyTypeSelector } from './PropertyTypeSelector';
import { ProblemDescription } from './ProblemDescription';
import { PhotoUpload } from './PhotoUpload';
import { AddressSelector } from './AddressSelector';
import { ScheduleForm } from './ScheduleForm';
import { BudgetSelector } from './BudgetSelector';
import { OrderSummary } from './OrderSummary';
import { PaymentMethodModal } from './PaymentMethodModal';
// import { createHouseOrder } from '../../lib/actions/order';
import { orderService } from '../../lib/services/orderService';
import { supabase } from '../../lib/supabaseClient';

const BookingForm: React.FC<BookingFormProps> = ({ switchView }) => {
    // State Management
    const [propertyType, setPropertyType] = useState('Rumah');
    const [description, setDescription] = useState('');
    const [addressSearch, setAddressSearch] = useState('');
    const [addressDetail, setAddressDetail] = useState('');
    const [budget, setBudget] = useState('');
    const [orderCode, setOrderCode] = useState('');

    // Date & Time State
    const [currentDate, setCurrentDate] = useState(new Date()); // For calendar navigation
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const [images, setImages] = useState<File[]>([]);

    // Payment Logic
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>({
        id: 'qris',
        name: 'QRIS',
        type: 'ewallet',
        icon: '/images/qris.png'
    });
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleImagesChange = (newImages: File[]) => {
        setImages((prevImages) => {
            const combinedImages = [...prevImages, ...newImages];
            // Limit to 10 images
            return combinedImages.slice(0, 10);
        });
    };

    const removeImage = (index: number) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleConfirmPaymentMethod = (proofFile: File | null) => {
        if (proofFile) {
            setPaymentProof(proofFile);
            setShowPaymentModal(false);
        }
    };

    const handleSubmit = async () => {
        if (!description || !addressSearch || !selectedDate || !selectedTime || !budget) {
            alert('Mohon lengkapi semua data wajib (*) sebelum melanjutkan.');
            return;
        }
        if (!paymentProof) {
            alert('Mohon lakukan pembayaran dan upload bukti transfer terlebih dahulu.');
            setShowPaymentModal(true);
            return;
        }

        try {
            setIsLoading(true);

            // 1. Get Current User
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                alert('Anda harus login terlebih dahulu untuk membuat pesanan.');
                return;
            }

            // 2. Prepare Data
            const fullAddress = `${addressSearch}, ${addressDetail}`;

            // 3. Create Order (Client Side)
            const order = await orderService.createOrder({
                userId: user.id,
                customerName: user.user_metadata?.full_name || 'Anonymous',
                tipe_pesanan: 'Rumah',
                propertyType,
                description,
                address: fullAddress,
                budget,
                selectedDate: selectedDate ? selectedDate.toISOString() : new Date().toISOString(),
                selectedTime: selectedTime || '',
                paymentMethod: 'QRIS',
                kategori_layanan: 'Borongan'
            });

            if (!order) throw new Error('Gagal membuat pesanan.');

            // 4. Upload Problem Images
            for (const image of images) {
                if (image.size > 0) {
                    const publicUrl = await orderService.uploadOrderImage(image, order.pesanan_id.toString(), user.id);
                    await orderService.createDocumentation(order.pesanan_id, user.id, publicUrl);
                }
            }

            // 5. Upload Payment Proof
            if (paymentProof) {
                const proofUrl = await orderService.uploadOrderImage(paymentProof, order.pesanan_id.toString(), user.id);
                // Save to Documentation (Legacy/Backup)
                await orderService.createDocumentation(order.pesanan_id, user.id, proofUrl, 'Bukti Pembayaran QRIS');
                // Save to Orders Table (Main)
                await orderService.updateOrder(order.pesanan_id, { payment_proof: proofUrl });
            }

            alert('Pesanan berhasil dibuat! Kami akan segera memverifikasi pembayaran Anda.');
            switchView('home');

        } catch (error: any) {
            console.error('Submission error:', error);
            alert(`Gagal membuat pesanan: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestSurvey = () => {
        if (!budget) {
            alert('Mohon pilih range budget terlebih dahulu.');
            return;
        }

        // Simulating sending data to server/Mandor
        localStorage.setItem('srv_simulation_budget', budget);
        console.log('Survey Requested with Budget:', budget);

        alert('Permintaan survey berhasil dikirim ke Mandor! Data estimasi budget telah tersimpan.');
        switchView('home');
    };

    const formattedPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
    };

    // Pricing Constants
    const basePrice = 100000;
    const serviceFee = 5000;
    const finalTotal = basePrice + serviceFee;

    return (
        <div className="min-h-screen bg-gray-50 font-sans animate-fade-in pb-20">
            {/* Header (Breadcrumb Style) */}
            <div className="bg-white border-b border-gray-200 py-4 px-6 md:px-12 sticky top-0 z-40 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3 text-sm md:text-base">

                    <div className="flex items-center gap-2 text-gray-500">
                        <span className="cursor-pointer hover:text-blue-600" onClick={() => switchView('home')}>Home</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="font-bold text-gray-900">Form Pemesanan</span>
                    </div>
                </div>
                <button
                    onClick={() => switchView('booking-form-business')}
                    className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-bold transition-colors text-xs hover:bg-blue-100"
                >
                    <Building className="w-4 h-4" />
                    Untuk Bisnis?
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
                                    <h2 className="text-2xl font-bold mb-2">Solusi Perbaikan untuk Rumahmu</h2>
                                    <p className="text-blue-100">Mohon isi masalah yang butuh perbaikan secara detail agar kami bisa membantu dengan tepat.</p>
                                </div>
                                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                            </div>
                        </div>

                        <PropertyTypeSelector
                            selectedType={propertyType}
                            onSelect={setPropertyType}
                        />

                        <ProblemDescription
                            value={description}
                            onChange={setDescription}
                        />

                        <PhotoUpload
                            images={images}
                            onImagesChange={handleImagesChange}
                            onRemoveImage={removeImage}
                        />

                        <AddressSelector
                            addressSearch={addressSearch}
                            onAddressSearchChange={setAddressSearch}
                            addressDetail={addressDetail}
                            onAddressDetailChange={setAddressDetail}
                        />

                        <ScheduleForm
                            currentDate={currentDate}
                            selectedDate={selectedDate}
                            selectedTime={selectedTime}
                            onDateSelect={setSelectedDate}
                            onTimeSelect={setSelectedTime}
                            onPrevMonth={handlePrevMonth}
                            onNextMonth={handleNextMonth}
                        />

                        <BudgetSelector
                            value={budget}
                            onChange={setBudget}
                        />
                    </div>

                    {/* Right Column: Sticky Summary & Action */}
                    <OrderSummary
                        basePrice={basePrice}
                        serviceFee={serviceFee}
                        finalTotal={finalTotal}
                        selectedPaymentMethod={selectedPaymentMethod}
                        onSelectPaymentClick={() => {
                            setShowPaymentModal(true);
                        }}
                        onSubmit={handleSubmit}
                        onRequestSurvey={handleRequestSurvey}
                        formattedPrice={formattedPrice}
                        isLoading={isLoading}
                    />
                </div>
            </div>

            <PaymentMethodModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onConfirmSelection={handleConfirmPaymentMethod}
                formattedPrice={formattedPrice}
            />
        </div>
    );
};

export default BookingForm;
