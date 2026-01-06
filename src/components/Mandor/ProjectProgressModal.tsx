import React, { useState } from 'react';
import { X, Save, Upload, Image as ImageIcon, FileText, MapPin, Calendar, User, CheckCircle2, AlertCircle } from 'lucide-react';

interface Project {
    id: string;
    project: string;
    status: 'On Progress' | 'Approved' | 'Pending';
    progress: number;
    budget: string;
}

interface ProjectProgressModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: Project | null;
    onUpdateProgress: (newProgress: number) => void;
}

export const ProjectProgressModal: React.FC<ProjectProgressModalProps> = ({ isOpen, onClose, project, onUpdateProgress }) => {
    const [progress, setProgress] = useState(project ? project.progress : 0);
    const [dragActive, setDragActive] = useState(false);
    // Mock details - In real app, fetch based on project.id
    const mockDetails = {
        client: "Bapak Ahmad Saifuddin",
        address: "Jl. Menteng Raya No. 45, Jakarta Pusat",
        startDate: "12 Oktober 2023",
        duration: "14 Hari Kerja",
        description: "Renovasi bagian facade depan, pengecatan ulang, dan perbaikan atap teras yang bocor.",
        documentation: [
            "/api/placeholder/400/300",
            "/api/placeholder/400/300"
        ]
    };

    const [uploadedPhotos, setUploadedPhotos] = useState<string[]>(mockDetails.documentation);

    // Reset progress when project changes or modal opens
    React.useEffect(() => {
        if (project) {
            setProgress(project.progress);
        }
    }, [project, isOpen]);

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
            setUploadedPhotos(prev => [...prev, ...newFiles]);
        }
    };

    if (!isOpen || !project) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl animate-scale-up border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-8 bg-gradient-to-r from-blue-900 to-blue-700 text-white relative overflow-hidden shrink-0">
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm border border-white/10">
                                    {project.id}
                                </span>
                                <span className="px-3 py-1 bg-green-500/20 text-green-100 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm border border-green-500/30">
                                    {project.status}
                                </span>
                            </div>
                            <h3 className="text-3xl font-black tracking-tight">{project.project}</h3>
                            <p className="text-blue-100 font-medium text-lg mt-1 opacity-90">{mockDetails.client}</p>
                        </div>
                    </div>

                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-12 -mb-12 blur-2xl"></div>
                </div>

                {/* Content Scrollable Area */}
                <div className="overflow-y-auto p-8 bg-gray-50/50 flex flex-col lg:flex-row gap-8">

                    {/* Left Column: Details & Order Info */}
                    <div className="flex-1 space-y-6">
                        <section className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                            <h4 className="flex items-center gap-2 font-black text-gray-900 text-lg mb-4">
                                <FileText className="w-5 h-5 text-blue-600" />
                                Detail Pemesanan
                            </h4>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-100 transition-colors">
                                    <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Lokasi Proyek</p>
                                        <p className="font-bold text-gray-800 leading-relaxed">{mockDetails.address}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-1 flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <Calendar className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Mulai</p>
                                            <p className="font-bold text-gray-800 text-sm">{mockDetails.startDate}</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Estimasi</p>
                                            <p className="font-bold text-gray-800 text-sm">{mockDetails.duration}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                                    <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Catatan User (Klien)</p>
                                    <p className="text-blue-900 font-medium leading-relaxed text-sm">
                                        "{mockDetails.description}"
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="flex items-center gap-2 font-black text-gray-900 text-lg">
                                    <AlertCircle className="w-5 h-5 text-blue-600" />
                                    Update Progress
                                </h4>
                                <span className={`px-4 py-1.5 rounded-full text-sm font-black ${progress === 100 ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {progress}% Selesai
                                </span>
                            </div>

                            <div className="mb-8 px-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={progress}
                                    onChange={(e) => setProgress(parseInt(e.target.value))}
                                    className="w-full h-4 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
                                />
                                <div className="flex justify-between mt-3 text-xs font-bold text-gray-400 px-1">
                                    <span>Persiapan (0%)</span>
                                    <span>Pengerjaan (50%)</span>
                                    <span>Finishing (100%)</span>
                                </div>
                            </div>

                            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                                <p className="text-xs text-amber-800 font-medium leading-relaxed">
                                    Pastikan progress yang diinput sesuai dengan kondisi aktual di lapangan. Progress akan diverifikasi oleh Admin.
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Documentation */}
                    <div className="flex-1 flex flex-col">
                        <section className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm h-full flex flex-col">
                            <h4 className="flex items-center gap-2 font-black text-gray-900 text-lg mb-4">
                                <ImageIcon className="w-5 h-5 text-purple-600" />
                                Dokumentasi Pekerjaan
                            </h4>

                            <div className="flex-1">
                                <div
                                    className={`border-3 border-dashed rounded-[1.5rem] h-64 flex flex-col items-center justify-center text-center p-6 transition-all duration-300 mb-6 relative
                                        ${dragActive ? 'border-blue-500 bg-blue-50 scale-[1.02]' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                                        <Upload className="w-8 h-8" />
                                    </div>
                                    <p className="font-bold text-gray-900 text-lg mb-1">Upload Foto Progress</p>
                                    <p className="text-gray-500 text-sm font-medium mb-4 max-w-xs mx-auto">
                                        Drag & drop foto pekerjaan di sini, atau klik untuk memilih file dari galeri.
                                    </p>
                                    <input
                                        type="file"
                                        multiple
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                const newFiles = Array.from(e.target.files).map(file => URL.createObjectURL(file));
                                                setUploadedPhotos(prev => [...prev, ...newFiles]);
                                            }
                                        }}
                                    />
                                    <button className="px-6 py-2.5 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all pointer-events-none">
                                        Pilih File
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Foto Terupload ({uploadedPhotos.length})</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {uploadedPhotos.map((photo, i) => (
                                            <div key={i} className="group relative aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200 cursor-pointer">
                                                <img src={photo} alt={`Dokumentasi ${i + 1}`} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setUploadedPhotos(prev => prev.filter((_, idx) => idx !== i));
                                                        }}
                                                        className="p-2 bg-white/90 rounded-full text-red-600 shadow-lg hover:scale-110 transition-transform"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-white border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-8 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={() => onUpdateProgress(progress)}
                        className="px-8 py-4 bg-blue-600 text-white rounded-xl font-black shadow-xl shadow-blue-200 hover:shadow-2xl hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center gap-3"
                    >
                        <Save className="w-5 h-5" />
                        Simpan Update
                    </button>
                </div>

            </div>
        </div>
    );
};
