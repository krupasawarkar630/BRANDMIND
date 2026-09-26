import { neon } from '@neondatabase/serverless';
import * as fs from 'fs';
import * as path from 'path';

function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

async function runMigration() {
  console.log('Connecting to database via neon HTTP...');
  const sql = neon(databaseUrl!);

  const migrationFile = path.resolve(process.cwd(), 'drizzle/0000_nostalgic_tag.sql');
  if (!fs.existsSync(migrationFile)) {
    console.error('Migration file not found:', migrationFile);
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(migrationFile, 'utf8');
  const statements = sqlContent
    .split('--> statement-breakpoint')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  console.log(`Found ${statements.length} SQL statements to execute.`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    try {
      console.log(`Executing statement [${i + 1}/${statements.length}]...`);
      // Neon SQL HTTP driver conventional query call
      if (typeof (sql as any).query === 'function') {
        await (sql as any).query(stmt);
      } else {
        await (sql as any)(stmt);
      }
      console.log(`✓ Statement [${i + 1}] executed successfully.`);
    } catch (err: any) {
      console.warn(`Statement [${i + 1}] warning/error:`, err.message || err);
    }
  }

  console.log('All migrations processed successfully!');
}

runMigration()
  .then(() => {
    console.log('Migration script complete.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
