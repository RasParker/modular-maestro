
import { db } from './db';
import fs from 'fs';
import path from 'path';

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
    
    // Read and execute the SQL schema file
    const sqlFilePath = path.join(__dirname, 'create-tables.sql');
    if (fs.existsSync(sqlFilePath)) {
      console.log('Reading SQL schema file...');
      const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
      
      console.log('Executing database schema...');
      await db.execute(sqlContent);
      
      console.log('Database schema created successfully');
    } else {
      console.warn('SQL schema file not found, skipping table creation');
    }
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    console.error('Full error details:', {
      message: (error as any)?.message || 'Unknown error',
      stack: (error as any)?.stack || 'No stack trace available',
      name: (error as any)?.name || 'Unknown error type'
    });
    
    // Instead of throwing and crashing the app, log the error and continue
    console.warn('Database initialization failed, but continuing app startup...');
    console.warn('Some features may not work until database connectivity is restored');
  }
}
