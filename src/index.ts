import app from './app';
import { CONFIG } from '@/config';

const PORT = CONFIG.port;

if (import.meta.main) {
    app.listen(PORT, () => {
        console.log(`🚀 ${CONFIG.api.name} running on port ${PORT}`);
        console.log(`📊 Health check: http://localhost:${PORT}/health`);
        console.log(`🔧 Test config: http://localhost:${PORT}/test-config`);
    });
}

export default app; 