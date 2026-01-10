'use client';

import React, { useState } from 'react';
import { Plus, CheckCircle, Clock, XCircle, FileText, DollarSign, Calendar, ChevronRight, AlertCircle } from 'lucide-react';
import { RABDetailModal } from './RABDetailModal';

import { rabService, RAB, RABItem } from '@/lib/services/rabService';
import { supabase } from '@/lib/supabaseClient';

export const RABList: React.FC = () => {
    const [rabs, setRabs] = useState<RAB[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({ project: '', total: '', notes: '' });

    // Detail Modal State
    const [selectedRAB, setSelectedRAB] = useState<RAB | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // New RAB Items State
    const [newItems, setNewItems] = useState<RABItem[]>([]);
    const [newItemInput, setNewItemInput] = useState<RABItem>({ nama_item: '', qty: 1, harga_satuan: 0 });

    const handleAddItem = () => {
        if (!newItemInput.nama_item) return;
        setNewItems([...newItems, newItemInput]);
        setNewItemInput({ nama_item: '', qty: 1, harga_satuan: 0 });

        // Update Total
        const currentTotal = [...newItems, newItemInput].reduce((acc, item) => acc + (item.qty * item.harga_satuan), 0);
        setFormData(prev => ({ ...prev, total: String(currentTotal) }));
    };

    const handleRemoveItem = (index: number) => {
        const updated = newItems.filter((_, i) => i !== index);
        setNewItems(updated);

        // Update Total
        const currentTotal = updated.reduce((acc, item) => acc + (item.qty * item.harga_satuan), 0);
        setFormData(prev => ({ ...prev, total: String(currentTotal) }));
    };

    // Fetch Data
    const fetchRABs = async () => {
        try {
            setIsLoading(true);
            setErrorMsg(null);
            const data = await rabService.getRABs();
            setRabs(data);
        } catch (error: any) {
            console.error("Error fetching RABs:", error);
            setErrorMsg(error.message || "Gagal memuat data RAB");
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchRABs();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Get current user (simple check, ideally use context)
            const { data: { user } } = await supabase.auth.getUser();

            // Note: In a real app we need to map Auth UID to Mandor ID.
            // For now we assume the seed/trigger handles linking or we look it up.
            // But since I don't have a direct 'getMandorId' handy without context,
            // I will optimistically create. 'data_mandor' table has 'user_id' which maps to auth.
            // But 'rab_order' needs 'mandor_id' (BigInt).

            // To properly Insert, I first need the Mandor ID.
            let mandorId = null;
            if (user) {
                const { data: mandorData } = await supabase
                    .from('data_mandor')
                    .select('mandor_id')
                    .eq('user_id', user.id)
                    .single();
                if (mandorData) mandorId = mandorData.mandor_id;
            }

            const newRAB: any = {
                project_name: formData.project,
                total_biaya: Number(formData.total),
                catatan: formData.notes,
                status_rab: 'MENUNGGU_PERSETUJUAN',
                mandor_id: mandorId // Use fetched ID or null
            };

            await rabService.createRAB(newRAB, newItems); // Pass newItems here!
            await fetchRABs();
            setIsFormOpen(false);
            setFormData({ project: '', total: '', notes: '' });
            setNewItems([]);
        } catch (err) {
            console.error("Failed to create RAB:", err);
            alert("Gagal membuat RAB. Pastikan Anda login sebagai Mandor.");
        }
    };

    const handleRowClick = (rab: RAB) => {
        setSelectedRAB(rab);
        setIsDetailModalOpen(true);
    };

    const handleUpdateRAB = async (updatedRAB: RAB, items: RABItem[]) => {
        try {
            await rabService.updateRAB(updatedRAB.rab_id, {
                total_biaya: updatedRAB.total_biaya,
                project_name: updatedRAB.project_name
                // other fields if needed
            }, items);
            await fetchRABs();
            setIsDetailModalOpen(false);
        } catch (err) {
            console.error("Error updating RAB:", err);
            alert("Gagal update RAB");
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'DISETUJUI': return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100' };
            case 'MENUNGGU_PERSETUJUAN': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' };
            case 'DITOLAK': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100' };
            default: return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-100' };
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'DISETUJUI': return CheckCircle;
            case 'MENUNGGU_PERSETUJUAN': return Clock;
            case 'DITOLAK': return XCircle;
            default: return AlertCircle;
        }
    };

    return (
        <div className="space-y-12 animate-fade-in font-sans">
            {/* Header */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-gray-100 border border-gray-100 relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-gray-900">Kelola RAB</h2>
                        </div>
                        <p className="text-gray-500 font-medium ml-1">Ajukan dan pantau status Rencana Anggaran Biaya proyek Anda.</p>
                    </div>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-1 flex items-center gap-3"
                    >
                        <Plus className="w-5 h-5" />
                        Ajukan RAB Baru
                    </button>
                </div>
            </div>

            {/* Form Modal */}
            {/* Error Message */}
            {errorMsg && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    <span>Error: {errorMsg}</span>
                </div>
            )}

            {isFormOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
                    <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-2xl shadow-2xl animate-scale-up border border-gray-100 relative overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                        <h3 className="text-3xl font-black text-gray-900 mb-6">Ajukan RAB Baru</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Project Name */}
                            <div>
                                <label className="block text-sm font-black text-gray-700 mb-2.5 uppercase tracking-wide">Nama Proyek</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-gray-900 placeholder:text-gray-400"
                                    value={formData.project}
                                    onChange={e => setFormData({ ...formData, project: e.target.value })}
                                    placeholder="Contoh: Renovasi Dapur Ibu Ani"
                                />
                            </div>

                            {/* Items Section */}
                            <div>
                                <label className="block text-sm font-black text-gray-700 mb-2.5 uppercase tracking-wide">Rincian Belanja (Estimasi)</label>

                                {/* Add Item Inline Form */}
                                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                                    <input
                                        placeholder="Nama Barang"
                                        className="flex-1 p-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-bold"
                                        value={newItemInput.nama_item}
                                        onChange={e => setNewItemInput({ ...newItemInput, nama_item: e.target.value })}
                                    />
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            placeholder="Qty"
                                            className="w-20 p-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-bold"
                                            value={newItemInput.qty}
                                            onChange={e => setNewItemInput({ ...newItemInput, qty: Number(e.target.value) })}
                                        />
                                        <input
                                            type="number"
                                            placeholder="Harga Satuan"
                                            className="w-28 p-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-bold"
                                            value={newItemInput.harga_satuan}
                                            onChange={e => setNewItemInput({ ...newItemInput, harga_satuan: Number(e.target.value) })}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddItem}
                                            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Items List */}
                                {newItems.length > 0 ? (
                                    <div className="space-y-2 mb-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        {newItems.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">{idx + 1}</div>
                                                    <div>
                                                        <p className="font-bold text-sm text-gray-900">{item.nama_item}</p>
                                                        <p className="text-xs text-gray-500">{item.qty} x {item.harga_satuan.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-gray-700 text-sm">
                                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.qty * item.harga_satuan)}
                                                    </span>
                                                    <button type="button" onClick={() => handleRemoveItem(idx)} className="text-red-400 hover:text-red-600">
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 italic mb-4 text-center p-4 border border-dashed rounded-xl">Belum ada item ditambahkan</p>
                                )}
                            </div>

                            {/* Auto Total */}
                            <div>
                                <label className="block text-sm font-black text-gray-700 mb-2.5 uppercase tracking-wide">Estimasi Kayanya Biaya Total</label>
                                <div className="relative">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-gray-400 text-lg">Rp</span>
                                    <input
                                        type="number"
                                        readOnly
                                        className="w-full pl-14 pr-5 py-4 rounded-2xl bg-gray-100 border-2 border-gray-200 focus:outline-none font-black text-xl text-gray-900"
                                        value={formData.total}
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-black text-gray-700 mb-2.5 uppercase tracking-wide">Catatan Pertimbangan</label>
                                <textarea
                                    className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:outline-none focus:border-blue-500 focus:bg-white transition-all h-24 resize-none font-medium text-gray-700 placeholder:text-gray-400"
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Opsional..."
                                />
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsFormOpen(false);
                                        setNewItems([]);
                                        setFormData({ project: '', total: '0', notes: '' });
                                    }}
                                    className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-50 hover:text-gray-900 rounded-2xl transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    Kirim Pengajuan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-gray-50">
                                <th className="p-6 font-black text-gray-400 text-xs uppercase tracking-wider">ID RAB</th>
                                <th className="p-6 font-black text-gray-400 text-xs uppercase tracking-wider">Proyek & Keterangan</th>
                                <th className="p-6 font-black text-gray-400 text-xs uppercase tracking-wider">Tanggal</th>
                                <th className="p-6 font-black text-gray-400 text-xs uppercase tracking-wider">Total Biaya</th>
                                <th className="p-6 font-black text-gray-400 text-xs uppercase tracking-wider w-1/6">Status</th>
                                <th className="p-6 font-black text-gray-400 text-xs uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {rabs.map((rab) => {
                                const statusStyle = getStatusStyle(rab.status_rab);
                                const StatusIcon = getStatusIcon(rab.status_rab);
                                return (
                                    <tr key={rab.rab_id} onClick={() => handleRowClick(rab)} className="hover:bg-blue-50/50 transition-all group cursor-pointer">
                                        <td className="p-6 align-top">
                                            <span className="font-bold text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded-lg">
                                                #{rab.rab_id}
                                            </span>
                                        </td>
                                        <td className="p-6 align-top">
                                            <div className="font-black text-gray-900 text-base mb-1 group-hover:text-blue-600 transition-colors">{rab.project_name || 'Proyek Tanpa Nama'}</div>
                                            <div className="text-sm text-gray-500 font-medium line-clamp-2 leading-relaxed">{rab.catatan || '-'}</div>
                                        </td>
                                        <td className="p-6 align-top">
                                            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl w-fit">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                {rab.created_at ? new Date(rab.created_at).toLocaleDateString() : '-'}
                                            </div>
                                        </td>
                                        <td className="p-6 align-top font-black text-gray-900 text-lg tracking-tight">
                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(rab.total_biaya)}
                                        </td>
                                        <td className="p-6 align-top">
                                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                                                <StatusIcon className="w-4 h-4" />
                                                <span>{rab.status_rab?.replace('_', ' ')}</span>
                                            </div>
                                        </td>
                                        <td className="p-6 align-top text-right">
                                            <button className="text-gray-300 hover:text-blue-600 p-3 hover:bg-white hover:shadow-lg rounded-2xl transition-all border border-transparent hover:border-gray-100">
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* RAB Detail Modal */}
            <RABDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                rab={selectedRAB}
                onSave={handleUpdateRAB}
            />
        </div>
    );
};
