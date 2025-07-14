import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from "@shared/schema";

// Use SQLite for development if PostgreSQL is not available
let db: any;

let pool: any;

if (process.env.DATABASE_URL) {
  // Production: use PostgreSQL
  const { Pool } = require('pg');
  const { drizzle: drizzlePg } = require('drizzle-orm/node-postgres');
  
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });
  
  db = drizzlePg(pool, { schema });
} else {
  // Development: use SQLite
  console.warn("DATABASE_URL not set, using SQLite for development");
  const sqlite = new Database(':memory:');
  db = drizzle(sqlite, { schema });
}

// Test database connection for PostgreSQL
if (process.env.DATABASE_URL && typeof pool !== 'undefined') {
  pool.on('connect', () => {
    console.log('PostgreSQL database connected successfully');
  });

  pool.on('error', (err) => {
    console.error('Database connection error:', err);
  });
}

export { db, pool };