
import { db } from './db';
import { sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initializeDatabase() {
  console.log('Initializing database tables...');
  
  try {
    // Test database connection with shorter timeout for faster feedback
    console.log('Testing database connection...');
    
    const result = await Promise.race([
      db.execute(sql`SELECT 1 as test`),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Database connection timeout after 5 seconds')), 5000))
    ]);
    
    console.log('Database connection test successful');
    
    // Check if tables already exist to skip schema creation if possible
    const tablesCheck = await db.execute(sql`
      SELECT COUNT(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('users', 'posts', 'subscriptions')
    `);
    
    const tableCount = (tablesCheck as any).rows[0]?.table_count || 0;
    
    if (parseInt(tableCount) >= 3) {
      console.log('Core tables already exist, skipping schema creation');
      return;
    }
    
    // Read and execute the optimized SQL schema file
    const sqlFilePath = path.join(__dirname, 'create-tables-optimized.sql');
    if (fs.existsSync(sqlFilePath)) {
      console.log('Reading SQL schema file...');
      const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
      
      console.log('Executing database schema...');
      await db.execute(sql.raw(sqlContent));
      
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
