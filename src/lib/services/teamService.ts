import { supabase } from '../supabaseClient';
import { TeamMember } from '@/components/team-mandor/TeamList';

// DB Interface matching data_anggota table
interface TeamMemberDB {
    anggota_id: number;
    mandor_id: number;
    nama: string;
    role: string;
    phone: string;
    domisili: string;
    bio: string;
    photo_url: string;
    rating: number;
    status: string;
    keahlian?: string;
}

export const teamService = {
    // GET all members for a mandor
    getMembers: async (mandorId: number): Promise<TeamMember[]> => {
        const { data, error } = await supabase
            .from('data_anggota')
            .select('*')
            .eq('mandor_id', mandorId)
            // Sorting by anggota_id since created_at might be missing
            .order('anggota_id', { ascending: false });

        if (error) {
            console.error('Error fetching team members:', error);
            return [];
        }

        return (data || []).map((db: TeamMemberDB) => ({
            id: db.anggota_id,
            name: db.nama,
            role: db.role || 'Umum',
            phone: db.phone,
            rating: Number(db.rating),
            domisili: db.domisili,
            bio: db.bio,
            bio: db.bio,
            image: db.photo_url || undefined,
            keahlian: db.keahlian
        }));
    },

    // CREATE member
    createMember: async (member: Omit<TeamMember, 'id'>, mandorId: number) => {
        const { data, error } = await supabase
            .from('data_anggota')
            .insert({
                mandor_id: mandorId,
                nama: member.name,
                role: member.role,
                phone: member.phone,
                domisili: member.domisili,
                bio: member.bio,
                rating: member.rating || 0,
                rating: member.rating || 0,
                status: 'Available',
                keahlian: member.keahlian
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating team member:', error);
            return null;
        }

        return {
            id: data.anggota_id,
            name: data.nama,
            role: data.role,
            phone: data.phone,
            rating: Number(data.rating),
            domisili: data.domisili,
            bio: data.bio,
            image: data.photo_url
        } as TeamMember;
    },

    // UPDATE member
    updateMember: async (id: number, updates: Partial<TeamMember>) => {
        const updateData: any = {};
        if (updates.name) updateData.nama = updates.name;
        if (updates.role) updateData.role = updates.role;
        if (updates.phone) updateData.phone = updates.phone;
        if (updates.domisili) updateData.domisili = updates.domisili;
        if (updates.bio) updateData.bio = updates.bio;
        if (updates.keahlian) updateData.keahlian = updates.keahlian;
        // image upload logic here if needed

        const { data, error } = await supabase
            .from('data_anggota')
            .update(updateData)
            .eq('anggota_id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating team member:', error);
            return null;
        }
        return true;
    },

    // DELETE member
    deleteMember: async (id: number) => {
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
