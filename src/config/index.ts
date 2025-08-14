import 'dotenv/config';

const DEV = 'development';
const PRD = 'production';

export const CONFIG = {
    NODE_ENV: process.env.NODE_ENV || DEV,

    APP_BASE: process.env.APP_BASE || 'http://localhost:3000',
    APP_NAME: process.env.APP_NAME || 'LAVAGO API',

    JWT_SECRET: process.env.JWT_SECRET || 'secret',
    JWT_LENGTH: process.env.JWT_LENGTH || '10d',

    AUTH_DOMAIN: '@lavago.com.br',
    AUTH_SLICE_LENGTH: -12,

    /**
     * Supabase Config
     */
    SUPABASE: {
        url: process.env.SUPABASE_URL!,
        key: process.env.SUPABASE_SECRET_KEY!,
    },

    /**
     * MercadoPago Config
     */
    MERCADOPAGO: {},

    /**
     * PagBank Config
     */
    PAGBANK: {
        key: process.env.PAGBANK_API_KEY!,
        url: process.env.PAGBANK_URL || 'http://sandbox.api.pagseguro.com',
        timeout: 3000,
    },
};
