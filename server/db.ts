import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Use PostgreSQL database
const databaseUrl = process.env.DATABASE_URL || "postgresql://runner@localhost:5432/xclusive";

console.log('Connecting to PostgreSQL database...');

// Configure Pool with better error handling and connection management
export const pool = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export const db = drizzle(pool, { schema });

// Test database connection
pool.on('connect', () => {
  console.log('PostgreSQL database connected successfully');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});