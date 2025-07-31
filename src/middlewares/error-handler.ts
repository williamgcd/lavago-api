import { Request, Response, NextFunction } from "express";
import { CONFIG } from "@/config";

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    // Show error message to the user, based on the error type;
    if (CONFIG.nodeEnv === 'development') {
        console.info((err as Error).stack);
    }
    
    return res.status(500).send({
        status: 'error',
        statusCode: 500,
        error: 'internal_server_error',
        message: (err as Error).message || 'Internal Server Error',
    });
}; 