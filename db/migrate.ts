import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envConfig = fs.readFileSync(envLocalPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
}

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("DATABASE_URL is missing or empty in .env.local");
  process.exit(1);
}

const sql = neon(dbUrl);

async function migrate() {
  console.log("Starting migration...");

  try {
    // Enable uuid-ossp extension for uuid_generate_v4() if needed, though we can use gen_random_uuid() which is native in PG 13+
    
    await sql`
      CREATE TABLE IF NOT EXISTS brand_versions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        data JSONB NOT NULL
      );
    `;
    console.log("Created table: brand_versions");

    await sql`
      CREATE TABLE IF NOT EXISTS blind_spots (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        data JSONB NOT NULL
      );
    `;
    console.log("Created table: blind_spots");

    await sql`
      CREATE TABLE IF NOT EXISTS timeline_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        data JSONB NOT NULL
      );
    `;
    console.log("Created table: timeline_events");

    await sql`
      CREATE TABLE IF NOT EXISTS crisis_responses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        data JSONB NOT NULL
      );
    `;
    console.log("Created table: crisis_responses");

    await sql`
      CREATE TABLE IF NOT EXISTS experiments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        data JSONB NOT NULL
      );
    `;
    console.log("Created table: experiments");

    await sql`
      CREATE TABLE IF NOT EXISTS locked_dna (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        data JSONB NOT NULL
      );
    `;
    console.log("Created table: locked_dna");

    console.log("Migration complete!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
