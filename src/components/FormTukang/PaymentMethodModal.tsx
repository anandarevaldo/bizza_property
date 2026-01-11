import React, { useState, useRef } from 'react';
import { X, Upload, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { PaymentMethod } from './types';

interface PaymentMethodModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirmSelection: (proofFile: File | null) => void;
    formattedPrice: (price: number) => string;
}

export const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
    isOpen,
    onClose,
    onConfirmSelection,
    formattedPrice,
}) => {
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPaymentProof(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleConfirm = () => {
        if (paymentProof) {
            onConfirmSelection(paymentProof);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md max-h-[95vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <div>
                        <h3 className="text-xl font-black text-gray-900">Pembayaran QRIS</h3>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Scan & Upload Bukti Tukang</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-400 font-bold" />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                    {/* QR Code Section */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-full aspect-square max-w-[280px] bg-white border-4 border-gray-50 rounded-[2rem] p-6 shadow-inner mb-6 relative group">
                            <img 
                                src="/images/qris.png" 
                                alt="QRIS Code" 
                                className="w-full h-full object-contain"
                            />
                            <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.8rem] flex items-center justify-center pointer-events-none">
                                <span className="text-blue-600 font-black text-xs uppercase tracking-tighter">Scan untuk Membayar</span>
                            </div>
                        </div>
                        <div className="text-center space-y-2">
                            <h4 className="text-lg font-black text-gray-900">Scan QRIS BIZZA</h4>
                            <p className="text-sm text-gray-500 font-medium px-4">Buka aplikasi mobile banking atau e-wallet (GoPay, OVO, DANA, dll) untuk memindai kode di atas.</p>
                        </div>
                    </div>

                    {/* Upload Section */}
                    <div className="space-y-4">
                        <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">Bukti Pembayaran</label>
                        {!paymentProof ? (
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="border-3 border-dashed border-gray-100 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-3 bg-gray-50/50 hover:bg-blue-50/50 hover:border-blue-200 cursor-pointer transition-all group"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors">
                                    <Upload className="w-8 h-8" />
                                </div>
                                <div className="text-center">
                                    <p className="font-black text-gray-900 text-sm">Upload Bukti Transfer</p>
                                    <p className="text-xs text-gray-400 font-bold mt-1">Format: JPG, PNG (Maks 5MB)</p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative rounded-[2rem] overflow-hidden border-2 border-blue-100 bg-blue-50/30 p-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-blue-100">
                                        <img src={previewUrl!} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-gray-900 text-sm truncate">{paymentProof.name}</p>
                                        <div className="flex items-center gap-1.5 text-blue-600">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span className="text-xs font-black uppercase tracking-wider text-blue-500">Berhasil dipilih</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            setPaymentProof(null);
                                            setPreviewUrl(null);
                                        }}
                                        className="p-2 hover:bg-white rounded-full transition-colors text-red-400 hover:text-red-500"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                </div>

                <div className="p-8 border-t border-gray-100 bg-white">
                    <button
                        onClick={handleConfirm}
                        disabled={!paymentProof}
                        className={`w-full py-5 rounded-[1.5rem] font-black text-lg transition-all shadow-xl flex items-center justify-center gap-3 ${
                            paymentProof 
                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-1' 
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none font-bold'
                        }`}
                    >
                        {paymentProof && <ImageIcon className="w-5 h-5" />}
                        Konfirmasi Pembayaran
                    </button>
                </div>
            </div>
        </div>
    );
};
