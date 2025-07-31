export const CONFIG = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    
    // Test configuration
    api: {
        version: '1.0.0',
        name: 'LavaGo API (Bun)'
    }
}; 