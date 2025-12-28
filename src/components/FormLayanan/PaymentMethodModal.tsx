import React from 'react';
import { X } from 'lucide-react';
import { PaymentMethod } from './types';

interface PaymentMethodModalProps {
    isOpen: boolean;
    onClose: () => void;
    paymentMethods: PaymentMethod[];
    tempSelectedPayment: PaymentMethod | null;
    onSelectTempPayment: (method: PaymentMethod) => void;
    onConfirmSelection: () => void;
    formattedPrice: (price: number) => string;
}

export const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
    isOpen,
    onClose,
    paymentMethods,
    tempSelectedPayment,
    onSelectTempPayment,
    onConfirmSelection,
    formattedPrice,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <h3 className="text-xl font-bold text-gray-900">Pilih Metode Pembayaran</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
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
                                    onClick={() => onSelectTempPayment(method)}
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
                                    onClick={() => onSelectTempPayment(method)}
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
                        onClick={onConfirmSelection}
                        disabled={!tempSelectedPayment}
                        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${tempSelectedPayment ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'}`}
                    >
                        Pilih Metode Pembayaran
                    </button>
                </div>
            </div>
        </div>
    );
};
