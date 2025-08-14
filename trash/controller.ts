import { Request, Response } from 'express';
import { TResponse } from '@/shared/types/responses';

import { ContextRequest, ContextUpdate } from './types';
import { contextService } from './service';

export const contextController = {
    /**
     * Get user context for WhatsApp bot
     */
    getUserContext: async (req: Request, res: Response) => {
        const params = ContextRequest.parse(req.query);
        const context = await contextService.getUserContext(params);
        
        res.status(200).json({
            status: 'success',
            data: context,
        } as TResponse);
    },

    /**
     * Update user context with new information
     */
    updateContext: async (req: Request, res: Response) => {
        const update = ContextUpdate.parse(req.body);
        await contextService.updateContext(update);
        
        // Get fresh context after update
        const context = await contextService.getUserContext({
            phone: update.phone,
            session_id: update.session_id,
        });
        
        res.status(200).json({
            status: 'success',
            data: context,
        } as TResponse);
    },
};