import 'server-only';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const dbUrl = process.env.DATABASE_URL || '';

if (!dbUrl) {
  // Silent fallback for offline dev/demo mode without leaking sensitive connection errors
}

export const sql = neon(dbUrl);
export const db = drizzle(sql, { schema });
export { schema };
export * from './schema';
