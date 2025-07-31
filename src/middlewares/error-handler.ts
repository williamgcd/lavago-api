import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

import { CONFIG } from "@/config";
import { InvalidRequestBodyError, InvalidRequestParamError, RecordNotFoundError } from "../errors";
import { TResponse } from "../types/responses";

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    // Show error message to the user, based on the error type;
    if (CONFIG.nodeEnv === 'development') {
        console.info((err as Error).stack);
    }
    
    /**
     * Request Errors.
     */
    if (err instanceof InvalidRequestBodyError) {
        return res.status(400).send({
            status: 'error',
            statusCode: 400,
            error: 'invalid_request_body',
            message: err.message,
        } as TResponse<unknown>);
    }
    if (err instanceof InvalidRequestParamError) {
        return res.status(400).send({
            status: 'error',
            statusCode: 400,
            error: 'invalid_request_param',
            message: err.message,
        } as TResponse<unknown>);
    }
    if (err instanceof RecordNotFoundError) {
        return res.status(404).send({
            status: 'error',
            statusCode: 404,
            error: 'record_not_found',
            message: err.message,
        } as TResponse<unknown>);
    }

    /**
     * Server Errors.
     * ZodErrors can come from the database, so we need to handle them here.
     */
    if (err instanceof Error) {
        //console.error('Error!', err.message);
        return res.status(500).send({
            status: 'error',
            statusCode: 500,
            error: 'internal_server_error',
            message: err.message,
        } as TResponse<unknown>);
    }
    if (err instanceof ZodError) {
        // Just show that the request is invalid
        // console.error('ZodError!', err.issues);
        return res.status(400).send({
            status: 'error',
            statusCode: 400,
            error: 'invalid_request',
            message: 'Invalid request',
        } as TResponse<unknown>);
    }
    
    return res.status(500).send('Internal Server Error!');
}