import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import createHttpError from 'http-errors';

import { handleAudit } from './middlewares/handle-audit';
import { handleAuth } from './middlewares/handle-auth';
import { handleError } from './middlewares/handle-error';
import { handleJson } from './middlewares/handle-json';
import { handleLimiter } from './middlewares/handle-limiter';

import { admRoutes } from './app/routes/adm.routes';
import { appRoutes } from './app/routes/app.routes';
import { botRoutes } from './app/routes/bot.routes';
import { mcpRoutes } from './app/routes/mcp.routes';

import { respond } from './shared/helpers/respond';

import { healthCheck } from './app-health';

const app = express();

// Security middlewares
app.use(cors());
app.use(helmet());

// Rate limiting middleware
app.use(handleLimiter('basic'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(handleJson);
app.use(handleAuth);

// AuditLog ~> Add request context
app.use(handleAudit.context);

/**
 * App is running...
 * @route GET /
 */
app.get('/', (req, res) => {
    const name = process.env.npm_package_name;
    const version = process.env.npm_package_version;
    respond.message(res, `${name} v.${version} is running...`);
});

/**
 * Health check
 * @route GET /health
 */
app.get('/health', async (req, res) => {
    const health = await healthCheck();
    respond.success(res, health);
});

/**
 * APIs Routers
 * @see: src/app/routes
 */
app.use('/adm/v1', admRoutes);
app.use('/app/v1', appRoutes);
app.use('/bot/v1', botRoutes);
app.use('/mcp/v1', mcpRoutes);

/**
 * Webhooks handlers
 * @see: src/webhooks
 */
// app.use('/webhooks/v1', webhookRoutes);

// AuditLog ~> Dumps logs from request
app.use(handleAudit.logs);

// Error handling
// https://expressjs.com/en/guide/error-handling.html
app.use((_req, _res, next) => {
    next(createHttpError.NotFound());
});
app.use(handleError);

export { app };
export default app;
