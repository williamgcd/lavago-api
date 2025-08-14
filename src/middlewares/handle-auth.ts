import { Request, Response, NextFunction } from 'express';
import { supabaseClient } from '@/providers/supabase';
import { CONFIG } from '@/config';

export const handleAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (CONFIG.NODE_ENV !== 'production') {
        const envToken = process.env.TOKEN;
        req.headers['authorization'] = envToken ? `Bearer ${envToken}` : '';
    }

    const headers = req.headers.authorization;
    if (!headers || !headers.startsWith('Bearer ')) {
        (req as any).user = null;
        return next();
    }

    try {
        // Try to get user information from Supabase
        const token = headers.split(' ')[1];
        const { data, error } = await supabaseClient.auth.getUser(token);
        if (error) {
            (req as any).user = null;
            return next();
        }

        // Set the session for RLS calls
        await supabaseClient.auth.setSession({
            access_token: token,
            refresh_token: 'lavago-temp-token',
        });

        const metadata = data.user.user_metadata;
        (req as any).user = {
            impersonator_id: metadata.impersonator_id || null,
            user_id: metadata.id || data.user.id,
            role: metadata.role || 'client',
        };

        console.log('✅ Supabase user verified', metadata);
        return next();
    } catch (err) {
        (req as any).user = null;
        return next();
    }
};
