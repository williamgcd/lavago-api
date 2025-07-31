import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import { errorHandler } from './middlewares/error-handler';
import { jsonValidator } from './middlewares/json-validator';
import { basicRateLimiter } from './middlewares/rate-limiter';

import { adminRoutes } from './routes/admin.routes';

import { authRoutes } from './features/auth/auth.routes';
import { authGuards } from './features/auth';
import { appHealth } from './app-health';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting middleware (simple, by IP)
app.use(basicRateLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// JSON validator middleware
// This is needed for POST and PUT requests
app.use(jsonValidator);

// App is running...
app.get('/', async (_, res, next) => {
    res.status(200).json({
        status: 'ok',
        message: 'LavaGo API is running...',
    });
});

// Health check
app.get('/health', async (_, res, next) => {
    try {
        const health = await appHealth();
        res.status(200).json(health);
    } catch (error) {
        next(error);
    }
});

// TODO:
// This middleware is responsible for checking if the request has a valid APP key
// If the request has a valid APP key, the request will be processed
// If the request does not have a valid APP key, the request will be rejected
// app.use(appKeyMiddleware);

/**
 * AUTHENTICATION
 * @see: src/features/auth/auth.routes.ts
 */
app.use('/auth', authRoutes);

// MCP ServerRoutes
// TODO:
// We will have a MCP server that will be responsible for handling the MCP requests
// These will be the routes that will be used to interact with the MCP server
// The routes will be based on the User's phone, and he wont be able to extract data, just to send data
// So the registration and other things will be abstracted from the requests;
// app.use('/mcp/v1', mcpRoutes);

// TODO:
// For the user to interact with the entities, they will use a /client route
// These routes will be used to get the user's data and to update the user's data
// The user will only be able to get his own data and to update his own data
// app.use(authGuards.byRole(['CLIENT','WASHER', 'ADMIN', 'SUPER']));
// app.use('/client/v1', clientRoutes);

// TODO:
// For the user to interact with the entities, they will use a /washer route
// These routes will be used to get the user's data and to update the user's data
// The user will only be able to get his own data and to update his own data
// app.use(authGuards.byRole(['WASHER','ADMIN', 'SUPER']));
// app.use('/washer/v1', washerRoutes);

/**
 * API Routes
 */
app.use('/admin/v1', adminRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;