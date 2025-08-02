import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

console.log('Using PostgreSQL database');

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 5, // Reduced pool size for faster startup
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000, // Reduced to 5 seconds for faster feedback
  statement_timeout: 15000, // Reduced to 15 seconds
  query_timeout: 15000, // Reduced to 15 seconds
  allowExitOnIdle: true, // Allow pool to exit when idle
});

export const db = drizzle({ client: pool, schema });

console.log('Database setup completed successfully');