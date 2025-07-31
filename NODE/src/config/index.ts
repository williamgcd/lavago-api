import 'dotenv/config';

export const CONFIG = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',

	geofence: {
		radius: 1000,
	},
    
	googleMaps: {
		apiKey: process.env.GOOGLE_MAPS_API_KEY,
	},

	/**
	 * Payment providers configuration
	 */
	pagbank: {
		apiKey: process.env.PAGBANK_API_KEY,
		baseUrl: process.env.PAGBANK_BASE_URL || 'https://sandbox.api.pagseguro.com',
		webhookSecret: process.env.PAGBANK_WEBHOOK_SECRET,
	},

	/**
	 * Database configuration
	 */
	databaseTurso: {
		url: process.env.TURSO_DATABASE_URL,
		authToken: process.env.TURSO_AUTH_TOKEN,
	},
	databaseSupabase: {
		url: process.env.SUPABASE_DATABASE_URL,
		authToken: process.env.SUPABASE_DATABASE_AUTH_TOKEN,
	}
};
