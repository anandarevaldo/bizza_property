import React, { useState, useRef } from 'react';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { BookingFormHandymanProps, SelectedHandyman, PaymentMethod } from './types';
import { MaterialPreview } from './MaterialPreview';
import { ProblemDescription } from './ProblemDescription';
import { HandymanList } from './HandymanList';
import { PhotoUpload } from './PhotoUpload';
import { ScheduleForm } from './ScheduleForm';
import { AddressForm } from './AddressForm';
import { OrderSummary } from './OrderSummary';
import { AddHandymanModal } from './AddHandymanModal';
import { PaymentMethodModal } from './PaymentMethodModal';
import { handymanTypes } from './handymanData';
import { supabase } from '../../lib/supabaseClient';
import { orderService } from '../../lib/services/orderService';

const BookingFormHandyman: React.FC<BookingFormHandymanProps> = ({ switchView, selectedHandymanType: initialHandymanType, selectedMaterials = [], onUpdateMaterials }) => {
    // State
    const [selectedHandymen, setSelectedHandymen] = useState<SelectedHandyman[]>([
        { id: Date.now(), type: initialHandymanType || '', quantity: 1, shift: 'seharian' }
    ]);
    const [description, setDescription] = useState('');
    const [images, setImages] = useState<File[]>([]);

    // Date & Time
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

    // Address
    const [showAddress, setShowAddress] = useState(false);
    const [addressDetails, setAddressDetails] = useState('');

    // Modals
    const [showAddHandymanModal, setShowAddHandymanModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // Payment
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>({
        id: 'qris',
        name: 'QRIS',
        type: 'ewallet',
        icon: '/images/qris.png'
    });
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Pricing
    const prices: Record<string, number> = {
        seharian: 259000,
        pagi: 199000,
        sore: 199000
    };

    // Derived State
    const totalPrice = selectedHandymen.reduce((acc, curr) => {
        const pricePerUnit = prices[curr.shift] || 0;
        return acc + (pricePerUnit * curr.quantity);
    }, 0);
    const totalMaterialPrice = selectedMaterials.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const serviceFee = 5000;
    const finalTotal = totalPrice + serviceFee + totalMaterialPrice;

    const formattedPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
    };

    const handleUpdateHandyman = (index: number, field: keyof SelectedHandyman, value: any) => {
        const newHandymen = [...selectedHandymen];
        newHandymen[index] = { ...newHandymen[index], [field]: value };
        setSelectedHandymen(newHandymen);
    };

    const handleRemoveHandyman = (index: number) => {
        const newHandymen = selectedHandymen.filter((_, i) => i !== index);
        setSelectedHandymen(newHandymen);
    };

    const handleAddHandyman = (name: string) => {
        setSelectedHandymen(prev => [...prev, { id: Date.now(), type: name, quantity: 1, shift: 'seharian' }]);
        setShowAddHandymanModal(false);
    };

    const handleConfirmPaymentMethod = (proofFile: File | null) => {
        if (proofFile) {
            setPaymentProof(proofFile);
            setShowPaymentModal(false);
        }
    };

    const handleSubmit = async () => {
        if (!addressDetails) {
            alert('Mohon isi alamat survey.');
            return;
        }

        if (!paymentProof) {
            alert('Mohon lakukan pembayaran dan upload bukti transfer terlebih dahulu.');
            setShowPaymentModal(true);
            return;
        }

        try {
            setIsLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert("Anda harus login untuk membuat pesanan.");
                return;
            }

            // Create Order
            const order = await orderService.createOrder({
                userId: user.id,
                customerName: user.user_metadata?.full_name || 'Anonymous',
                tipe_pesanan: 'Tukang',
                propertyType: selectedHandymen.map(h => h.type).join(', '),
                description: `Tukang: ${selectedHandymen.map(h => `${h.type} (${h.quantity})`).join(', ')}. Detail: ${description}`,
                address: addressDetails,
                budget: finalTotal.toString(),
                selectedDate: selectedDate?.toISOString() || new Date().toISOString(),
                selectedTime: selectedTimeSlot || '',
                paymentMethod: 'QRIS'
            });

            if (order) {
                // Upload Proof
                const proofUrl = await orderService.uploadOrderImage(paymentProof, order.pesanan_id.toString(), user.id);
                await orderService.createDocumentation(order.pesanan_id, user.id, proofUrl, 'Bukti Pembayaran QRIS');

                alert("Pesanan Tukang Berhasil! Kami akan segera memverifikasi pembayaran Anda.");
                switchView('home');
            }
        } catch (error) {
            console.error(error);
            alert("Gagal membuat pesanan.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleMonthChange = (direction: 'prev' | 'next') => {
        if (direction === 'prev') {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        } else {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans animate-fade-in pb-32 md:pb-12">
            {/* Header (Breadcrumb Style) */}
            <div className="bg-white border-b border-gray-200 py-4 px-6 md:px-12 sticky top-0 z-40 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3 text-sm md:text-base">
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
                        <MaterialPreview
                            selectedMaterials={selectedMaterials}
                            onUpdateMaterials={onUpdateMaterials}
                            switchView={switchView}
                        />

                        <ProblemDescription
                            value={description}
                            onChange={setDescription}
                        />

                        <HandymanList
                            selectedHandymen={selectedHandymen}
                            handymanTypes={handymanTypes}
                            onUpdateHandyman={handleUpdateHandyman}
                            onRemoveHandyman={handleRemoveHandyman}
                            onAddHandymanClick={() => setShowAddHandymanModal(true)}
                        />

                        <PhotoUpload
                            images={images}
                            onImagesChange={setImages}
                            onRemoveImage={(index) => setImages(prev => prev.filter((_, i) => i !== index))}
                        />

                        <div className="space-y-4">
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
                        </div>
                    </div>

                    {/* Right Column: Sticky Summary & Action */}
                    <OrderSummary
                        totalPrice={totalPrice}
                        serviceFee={serviceFee}
                        totalMaterialPrice={totalMaterialPrice}
                        finalTotal={finalTotal}
                        selectedMaterialsCount={selectedMaterials.length}
                        selectedPaymentMethod={selectedPaymentMethod}
                        onSelectPaymentClick={() => {
                            setShowPaymentModal(true);
                        }}
                        onSubmit={handleSubmit}
                        formattedPrice={formattedPrice}
                        isLoading={isLoading}
                    />
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

            <AddHandymanModal
                isOpen={showAddHandymanModal}
                onClose={() => setShowAddHandymanModal(false)}
                handymanTypes={handymanTypes}
                selectedHandymanTypes={selectedHandymen.map(h => h.type)}
                onAddHandyman={handleAddHandyman}
            />

            <PaymentMethodModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onConfirmSelection={handleConfirmPaymentMethod}
                formattedPrice={formattedPrice}
            />
        </div>
    );
};

export default BookingFormHandyman;
