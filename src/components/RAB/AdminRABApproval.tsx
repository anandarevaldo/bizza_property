import React, { useState } from 'react';
import { CheckCircle, XCircle, FileText, Calendar, ChevronRight, Calculator, AlertCircle } from 'lucide-react';

// Mock Data (Shared/Simulated to match Mandor's perspective)
const initialRABSubmissions = [
    { id: 'RAB-001', mandor: 'Pak Mandor A', project: 'Renovasi Rumah Cluster A', date: '2024-01-02', total: 15000000, status: 'Disetujui', notes: 'Sudah OK sesuai budget.' },
    { id: 'RAB-002', mandor: 'Pak Mandor A', project: 'Pemasangan Kanopi B', date: '2024-01-03', total: 3500000, status: 'Menunggu', notes: 'Mohon dicek kembali harga besi.' },
    { id: 'RAB-004', mandor: 'Pak Mandor B', project: 'Cat Ulang Gedung', date: '2024-01-04', total: 45000000, status: 'Menunggu', notes: 'Volume cat besar.' },
];

export const AdminRABApproval: React.FC = () => {
    const [submissions, setSubmissions] = useState(initialRABSubmissions);

    const handleApprove = (id: string) => {
        if (window.confirm('Setujui RAB ini?')) {
            setSubmissions(submissions.map(s => s.id === id ? { ...s, status: 'Disetujui' } : s));
        }
    };

    const handleReject = (id: string) => {
        if (window.confirm('Tolak RAB ini?')) {
            setSubmissions(submissions.map(s => s.id === id ? { ...s, status: 'Ditolak' } : s));
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Disetujui': return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' };
            case 'Menunggu': return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' };
            case 'Ditolak': return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' };
            default: return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
        }
    };

    return (
        <div className="space-y-8 animate-fade-in font-sans">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                        <Calculator className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">Persetujuan RAB</h2>
                </div>
                <p className="text-gray-500 font-medium ml-1">Tinjau dan setujui pengajuan RAB dari Mandor.</p>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-gray-100">
                                <th className="p-4 font-extrabold text-gray-400 text-xs uppercase tracking-wider">ID & Tanggal</th>
                                <th className="p-4 font-extrabold text-gray-400 text-xs uppercase tracking-wider">Project Info</th>
                                <th className="p-4 font-extrabold text-gray-400 text-xs uppercase tracking-wider">Total Biaya</th>
                                <th className="p-4 font-extrabold text-gray-400 text-xs uppercase tracking-wider">Status</th>
                                <th className="p-4 font-extrabold text-gray-400 text-xs uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {submissions.map((item) => {
                                const statusStyle = getStatusStyle(item.status);
                                return (
                                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900">{item.id}</div>
                                            <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                                <Calendar className="w-3 h-3" /> {item.date}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900">{item.project}</div>
                                            <div className="text-xs text-blue-600 font-bold bg-blue-50 inline-block px-2 py-0.5 rounded-md mt-1">{item.mandor}</div>
                                            <p className="text-xs text-gray-500 mt-1 max-w-xs">{item.notes}</p>
                                        </td>
                                        <td className="p-4 font-black text-gray-900 text-lg">
                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.total)}
                                        </td>
                                        <td className="p-4">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-extrabold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                                                {item.status === 'Disetujui' ? <CheckCircle className="w-3.5 h-3.5" /> :
                                                    item.status === 'Ditolak' ? <XCircle className="w-3.5 h-3.5" /> :
                                                        <AlertCircle className="w-3.5 h-3.5" />}
                                                <span>{item.status}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            {item.status === 'Menunggu' ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleReject(item.id)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold text-xs border border-transparent hover:border-red-100"
                                                        title="Tolak"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleApprove(item.id)}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:bg-blue-700 transition-all font-bold text-xs flex items-center gap-2"
                                                    >
                                                        <CheckCircle className="w-4 h-4" /> Approve
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-300 font-bold text-xs uppercase">Selesai</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
