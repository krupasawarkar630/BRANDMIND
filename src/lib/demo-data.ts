import type {
  ProjectState,
  Stage,
  IdeaInput,
  BlindSpotResult,
  BrandDNA,
  BrandWorld,
  BrandBattle,
  StressTest,
  BrandSystem,
  AudienceRoom,
  VisualDNA,
  RealitySimulatorResult,
  CrisisRoomState,
  GuardianResult,
  LaunchKit,
  STAGE_ORDER,
} from './types';

export const DEMO_IDEA: IdeaInput = {
  idea: "An app that helps college students find teammates for hackathons, side projects, and startup ideas",
  audience: "College students who want to build things but don't have a reliable crew",
  industry: "EdTech / Community",
  problem: "Students have to stitch together group chats, Discord servers, campus clubs, and asking whoever is nearby — which makes a high-intent moment feel accidental",
  alternatives: "Discord, LinkedIn, random campus events",
  motivation: "I was at a hackathon alone and watched teams with 4 people build things I knew I could build if I had the right crew",
  tone: "Direct and human, not corporate",
};

export const DEMO_BLIND_SPOTS: BlindSpotResult = {
  spots: [
    {
      id: "bs-1-demo",
      statement: "Everyone is my customer.",
      category: "Audience assumption",
      severity: "high",
      evidence: "The interview answers describe college workflows but audience claims 'everyone'.",
      whyItMatters: "A product for everyone is a product for no one. Without a specific wedge, messaging will be too generic to convert.",
      affectedBrandDecisions: ["Audience", "Positioning", "Tone"],
      suggestedQuestion: "If you could only sell to one group for the next 12 months, who would it be?",
      alternatives: [
        "College students who need reliable crews",
        "Recent grads building side projects",
        "Hackathon participants"
      ],
      status: "accepted"
    },
    {
      id: "bs-2-demo",
      statement: "People will pay because the idea is useful.",
      category: "Pricing assumption",
      severity: "medium",
      evidence: "Utility is mentioned multiple times, but there is no specific economic pain point identified.",
      whyItMatters: "Utility doesn't guarantee willingness to pay. If they are currently using free alternatives, the barrier to adoption is high.",
      affectedBrandDecisions: ["Value Proposition", "Positioning"],
      suggestedQuestion: "What is the cost of NOT using your product?",
      alternatives: [
        "Focus on time saved (quantifiable)",
        "Focus on quality of output (reputation)",
        "Position as a premium tool for serious builders"
      ],
      status: "explored"
    },
    {
      id: "bs-3-demo",
      statement: "There are no competitors.",
      category: "Competition assumption",
      severity: "high",
      evidence: "Alternatives mentioned are generic platforms like Discord, implying no direct competitors.",
      whyItMatters: "If there are no competitors, the real competitor is 'doing nothing' or hacky status quo workarounds.",
      affectedBrandDecisions: ["Positioning", "Differentiator"],
      suggestedQuestion: "What is the hacky workaround people use today that you are replacing?",
      alternatives: [
        "Position against the specific friction of Discord",
        "Position as the anti-LinkedIn",
        "Position against 'asking whoever is nearby'"
      ],
      status: "accepted"
    }
  ],
  summary: "Found 3 potential assumptions that could weaken the brand's positioning. Addressing these creates a sharper DNA.",
  status: "complete"
};

