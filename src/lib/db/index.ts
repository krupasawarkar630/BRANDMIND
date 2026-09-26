import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.warn('DATABASE_URL is missing in environment variables. Database operations will fail if invoked.');
}

const client = neon(dbUrl || '');

export const db = drizzle(client, { schema });
export { schema };
export * from './schema';
