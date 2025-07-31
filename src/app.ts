import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import { CONFIG } from '@/config';
import { errorHandler } from '@/middlewares/error-handler';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// App is running...
app.get('/', async (_, res) => {
    res.status(200).json({
        status: 'ok',
        message: `${CONFIG.api.name} is running...`,
        version: CONFIG.api.version,
        environment: CONFIG.nodeEnv
    });
});

// Health check
app.get('/health', async (_, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: CONFIG.nodeEnv,
        version: CONFIG.api.version
    });
});

// Test path alias endpoint
app.get('/test-config', async (_, res) => {
    res.status(200).json({
        message: 'Path aliases are working!',
        config: {
            port: CONFIG.port,
            nodeEnv: CONFIG.nodeEnv,
            baseUrl: CONFIG.baseUrl
        }
    });
});

// Error handling middleware
app.use(errorHandler);

export default app; 