import { CONFIG } from './config';

export const healthCheck = async () => ({
    status: 'ok',
    url: CONFIG.APP_BASE,
    txt: CONFIG.APP_NAME,
    env: process.env.NODE_ENV,
    version: process.env.npm_package_version || 'unknown',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
});
