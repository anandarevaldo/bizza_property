'use client';

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, User, HardHat, CheckCircle2, X, ChevronDown, Loader2, Plus, Trash2 } from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { teamService } from '@/lib/services/teamService';
import { TeamMember } from '../team-mandor/TeamList';

interface Schedule {
    id: string;
    customerName: string;
    service: string;
    date: string;
    time: string;
    address: string;
    mandor: string;
    mandorId?: number;
    assignedHandymanId?: number; // Legacy
    assignedHandymen?: { id: number; name: string; knownSkill?: string }[]; // New
    handymanName?: string;
    handymanSkill?: string;
    status: 'Need Validation' | 'On Progress' | 'Cancel' | 'Done';
}

interface ScheduleEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    schedule: Schedule | null;
    selectedDate: string;
    onSave: (scheduleData: Partial<Schedule> & { assignedHandymenIds?: number[] }, isNew: boolean) => void;
    isSaving?: boolean;
}

export const MandorScheduleEditModal: React.FC<ScheduleEditModalProps> = ({ isOpen, onClose, schedule, selectedDate, onSave, isSaving = false }) => {

    const [formData, setFormData] = useState<Partial<Schedule>>({});
    const { services: dbServices } = useServices();
    const [availableHandymen, setAvailableHandymen] = useState<TeamMember[]>([]);
    const [filterSkill, setFilterSkill] = useState<string>('');
    
    // New state for multi-select
    const [selectedHandymenIds, setSelectedHandymenIds] = useState<number[]>([]);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                // Fetch members for Mandor (assuming ID 1 for now or from context)
                const MANDOR_ID = 1;
                const data = await teamService.getMembers(MANDOR_ID);
                setAvailableHandymen(data);
            } catch (error) {
                console.error('Error fetching team:', error);
            }
        };
        fetchTeam();
    }, []);

    useEffect(() => {
        if (isOpen) {
            if (schedule) {
                setFormData(schedule);
                // Initialize selected IDs from schedule.assignedHandymen
                if (schedule.assignedHandymen && schedule.assignedHandymen.length > 0) {
                    setSelectedHandymenIds(schedule.assignedHandymen.map(h => h.id));
                } else if (schedule.assignedHandymanId) {
                    // Fallback to legacy single ID
                    setSelectedHandymenIds([schedule.assignedHandymanId]);
                } else {
                    setSelectedHandymenIds([]);
                }
            } else {
                setFormData({ date: selectedDate, status: 'On Progress' });
                setFilterSkill('');
                setSelectedHandymenIds([]);
            }
        }
    }, [isOpen, schedule, selectedDate]);

    // Derived list of selected handyman objects
    const selectedHandymen = availableHandymen.filter(h => selectedHandymenIds.includes(h.id));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSaving) return; 
        
        // Pass the array of IDs to onSave
        onSave({
            ...formData,
            assignedHandymenIds: selectedHandymenIds
        }, !schedule);
    };

    // Auto-set filter skill if not set, maybe based on first assigned? 
    // Or just leave empty. Previous logic was specific to single select.
    // Let's keep it simple: if list is empty, default blank. If editing, maybe preselect based on service?
    // User requested auto-select before, but with multi-select of potentially mixed skills, it's tricky.
    // Let's try to match the first one's skill if filter is empty.
    useEffect(() => {
        if (isOpen && schedule?.assignedHandymen && schedule.assignedHandymen.length > 0 && !filterSkill && availableHandymen.length > 0) {
             const firstId = schedule.assignedHandymen[0].id;
             const h = availableHandymen.find(m => m.id === firstId);
             if (h) setFilterSkill(h.keahlian || '');
        }
    }, [isOpen, schedule, availableHandymen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            {/* ... Modal Wrapper ... */}
            <div className="bg-white rounded-[1.5rem] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up border border-gray-100">
                {/* ... Header ... */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <div>
                        <h3 className="text-xl font-black text-gray-900">{schedule ? 'Edit Jadwal' : 'Jadwal Baru'}</h3>
                        <p className="text-gray-500 text-xs font-medium mt-1">
                            {schedule ? `Edit data kunjungan & penugasan` : 'Tugaskan Tukang untuk proyek ini'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors group border border-transparent hover:border-gray-200">
                        <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* ... Time & Status ... */}
                    <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" /> Waktu & Status
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Tanggal</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={formData.date || ''}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full p-2.5 pl-9 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-bold text-gray-700 text-sm bg-white"
                                        required
                                    />
                                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Jam</label>
                                <div className="relative">
                                    <input
                                        type="time"
                                        value={formData.time || ''}
                                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                                        className="w-full p-2.5 pl-9 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-bold text-gray-700 text-sm bg-white"
                                        required
                                    />
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Status</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['On Progress', 'Done', 'Cancel'].map((status) => (
                                    <button
                                        key={status}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, status: status as any })}
                                        className={`px-2 py-2 rounded-lg text-xs font-bold border transition-all ${formData.status === status
                                            ? status === 'On Progress' ? 'bg-blue-50 border-blue-500 text-blue-700' :
                                                status === 'Done' ? 'bg-green-50 border-green-500 text-green-700' :
                                                    'bg-red-50 border-red-500 text-red-700'
                                            : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ... Customer Info ... */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-600" /> Informasi Pelanggan
                        </h4>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nama Pelanggan</label>
                                <input
                                    type="text"
                                    value={formData.customerName || ''}
                                    onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-sm"
                                    placeholder="Contoh: Ibu Siti"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Alamat Lengkap</label>
                                <div className="relative">
                                    <textarea
                                        value={formData.address || ''}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full p-3 pl-10 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-sm min-h-[80px]"
                                        placeholder="Jl. Contoh No. 123..."
                                        required
                                    />
                                    <MapPin className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section: Allocation */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <HardHat className="w-4 h-4 text-blue-600" /> Detail Penugasan
                        </h4>
                        <div className="mt-4 space-y-4">
                            
                            {/* Skill & Add Control */}
                            <div className="grid grid-cols-2 gap-4 items-end">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                        FILTER KEAHLIAN
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={filterSkill}
                                            onChange={e => setFilterSkill(e.target.value)}
                                            className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-sm appearance-none bg-white"
                                        >
                                            <option value="">Semua Keahlian</option>
                                            {dbServices.map((service) => (
                                                <option key={service.id} value={service.name}>
                                                    {service.name}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                        TAMBAH TUKANG
                                    </label>
                                    <div className="relative">
                                         <select
                                            value=""
                                            onChange={e => {
                                                const selectedId = parseInt(e.target.value);
                                                if (selectedId && !selectedHandymenIds.includes(selectedId)) {
                                                    setSelectedHandymenIds([...selectedHandymenIds, selectedId]);
                                                }
                                            }}
                                            className={`w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-sm appearance-none bg-white ${!filterSkill ? 'bg-gray-50 text-gray-400' : ''}`}
                                            disabled={!filterSkill || (!!filterSkill && availableHandymen.filter(h => h.keahlian === filterSkill).length === 0)}
                                        >
                                            <option value="" disabled>
                                                {!filterSkill ? 'Pilih Keahlian...' : '+ Pilih Tukang'}
                                            </option>
                                            
                                            {availableHandymen
                                                .filter(h => h.keahlian === filterSkill)
                                                .filter(h => !selectedHandymenIds.includes(h.id)) // Exclude already selected
                                                .map((tukang: TeamMember) => (
                                                    <option key={tukang.id} value={tukang.id}>
                                                        {tukang.name}
                                                    </option>
                                                ))}

                                            {filterSkill && availableHandymen.filter(h => h.keahlian === filterSkill).length === 0 && (
                                                <option value="" disabled>Tidak ada tukang {filterSkill}</option>
                                            )}
                                        </select>
                                        <Plus className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Selected List */}
                            {selectedHandymen.length > 0 ? (
                                <div className="space-y-2">
                                     <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                        TIM BERTUGAS ({selectedHandymen.length})
                                    </label>
                                    {selectedHandymen.map(member => (
                                        <div key={member.id} className="flex items-center justify-between p-3 bg-blue-50/50 rounded-xl border border-blue-100 group hover:border-blue-300 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">{member.name}</p>
                                                    <p className="text-xs text-gray-500 font-medium">{member.keahlian || 'Anggota Tim'}</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedHandymenIds(prev => prev.filter(id => id !== member.id))}
                                                className="p-1.5 bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-gray-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-center">
                                    <p className="text-gray-400 text-sm font-medium">Belum ada tukang ditugaskan.</p>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-3 rounded-xl font-bold text-gray-500 text-sm hover:bg-gray-50 hover:text-gray-700 transition-all"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-200 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    Simpan
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
