
import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin, Calendar, Clock, AlertCircle, Upload, FileText, Image as ImageIcon, Save, CheckCircle, User, HardHat, ChevronDown, Zap, Palette, Wrench, Briefcase, Wallet } from 'lucide-react';
import { documentationService, Documentation } from '@/lib/services/documentationService';

export interface Order {
    id: string;
    orderNumber: string;
    customer: string;
    type: 'Jasa Tukang' | 'Borongan' | 'Material';
    total: string;
    date: string;
    status: 'Need Validation' | 'On Progress' | 'Done' | 'Cancel';
    userBudget?: string;
    rabProposed?: number;
    rabStatus?: 'Pending' | 'Approved' | 'Rejected';
    assignedHandymanId?: number; // Legacy
    assignedHandymen?: { id: number; name: string; role?: string }[];
    pesananId?: number; // Real Order ID
    handymanName?: string;
    handymanRole?: string;
    project?: string;
    progress?: number;
    location?: string;
    description?: string;
    estimation?: string;
}

// Mock Team Data
const availableHandymen = [
    { id: 1, name: 'Budi Santoso', role: 'Cat' },
    { id: 2, name: 'Asep Supriyadi', role: 'Listrik' },
    { id: 3, name: 'Joko Widodo', role: 'Pipa' },
];

