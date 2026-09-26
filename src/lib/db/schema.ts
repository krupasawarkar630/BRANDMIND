import { pgTable, varchar, text, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

// ── 1. USERS ─────────────────────────────────────────────────────────────
export const users = pgTable('users', {
  id: varchar('id', { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  email: varchar('email', { length: 255 }).unique(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ── 2. BRANDS / PROJECTS ────────────────────────────────────────────────
export const projects = pgTable('projects', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  tagline: text('tagline'),
  currentStage: varchar('current_stage', { length: 50 }).default('idea').notNull(),
  ideaInput: jsonb('idea_input'),
  completedStages: jsonb('completed_stages').default('[]').notNull(),
  brandDnaLocked: boolean('brand_dna_locked').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ── 3. BRAND VERSIONS ───────────────────────────────────────────────────
export const brandVersions = pgTable('brand_versions', {
  id: varchar('id', { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar('project_id', { length: 255 }).references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  versionNumber: integer('version_number').default(1).notNull(),
  brandSystem: jsonb('brand_system').notNull(),
  changeSummary: text('change_summary'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ── 4. BRAND DNA ────────────────────────────────────────────────────────
export const brandDna = pgTable('brand_dna', {
  id: varchar('id', { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar('project_id', { length: 255 }).references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  coreProblem: text('core_problem'),
  targetUser: text('target_user'),
  valueProposition: text('value_proposition'),
  differentiator: text('differentiator'),
  personality: jsonb('personality').default('[]'),
  radarScores: jsonb('radar_scores'),
  visualDna: jsonb('visual_dna'),
  rawDna: jsonb('raw_dna'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ── 5. BRAND WORLDS ─────────────────────────────────────────────────────
export const brandWorlds = pgTable('brand_worlds', {
  id: varchar('id', { length: 255 }).primaryKey(),
  projectId: varchar('project_id', { length: 255 }).references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  tagline: text('tagline'),
  strategicIdea: text('strategic_idea'),
  isSelected: boolean('is_selected').default(false).notNull(),
  data: jsonb('data').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ── 6. BATTLE SESSIONS ──────────────────────────────────────────────────
export const battleSessions = pgTable('battle_sessions', {
  id: varchar('id', { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar('project_id', { length: 255 }).references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  selectedWorldId: varchar('selected_world_id', { length: 255 }),
  collectiveInsight: text('collective_insight'),
  recommendation: text('recommendation'),
  status: varchar('status', { length: 50 }).default('pending').notNull(),
  agentLogs: jsonb('agent_logs').default('[]').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ── 7. STRESS TESTS ─────────────────────────────────────────────────────
export const stressTests = pgTable('stress_tests', {
  id: varchar('id', { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar('project_id', { length: 255 }).references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  survivalMap: jsonb('survival_map'),
  scenarios: jsonb('scenarios').default('[]').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ── 8. AUDIENCE SIMULATIONS ─────────────────────────────────────────────
export const audienceSimulations = pgTable('audience_simulations', {
  id: varchar('id', { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar('project_id', { length: 255 }).references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  agreement: text('agreement'),
  disagreement: text('disagreement'),
  insight: text('insight'),
  reactions: jsonb('reactions').default('[]').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ── 9. MUTATIONS ────────────────────────────────────────────────────────
export const mutations = pgTable('mutations', {
  id: varchar('id', { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar('project_id', { length: 255 }).references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  variable: varchar('variable', { length: 255 }).notNull(),
  originalValue: text('original_value'),
  newValue: text('new_value'),
  intensity: varchar('intensity', { length: 50 }),
  reasoning: text('reasoning'),
  status: varchar('status', { length: 50 }).default('pending').notNull(),
  changes: jsonb('changes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ── 10. WHAT-IF SCENARIOS ───────────────────────────────────────────────
export const whatIfScenarios = pgTable('what_if_scenarios', {
  id: varchar('id', { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar('project_id', { length: 255 }).references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  transformation: text('transformation').notNull(),
  changes: jsonb('changes').notNull(),
  status: varchar('status', { length: 50 }).default('pending').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ── 11. DECISIONS (TIMELINE / AUDIT TRAIL) ──────────────────────────────
export const decisions = pgTable('decisions', {
  id: varchar('id', { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar('project_id', { length: 255 }).references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  stage: varchar('stage', { length: 100 }).notNull(),
  decision: text('decision').notNull(),
  reason: text('reason').notNull(),
  source: varchar('source', { length: 50 }).default('USER').notNull(),
  metadata: jsonb('metadata'),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
});

// ── 12. BRAND LOCKS ─────────────────────────────────────────────────────
export const brandLocks = pgTable('brand_locks', {
  id: varchar('id', { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar('project_id', { length: 255 }).references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  isLocked: boolean('is_locked').default(true).notNull(),
  lockedAt: timestamp('locked_at', { withTimezone: true }).defaultNow().notNull(),
  unlockedAt: timestamp('unlocked_at', { withTimezone: true }),
  unlockReason: text('unlock_reason'),
  lockedSnapshot: jsonb('locked_snapshot').notNull(),
});

// ── 13. GUARDIAN SCANS ──────────────────────────────────────────────────
export const guardianScans = pgTable('guardian_scans', {
  id: varchar('id', { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar('project_id', { length: 255 }).references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  contentScanned: text('content_scanned').notNull(),
  consistencyScore: integer('consistency_score').notNull(),
  summary: text('summary'),
  violations: jsonb('violations').default('[]').notNull(),
  suggestedRewrite: text('suggested_rewrite'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ── 14. LAUNCH ASSETS ───────────────────────────────────────────────────
export const launchAssets = pgTable('launch_assets', {
  id: varchar('id', { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar('project_id', { length: 255 }).references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  assetType: varchar('asset_type', { length: 100 }).notNull(),
  channel: varchar('channel', { length: 100 }),
  title: varchar('title', { length: 255 }).notNull(),
  subtitle: text('subtitle'),
  content: text('content').notNull(),
  isLocked: boolean('is_locked').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ── 15. AUDIT LOGS ──────────────────────────────────────────────────────
export const auditLogs = pgTable('audit_logs', {
  id: varchar('id', { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar('project_id', { length: 255 }).references(() => projects.id, { onDelete: 'cascade' }),
  action: varchar('action', { length: 100 }).notNull(),
  actor: varchar('actor', { length: 100 }).default('system').notNull(),
  details: jsonb('details'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ── RELATIONS ───────────────────────────────────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  brandVersions: many(brandVersions),
  brandDna: one(brandDna),
  brandWorlds: many(brandWorlds),
  battleSessions: many(battleSessions),
  stressTests: many(stressTests),
  audienceSimulations: many(audienceSimulations),
  mutations: many(mutations),
  whatIfScenarios: many(whatIfScenarios),
  decisions: many(decisions),
  brandLocks: many(brandLocks),
  guardianScans: many(guardianScans),
  launchAssets: many(launchAssets),
  auditLogs: many(auditLogs),
}));

export const brandVersionsRelations = relations(brandVersions, ({ one }) => ({
  project: one(projects, {
    fields: [brandVersions.projectId],
    references: [projects.id],
  }),
}));

export const brandDnaRelations = relations(brandDna, ({ one }) => ({
  project: one(projects, {
    fields: [brandDna.projectId],
    references: [projects.id],
  }),
}));

export const brandWorldsRelations = relations(brandWorlds, ({ one }) => ({
  project: one(projects, {
    fields: [brandWorlds.projectId],
    references: [projects.id],
  }),
}));

export const decisionsRelations = relations(decisions, ({ one }) => ({
  project: one(projects, {
    fields: [decisions.projectId],
    references: [projects.id],
  }),
}));
