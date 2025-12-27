'use client';

import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, FileText, Upload, MoreVertical, Search, Filter, X } from 'lucide-react';

// --- Types ---
type ProjectStatus = 'Pending' | 'In Progress' | 'Completed' | 'Canceled';

interface ProgressLog {
    id: number;
    date: string;
    description: string;
    imageUrl?: string;
}

interface Project {
    id: string;
    clientName: string;
    serviceType: string;
    location: string;
    dateRequested: string;
    status: ProjectStatus;
    price: string;
    progressLogs: ProgressLog[];
}

// --- Mock Data ---
const INITIAL_PROJECTS: Project[] = [
    {
        id: 'PRJ-001',
        clientName: 'Budi Santoso',
        serviceType: 'Renovasi Atap',
        location: 'Denpasar Selatan',
        dateRequested: '2024-05-20',
        status: 'In Progress',
        price: 'Rp 15.000.000',
        progressLogs: [
            { id: 1, date: '2024-05-21', description: 'Survey lokasi dan pengukuran.', imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=200' },
            { id: 2, date: '2024-05-23', description: 'Pembongkaran atap lama dimulai.' }
        ]
    },
    {
        id: 'PRJ-002',
        clientName: 'Siti Aminah',
        serviceType: 'Service AC (3 Unit)',
        location: 'Kuta Utara',
        dateRequested: '2024-05-24',
        status: 'Pending',
        price: 'Rp 450.000',
        progressLogs: []
    },
    {
        id: 'PRJ-003',
        clientName: 'PT. Maju Mundur',
        serviceType: 'Instalasi Listrik Gedung',
        location: 'Gianyar',
        dateRequested: '2024-05-18',
        status: 'Completed',
        price: 'Rp 8.500.000',
        progressLogs: [
            { id: 1, date: '2024-05-19', description: 'Pemasangan kabel utama.' },
            { id: 2, date: '2024-05-22', description: 'Testing dan Commissioning berhasil.' }
        ]
    }
];

const AdminDashboard: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [newLogDesc, setNewLogDesc] = useState('');

    // --- Actions ---
    const handleStatusChange = (projectId: string, newStatus: ProjectStatus) => {
        setProjects(projects.map(p => p.id === projectId ? { ...p, status: newStatus } : p));
        if (selectedProject && selectedProject.id === projectId) {
            setSelectedProject({ ...selectedProject, status: newStatus });
        }
    };

    const handleAddProgress = () => {
        if (!selectedProject || !newLogDesc) return;

        const newLog: ProgressLog = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            description: newLogDesc,
            // In a real app, handle image upload here
        };

        const updatedProject = {
            ...selectedProject,
            progressLogs: [newLog, ...selectedProject.progressLogs]
        };

        setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p));
        setSelectedProject(updatedProject);
        setNewLogDesc('');
    };

    const openDetail = (project: Project) => {
        setSelectedProject(project);
        setIsDetailOpen(true);
    };

    const closeDetail = () => {
        setIsDetailOpen(false);
        setSelectedProject(null);
    };

    // --- Stats Helpers ---
    const stats = {
        total: projects.length,
        pending: projects.filter(p => p.status === 'Pending').length,
        inProgress: projects.filter(p => p.status === 'In Progress').length,
        completed: projects.filter(p => p.status === 'Completed').length
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-500">Kelola proyek dan pantau progress pekerjaan.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 flex items-center">
                            <Search className="w-5 h-5 text-gray-400 mr-2" />
                            <input type="text" placeholder="Cari proyek..." className="outline-none text-sm" />
                        </div>
                        <button className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50">
                            <Filter className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Proyek</p>
                                <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</h3>
                            </div>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Menunggu Konfirmasi</p>
                                <h3 className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</h3>
                            </div>
                            <div className="p-2 bg-yellow-50 rounded-lg">
                                <AlertCircle className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Sedang Dikerjakan</p>
                                <h3 className="text-3xl font-bold text-blue-600 mt-2">{stats.inProgress}</h3>
                            </div>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Clock className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Selesai</p>
                                <h3 className="text-3xl font-bold text-green-600 mt-2">{stats.completed}</h3>
                            </div>
                            <div className="p-2 bg-green-50 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Projects Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900">Daftar Proyek Terbaru</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-3 font-semibold">ID Proyek</th>
                                    <th className="px-6 py-3 font-semibold">Klien</th>
                                    <th className="px-6 py-3 font-semibold">Layanan</th>
                                    <th className="px-6 py-3 font-semibold">Status</th>
                                    <th className="px-6 py-3 font-semibold">Harga</th>
                                    <th className="px-6 py-3 font-semibold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {projects.map((project) => (
                                    <tr key={project.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{project.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="font-medium text-gray-900">{project.clientName}</div>
                                            <div className="text-xs text-gray-500">{project.location}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{project.serviceType}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                    project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                                        project.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-gray-100 text-gray-800'}`}>
                                                {project.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">{project.price}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => openDetail(project)}
                                                className="text-blue-600 hover:text-blue-900 font-medium text-sm"
                                            >
                                                Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Project Detail Modal */}
            {isDetailOpen && selectedProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Detail Proyek {selectedProject.id}</h2>
                                <p className="text-gray-500 text-sm">Kelola status dan dokumentasi progress.</p>
                            </div>
                            <button onClick={closeDetail} className="p-2 hover:bg-gray-100 rounded-full transition">
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Left Column: Info & Status */}
                            <div className="md:col-span-1 space-y-6">
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <h3 className="font-bold text-gray-900 mb-4">Informasi Klien</h3>
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <span className="block text-gray-500 text-xs uppercase">Nama Klien</span>
                                            <span className="font-medium">{selectedProject.clientName}</span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-500 text-xs uppercase">Lokasi</span>
                                            <span className="font-medium">{selectedProject.location}</span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-500 text-xs uppercase">Layanan</span>
                                            <span className="font-medium">{selectedProject.serviceType}</span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-500 text-xs uppercase">Tanggal Request</span>
                                            <span className="font-medium">{selectedProject.dateRequested}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 p-4 rounded-xl">
                                    <h3 className="font-bold text-gray-900 mb-4">Update Status</h3>
                                    <div className="space-y-2">
                                        {['Pending', 'In Progress', 'Completed', 'Canceled'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => handleStatusChange(selectedProject.id, status as ProjectStatus)}
                                                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition flex items-center justify-between
                                                    ${selectedProject.status === status
                                                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                        : 'hover:bg-gray-50 text-gray-600 border border-transparent'}`}
                                            >
                                                {status}
                                                {selectedProject.status === status && <CheckCircle className="w-4 h-4" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Progress Log */}
                            <div className="md:col-span-2">
                                <div className="mb-6">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                        Dokumentasi Progress
                                    </h3>

                                    {/* Add New Log */}
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
                                        <textarea
                                            value={newLogDesc}
                                            onChange={(e) => setNewLogDesc(e.target.value)}
                                            placeholder="Tulis update progress pekerjaan..."
                                            className="w-full bg-white p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-[80px]"
                                        />
                                        <div className="flex justify-between items-center mt-3">
                                            <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm font-medium">
                                                <Upload className="w-4 h-4" /> Upload Foto
                                            </button>
                                            <button
                                                onClick={handleAddProgress}
                                                disabled={!newLogDesc}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                            >
                                                Tambah Update
                                            </button>
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    <div className="relative pl-4 border-l-2 border-gray-200 space-y-8">
                                        {selectedProject.progressLogs.length === 0 && (
                                            <p className="text-gray-500 text-sm italic pl-2">Belum ada update progress.</p>
                                        )}
                                        {selectedProject.progressLogs.map((log) => (
                                            <div key={log.id} className="relative pl-4">
                                                <div className="absolute -left-[21px] top-1 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-sm"></div>
                                                <span className="text-xs text-gray-400 font-medium mb-1 block">{log.date}</span>
                                                <p className="text-gray-800 text-sm bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                                    {log.description}
                                                </p>
                                                {log.imageUrl && (
                                                    <div className="mt-2">
                                                        <img src={log.imageUrl} alt="Progress" className="w-32 h-24 object-cover rounded-lg border border-gray-200" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
