
import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Upload, FileText, Briefcase, CheckCircle, Clock, XCircle, AlertCircle, User } from 'lucide-react';

interface RABItem {
    id: string;
    name: string;
    qty: number;
    price: number;
}

interface RAB {
    id: string;
    project: string;
    date: string;
    total: number;
    status: string;
    notes: string;
}

interface RABDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    rab: RAB | null;
    onSave: (updatedRAB: RAB) => void;
}

export const RABDetailModal: React.FC<RABDetailModalProps> = ({ isOpen, onClose, rab, onSave }) => {
    const [items, setItems] = useState<RABItem[]>([
        { id: '1', name: 'Semen Tiga Roda', qty: 10, price: 65000 },
        { id: '2', name: 'Pasir Beton', qty: 1, price: 350000 },
    ]);
    const [receipts, setReceipts] = useState<string[]>([]);
    const [dragActive, setDragActive] = useState(false);

    // Initial load logic could be added here to populate items from rab prop if needed
    // For now we keep the mock items as per original code

    if (!isOpen || !rab) return null;

    const handleAddItem = () => {
        setItems([...items, { id: Math.random().toString(), name: '', qty: 1, price: 0 }]);
    };

    const handleUpdateItem = (id: string, field: keyof RABItem, value: any) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const handleDeleteItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const totalCalculated = items.reduce((acc, item) => acc + (item.qty * item.price), 0);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const newFiles = Array.from(e.dataTransfer.files).map(file => URL.createObjectURL(file));
            setReceipts(prev => [...prev, ...newFiles]);
        }
    };

    const handleSave = () => {
        if (!rab) return;

        const updatedRAB = {
            ...rab,
            total: totalCalculated, // Update total based on items
        };

        onSave(updatedRAB);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in font-sans">
            <div className="bg-white rounded-[2.5rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up border border-gray-100 custom-scrollbar">

                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-gray-100 sticky top-0 bg-white z-20">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900">Detail RAB</h2>
                        </div>
                        <p className="text-gray-500 font-medium text-sm ml-1">ID RAB: <span className="text-gray-900 font-bold">{rab.id}</span></p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors group"
                    >
                        <X className="w-6 h-6 text-gray-400 group-hover:text-gray-600" />
                    </button>
                </div>

                <div className="p-8 space-y-8">

                    {/* Project/Client Info */}
                    <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" />
                            Informasi Proyek
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nama Proyek</p>
                                <p className="font-bold text-gray-900 text-lg">{rab.project}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tanggal Pengajuan</p>
                                <p className="font-bold text-gray-900 text-lg">{rab.date}</p>
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                    <FileText className="w-3 h-3" /> Catatan
                                </p>
                                <p className="font-medium text-gray-600 italic">"{rab.notes || 'Tidak ada catatan khusus'}"</p>
                            </div>
                        </div>
                    </div>

                    {/* Content: RAB Items */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-blue-600" />
                                Rincian Belanja
                            </h3>
                            <button onClick={handleAddItem} className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                                <Plus className="w-3.5 h-3.5" /> Item Baru
                            </button>
                        </div>

                        <div className="space-y-3">
                            {items.map((item, index) => (
                                <div key={item.id} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-[10px] shrink-0">
                                        {index + 1}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Nama Barang"
                                        value={item.name}
                                        onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                                        className="flex-1 p-2 rounded-lg bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 font-medium text-sm transition-all"
                                    />
                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <input
                                            type="number"
                                            placeholder="Qty"
                                            value={item.qty}
                                            onChange={(e) => handleUpdateItem(item.id, 'qty', Number(e.target.value))}
                                            className="w-16 p-2 rounded-lg bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 font-bold text-sm text-center transition-all"
                                        />
                                        <div className="relative w-full sm:w-32">
                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] font-bold">Rp</span>
                                            <input
                                                type="number"
                                                placeholder="Harga"
                                                value={item.price}
                                                onChange={(e) => handleUpdateItem(item.id, 'price', Number(e.target.value))}
                                                className="w-full pl-6 p-2 rounded-lg bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 font-bold text-sm text-right transition-all"
                                            />
                                        </div>
                                        <button
                                            onClick={() => handleDeleteItem(item.id)}
                                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Total Summary */}
                        <div className="mt-6 flex justify-between items-center bg-blue-600 text-white p-6 rounded-2xl shadow-lg shadow-blue-200">
                            <span className="font-medium opacity-80">Total Estimasi Biaya</span>
                            <span className="text-2xl font-black tracking-tight">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalCalculated)}
                            </span>
                        </div>
                    </div>

                    {/* Upload Receipts */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Upload className="w-5 h-5 text-purple-600" />
                            Bukti / Nota
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Upload Button */}
                            <div
                                className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-4 min-h-[120px] transition-all cursor-pointer relative
                                ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <Upload className="w-6 h-6 text-gray-400 mb-2" />
                                <p className="text-xs font-bold text-gray-500">Upload Nota</p>
                                <input
                                    type="file"
                                    multiple
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            const newFiles = Array.from(e.target.files).map(file => URL.createObjectURL(file));
                                            setReceipts(prev => [...prev, ...newFiles]);
                                        }
                                    }}
                                />
                            </div>

                            {/* Previews */}
                            {receipts.map((receipt, i) => (
                                <div key={i} className="group relative aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
                                    <img src={receipt} alt={`Receipt ${i + 1}`} className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => setReceipts(prev => prev.filter((_, idx) => idx !== i))}
                                        className="absolute top-2 right-2 p-1 bg-white/90 rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Footer Action Buttons */}
                <div className="flex gap-4 p-8 border-t border-gray-100 bg-white sticky bottom-0 z-20">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-colors"
                    >
                        Tutup
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                    >
                        Simpan Perubahan
                    </button>
                </div>
            </div>
        </div>
    );
};