export const DEMO_BRAND_DNA: BrandDNA = {
  coreIdea: "An app that helps college students find teammates for hackathons, side projects, and startup ideas — designed to make the right move feel obvious.",
  targetUser: "College students who want to build things but don't have a reliable crew who have the intent but not yet the clarity.",
  coreProblem: "Students have to stitch together group chats, Discord servers, campus clubs, and asking whoever is nearby — which makes a high-intent moment feel accidental",
  valueProposition: "Turns context into momentum by making the right teammate choice visible, timely, and worth acting on.",
  motivations: [
    "Feel early without feeling alone",
    "Make progress without asking permission",
    "Find the people worth building with"
  ],
  painPoints: [
    "Scattered communication across messy channels",
    "High friction to verify partner commitment",
    "Awkward cold-outreach with low response rates"
  ],
  differentiator: "Turns verified skills and hackathon track record into high-signal partner matches instead of resume noise.",
  personality: ["Direct", "Opinionated", "Precise", "Honest"],
  principles: ["Never overpromise", "Serve the signal not the noise", "Make the next step obvious"],
  emotionalTerritory: "The feeling of knowing you made the right choice with people who build at your speed.",
  positioning: "For college students who need to build but can't find the signal, this is the platform that makes team formation deterministic — unlike Discord and LinkedIn, which create more noise.",
  voiceCharacteristics: ["Specific over vague", "Action over aspiration", "Evidence over promise"],
  confidence: 94,
  insight: "Adjusted based on validated assumptions: The core tension is not lack of people, but lack of trust and verifiable intent. Filter by commitment, not just skills."
};

export const DEMO_WORLDS: BrandWorld[] = [
  {
    id: "world-1",
    name: "THE SIGNAL LAB",
    tagline: "High-density partner matching for builders.",
    strategicIdea: "Position as the uncompromising terminal for high-intent builders.",
    positioning: "The developer-first platform that turns chaotic team discovery into a precise algorithmic signal.",
    personality: "Technical, rigorous, sharp, understated.",
    audienceRelationship: "A high-performance peer environment that doesn't waste your time.",
    visualDirection: "Monochrome dark mode, monospace data tables, vivid amber accent pulses.",
    voiceDirection: "Terse, evidence-backed, no corporate fluff, active voice.",
    whyItWorks: "Attracts top 5% builders who hate cheesy networking platforms and crave pure signal.",
    risks: "Could feel intimidating to first-time beginners if tone is too sparse.",
    differentiationScore: 92,
    signalScore: 95
  },
  {
    id: "world-2",
    name: "FOUNDER SQUAD",
    tagline: "Build what matters with people who show up.",
    strategicIdea: "Position around shared momentum, camaraderie, and shipping velocity.",
    positioning: "The launchpad community where ambitious students turn half-baked ideas into shipped software.",
    personality: "Warm, ambitious, kinetic, relentless.",
    audienceRelationship: "The crew in your corner at 3 AM when the demo deadline hits.",
    visualDirection: "Vibrant retro-modern aesthetic, bold typography, electric orange and deep indigo.",
    voiceDirection: "Empowering, direct, encouraging, focused on shipping.",
    whyItWorks: "High emotional resonance for university students looking for co-founders.",
    risks: "Needs clear moderation to prevent low-effort spam.",
    differentiationScore: 86,
    signalScore: 88
  },
  {
    id: "world-3",
    name: "MERIT MATRIX",
    tagline: "Proof over pitch decks.",
    strategicIdea: "Position as the verified reputation and hackathon record network.",
    positioning: "The decentralized reputation layer where your GitHub commits and hackathon wins speak for you.",
    personality: "Analytical, transparent, meritocratic.",
    audienceRelationship: "An objective evaluator and accelerator of builder reputation.",
    visualDirection: "Clean architectural grid, crisp emerald and cool slate, minimalist graphs.",
    voiceDirection: "Objective, metrics-focused, calm authority.",
    whyItWorks: "Solves the trust deficit completely through verified track records.",
    risks: "May feel impersonal if devoid of personal builder storytelling.",
    differentiationScore: 89,
    signalScore: 91
  }
];

