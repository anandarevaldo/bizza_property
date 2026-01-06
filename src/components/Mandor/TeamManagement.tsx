
import React, { useState } from 'react';
import { Plus, User, Phone, MapPin, Trash2, Shield, Star, Users, Edit2, MessageSquare } from 'lucide-react';
import { serviceTypes } from '../Layanan/RepairServiceSelection/constants';
import { TeamMemberModal } from './TeamMemberModal';
import { MemberReviewsModal } from './MemberReviewsModal';

// Exported for usage in Admin/MandorEditModal
export interface TeamMember {
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


export const initialTeam: TeamMember[] = [
    { id: 1, name: 'Budi Santoso', role: 'Cat', phone: '081234567890', skill: 'Expert', rating: 4.8, experience: '7 Tahun', bio: 'Spesialis cat dekoratif dan tekstur.' },
    { id: 2, name: 'Asep Supriyadi', role: 'Listrik', phone: '081987654321', skill: 'Intermediate', rating: 4.5, experience: '3 Tahun', bio: 'Ahli instalasi listrik rumahan.' },
    { id: 3, name: 'Joko Widodo', role: 'Pipa', phone: '081298765432', skill: 'Expert', rating: 4.9, experience: '10 Tahun', bio: 'Mengatasi segala masalah kebocoran pipa.' },
];

export const TeamManagement: React.FC = () => {
    const [team, setTeam] = useState<TeamMember[]>(initialTeam);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

    const handleDelete = (id: number) => {
        if (window.confirm('Hapus anggota ini dari tim?')) {
            setTeam(team.filter(t => t.id !== id));
        }
    };

    const handleAdd = () => {
        setSelectedMember(null);
        setIsEditModalOpen(true);
    };

    const handleEdit = (member: TeamMember) => {
        setSelectedMember(member);
        setIsEditModalOpen(true);
    };

    const handleViewReviews = (member: TeamMember) => {
        setSelectedMember(member);
        setIsReviewsModalOpen(true);
    };

    const handleSaveMember = (memberData: Partial<TeamMember>) => {
        if (selectedMember) {
            // Edit existing
            setTeam(team.map(t => t.id === selectedMember.id ? { ...t, ...memberData } as TeamMember : t));
        } else {
            // Add new
            const newMember: TeamMember = {
                ...memberData as TeamMember,
                id: Math.random(),
                rating: 0, // New member default rating
            };
            setTeam([...team, newMember]);
        }
        setIsEditModalOpen(false);
    };

    const getRoleStyle = (roleName: string) => {
        const role = serviceTypes.find(s => s.name === roleName);
        return role ? { bg: role.bg, color: role.color, icon: role.icon } : { bg: 'bg-gray-50', color: 'text-gray-600', icon: User };
    };

    return (
        <div className="space-y-12 animate-fade-in font-sans">
            {/* Header */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-gray-100 border border-gray-100 relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                                <Users className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-gray-900">Tim Saya</h2>
                        </div>
                        <p className="text-gray-500 font-medium ml-1">Kelola daftar tukang dan pekerja profesional dalam tim Anda.</p>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-1 flex items-center gap-3"
                    >
                        <Plus className="w-5 h-5" />
                        Tambah Anggota
                    </button>
                </div>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {team.map((member) => {
                    const roleStyle = getRoleStyle(member.role);
                    const RoleIcon = roleStyle.icon;

                    return (
                        <div key={member.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100 hover:shadow-2xl hover:shadow-blue-50 hover:border-blue-100 transition-all group relative overflow-hidden flex flex-col">

                            {/* Actions Top Right */}
                            <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                <button
                                    onClick={() => handleEdit(member)}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                    title="Edit Data"
                                >
                                    <Edit2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(member.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                    title="Hapus Anggota"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Profile Header */}
                            <div className="flex items-center gap-6 mb-8 mt-2">
                                <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center font-black text-3xl group-hover:scale-110 transition-transform shadow-sm ${roleStyle.bg} ${roleStyle.color}`}>
                                    {member.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 leading-tight mb-2">{member.name}</h3>
                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-transparent bg-opacity-60 ${roleStyle.bg} ${roleStyle.color}`}>
                                        <RoleIcon className="w-3.5 h-3.5" />
                                        {member.role}
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-4 flex-1">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group-hover:bg-white group-hover:border-blue-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <span className="font-bold text-gray-600 text-sm">{member.phone}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex-1 flex items-center justify-center gap-2 bg-yellow-50 px-4 py-3 rounded-2xl border border-yellow-100">
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        <span className="font-black text-yellow-700">{member.rating}</span>
                                    </div>
                                    <div className="flex-1 flex items-center justify-center gap-2 bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100 text-gray-500 font-bold text-xs uppercase tracking-wider">
                                        {member.skill === 'Expert' && <Shield className="w-4 h-4 text-blue-600 fill-blue-600" />}
                                        {member.skill}
                                    </div>
                                </div>

                                {member.experience && (
                                    <div className="px-4 py-2 bg-gray-50/50 rounded-xl text-center">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Pengalaman</p>
                                        <p className="font-bold text-gray-700 text-sm">{member.experience}</p>
                                    </div>
                                )}
                            </div>

                            {/* Bottom Action: Reviews */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <button
                                    onClick={() => handleViewReviews(member)}
                                    className="w-full py-3 rounded-xl bg-gray-50 text-gray-500 font-bold text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 group/btn"
                                >
                                    <MessageSquare className="w-4 h-4 text-gray-400 group-hover/btn:text-blue-500" />
                                    Lihat Ulasan Pengguna
                                </button>
                            </div>
                        </div>
                    );
                })}

                {/* Add Member Placeholder Card */}
                <button
                    onClick={handleAdd}
                    className="min-h-[400px] rounded-[2.5rem] border-3 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/30 transition-all gap-6 group"
                >
                    <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-100 group-hover:scale-110 transition-all shadow-sm">
                        <Plus className="w-10 h-10 group-hover:text-blue-600 transiton-colors" />
                    </div>
                    <span className="font-black text-lg">Undang Tukang Baru</span>
                </button>
            </div>

            <TeamMemberModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                member={selectedMember}
                onSave={handleSaveMember}
            />

            <MemberReviewsModal
                isOpen={isReviewsModalOpen}
                onClose={() => setIsReviewsModalOpen(false)}
                memberName={selectedMember?.name || ''}
            />
        </div>
    );
};
