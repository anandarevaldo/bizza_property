import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { ServiceRepairBookingProps, PaymentMethod } from './types';
import { problemTypesMap } from './constants';
import { ProblemSelector } from './ProblemSelector';
import { ConsultationBanner } from './ConsultationBanner';
import { ProblemDescription } from './ProblemDescription';
import { ScheduleForm } from './ScheduleForm';
import { AddressSelector } from '../FormRumah/AddressSelector';
import { PhotoUpload } from './PhotoUpload';
import { OrderSummary } from './OrderSummary';
import { PaymentMethodModal } from './PaymentMethodModal';
import { supabase } from '../../lib/supabaseClient';
import { orderService } from '../../lib/services/orderService';

// Shared Handyman Components
import { HandymanList } from '../FormTukang/HandymanList';
import { handymanTypes } from '../FormTukang/handymanData';
import { SelectedHandyman } from '../FormTukang/types';

const ServiceRepairBooking: React.FC<ServiceRepairBookingProps> = ({ switchView, selectedServiceType }) => {
    // Selection State
    const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
    const [selectedHandymen, setSelectedHandymen] = useState<SelectedHandyman[]>([]);

    // Form State
    const [description, setDescription] = useState('');
    const [addressSearch, setAddressSearch] = useState('');
    const [addressDetails, setAddressDetails] = useState('');
    const [images, setImages] = useState<File[]>([]);

    // Date & Time Logic
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
    // const [showAddress, setShowAddress] = useState(false); // Removed

    // Payment State
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>({
        id: 'qris',
        name: 'QRIS',
        type: 'ewallet',
        icon: '/images/qris.png'
    });
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Photo Upload Handlers
    const handleImagesChange = (newImages: File[]) => {
        setImages((prevImages) => {
            const combinedImages = [...prevImages, ...newImages];
            return combinedImages.slice(0, 10);
        });
    };

    const removeImage = (index: number) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    // Logic: Smart Select Handyman based on Problem
    const handleSelectProblem = (problemId: string) => {
        setSelectedProblem(problemId);

        const problems = problemTypesMap[selectedServiceType || 'default'] || problemTypesMap['default'];
        const problem = problems.find(p => p.id === problemId);

        if (problem) {
            const newHandymen: SelectedHandyman[] = [];

            // Add Main Handyman
            if (problem.handymanType) {
                newHandymen.push({
                    id: Date.now(),
                    type: problem.handymanType,
                    quantity: 1,
                    shift: 'seharian'
                });
            }

            // Add Kenek if recommended
            if (problem.needsKenek) {
                newHandymen.push({
                    id: Date.now() + 1,
                    type: 'Kenek',
                    quantity: 1,
                    shift: 'seharian'
                });
            }

            setSelectedHandymen(newHandymen);
        }
    };

    // Handyman List Handlers
    const handleUpdateHandyman = (index: number, field: keyof SelectedHandyman, value: any) => {
        const updated = [...selectedHandymen];
        updated[index] = { ...updated[index], [field]: value };
        setSelectedHandymen(updated);
    };

    const handleRemoveHandyman = (index: number) => {
        setSelectedHandymen(prev => prev.filter((_, i) => i !== index));
    };

    const handleAddHandyman = () => {
        // Default to 'Tukang Bangunan' or generic if adding manually, user can change it?
        // For simplicity, adding a generic one, or we could open a modal.
        // Re-using logic: just add a placeholder for now or duplicating first type.
        // Let's add a default 'Tukang Bangunan'
        setSelectedHandymen([
            ...selectedHandymen,
            { id: Date.now(), type: 'Tukang Bangunan', quantity: 1, shift: 'seharian' }
        ]);
        // Ideally we should show a modal to select the type, but let's keep it simple for this concise refactor
        // Or trigger a view/modal. For now, adding default.
    };

    // Helpers
    const handleMonthChange = (direction: 'prev' | 'next') => {
        if (direction === 'prev') {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        } else {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        }
    };

    const handleConfirmPaymentMethod = (proofFile: File | null) => {
        if (proofFile) {
            setPaymentProof(proofFile);
            setShowPaymentModal(false);
        }
    };

    const handleChatWA = () => {
        const phoneNumber = '628123456789';
        const message = encodeURIComponent('Halo Admin, saya bingung dengan masalah perbaikan rumah saya...');
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    };

    const handleSubmit = async () => {
        if (!selectedProblem || selectedHandymen.length === 0) {
            alert("Mohon pilih masalah dan pastikan tukang terpilih.");
            return;
        }
        if (!addressSearch) {
            alert("Mohon isi alamat survey.");
            return;
        }
        if (!paymentProof) {
            alert("Mohon upload bukti pembayaran QRIS terlebih dahulu.");
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

            // Get problem title
            const problems = selectedServiceType ? (problemTypesMap as any)[selectedServiceType] : [];
            const problemTitle = selectedProblem ? (problems as any[]).find(p => p.id === selectedProblem)?.title : 'Unknown';

            // Create Order
            const order = await orderService.createOrder({
                userId: user.id,
                customerName: user.user_metadata?.full_name || 'Anonymous',
                tipe_pesanan: 'Layanan',
                propertyType: selectedServiceType || 'Unknown',
                description: `Masalah: ${problemTitle}. Detail: ${description}`,
                address: addressSearch + (addressDetails ? `, ${addressDetails}` : ''),
                budget: finalTotal.toString(),
                selectedDate: selectedDate ? selectedDate.toISOString() : new Date().toISOString(),
                selectedTime: selectedTimeSlot || '',
                paymentMethod: 'CASH',
                kategori_layanan: 'Jasa Tukang'
            });

            if (order) {
                // Upload Proof
                const proofUrl = await orderService.uploadOrderImage(paymentProof, order.pesanan_id.toString(), user.id);
                await orderService.createDocumentation(order.pesanan_id, user.id, proofUrl, 'Bukti Pembayaran QRIS');

                alert("Pesanan Perbaikan Berhasil Dikirim! Kami akan segera memverifikasi pembayaran Anda.");
                switchView('home');
            }
        } catch (error) {
            console.error(error);
            alert("Gagal membuat pesanan.");
        } finally {
            setIsLoading(false);
        }
    };

    // Pricing Logic (Dynamic based on selected handymen)
    const calculateTotal = () => {
        let total = 0;
        selectedHandymen.forEach(h => {
            let price = 0;
            if (h.shift === 'seharian') price = 200000; // Base rate sim
            if (h.shift === 'pagi') price = 150000;
            if (h.shift === 'sore') price = 150000;
            // Adjust price by type? For now flat rate simulation
            total += price * h.quantity;
        });
        return total;
    };

    const basePrice = calculateTotal();
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
                    onSelectProblem={handleSelectProblem}
                />

                {/* Section 2: Form */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Form Area */}
                    <div className="flex-1 space-y-6">

                        {/* Handyman List Visualization */}
                        {selectedHandymen.length > 0 && (
                            <HandymanList
                                selectedHandymen={selectedHandymen}
                                handymanTypes={handymanTypes}
                                onUpdateHandyman={handleUpdateHandyman}
                                onRemoveHandyman={handleRemoveHandyman}
                                onAddHandymanClick={handleAddHandyman}
                            />
                        )}

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

                        <AddressSelector
                            addressSearch={addressSearch}
                            onAddressSearchChange={setAddressSearch}
                            addressDetail={addressDetails}
                            onAddressDetailChange={setAddressDetails}
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
                            setShowPaymentModal(true);
                        }}
                        onSubmit={handleSubmit}
                        formattedPrice={formattedPrice}
                        isLoading={isLoading}
                    />

                </div>
            </div>

            {/* Payment Method Modal */}
            <PaymentMethodModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onConfirmSelection={handleConfirmPaymentMethod}
                formattedPrice={formattedPrice}
            />
        </div>
    );
}

export default ServiceRepairBooking;
