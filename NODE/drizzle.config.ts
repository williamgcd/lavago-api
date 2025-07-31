import { defineConfig } from "drizzle-kit";
import 'dotenv/config';

export default defineConfig({
    schema: "./src/features/**/*.schema.ts",
    out: "./src/database/migrations",
    dialect: "turso",
    dbCredentials: {
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!,
    },
    verbose: true,
    strict: true,
});