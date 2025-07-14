import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from "@shared/sqlite-schema";

// Use SQLite for development
console.log('Using SQLite database for development');

const sqlite = new Database('./dev.db');
export const db = drizzle(sqlite, { schema });

// Create a mock pool for compatibility with session store
export const pool = {
  query: async () => ({ rows: [] }),
  connect: () => {},
  end: () => {},
  on: () => {}
};

console.log('Database setup completed successfully');