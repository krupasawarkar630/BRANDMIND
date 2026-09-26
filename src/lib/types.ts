// ============================================================
// BRANDMIND — Core Types
// ============================================================

export interface IdeaInput {
  idea: string;
  audience: string;
  industry: string;
  problem?: string;
  alternatives?: string;
  motivation?: string;
  tone?: string;
}

export interface BlindSpot {
  id: string;
  statement: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
  evidence: string;
  whyItMatters: string;
  affectedBrandDecisions: string[];
  suggestedQuestion: string;
  alternatives: string[];
  status: 'pending' | 'accepted' | 'rejected' | 'explored';
}

export interface BlindSpotResult {
  spots: BlindSpot[];
  summary: string;
  status: 'idle' | 'running' | 'complete';
}


export interface BrandDNA {
  coreIdea: string;
  targetUser: string;
  coreProblem: string;
  valueProposition: string;
  motivations: string[];
  painPoints: string[];
  differentiator: string;
  personality: string[];
  principles: string[];
  emotionalTerritory: string;
  positioning: string;
  voiceCharacteristics: string[];
  confidence: number;
  insight: string;
}

export interface BrandWorld {
  id: string;
  name: string;
  tagline: string;
  strategicIdea: string;
  positioning: string;
  personality: string;
  audienceRelationship: string;
  visualDirection: string;
  voiceDirection: string;
  whyItWorks: string;
  risks: string;
  differentiationScore: number;
  signalScore: number;
}

export interface AgentResult {
  agentId: string;
  agentName: string;
  role: string;
  status: 'pending' | 'running' | 'complete';
  finding: string;
  evidence: string;
  concern: string;
  score: number;
  recommendation: string;
}

export interface BrandBattle {
  agents: AgentResult[];
  collectiveInsight: string;
  recommendation: string;
  status: 'idle' | 'running' | 'complete';
}

