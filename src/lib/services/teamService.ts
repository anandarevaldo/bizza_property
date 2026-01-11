import { supabase } from '../supabaseClient';
import { TeamMember } from '@/components/team-mandor/TeamList';

export const teamService = {
    getMembers: async (mandorId: number): Promise<TeamMember[]> => {
        const { data, error } = await supabase
            .from('data_anggota')
            .select('*')
            .eq('mandor_id', mandorId)
            .eq('status_aktif', true);

        if (error) {
            console.error('Error fetching team members:', error);
            return [];
        }

        return (data || []).map((item: any) => ({
            id: item.anggota_id,
            name: item.nama,
            role: item.spesialis,
            phone: item.kontak,
            skill: item.keahlian_level || 'Intermediate',
            rating: item.rating || 0,
            experience: item.pengalaman || '1 Tahun',
            bio: item.bio || '',
        }));
    },

    createMember: async (member: Omit<TeamMember, 'id'>, mandorId: number): Promise<TeamMember | null> => {
        const payload = {
            mandor_id: mandorId,
            nama: member.name,
            spesialis: member.role,
            kontak: member.phone,
            wilayah: 'Jakarta', // Default value
            status_aktif: true,
            keahlian_level: member.skill,
            pengalaman: member.experience,
            bio: member.bio,
            rating: member.rating || 0
        };

        const { data, error } = await supabase
            .from('data_anggota')
            .insert(payload)
            .select()
            .single();

        if (error) {
            console.error('Error creating team member:', error);
            return null;
        }

        return {
            id: data.anggota_id,
            name: data.nama,
            role: data.spesialis,
            phone: data.kontak,
            skill: data.keahlian_level,
            rating: data.rating || 0,
            experience: data.pengalaman,
            bio: data.bio
        };
    },

    updateMember: async (id: number, member: Partial<TeamMember>): Promise<TeamMember | null> => {
        const payload: any = {};
        if (member.name !== undefined) payload.nama = member.name;
        if (member.role !== undefined) payload.spesialis = member.role;
        if (member.phone !== undefined) payload.kontak = member.phone;
        if (member.skill !== undefined) payload.keahlian_level = member.skill;
        if (member.experience !== undefined) payload.pengalaman = member.experience;
        if (member.bio !== undefined) payload.bio = member.bio;
        if (member.rating !== undefined) payload.rating = member.rating;

        const { data, error } = await supabase
            .from('data_anggota')
            .update(payload)
            .eq('anggota_id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating team member:', error);
            return null;
        }

        return {
            id: data.anggota_id,
            name: data.nama,
            role: data.spesialis,
            phone: data.kontak,
            skill: data.keahlian_level,
            rating: data.rating || 0,
            experience: data.pengalaman,
            bio: data.bio
        };
    },

    deleteMember: async (id: number): Promise<boolean> => {
        const { error } = await supabase
            .from('data_anggota')
            .delete()
            .eq('anggota_id', id);

        if (error) {
            console.error('Error deleting team member:', error);
            return false;
        }
        return true;
    }
};
