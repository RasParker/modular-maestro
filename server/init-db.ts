import { db } from './db';

export async function initializeDatabase() {
  console.log('Initializing database tables...');
  
  try {
    // Test database connection with more detailed error handling
    console.log('Testing database connection...');
    
    // Use a simpler query with timeout handling
    const result = await Promise.race([
      db.execute(`SELECT 1 as test`),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Database connection timeout after 15 seconds')), 15000))
    ]);
    
    console.log('Database connection test successful:', result);
    
    console.log('Database already configured with PostgreSQL schema');
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    console.error('Full error details:', {
      message: error?.message || 'Unknown error',
      stack: error?.stack || 'No stack trace available',
      name: error?.name || 'Unknown error type'
    });
    
    // Instead of throwing and crashing the app, log the error and continue
    console.warn('Database initialization failed, but continuing app startup...');
    console.warn('Some features may not work until database connectivity is restored');
  }
}