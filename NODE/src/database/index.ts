import { createClient } from '@libsql/client';

import { CONFIG } from '@/config';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schemas';

if (!CONFIG.databaseTurso.url || !CONFIG.databaseTurso.authToken) {
    throw new Error('Database configuration is not set');
}

const client = createClient({
    url: CONFIG.databaseTurso.url!,
    authToken: CONFIG.databaseTurso.authToken!,
});

const db = drizzle(client, { schema });

export { client, client as sql, db };