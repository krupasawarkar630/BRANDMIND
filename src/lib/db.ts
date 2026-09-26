import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './db/schema';

const dbUrl = process.env.DATABASE_URL || '';

export const sql = neon(dbUrl);
export const db = drizzle(sql, { schema });

export { schema };
export * from './db/schema';
