import { CONFIG } from '@/config';
import { supabaseClient } from '@/providers/supabase';

type TSupabaseUser = {
    user_id: string;
    role: string;
    email?: string;
    phone?: string;
};

const generateEmail = (id: string) => {
    return `${id}${CONFIG.AUTH_DOMAIN}`;
};
const generatePassword = (id: string) => {
    return id.slice(CONFIG.AUTH_SLICE_LENGTH);
};

export const authClient = {
    auth: async (user: TSupabaseUser, retry = true) => {
        const id = user.user_id as string;

        // Try to sign in first (user might already exist)
        // Use a temporary email and password.
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: generateEmail(id),
            password: generatePassword(id),
        });

        if (!error && data.session) {
            // User is signed in, update user profile
            await supabaseClient.auth.updateUser({ data: user });

            // Set app_metadata using admin API after signup
            await supabaseClient.auth.admin.updateUserById(data.user.id, {
                app_metadata: user,
                email_confirm: true, // Auto-confirm email
                phone_confirm: true, // Auto-confirm phone
            });

            return data.session.access_token;
        }

        if (!retry) {
            console.error('authClient.auth', 'retry', user);
            throw new Error('Failed to authenticate');
        }

        const signedUp = await authClient.signUp(user);
        if (!signedUp) {
            console.error('authClient.auth', 'signUp', user);
            throw new Error('Failed to authenticate');
        }
        return authClient.auth(user, false);
    },

    getActiveUser: async () => {
        const user = await supabaseClient.auth.getUser();
        return user;
    },

    signUp: async (user: TSupabaseUser) => {
        const id = user.user_id as string;

        // Sign-up a new user on Supabase
        // Use a temporary email and password.
        const { data, error } = await supabaseClient.auth.signUp({
            email: generateEmail(id),
            password: generatePassword(id),
        });

        if (error || !data.user) {
            console.error('authClient.signUp', 'data', data);
            console.error('authClient.signUp', 'error', error);
            throw error;
        }
        return data.user;
    },
};