export interface GenericIssue {
  element: string;
  original: string;
  problem: string;
  whyGeneric: string;
  improvement: string;
  alternatives: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface StressTest {
  input: string;
  inputType: string;
  issues: GenericIssue[];
  overallRisk: 'low' | 'medium' | 'high';
  summary: string;
  status: 'idle' | 'running' | 'complete';
}

export interface BrandSystem {
  brandName: string;
  namingDirection: string;
  positioningStatement: string;
  valueProposition: string;
  tagline: string;
  brandPromise: string;
  personality: string[];
  principles: string[];
  voice: string[];
  messagingPillars: string[];
  visualDirection: {
    color: string;
    typography: string;
    imagery: string;
  };
  doExamples: string[];
  dontExamples: string[];
}

export interface AudienceReaction {
  id: string;
  persona: string;
  firstImpression: string;
  appeal: string;
  confusion: string;
  objection: string;
  memorableElement: string;
  trustLevel: string;
  clarityScore: number;
  distinctivenessScore: number;
  audienceFitScore: number;
  improvementSuggestion: string;
}

export interface AudienceRoom {
  reactions: AudienceReaction[];
  consensus: {
    clarity: number;
    memorability: number;
    distinctiveness: number;
    trust: number;
    audienceFit: number;
  };
  agreement: string;
  disagreement: string;
  insight: string;
  status: 'idle' | 'running' | 'complete';
  sentToBattle?: boolean;
}

export interface ChangedElement {
  element: string;
  original: string;
  newValue: string;
  intensity: 'low' | 'moderate' | 'major';
}

export interface BrandMutation {
  id: string;
  variable: string;
  newValue: string;
  changedElements: ChangedElement[];
  unchangedElements: string[];
  reasoning: string;
  mutatedBrand: BrandSystem;
  status: 'pending' | 'applied' | 'discarded';
}

export interface WhatIfChange {
  element: string;
  original: string;
  newValue: string;
  description?: string;
}

export interface WhatIfAudienceReaction {
  persona: string;
  sentiment: 'positive' | 'neutral' | 'skeptical';
  quote: string;
  affinityDelta: number;
}

export interface WhatIfPositioningImpact {
  metric: string;
  before: number;
  after: number;
  delta: number;
}

export interface WhatIfBranchingPath {
  branchName: string;
  tradeOff: string;
  likelihood: string;
  strategicUpside: string;
}

export interface WhatIfResult {
  id: string;
  transformation: string;
  changes: {
    personality: WhatIfChange;
    tone: WhatIfChange;
    messaging: WhatIfChange;
    tagline: WhatIfChange;
    visual: WhatIfChange;
    audiencePerception: WhatIfChange;
  };
  affectedDNA?: string[];
  audienceReactions?: WhatIfAudienceReaction[];
  positioningImpact?: WhatIfPositioningImpact[];
  risks?: string[];
  opportunities?: string[];
  confidence?: number;
  recommendedAction?: string;
  branchingPaths?: WhatIfBranchingPath[];
  mutatedBrand: BrandSystem;
  status: 'pending' | 'applied' | 'saved_as_variant' | 'discarded';
}

// ── Evidence-Backed Scoring & Brand Memory ──────────────────

export interface EvidenceItem {
  id: string;
  source: 'simulation' | 'stress_test' | 'blind_spot' | 'audience' | 'user_decision' | 'guardian' | 'market_signal';
  title: string;
  description: string;
  impactScore: number; // e.g. +15 or -10
  timestamp?: string;
  referenceId?: string;
}

export interface EvidenceScore {
  score: number;
  category: string;
  confidence: number;
  evidenceCount: number;
  items: EvidenceItem[];
  rationale: string;
}

export interface BrandMemoryContext {
  lockedRules: Array<{
    rule: string;
    lockedAt: string;
    stage: string;
    rationale: string;
  }>;
  decisions: TimelineEvent[];
  rejectedBlindSpots: string[];
  previousMutations: BrandMutation[];
  guardianViolations: GuardianViolation[];
  stressTestWeaknesses: string[];
}

// ── Competitor Gap Map ──────────────────────────────────────

export interface Competitor {
  id: string;
  name: string;
  tagline: string;
  claimedPositioning: string;
  targetAudience: string;
  strengths: string[];
  weaknesses: string[];
  // User input coordinates or AI inferred (0 to 100)
  xCoord: number; // e.g. Innovation / Pragmatic
  yCoord: number; // e.g. Enterprise / Consumer
  isUserInput: boolean;
}

export interface CompetitorGapMapData {
  xAxisLabel: string;
  yAxisLabel: string;
  competitors: Competitor[];
  brandCoords: { x: number; y: number };
  whitespaceZones: Array<{
    name: string;
    description: string;
    opportunityScore: number;
    recommendedAngle: string;
    coordinates: { x: number; y: number };
  }>;
  aiInferences: Array<{
    competitorName: string;
    inferredVulnerability: string;
    confidence: number;
  }>;
}

// ── Existing Brand Analyzer ─────────────────────────────────

export interface BrandAnalyzerResult {
  sourceTextLength: number;
  extractedPositioning: string;
  extractedTone: string[];
  impliedAudience: string;
  coreDna: {
    coreProblem: string;
    valueProposition: string;
    differentiator: string;
    personality: string[];
  };
  detectedInconsistencies: Array<{
    element: string;
    observation: string;
    severity: 'low' | 'medium' | 'high';
    recommendation: string;
  }>;
  readinessScore: number;
  rawPastedCopy: string;
}

export interface SimulatorScenario {
  id: string;
  title: string;
  situation: string;
  audienceReaction: string;
  brandResponseRequirement: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  why: string;
  affectedElements: string[];
  recommendedAction: string;
  brandAlignment: string;
  status: 'pending' | 'accepted_fix' | 'ignored' | 'sent_to_guardian';
}

export interface BrandSurvivalMap {
  clarity: number;
  consistency: number;
  differentiation: number;
  audienceFit: number;
  voiceStability: number;
}

export interface ABExperimentOption {
  value: string;
  clarity: number;
  memorability: number;
  distinctiveness: number;
  audienceFit: number;
  brandAlignment: number;
  risks: string[];
  reasoning: string;
  summary: string;
}

export interface ABExperiment {
  id: string;
  experimentType: string;
  optionA: ABExperimentOption;
  optionB: ABExperimentOption;
  status: 'pending' | 'chose_a' | 'chose_b' | 'kept_both';
}

export interface TimelineEvent {
  id: string;
  stage: string;
  decision: string;
  previousValue?: string;
  newValue?: string;
  reason: string;
  source: 'AI' | 'USER';
  timestamp: string;
  affectedElements?: string[];
  snapshot?: Partial<BrandDNA | BrandSystem>;
}

export interface RealitySimulatorResult {
  scenariosTested: number;
  potentialConflicts: number;
  strongAreas: number;
  needsAttention: number;
  scenarios: SimulatorScenario[];
  survivalMap: BrandSurvivalMap;
  status: 'idle' | 'running' | 'complete';
}

export interface GuardianViolation {
  id: string;
  expected: string;
  generated: string;
  violation: string;
  fixedContent: string;
  status: 'pending' | 'fixed';
}

export interface GuardianResult {
  content: string;
  consistencyScore: number;
  voiceMatch: number;
  personalityMatch: number;
  positioningMatch: number;
  label: string;
  summary: string;
  violations: GuardianViolation[];
  suggestedRewrite: string;
  status: 'idle' | 'running' | 'complete';
}

export interface LaunchKitItem {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  channel: string;
}

export interface VisualDNA {
  typography: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    description: string;
  };
  composition: string;
  shapes: string;
  icons: string;
  imagery: string;
  logoDirection: string;
  uiStyle: string;
  avoid: string[];
  status: 'idle' | 'running' | 'complete';
  isLocked?: boolean;
}