export const DEMO_BATTLE: BrandBattle = {
  agents: [
    {
      agentId: "agent-strategist",
      agentName: "Chief Strategist",
      role: "Positioning & Market Wedge",
      status: "complete",
      finding: "THE SIGNAL LAB creates the highest defensibility against LinkedIn and Discord by rejecting generalist networking entirely.",
      evidence: "Generalist tools cannot specialize their UX for project pairing and github commit verification without breaking their broad utility.",
      concern: "Requires keeping onboarding friction tuned strictly for builders.",
      score: 94,
      recommendation: "Select 'THE SIGNAL LAB' as the core brand foundation."
    },
    {
      agentId: "agent-voice",
      agentName: "Voice Critic",
      role: "Tone & Brand Authenticity",
      status: "complete",
      finding: "The terse, high-signal voice cuts through campus marketing fatigue instantly.",
      evidence: "College students in CS and design have built-in immune systems against corporate 'synergy' speak.",
      concern: "Avoid sounding overly cynical; keep focus on the craft of building.",
      score: 91,
      recommendation: "Keep voice direct, concise, and focused on tangible output."
    },
    {
      agentId: "agent-growth",
      agentName: "Growth Architect",
      role: "Viral Loops & Retention",
      status: "complete",
      finding: "Hackathon project submissions naturally create public proof pages that attract incoming freshmen every semester.",
      evidence: "Every project built using BrandMind becomes an organic case study.",
      concern: "Ensure new users can form or join a squad within their first 7 minutes.",
      score: 88,
      recommendation: "Anchor brand messaging around fast squad lock-in and shipping."
    }
  ],
  collectiveInsight: "THE SIGNAL LAB dominates on differentiation, developer trust, and clarity. It converts hackathon chaos into a structured builder advantage.",
  recommendation: "Proceed with THE SIGNAL LAB as the primary Brand World.",
  status: "complete"
};

export const DEMO_STRESS_TEST: StressTest = {
  input: "THE SIGNAL LAB",
  inputType: "Brand World Selection",
  issues: [
    {
      element: "Messaging",
      original: "Find anyone to build anything",
      problem: "Too broad, lacks the high-signal filter promise.",
      whyGeneric: "Sounds like generic Discord server invite.",
      improvement: "Match with teammates based on verified shipping track record.",
      alternatives: [
        "Assemble your hackathon crew in 4 clicks.",
        "Zero fluff teammate pairing for serious builders."
      ],
      riskLevel: "medium"
    },
    {
      element: "Positioning",
      original: "The social network for students",
      problem: "Social network framing invites low-intent scrolling and superficial engagement.",
      whyGeneric: "Directly invites comparison to Instagram/LinkedIn.",
      improvement: "The teammate terminal for hackathons and venture builds.",
      alternatives: [
        "High-velocity squad assembly platform.",
        "The project co-founder engine."
      ],
      riskLevel: "high"
    }
  ],
  overallRisk: "low",
  summary: "Brand system is resilient against market noise. Minor cliché risks mitigated by tightening the technical vernacular.",
  status: "complete"
};

export const DEMO_BRAND_SYSTEM: BrandSystem = {
  brandName: "CREWFORGE",
  namingDirection: "Engineered authority with action-oriented momentum",
  positioningStatement: "For student builders seeking high-velocity hackathon and startup crews, Crewforge is the teammate terminal that turns chaotic campus discovery into deterministic squad assembly.",
  valueProposition: "Assemble a verified hackathon or venture squad in under 5 minutes with zero noise.",
  tagline: "Build at your true speed.",
  brandPromise: "No ghosting, no unverified claims, no accidental teams. Only high-intent builders ready to ship.",
  personality: ["Precise", "Uncompromising", "Kinetic", "Grounded"],
  principles: [
    "Proof over pitch decks",
    "Signal over social noise",
    "Make the next move obvious"
  ],
  voice: [
    "Terse and actionable",
    "Numbers and evidence before adjectives",
    "Speak builder to builder"
  ],
  messagingPillars: [
    "Verified Track Record: Real GitHub and hackathon receipts.",
    "Deterministic Pairing: Skills and availability aligned before first contact.",
    "Built for Speed: From idea to locked 4-person team in minutes."
  ],
  visualDirection: {
    color: "#0D0F12, #D9531E, #F4F4F6, #1A1D24",
    typography: "Outfit / JetBrains Mono / Inter",
    imagery: "High-contrast IDE screenshots, blueprint schematics, raw workspace lighting"
  },
  doExamples: [
    "Say 'Assemble your hackathon crew in 3 minutes.'",
    "Show verified GitHub commit frequencies and past hackathon awards.",
    "Highlight real shipped MVPs."
  ],
  dontExamples: [
    "Never say 'Network with like-minded individuals.'",
    "Never use corporate stock photos of students in conference rooms.",
    "Never hide teammate status behind opaque social feeds."
  ]
};

