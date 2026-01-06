
import { supabase } from '../supabaseClient';
import { SignUpWithPasswordCredentials } from '@supabase/supabase-js';

export const authService = {
    async signUp(data: SignUpWithPasswordCredentials) {
        const { data: result, error } = await supabase.auth.signUp(data);
        if (error) throw error;
        return result;
    },

    async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    },

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    async getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    async getSession() {
        const { data: { session } } = await supabase.auth.getSession();
        return session;
    }
};
