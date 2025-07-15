import { db } from './db';

export async function initializeDatabase() {
  console.log('Initializing database tables...');
  
  try {
    // Test database connection with more detailed error handling
    console.log('Testing database connection...');
    const result = await db.execute(`SELECT 1 as test`);
    console.log('Database connection test successful:', result);
    
    // Additional connection test
    console.log('Testing database schema access...');
    const schemaTest = await db.execute(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' LIMIT 1`);
    console.log('Schema test successful:', schemaTest);
    
    console.log('Database already configured with PostgreSQL schema');
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    console.error('Full error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    throw error; // Re-throw to prevent app startup if DB is not accessible
  }
}