export interface CrisisScenario {
  id: string;
  type: string;
  situation: string;
  options: {
    id: string;
    style: string;
    content: string;
  }[];
}

export interface CrisisEvaluation {
  brandAlignment: number;
  trustPreservation: number;
  voiceAlignment: number;
  reasoning: string;
}

export interface CrisisTest {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  situation: string;
  selectedResponse: string;
  evaluation?: CrisisEvaluation;
  status: 'pending' | 'evaluated' | 'saved';
}

export interface CrisisRoomState {
  scenarios: CrisisScenario[];
  tests: CrisisTest[];
}

export interface CultureAdaptation {
  id: string;
  market: string;
  corePreserved: string[];
  adaptedElements: {
    element: string;
    original: string;
    adapted: string;
  }[];
  considerations: string[];
  status: 'pending' | 'saved';
}

export interface LaunchKit {
  thesis: string;
  items: LaunchKitItem[];
  status: 'idle' | 'running' | 'complete';
}

export type Stage =
  | 'idea'
  | 'blindSpots'
  | 'dna'
  | 'worlds'
  | 'battle'
  | 'stress'
  | 'system'
  | 'audienceRoom'
  | 'mutationLab'
  | 'whatIfMachine'
  | 'realitySimulator'
  | 'abExperiment'
  | 'timeline'
  | 'visualDna'
  | 'dnaLock'
  | 'guardian'
  | 'cultureAdaptation'
  | 'crisisRoom'
  | 'launch';

export interface ProjectState {
  id: string;
  createdAt: string;
  updatedAt: string;
  currentStage: Stage;
  idea: IdeaInput | null;
  blindSpots: BlindSpotResult | null;
  brandDNA: BrandDNA | null;
  worlds: BrandWorld[] | null;
  selectedWorldId: string | null;
  battle: BrandBattle | null;
  stressTest: StressTest | null;
  brandSystem: BrandSystem | null;
  brandSystemHistory: BrandSystem[];
  brandVariants: BrandSystem[];
  audienceRoom: AudienceRoom | null;
  mutations: BrandMutation[];
  whatIfResult: WhatIfResult | null;
  realitySimulator: RealitySimulatorResult | null;
  abExperiments: ABExperiment[];
  timeline: TimelineEvent[];
  visualDNA: VisualDNA | null;
  cultureAdaptations: CultureAdaptation[];
  brandDnaLocked: boolean;
  guardian: GuardianResult | null;
  crisisRoom: CrisisRoomState | null;
  launchKit: LaunchKit | null;
  competitorMap?: CompetitorGapMapData | null;
  brandAnalyzerResult?: BrandAnalyzerResult | null;
  completedStages: Stage[];
}

export const STAGE_ORDER: Stage[] = [
  'idea',
  'blindSpots',
  'dna',
  'worlds',
  'battle',
  'stress',
  'system',
  'audienceRoom',
  'mutationLab',
  'whatIfMachine',
  'realitySimulator',
  'abExperiment',
  'timeline',
  'visualDna',
  'cultureAdaptation',
  'dnaLock',
  'guardian',
  'crisisRoom',
  'launch',
];

export const STAGE_LABELS: Record<Stage, string> = {
  idea: 'Idea',
  blindSpots: 'Blind Spots',
  dna: 'Brand DNA',
  worlds: 'Worlds',
  battle: 'Battle',
  stress: 'Stress test',
  system: 'System',
  audienceRoom: 'Audience Room',
  mutationLab: 'Mutation Lab',
  whatIfMachine: 'What-If Machine',
  realitySimulator: 'Reality Simulator',
  abExperiment: 'A/B Experiments',
  timeline: 'Decision Timeline',
  visualDna: 'Visual DNA',
  cultureAdaptation: 'Culture Adaptation',
  dnaLock: 'DNA Lock',
  guardian: 'Guardian',
  crisisRoom: 'Crisis Room',
  launch: 'Launch',
};

export const STAGE_NUMBERS: Record<Stage, string> = {
  idea: '01',
  blindSpots: '02',
  dna: '03',
  worlds: '04',
  battle: '05',
  stress: '06',
  system: '07',
  audienceRoom: '07b',
  mutationLab: '07c',
  whatIfMachine: '07d',
  realitySimulator: '07e',
  abExperiment: '07f',
  timeline: '07g',
  visualDna: '07h',
  cultureAdaptation: '07i',
  dnaLock: '07j',
  guardian: '08',
  crisisRoom: '08b',
  launch: '09',
};
