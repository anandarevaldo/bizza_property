'use client';

import React, { useState, useEffect } from 'react';
import { X, Upload, User, Phone, Briefcase, Award, FileText, ChevronDown, Check, Home } from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { ICON_MAP } from '@/lib/constants/serviceTemplates';

interface TeamMember {
    id: number;
    name: string;
    role: string;
    phone: string;
    skill: string;
    rating: number;
    experience?: string;
    bio?: string;
    image?: string;
}

interface TeamMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    member: TeamMember | null;
    onSave: (member: Partial<TeamMember>) => void;
}

export const TeamMemberModal: React.FC<TeamMemberModalProps> = ({ isOpen, onClose, member, onSave }) => {
    const { services } = useServices();
    const [formData, setFormData] = useState<Partial<TeamMember>>({
        name: '',
        role: '',
        phone: '',
        skill: 'Intermediate',
        experience: '1 Tahun',
        bio: '',
    });

    const [selectedRole, setSelectedRole] = useState<{name: string, icon: any, color: string, bg: string}>({
        name: 'Pilih Spesialisasi',
        icon: Briefcase,
        color: 'text-gray-400',
        bg: 'bg-gray-50'
    });
    const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

    useEffect(() => {
        if (services.length > 0 && !formData.role && !member) {
            handleChange('role', services[0].name);
            const Icon = ICON_MAP[services[0].icon_name] || Home;
            setSelectedRole({
                name: services[0].name,
                icon: Icon,
                color: services[0].color_class,
                bg: services[0].bg_gradient.split(' ')[0]
            });
        }
    }, [services]);

    useEffect(() => {
        if (member) {
            setFormData(member);
            const s = services.find(s => s.name === member.role);
            if (s) {
                const Icon = ICON_MAP[s.icon_name] || Home;
                setSelectedRole({
                    name: s.name,
                    icon: Icon,
                    color: s.color_class,
                    bg: s.bg_gradient.split(' ')[0]
                });
            }
        } else {
            setFormData({
                name: '',
                role: services[0]?.name || '',
                phone: '',
                skill: 'Intermediate',
                experience: '1 Tahun',
                bio: '',
            });
            if (services[0]) {
                const Icon = ICON_MAP[services[0].icon_name] || Home;
                setSelectedRole({
                    name: services[0].name,
                    icon: Icon,
                    color: services[0].color_class,
                    bg: services[0].bg_gradient.split(' ')[0]
                });
            }
        }
    }, [member, isOpen, services]);

    const handleChange = (field: keyof TeamMember, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleRoleSelect = (roleName: string) => {
        const s = services.find(s => s.name === roleName);
        if (s) {
            const Icon = ICON_MAP[s.icon_name] || Home;
            setSelectedRole({
                name: s.name,
                icon: Icon,
                color: s.color_class,
                bg: s.bg_gradient.split(' ')[0]
            });
            handleChange('role', roleName);
            setIsRoleDropdownOpen(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in font-sans">
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up border border-gray-100 custom-scrollbar">

                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-gray-100 sticky top-0 bg-white z-20">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 mb-1">
                            {member ? 'Edit Anggota Tim' : 'Tambah Anggota Baru'}
                        </h2>
                        <p className="text-gray-500 font-medium text-sm">Lengkapi data diri dan keahlian anggota tim.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors group"
                    >
                        <X className="w-6 h-6 text-gray-400 group-hover:text-gray-600" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">

                    {/* Basic Info Group */}
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Photo Upload Placeholder */}
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-28 h-28 rounded-[2rem] bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 cursor-pointer hover:border-blue-400 hover:bg-blue-50 hover:text-blue-500 transition-all">
                                    {formData.image ? (
                                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover rounded-[2rem]" />
                                    ) : (
                                        <Upload className="w-8 h-8" />
                                    )}
                                </div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Foto Profil</span>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div>
                                    <label className="block text-sm font-black text-gray-700 mb-2">Nama Lengkap</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={e => handleChange('name', e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-gray-900"
                                            placeholder="Nama Lengkap Tukang"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-black text-gray-700 mb-2">Nomor Telepon</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={e => handleChange('phone', e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-gray-900"
                                            placeholder="0812..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Role Selection */}
                        <div className="relative">
                            <label className="block text-sm font-black text-gray-700 mb-2">Spesialisasi</label>
                            <button
                                type="button"
                                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                                className="w-full flex items-center justify-between p-4 rounded-2xl bg-white border-2 border-gray-100 hover:border-blue-200 transition-all font-bold text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${selectedRole.bg} ${selectedRole.color}`}>
                                        <selectedRole.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-gray-900">{selectedRole.name}</span>
                                </div>
                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isRoleDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[2rem] shadow-xl border border-gray-100 p-2 z-30 max-h-60 overflow-y-auto custom-scrollbar">
                                    {services.map((type) => {
                                        const Icon = ICON_MAP[type.icon_name] || Home;
                                        return (
                                            <button
                                                key={type.id}
                                                type="button"
                                                onClick={() => handleRoleSelect(type.name)}
                                                className={`w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors ${formData.role === type.name ? 'bg-blue-50' : ''}`}
                                            >
                                                <div className={`p-2 rounded-lg ${type.bg_gradient.split(' ')[0]} ${type.color_class}`}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <span className={`font-bold text-sm ${formData.role === type.name ? 'text-blue-700' : 'text-gray-700'}`}>{type.name}</span>
                                                {formData.role === type.name && <Check className="w-4 h-4 text-blue-600 ml-auto" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Skill Level */}
                        <div>
                            <label className="block text-sm font-black text-gray-700 mb-2">Skill Level</label>
                            <div className="relative">
                                <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                    value={formData.skill}
                                    onChange={e => handleChange('skill', e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-gray-900 appearance-none cursor-pointer"
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Expert">Expert</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-black text-gray-700 mb-2">Pengalaman</label>
                        <input
                            type="text"
                            value={formData.experience}
                            onChange={e => handleChange('experience', e.target.value)}
                            className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-gray-900"
                            placeholder="Contoh: 5 Tahun di Konstruksi Gedung"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-black text-gray-700 mb-2">Bio Singkat</label>
                        <textarea
                            value={formData.bio}
                            onChange={e => handleChange('bio', e.target.value)}
                            className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium h-32 resize-none"
                            placeholder="Deskripsi singkat tentang keahlian dan pengalaman kerja..."
                        />
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                        >
                            Simpan Data
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