const getRoleStyle = (role?: string) => {
    switch (role) {
        case 'Cat': return { icon: Palette, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100' };
        case 'Listrik': return { icon: Zap, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' };
        case 'Pipa': return { icon: Wrench, color: 'text-cyan-500', bg: 'bg-cyan-50', border: 'border-cyan-100' };
        default: return { icon: HardHat, color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-100' };
    }
};

const estimationUnits = ['Jam', 'Hari', 'Bulan', 'Tahun'];

// Validation Configuration
const EST_LIMITS: Record<string, number> = {
    'Jam': 9,
    'Hari': 31,
    'Bulan': 12,
    'Tahun': 100 // Reasonable default
};

interface MandorOrderDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
    onSave?: (updatedOrder: Order) => void;
}

export const MandorOrderDetailModal: React.FC<MandorOrderDetailModalProps> = ({ isOpen, onClose, order, onSave }) => {
    const initialProgress = order?.progress || 0;
    const [currentProgress, setCurrentProgress] = useState(initialProgress);
    const [documentation, setDocumentation] = useState<Documentation[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [pendingPhotos, setPendingPhotos] = useState<File[]>([]); // New: Store photos before upload

    const [selectedHandymanIds, setSelectedHandymanIds] = useState<number[]>([]);

    // Split estimation into value and unit
    const [estValue, setEstValue] = useState('');
    const [estUnit, setEstUnit] = useState('Hari');

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // RAB Input State
    const [rabInput, setRabInput] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleRabChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\./g, '');
        if (!isNaN(Number(rawValue))) {
            const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            setRabInput(formattedValue);
        }
    };

    const handleSaveRab = () => {
        const numericValue = parseInt(rabInput.replace(/\./g, ''), 10);
        if (order && numericValue > 0) {
            // Save to localStorage to persist change across pages
            const updatedOrder = { ...order, rabProposed: numericValue, rabStatus: 'Pending' } as Order;
            localStorage.setItem('srv_test_001_rab', JSON.stringify(numericValue));
            alert(`Penawaran RAB sebesar Rp ${rabInput} berhasil diajukan!`);
            onClose();
        } else {
            alert('Mohon masukkan nominal RAB yang valid.');
        }
    };

    useEffect(() => {
        if (order) {
            setCurrentProgress(order.progress || 0);
            
            // Initialize assignments
            if (order.assignedHandymen && order.assignedHandymen.length > 0) {
                setSelectedHandymanIds(order.assignedHandymen.map(h => h.id));
            } else if (order.assignedHandymanId) {
                // Fallback for legacy single assignment
                setSelectedHandymanIds([order.assignedHandymanId]);
            } else {
                setSelectedHandymanIds([]);
            }

            // Fetch documentation
            const fetchDocs = async () => {
                // Use pesananId if available, otherwise fallback (though likely won't work for db foreign key)
                const targetId = order.pesananId ? order.pesananId.toString() : order.id;
                try {
                const docs = await documentationService.getByOrderId(targetId);
                // Filter out payment proofs - only show progress documentation
                const progressDocs = docs.filter(doc => 
                    !doc.description.toLowerCase().includes('bukti pembayaran') && 
                    !doc.description.toLowerCase().includes('payment')
                );
                setDocumentation(progressDocs);
                } catch(e) { console.error(e) }
            };
            fetchDocs();

            // Parse existing estimation string
            if (order.estimation) {
                const parts = order.estimation.split(' ');
                if (parts.length >= 2) {
                    setEstValue(parts[0]);
                    const unitPart = parts.slice(1).join(' '); // "Hari" or "Hari Kerja"
                    // Simple clean up if it contains user friendly text
                    const matchedUnit = estimationUnits.find(u => unitPart.includes(u)) || 'Hari';
                    setEstUnit(matchedUnit);
                } else {
                    setEstValue(order.estimation);
                    setEstUnit('Hari');
                }
            } else {
                setEstValue('');
                setEstUnit('Hari');
            }
        }
    }, [order]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isOpen || !order) return null;

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        if (order.progress === 100) return;
        setCurrentProgress(val);
    };

    const handleSave = async () => {
        // Collect selected objects
        const selectedHandymen = availableHandymen.filter(h => selectedHandymanIds.includes(h.id));
        const primaryHandyman = selectedHandymen[0];

        // Upload pending photos first
        if (pendingPhotos.length > 0 && order.pesananId) {
            try {
                for (const photo of pendingPhotos) {
                    await documentationService.uploadProof(photo, order.pesananId.toString(), 'Uploaded by Mandor');
                }
                // Clear pending photos after successful upload
                setPendingPhotos([]);
            } catch (error: any) {
                alert(`Gagal mengupload foto: ${error.message || 'Unknown error'}`);
                return; // Don't proceed with save if photo upload fails
            }
        }

        // Combine value and unit
        const combinedEstimation = estValue ? `${estValue} ${estUnit}` : '';

        const updatedOrder: Order = {
            ...order,
            progress: currentProgress,
            estimation: combinedEstimation,
            assignedHandymanId: primaryHandyman?.id, // Legacy compat
            assignedHandymen: selectedHandymen,
            handymanName: selectedHandymen.map(h => h.name).join(', '),
            handymanRole: primaryHandyman?.role,
            status: (order.status === 'Need Validation' && selectedHandymanIds.length > 0) ? 'On Progress' : order.status
        };

        if (onSave) onSave(updatedOrder);
        onClose();
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && order) {
            // Instead of uploading immediately, add to pending photos
            setPendingPhotos(prev => [...prev, file]);
            // Reset input so same file can be selected again if needed
            event.target.value = '';
        }
    };

    const handleRemovePendingPhoto = (index: number) => {
        setPendingPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const handleDeletePhoto = async (id: string, fileUrl: string) => {
        if (!confirm("Hapus foto ini?")) return;
        try {
            await documentationService.delete(id, fileUrl);
            setDocumentation(prev => prev.filter(d => d.id !== id));
        } catch (error) {
            console.error("Delete failed", error);
            alert("Gagal menghapus foto.");
        }
    };

    const handleEstValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = parseInt(e.target.value);
        if (isNaN(val)) {
            setEstValue('');
            return;
        }

        // Prevent Negative
        if (val < 0) val = 0;

        // Enforce Max based on Unit
        const max = EST_LIMITS[estUnit];
        if (val > max) val = max;

        setEstValue(val.toString());
    };

    const handleEstUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newUnit = e.target.value;
        setEstUnit(newUnit);

        // Re-validate value with new unit limit
        if (estValue) {
            const currentVal = parseInt(estValue);
            const max = EST_LIMITS[newUnit];
            if (currentVal > max) {
                setEstValue(max.toString());
            }
        }
    };

    const isProgressLocked = order.progress === 100;
    const isPending = order.status === 'Need Validation' || order.status === 'Cancel';
    const isWorking = order.status === 'On Progress' || order.status === 'Done';

    // Derived state for display
    const primaryHandymanId = selectedHandymanIds.length > 0 ? selectedHandymanIds[0] : undefined;
    const selectedHandymanObj = availableHandymen.find(h => h.id === primaryHandymanId);
    // Display logic: if updated name exists, use it, else generic
    const displayedHandymanName = order.handymanName || selectedHandymanObj?.name;
    const displayedHandymanRole = order.handymanRole || selectedHandymanObj?.role;

    const roleStyle = getRoleStyle(displayedHandymanRole);
    const HandymanIcon = roleStyle.icon;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-fade-in font-sans">
            <div className="bg-white rounded-[2.5rem] w-full max-w-5xl max-h-[92vh] overflow-hidden shadow-2xl animate-scale-up flex flex-col relative ring-1 ring-gray-100">

                {/* Navbar / Header - Clean style */}
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white z-20">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-black text-gray-900 line-clamp-1">{order.project || order.customer}</h2>
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border 
                                    ${order.status === 'On Progress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                        order.status === 'Done' ? 'bg-green-50 text-green-600 border-green-100' :
                                            order.status === 'Need Validation' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                                                'bg-red-50 text-red-600 border-red-100'}`}>
                                    {order.status === 'On Progress' ? 'On Progress' : order.status}
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm font-bold flex items-center gap-2 mt-0.5">
                                <span className="text-gray-500">{order.orderNumber}</span> • <span>{order.type}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-2xl transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Scrollable Main Content */}
                <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* LEFT COLUMN (Details) - Span 7 */}
                        <div className="lg:col-span-7 space-y-6">

                            {/* Handyman & Estimation Card */}
                            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-visible group">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity overflow-hidden rounded-[2rem]">
                                    <HardHat className="w-32 h-32 rotate-12" />
                                </div>

                                <h3 className="text-gray-900 font-extrabold text-lg mb-6 flex items-center gap-2 relative z-10">
                                    <User className="w-5 h-5 text-gray-400" /> Penugasan Tim
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                    {/* Handyman Input (Custom Dropdown) */}
                                    <div className="space-y-2 relative" ref={dropdownRef}>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Ditugaskan Kepada</label>

                                        {!isWorking ? (
                                            <>
                                                {/* Dropdown Trigger */}
                                                <button
                                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                    className={`w-full flex items-center justify-between bg-gray-50 hover:bg-white border text-left rounded-2xl p-4 transition-all
                                                        ${isDropdownOpen ? 'border-blue-500 ring-4 ring-blue-50 bg-white' : 'border-transparent hover:border-gray-200'}`}
                                                >
                                                    {selectedHandymanIds.length > 0 ? (
                                                        <div className="flex items-center gap-3">
                                                             <div className="flex -space-x-2">
                                                                {availableHandymen.filter(h => selectedHandymanIds.includes(h.id)).slice(0, 3).map((h, i) => (
                                                                     <div key={h.id} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs text-white ${getRoleStyle(h.role).bg.replace('bg-', 'bg-')}`}>
                                                                         <User className="w-4 h-4 text-gray-500" />
                                                                     </div>
                                                                ))}
                                                                {selectedHandymanIds.length > 3 && (
                                                                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                                        +{selectedHandymanIds.length - 3}
                                                                    </div>
                                                                )}
                                                             </div>
                                                            <div>
                                                                <p className="font-bold text-gray-900 text-sm leading-tight">{selectedHandymanIds.length} Personel</p>
                                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tim Terpilih</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 font-bold px-1">Pilih Personel</span>
                                                    )}
                                                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                                </button>

                                                {/* Dropdown List */}
                                                {isDropdownOpen && (
                                                    <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-scale-up-sm origin-top">
                                                        <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
                                                            {availableHandymen.map((handyman) => {
                                                                const hRoleStyle = getRoleStyle(handyman.role);
                                                                const HIcon = hRoleStyle.icon;
                                                                const isSelected = selectedHandymanIds.includes(handyman.id);

                                                                return (
                                                                    <button
                                                                        key={handyman.id}
                                                                        onClick={() => {
                                                                            setSelectedHandymanIds(prev => {
                                                                                if (prev.includes(handyman.id)) {
                                                                                    return prev.filter(id => id !== handyman.id);
                                                                                } else {
                                                                                    return [...prev, handyman.id];
                                                                                }
                                                                            });
                                                                            // Don't close dropdown on multi-select
                                                                        }}
                                                                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all
                                                                            ${isSelected ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50 border border-transparent'}`}
                                                                    >
                                                                        <div className={`p-2 rounded-lg ${hRoleStyle.bg} ${hRoleStyle.color}`}>
                                                                            <HIcon className="w-5 h-5" />
                                                                        </div>
                                                                        <div className="text-left">
                                                                            <p className={`font-bold text-sm ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>{handyman.name}</p>
                                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{handyman.role}</p>
                                                                        </div>
                                                                        {isSelected && <CheckCircle className="w-5 h-5 text-blue-500 ml-auto" />}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            // Locked View
                                            <div className="flex flex-col gap-2">
                                                {(order.assignedHandymen && order.assignedHandymen.length > 0) ? (
                                                     order.assignedHandymen.map(handyman => (
                                                        <div key={handyman.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                                            <div className={`w-12 h-12 rounded-xl shadow-sm flex items-center justify-center ${getRoleStyle(handyman.role).bg} ${getRoleStyle(handyman.role).color}`}>
                                                                {React.createElement(getRoleStyle(handyman.role).icon, { className: "w-6 h-6" })}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-900">{handyman.name}</p>
                                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{handyman.role || 'Tenaga Ahli'}</p>
                                                            </div>
                                                        </div>
                                                     ))
                                                ) : (
                                                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                                                            <User className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900">Belum Ditugaskan</p>
                                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">-</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Estimation Input Split */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Estimasi Waktu</label>
                                        <div className="relative h-full">
                                            {isPending ? (
                                                <div className="flex gap-2">
                                                    <input
                                                        type="number"
                                                        value={estValue}
                                                        onChange={handleEstValueChange}
                                                        min="0"
                                                        max={EST_LIMITS[estUnit]}
                                                        className="w-24 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 rounded-2xl px-5 py-5 font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-50 focus:bg-white transition-all placeholder-gray-300 shadow-sm text-lg text-center appearance-none"
                                                        placeholder="0"
                                                    />
                                                    <div className="relative flex-1">
                                                        <select
                                                            value={estUnit}
                                                            onChange={handleEstUnitChange}
                                                            className="w-full h-full appearance-none bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 rounded-2xl px-5 font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-50 focus:bg-white transition-all cursor-pointer shadow-sm text-base pr-10"
                                                        >
                                                            {estimationUnits.map(unit => (
                                                                <option key={unit} value={unit}>{unit}</option>
                                                            ))}
                                                        </select>
                                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                                    </div>
                                                </div>
                                            ) : (
                                                // Locked View
                                                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 h-[88px]">
                                                    <Clock className="w-5 h-5 text-gray-400 ml-1" />
                                                    <span className="font-bold text-gray-900 text-lg">{order.estimation || `${estValue} ${estUnit}`}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Project Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-1">
                                    <div className="flex items-center gap-3 mb-3 text-gray-400">
                                        <MapPin className="w-5 h-5" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Lokasi</span>
                                    </div>
                                    <p className="font-bold text-gray-900 leading-relaxed text-lg line-clamp-2">
                                        {order.location || 'Lokasi tidak tersedia'}
                                    </p>
                                </div>
                                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-1">
                                    <div className="flex items-center gap-3 mb-3 text-gray-400">
                                        <Calendar className="w-5 h-5" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Tanggal Mulai</span>
                                    </div>
                                    <p className="font-bold text-gray-900 leading-relaxed text-lg">
                                        {(() => {
                                            try {
                                                const date = new Date(order.date);
                                                if (isNaN(date.getTime())) {
                                                    return 'Tanggal tidak valid';
                                                }
                                                return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                                            } catch (e) {
                                                return 'Tanggal tidak valid';
                                            }
                                        })()}
                                    </p>
                                </div>
                                {order.userBudget && (
                                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-1">
                                        <div className="flex items-center gap-3 mb-3 text-blue-500">
                                            <Wallet className="w-5 h-5" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Budget User</span>
                                        </div>
                                        <p className="font-bold text-blue-900 leading-relaxed text-lg">
                                            {order.userBudget}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Client Note */}
                            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Catatan Klien</h4>
                                <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-50/50">
                                    <p className="text-indigo-900 font-medium leading-relaxed italic">
                                        "{order.description || 'Tidak ada catatan khusus.'}"
                                    </p>
                                </div>
                            </div>

                            {/* Progress Slider (Only if NOT Pending) */}
                            {!isPending && (
                                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h3 className="font-extrabold text-gray-900 text-xl">Update Progress</h3>
                                            <p className="text-gray-400 font-medium text-sm mt-1">Geser slider untuk update status.</p>
                                        </div>
                                        <span className={`px-5 py-2.5 rounded-2xl text-sm font-black shadow-sm ${isProgressLocked ? 'bg-green-100 text-green-700' : 'bg-blue-600 text-white shadow-blue-200'}`}>
                                            {currentProgress}% Selesai
                                        </span>
                                    </div>

                                    <div className="mb-6 relative">
                                        {/* Custom Range Slider Styling */}
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            disabled={isProgressLocked}
                                            value={currentProgress}
                                            className={`w-full h-4 bg-gray-100 rounded-full appearance-none cursor-pointer relative z-10
                                                ${isProgressLocked ? 'opacity-50 cursor-not-allowed' : 'accent-blue-600 hover:accent-blue-700'}`}
                                            onChange={handleProgressChange}
                                        />
                                        <div className="flex justify-between mt-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            <span>Mulai (0%)</span>
                                            <span>Setengah Jalan (50%)</span>
                                            <span>Selesai (100%)</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 items-start p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <AlertCircle className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                                        <p className="text-gray-500 text-sm font-medium leading-relaxed">
                                            {isProgressLocked
                                                ? "Proyek ini telah ditandai selesai (100%). Progress terkunci untuk menjaga integritas data."
                                                : "Pastikan input progress sesuai dengan kondisi lapangan. Foto bukti wajib diupload untuk verifikasi."}
                                        </p>
                                    </div>

                                    {/* RAB Proposal Section (Only for Need Validation) */}
                                    {order.status === 'Need Validation' && (
                                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                                <FileText className="w-32 h-32 rotate-12" />
                                            </div>

                                            <h3 className="text-gray-900 font-extrabold text-lg mb-6 flex items-center gap-2 relative z-10">
                                                <FileText className="w-5 h-5 text-gray-400" /> Penawaran RAB
                                            </h3>

                                            <div className="space-y-6 relative z-10">
                                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                                    <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Estimasi Budget User</p>
                                                    <p className="text-xl font-black text-blue-900">{order.userBudget || 'Tidak ada estimasi'}</p>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Total Biaya (RAB) yang Diajukan</label>
                                                    <div className="relative">
                                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">Rp</span>
                                                        <input
                                                            type="text"
                                                            value={rabInput}
                                                            onChange={handleRabChange}
                                                            placeholder="0"
                                                            className="w-full bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 rounded-2xl pl-12 pr-5 py-4 font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all placeholder-gray-300 shadow-sm text-lg"
                                                        />
                                                    </div>
                                                    <p className="text-xs text-gray-400 font-medium ml-1">Masukkan total biaya yang akan diajukan ke klien untuk disetujui.</p>
                                                </div>

                                                <button
                                                    onClick={handleSaveRab}
                                                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-1 flex items-center justify-center gap-2"
                                                >
                                                    <Save className="w-5 h-5" />
                                                    Ajukan Penawaran RAB
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN (Documentation) - Span 5 */}
                        <div className="lg:col-span-5 h-full flex flex-col">
                            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm h-full flex flex-col">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
                                        <ImageIcon className="w-5 h-5 text-gray-400" /> Dokumentasi
                                    </h3>
                                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold">
                                        {documentation.length + pendingPhotos.length} Foto
                                        {pendingPhotos.length > 0 && (
                                            <span className="ml-1 text-yellow-600">({pendingPhotos.length} belum tersimpan)</span>
                                        )}
                                    </span>
                                </div>

                                {/* Custom Upload Area */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={isUploading}
                                />
                                <div
                                    onClick={handleUploadClick}
                                    className={`group relative border-3 border-dashed border-gray-100 hover:border-blue-200 bg-gray-50 hover:bg-blue-50/30 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 mb-8 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                                >
                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">
                                        <Upload className={`w-7 h-7 ${isUploading ? 'animate-bounce' : ''}`} />
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-1">{isUploading ? 'Mengupload...' : 'Upload Foto Baru'}</h4>
                                    <p className="text-gray-400 text-xs font-medium max-w-[200px]">Tap disini untuk mengambil foto atau pilih dari galeri</p>
                                </div>

                                {/* Gallery Grid */}
                                <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-4">
                                    {documentation.length === 0 && pendingPhotos.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-32 text-gray-300 border border-gray-100 rounded-3xl border-dashed">
                                            <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                                            <span className="text-xs font-bold">Belum ada dokumentasi</span>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3">
                                            {/* Pending Photos (not yet saved) */}
                                            {pendingPhotos.map((file, index) => (
                                                <div key={`pending-${index}`} className="aspect-square rounded-2xl relative overflow-hidden group shadow-sm bg-gray-100 border-2 border-yellow-300">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt="Pending upload"
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                    <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded-lg">
                                                        Belum Tersimpan
                                                    </div>
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                        <button
                                                            onClick={() => handleRemovePendingPhoto(index)}
                                                            className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-lg backdrop-blur-sm"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {/* Uploaded Documentation */}
                                            {documentation.map((doc) => (
                                                <div key={doc.id} className="aspect-square rounded-2xl relative overflow-hidden group shadow-sm bg-gray-100">
                                                    <img
                                                        src={doc.fileUrl}
                                                        alt={doc.description}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                        <button
                                                            onClick={() => handleDeletePhoto(doc.id, doc.fileUrl)}
                                                            className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-lg backdrop-blur-sm"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 bg-white z-20 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-8 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                        Batal
                    </button>
                    {!isPending && !isProgressLocked ? (
                        <button
                            onClick={handleSave}
                            className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-1 flex items-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            Simpan Progress
                        </button>
                    ) : isPending ? (
                        <button
                            onClick={handleSave}
                            disabled={selectedHandymanIds.length === 0 || !estValue}
                            className={`px-8 py-4 font-bold rounded-2xl flex items-center gap-2 transition-all shadow-lg
                                ${(selectedHandymanIds.length === 0 || !estValue)
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-1'}`}
                        >
                            <Save className="w-5 h-5" />
                            Simpan Penugasan
                        </button>
                    ) : (
                        <div className="px-8 py-4 bg-gray-50 text-gray-400 font-bold rounded-2xl flex items-center gap-2 cursor-not-allowed">
                            <CheckCircle className="w-5 h-5" />
                            Proyek Selesai
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