export const DEMO_AUDIENCE_ROOM: AudienceRoom = {
  reactions: [
    {
      id: "aud-1",
      persona: "Marcus Chen — Junior CS Major & Hackathon Veteran",
      firstImpression: "Finally, something that skips the awkward Discord pinging.",
      appeal: "Love that GitHub commits and past hackathon trophies are verified upfront.",
      confusion: "Will designers and product thinkers feel welcome if it's too developer-heavy?",
      objection: "I don't want to get spammed by non-technical people with 'just an idea'.",
      memorableElement: "The 'Deterministic Squad Assembly' promise.",
      trustLevel: "High",
      clarityScore: 94,
      distinctivenessScore: 92,
      audienceFitScore: 96,
      improvementSuggestion: "Add verified design portfolio integration (Figma/Behance)."
    },
    {
      id: "aud-2",
      persona: "Sarah Jenkins — Sophomore Product Designer",
      firstImpression: "Sharp visual identity. Feels like an elite studio tool.",
      appeal: "Clear role definition so designers aren't treated as 'the person who draws logos'.",
      confusion: "None — the value prop is immediately clear.",
      objection: "Make sure project scopes are defined before teams lock in.",
      memorableElement: "'Proof over pitch decks'.",
      trustLevel: "Very High",
      clarityScore: 96,
      distinctivenessScore: 95,
      audienceFitScore: 90,
      improvementSuggestion: "Include project brief templates during team formation."
    }
  ],
  consensus: {
    clarity: 95,
    memorability: 93,
    distinctiveness: 94,
    trust: 92,
    audienceFit: 94
  },
  agreement: "Both technical and creative student builders strongly prefer high-signal verification over informal chat channels.",
  disagreement: "Balance between pure developer metrics vs design/business portfolio validation.",
  insight: "Position Crewforge as the cross-functional squad terminal that values execution across both code and design.",
  status: "complete"
};

export const DEMO_VISUAL_DNA: VisualDNA = {
  typography: "Outfit (Headings, 800 weight) + JetBrains Mono (Meta / Signals) + Inter (Body)",
  colors: {
    primary: "#0A0B0E",
    secondary: "#16181D",
    accent: "#D9531E",
    background: "#08090B",
    text: "#F0F2F5",
    description: "Deep obsidian canvas with warm terracotta orange accent and surgical crisp typography."
  },
  composition: "Asymmetric split layout with dense live-status telemetry on the perimeter and clean canvas focus.",
  shapes: "Sharp 8px rounded corners, precision border strokes (1px rgba(255,255,255,0.08)), subtle grid overlays.",
  icons: "Thin-line technical Lucide iconography with monochrome fills.",
  imagery: "Authentic hardware workbench aesthetics, glowing terminal screens, night-mode development captures.",
  logoDirection: "Minimalist interlocking C and F glyph forming an enclosed squad polygon.",
  uiStyle: "Glassmorphic panels with dark backdrop blur and neon amber micro-accents.",
  avoid: [
    "Corporate blue gradients",
    "Cheesy 3D cartoon avatars",
    "Vague abstract watercolor patterns"
  ],
  status: "complete",
  isLocked: true
};

