
import React, { useState } from 'react';
import { Plus, CheckCircle, Clock, XCircle, FileText, DollarSign, Calendar, ChevronRight, AlertCircle } from 'lucide-react';
import { RABDetailModal } from './RABDetailModal';

// Mock Data
const initialRABs = [
    { id: 'RAB-001', project: 'Renovasi Rumah Cluster A', date: '2024-01-02', total: 15000000, status: 'Disetujui', notes: 'Budget material ok, jasa standar.' },
    { id: 'RAB-002', project: 'Pemasangan Kanopi B', date: '2024-01-03', total: 3500000, status: 'Menunggu', notes: '-' },
    { id: 'RAB-003', project: 'Perbaikan Atap Sekolah', date: '2023-12-28', total: 25000000, status: 'Ditolak', notes: 'Terlalu mahal di ongkos tukang.' },
];

export const RABManagement: React.FC = () => {
    const [rabs, setRabs] = useState(initialRABs);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({ project: '', total: '', notes: '' });

    // Detail Modal State
    const [selectedRAB, setSelectedRAB] = useState<typeof initialRABs[0] | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newRAB = {
            id: `RAB-${Math.floor(Math.random() * 1000)}`,
            project: formData.project,
            date: new Date().toISOString().split('T')[0],
            total: Number(formData.total),
            status: 'Menunggu',
            notes: formData.notes
        };
        setRabs([newRAB, ...rabs]);
        setIsFormOpen(false);
        setFormData({ project: '', total: '', notes: '' });
    };

    const handleRowClick = (rab: typeof initialRABs[0]) => {
        setSelectedRAB(rab);
        setIsDetailModalOpen(true);
    };

    const handleUpdateRAB = (updatedRAB: any) => {
        setRabs(rabs.map(r => r.id === updatedRAB.id ? updatedRAB : r));
        setIsDetailModalOpen(false); // Close modal after save
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Disetujui': return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100' };
            case 'Menunggu': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' };
            case 'Ditolak': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100' };
            default: return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-100' };
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Disetujui': return CheckCircle;
            case 'Menunggu': return Clock;
            case 'Ditolak': return XCircle;
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
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
                    <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-xl shadow-2xl animate-scale-up border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                        <h3 className="text-3xl font-black text-gray-900 mb-8">Ajukan RAB Baru</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-black text-gray-700 mb-2.5 uppercase tracking-wide">Nama Proyek</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-5 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-gray-900 placeholder:text-gray-400"
                                    value={formData.project}
                                    onChange={e => setFormData({ ...formData, project: e.target.value })}
                                    placeholder="Contoh: Renovasi Dapur Ibu Ani"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-black text-gray-700 mb-2.5 uppercase tracking-wide">Estimasi Biaya Total</label>
                                <div className="relative">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-gray-400 text-lg">Rp</span>
                                    <input
                                        type="number"
                                        required
                                        className="w-full pl-14 pr-5 py-5 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-black text-xl text-gray-900 placeholder:text-gray-400"
                                        value={formData.total}
                                        onChange={e => setFormData({ ...formData, total: e.target.value })}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-black text-gray-700 mb-2.5 uppercase tracking-wide">Catatan / Rincian</label>
                                <textarea
                                    className="w-full p-5 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:outline-none focus:border-blue-500 focus:bg-white transition-all h-40 resize-none font-medium text-gray-700 placeholder:text-gray-400"
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Tuliskan rincian item pekerjaan dan material secara singkat..."
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
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
                                const statusStyle = getStatusStyle(rab.status);
                                const StatusIcon = getStatusIcon(rab.status);
                                return (
                                    <tr key={rab.id} onClick={() => handleRowClick(rab)} className="hover:bg-blue-50/50 transition-all group cursor-pointer">
                                        <td className="p-6 align-top">
                                            <span className="font-bold text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded-lg">
                                                {rab.id}
                                            </span>
                                        </td>
                                        <td className="p-6 align-top">
                                            <div className="font-black text-gray-900 text-base mb-1 group-hover:text-blue-600 transition-colors">{rab.project}</div>
                                            <div className="text-sm text-gray-500 font-medium line-clamp-2 leading-relaxed">{rab.notes || '-'}</div>
                                        </td>
                                        <td className="p-6 align-top">
                                            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl w-fit">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                {rab.date}
                                            </div>
                                        </td>
                                        <td className="p-6 align-top font-black text-gray-900 text-lg tracking-tight">
                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(rab.total)}
                                        </td>
                                        <td className="p-6 align-top">
                                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                                                <StatusIcon className="w-4 h-4" />
                                                <span>{rab.status}</span>
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
