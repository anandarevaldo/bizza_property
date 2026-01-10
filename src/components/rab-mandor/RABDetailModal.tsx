'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Upload, FileText, Briefcase, CheckCircle, Clock, XCircle, AlertCircle, User, DollarSign } from 'lucide-react';

import { RAB, RABItem, MandorExpense } from '@/lib/services/rabService';

interface RABDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    rab: RAB | null;
    onSave: (updatedRAB: RAB, items: RABItem[]) => void;
}

export const RABDetailModal: React.FC<RABDetailModalProps> = ({ isOpen, onClose, rab, onSave }) => {
    const [items, setItems] = useState<RABItem[]>([]);
    const [expenses, setExpenses] = useState<MandorExpense[]>([]);
    const [receipts, setReceipts] = useState<string[]>([]);
    const [dragActive, setDragActive] = useState(false);

    // Expense Form State
    const [showExpenseForm, setShowExpenseForm] = useState(false);
    const [newExpense, setNewExpense] = useState({ nama_barang: '', qty: 1, harga_satuan: 0 });

    useEffect(() => {
        if (rab?.items) setItems(rab.items);
        else setItems([]);

        // Load initial expenses
        if (rab?.expenses) setExpenses(rab.expenses);
        else setExpenses([]);
    }, [rab]);

    if (!isOpen || !rab) return null;

    const handleAddItem = () => {
        setItems([...items, { nama_item: '', qty: 1, harga_satuan: 0 }]);
    };

    const handleUpdateItem = (index: number, field: keyof RABItem, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const handleDeleteItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const totalCalculated = items.reduce((acc, item) => acc + (item.qty * item.harga_satuan), 0);

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

    const handleAddExpense = async () => {
        if (!rab || !newExpense.nama_barang) return;

        // Optimistic Update
        const tempExpense: MandorExpense = {
            rab_id: rab.rab_id,
            ...newExpense,
            // ID will be assigned by DB, used optimistic logic or reload
        };

        // Call Service to Save directly (assuming separate table, instant save)
        /* 
           Note: Ideally we should use the service here. But props 'onSave' is for RAB update.
           For Expense, we might want a direct service call since it's a sub-resource.
           Let's import rabService here or pass a handler. For now I'll use rabService directly.
        */
        try {
            const { rabService } = await import('@/lib/services/rabService');
            const saved = await rabService.addExpense(tempExpense);
            if (saved) {
                setExpenses([...expenses, saved]);
                setShowExpenseForm(false);
                setNewExpense({ nama_barang: '', qty: 1, harga_satuan: 0 });
            }
        } catch (error) {
            console.error("Failed to save expense", error);
            alert("Gagal menyimpan pengeluaran");
        }
    };

    const handleSave = () => {
        if (!rab) return;

        const updatedRAB: RAB = {
            ...rab,
            total_biaya: totalCalculated,
        };

        onSave(updatedRAB, items);
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
                        <p className="text-gray-500 font-medium text-sm ml-1">ID RAB: <span className="text-gray-900 font-bold">#{rab.rab_id}</span></p>
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
                                <p className="font-bold text-gray-900 text-lg">{rab.project_name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tanggal Pengajuan</p>
                                <p className="font-bold text-gray-900 text-lg">{rab.created_at ? new Date(rab.created_at).toLocaleDateString() : '-'}</p>
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                    <FileText className="w-3 h-3" /> Catatan
                                </p>
                                <p className="font-medium text-gray-600 italic">"{rab.catatan || 'Tidak ada catatan khusus'}"</p>
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
                                <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-[10px] shrink-0">
                                        {index + 1}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Nama Barang"
                                        value={item.nama_item}
                                        onChange={(e) => handleUpdateItem(index, 'nama_item', e.target.value)}
                                        className="flex-1 p-2 rounded-lg bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 font-medium text-sm transition-all"
                                    />
                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <input
                                            type="number"
                                            placeholder="Qty"
                                            value={item.qty}
                                            onChange={(e) => handleUpdateItem(index, 'qty', Number(e.target.value))}
                                            className="w-16 p-2 rounded-lg bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 font-bold text-sm text-center transition-all"
                                        />
                                        <div className="relative w-full sm:w-32">
                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] font-bold">Rp</span>
                                            <input
                                                type="number"
                                                placeholder="Harga"
                                                value={item.harga_satuan}
                                                onChange={(e) => handleUpdateItem(index, 'harga_satuan', Number(e.target.value))}
                                                className="w-full pl-6 p-2 rounded-lg bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 font-bold text-sm text-right transition-all"
                                            />
                                        </div>
                                        <button
                                            onClick={() => handleDeleteItem(index)}
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

                    {/* Actual Expenses Section */}
                    <div className="mt-8 bg-green-50/50 rounded-3xl p-6 border border-green-100/50">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-green-600" />
                                Pengeluaran Aktual (Belanja)
                            </h3>
                            <button
                                onClick={() => setShowExpenseForm(true)}
                                className="flex items-center gap-1 text-xs font-bold text-green-600 bg-white px-3 py-2 rounded-xl shadow-sm border border-green-100 hover:bg-green-50 hover:border-green-200 transition-all"
                            >
                                <Plus className="w-3.5 h-3.5" /> Catat Pengeluaran
                            </button>
                        </div>

                        {/* Add Expense Form (Inline) */}
                        {showExpenseForm && (
                            <div className="mb-6 bg-white p-4 rounded-2xl border border-green-200 shadow-sm animate-fade-in">
                                <h4 className="text-sm font-bold text-gray-700 mb-3">Catat Pengeluaran Baru</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3">
                                    <div className="sm:col-span-2">
                                        <input
                                            type="text"
                                            placeholder="Nama Barang / Keperluan"
                                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-green-500"
                                            value={newExpense.nama_barang}
                                            onChange={e => setNewExpense({ ...newExpense, nama_barang: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            placeholder="Qty"
                                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-green-500"
                                            value={newExpense.qty}
                                            onChange={e => setNewExpense({ ...newExpense, qty: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">Rp</span>
                                        <input
                                            type="number"
                                            placeholder="Harga Satuan"
                                            className="w-full pl-8 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-green-500"
                                            value={newExpense.harga_satuan}
                                            onChange={e => setNewExpense({ ...newExpense, harga_satuan: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setShowExpenseForm(false)}
                                        className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handleAddExpense}
                                        className="px-4 py-2 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-md shadow-green-200 transition-all"
                                    >
                                        Simpan Pengeluaran
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Expenses List */}
                        {expenses.length === 0 ? (
                            <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-gray-200/60">
                                <p className="text-gray-400 font-medium text-sm">Belum ada data pengeluaran aktual.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {expenses.map((expense, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-green-100 shadow-sm hover:shadow-md transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                                <DollarSign className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{expense.nama_barang}</p>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                                    <span className="bg-gray-100 px-2 py-0.5 rounded-lg">{expense.qty} unit</span>
                                                    <span>x</span>
                                                    <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(expense.harga_satuan)}</span>
                                                    {expense.created_at && (
                                                        <>
                                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                            <span>{new Date(expense.created_at).toLocaleDateString()}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-gray-900 text-lg">
                                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format((expense.qty * expense.harga_satuan))}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-4 pt-4 border-t border-green-100 flex justify-between items-center px-2">
                                    <span className="font-bold text-green-800 text-sm">Total Pengeluaran</span>
                                    <span className="font-black text-green-700 text-xl">
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(expenses.reduce((acc, curr) => acc + (curr.qty * curr.harga_satuan), 0))}
                                    </span>
                                </div>
                            </div>
                        )}
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
