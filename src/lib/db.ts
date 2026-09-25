import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing or empty in environment variables. Please check your .env.local file.');
}

// neon returns a SQL query function
export const sql = neon(process.env.DATABASE_URL);