export const DEMO_REALITY_SIMULATOR: RealitySimulatorResult = {
  scenariosTested: 6,
  potentialConflicts: 1,
  strongAreas: 5,
  needsAttention: 0,
  scenarios: [
    {
      id: "sim-1",
      title: "Competitor Launches Free Student Directory",
      situation: "A well-funded competitor launches a free student directory on university campuses with gift card incentives.",
      audienceReaction: "Short-term curiosity, but high spam leads to quick abandonment.",
      brandResponseRequirement: "Double down on verified proof of shipping vs spammy directories.",
      riskLevel: "LOW",
      why: "Crewforge's brand equity is built on partner quality and squad completion, not directory size.",
      affectedElements: ["Positioning", "Value Proposition"],
      recommendedAction: "Highlight hackathon win rate of Crewforge squads.",
      brandAlignment: "98% Aligned",
      status: "accepted_fix"
    },
    {
      id: "sim-2",
      title: "First-Time Hackathon Builder Intimidation",
      situation: "Beginner freshmen find the 'terminal' vocabulary daunting.",
      audienceReaction: "Hesitation to create profile without extensive past projects.",
      brandResponseRequirement: "Provide 'First Build' onboarding track with mentorship matching.",
      riskLevel: "MEDIUM",
      why: "Preserves high signal while creating an explicit on-ramp for emerging talent.",
      affectedElements: ["Onboarding Messaging", "Tone"],
      recommendedAction: "Add 'Ready to Learn' badge alongside verified track records.",
      brandAlignment: "92% Aligned",
      status: "accepted_fix"
    }
  ],
  survivalMap: {
    clarity: 96,
    consistency: 94,
    differentiation: 95,
    audienceFit: 92,
    voiceStability: 96
  },
  status: "complete"
};

export const DEMO_GUARDIAN: GuardianResult = {
  content: "Crewforge is an innovative platform empowering the next generation of college creators to network and brainstorm amazing startup synergies.",
  consistencyScore: 32,
  voiceMatch: 25,
  personalityMatch: 30,
  positioningMatch: 40,
  label: "Severe Brand Drift Detected",
  summary: "Copy violates core Brand DNA principles: used corporate buzzwords ('synergies', 'empowering', 'network') instead of builder-first signal language.",
  violations: [
    {
      id: "viol-1",
      expected: "Action-oriented builder vernacular (assemble, ship, code)",
      generated: "network and brainstorm amazing startup synergies",
      violation: "Empty corporate clichés forbidden in Brand System.",
      fixedContent: "lock in your hackathon squad and ship in 48 hours.",
      status: "fixed"
    }
  ],
  suggestedRewrite: "Crewforge gives student builders the verified teammate signal they need to lock in their hackathon crew and ship in 48 hours.",
  status: "complete"
};

export const DEMO_CRISIS_ROOM: CrisisRoomState = {
  scenarios: [
    {
      id: "crisis-1",
      type: "Team Ghosting Incident",
      situation: "A high-profile hackathon team suffers a last-minute ghosting incident 2 hours before submission deadline.",
      options: [
        {
          id: "opt-1",
          style: "Transparent & Accountability First",
          content: "Acknowledge the gap immediately, activate Emergency Sub Protocol to pair solo builders with active teams within 15 minutes, and update builder reliability metrics."
        },
        {
          id: "opt-2",
          style: "Defensive PR Statement",
          content: "Remind users that teammate actions are outside platform responsibility."
        }
      ]
    }
  ],
  tests: [
    {
      id: "test-1",
      scenarioId: "crisis-1",
      scenarioTitle: "Team Ghosting Incident",
      situation: "A high-profile hackathon team suffers a last-minute ghosting incident.",
      selectedResponse: "Activate Emergency Sub Protocol and update builder reliability metrics.",
      evaluation: {
        brandAlignment: 96,
        trustPreservation: 95,
        voiceAlignment: 94,
        reasoning: "Reinforces brand promise of deterministic reliability and protective mechanisms."
      },
      status: "saved"
    }
  ]
};

