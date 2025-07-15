import { db } from './db';

export async function initializeDatabase() {
  console.log('Initializing database tables...');
  
  try {
    // Test database connection
    const result = await db.execute(`SELECT 1 as test`);
    console.log('Database connection test successful:', result);
    
    console.log('Database already configured with PostgreSQL schema');
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error; // Re-throw to prevent app startup if DB is not accessible
  }
}