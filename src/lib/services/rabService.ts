import { supabase } from '../supabaseClient';
import { PostgrestError } from '@supabase/supabase-js';

export interface RABItem {
    item_id?: number;
    rab_id?: number;
    nama_item: string;
    qty: number;
    harga_satuan: number;
    total_harga?: number;
}

export interface MandorExpense {
    expense_id?: number;
    rab_id?: number;
    nama_barang: string;
    qty: number;
    harga_satuan: number;
    total_harga?: number;
    tanggal_beli?: string;
    bukti_foto?: string;
    created_at?: string;
}

export interface RAB {
    rab_id: number;
    pesanan_id?: number | null; // Optional link to order
    mandor_id?: number | null; // Linked to mandor
    project_name: string;
    total_biaya: number;
    catatan: string;
    status_rab: 'MENUNGGU_PERSETUJUAN' | 'DISETUJUI' | 'DITOLAK';
    created_at?: string;
    items?: RABItem[];
    expenses?: MandorExpense[]; // Actual spending
}

export const rabService = {
    // READ
    async getRABs(mandorId?: number) {
        let query = supabase
            .from('rab_order')
            .select(`
                *,
                items:rab_items(*),
                expenses:mandor_expenses(*)
            `)
            .order('created_at', { ascending: false });

        if (mandorId) {
            query = query.eq('mandor_id', mandorId);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data as RAB[];
    },

    // CREATE
    async createRAB(rab: Omit<RAB, 'rab_id' | 'created_at'>, items: Omit<RABItem, 'item_id' | 'rab_id'>[]) {
        // 1. Insert RAB Header
        const { data: rabData, error: rabError } = await supabase
            .from('rab_order')
            .insert([{
                project_name: rab.project_name,
                total_biaya: rab.total_biaya,
                catatan: rab.catatan,
                status_rab: rab.status_rab,
                mandor_id: rab.mandor_id
            }])
            .select() // Need ID
            .single();

        if (rabError) throw rabError;

        if (items && items.length > 0) {
            const itemsWithId = items.map(item => ({
                ...item,
                rab_id: rabData.rab_id
            }));

            const { error: itemsError } = await supabase
                .from('rab_items')
                .insert(itemsWithId);

            if (itemsError) throw itemsError;
        }

        return rabData;
    },

    // UPDATE
    async updateRAB(id: number, updates: Partial<RAB>, newItems?: RABItem[]) {
        // Update Header
        const { error: rabError } = await supabase
            .from('rab_order')
            .update(updates)
            .eq('rab_id', id);

        if (rabError) throw rabError;

        // If items are provided, replace them (simple strategy: delete all, re-insert)
        // Or handle upsert if complex. For simplicity: Delete All -> Insert All is safer for strictly consistency if items changed significantly.
        if (newItems) {
            // Delete existing
            await supabase.from('rab_items').delete().eq('rab_id', id);

            // Insert new
            const itemsWithId = newItems.map(item => ({
                ...item,
                rab_id: id,
                item_id: undefined // Let DB generate new IDs
            }));

            const { error: itemsError } = await supabase
                .from('rab_items')
                .insert(itemsWithId);

            if (itemsError) throw itemsError;
        }
    },

    // DELETE
    async deleteRAB(id: number) {
        const { error } = await supabase
            .from('rab_order')
            .delete()
            .eq('rab_id', id);
        if (error) throw error;
    },

    // EXPENSES
    async addExpense(expense: MandorExpense) {
        const { data, error } = await supabase
            .from('mandor_expenses')
            .insert([expense])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async deleteExpense(id: number) {
        const { error } = await supabase
            .from('mandor_expenses')
            .delete()
            .eq('expense_id', id);
        if (error) throw error;
    }
};