export const DEMO_LAUNCH_KIT: LaunchKit = {
  thesis: "Crewforge turns the accidental chaos of campus hackathons into a high-signal squad accelerator.",
  items: [
    {
      id: "lk-1",
      title: "Campus Launch Hero Banner",
      subtitle: "Hackathon Website & Booth Header",
      content: "Stop gambling your weekend on unverified group chats. Assemble your verified 4-person hackathon crew in 4 minutes.",
      channel: "Event Landing Page"
    },
    {
      id: "lk-2",
      title: "Twitter / X Launch Thread",
      subtitle: "Founder Announcement",
      content: "We spent 3 hackathons building alone because Discord chats were a mess.\n\nToday we're launching @Crewforge: the teammate terminal for builders who want to ship, not just brainstorm.\n\nGitHub verified. Zero fluff. Link below.",
      channel: "Social (X / Twitter)"
    },
    {
      id: "lk-3",
      title: "Campus Discord Direct Announcement",
      subtitle: "Builder Community Drop",
      content: "Looking for a dedicated backend dev or Figma wizard for this weekend's hackathon? Don't post into the #general void. Drop your project on Crewforge and get matched with builders who have actual receipts.",
      channel: "Discord / Slack"
    },
    {
      id: "lk-4",
      title: "Brand Manifesto Card",
      subtitle: "Print & Digital Sticker Card",
      content: "PROOF OVER PITCH DECKS. SIGNAL OVER SOCIAL NOISE. BUILD AT YOUR TRUE SPEED.",
      channel: "Swag & Physical Collateral"
    }
  ],
  status: "complete"
};

export function createFullDemoProject(): ProjectState {
  return {
    id: "demo-project-seed",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentStage: "launch",
    idea: DEMO_IDEA,
    blindSpots: DEMO_BLIND_SPOTS,
    brandDNA: DEMO_BRAND_DNA,
    worlds: DEMO_WORLDS,
    selectedWorldId: "world-1",
    battle: DEMO_BATTLE,
    stressTest: DEMO_STRESS_TEST,
    brandSystem: DEMO_BRAND_SYSTEM,
    brandSystemHistory: [],
    brandVariants: [],
    audienceRoom: DEMO_AUDIENCE_ROOM,
    mutations: [],
    whatIfResult: null,
    realitySimulator: DEMO_REALITY_SIMULATOR,
    abExperiments: [],
    timeline: [
      {
        id: "evt-seed-1",
        stage: "Idea Intake",
        decision: "Formulated problem statement around fragmented student builder matchmaking.",
        reason: "Initial context seed.",
        source: "USER",
        timestamp: new Date().toISOString()
      },
      {
        id: "evt-seed-2",
        stage: "Discover",
        decision: "Validated assumption: filter for verifiable intent over generic social networking.",
        reason: "Prevent generic audience drift.",
        source: "AI",
        timestamp: new Date().toISOString()
      },
      {
        id: "evt-seed-3",
        stage: "DNA",
        decision: "Synthesized core differentiator around GitHub track records and deterministic team formation.",
        reason: "High confidence strategic core.",
        source: "AI",
        timestamp: new Date().toISOString()
      },
      {
        id: "evt-seed-4",
        stage: "Worlds",
        decision: "Selected THE SIGNAL LAB as core brand direction.",
        reason: "Highest differentiation and audience authority.",
        source: "USER",
        timestamp: new Date().toISOString()
      }
    ],
    visualDNA: DEMO_VISUAL_DNA,
    cultureAdaptations: [],
    brandDnaLocked: true,
    guardian: DEMO_GUARDIAN,
    crisisRoom: DEMO_CRISIS_ROOM,
    launchKit: DEMO_LAUNCH_KIT,
    completedStages: [
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
      'launch'
    ]
  };
}
