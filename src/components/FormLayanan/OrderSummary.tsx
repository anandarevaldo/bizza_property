import React from 'react';
import { ChevronRight, Wallet } from 'lucide-react';
import { PaymentMethod } from './types';

interface OrderSummaryProps {
    serviceFee: number;
    finalTotal: number;
    selectedPaymentMethod: PaymentMethod | null;
    onSelectPaymentClick: () => void;
    onSubmit: () => void;
    formattedPrice: (price: number) => string;
    isLoading?: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
    serviceFee,
    finalTotal,
    selectedPaymentMethod,
    onSelectPaymentClick,
    onSubmit,
    formattedPrice,
    isLoading = false,
}) => {
    return (
        <div className="lg:w-[420px] shrink-0">
            <div className="sticky top-28 space-y-6">
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
                            <div
                                className="mb-6 bg-blue-50 p-4 rounded-2xl border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors flex items-center justify-between group"
                                onClick={onSelectPaymentClick}
                            >
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

                <button
                    onClick={onSubmit}
                    disabled={isLoading}
                    className={`w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 mt-6 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? 'Memproses...' : 'Bayar Sekarang'}
                </button>
            </div>
        </div>
    );
};
