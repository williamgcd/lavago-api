import { Request, Response } from 'express';
import { db, sql } from "@/database";
import { users } from "@/database/schemas";
import { GmapsGeocodingClient } from '@/libs/gmaps-geocoding-client';

// Database checks
// Drizzle is used to interact with the database.
async function checkDatabaseDrizzle(): Promise<boolean> {
    try {
        await db.select().from(users);
        return true;
    } catch (error) {
        console.error('❌ Drizzle integration failed:', error);
        return false;
    }
}
// TURSO is used to store the data.
async function checkDatabaseTurso(): Promise<boolean> {
	try {
		await sql.execute({ sql: 'SELECT 1' });
		return true;
	} catch (error) {
		console.error('❌ TURSO database failed:', error);
		return false;
	}
};

// Google integrations checks;
// Google Maps API is being used for geocoding
async function checkLibGoogleMaps(): Promise<boolean> {
    try {
        const client = new GmapsGeocodingClient();
        await client.geocode('13219071');
        return true;
    } catch (error) {
        console.error('❌ Google Maps integration failed:', error);
        return false;
    }
}

// ManyChat is used to send messages to users via WhatsApp.
async function checkLibManychat(): Promise<boolean> {
    // TODO: Check if the manychat is running
    return false;
}

// TODO: Check for Twilio API <~ will be used for notifications and SMS
async function checkLibTwilio(): Promise<boolean> {
    // TODO: Check if the Twilio is running
    return false;
}

// TODO: Add Payment integration checks;
// TODO: Check for PagBank API
// TODO: Check for Stripe;
// TODO: Check for MercadoPago;

export async function appHealth() {
    const integrations = await Promise.all([
        checkDatabaseDrizzle(),
        checkDatabaseTurso(),
        checkLibGoogleMaps(),
        checkLibManychat(),
        checkLibTwilio(),
    ]);

    const status = integrations.every(integration => integration === true);

    return { 
        status: status ? 'ok' : 'degraded',
        env: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        integrations: {
            'database/drizzle': integrations[0] ? 'ok' : 'down',
            'database/turso': integrations[1] ? 'ok' : 'down',
            'lib/googleMaps': integrations[2] ? 'ok' : 'down',
            'lib/manychat': integrations[3] ? 'ok' : 'down',
            'lib/twilio': integrations[4] ? 'ok' : 'down',
        }
    };
}