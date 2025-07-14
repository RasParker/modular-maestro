import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;

// Use a default database URL for development if not set
const defaultDatabaseUrl = "postgresql://user:password@localhost:5432/xclusive";
const databaseUrl = process.env.DATABASE_URL || defaultDatabaseUrl;

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL not set, using default development database");
}

// Configure Pool with better error handling and connection management
export const pool = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test database connection
pool.on('connect', () => {
  console.log('Database connected successfully');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

export const db = drizzle({ client: pool, schema });