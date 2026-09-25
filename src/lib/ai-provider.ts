// ============================================================
// BRANDMIND — Mock AI Provider
// The output is deterministic based on user inputs
// Architecture is designed for easy swap to a real AI provider
// ============================================================

import type {
  IdeaInput,
  BlindSpot,
  BlindSpotResult,
  BrandDNA,
  BrandWorld,
  AgentResult,
  BrandBattle,
  GenericIssue,
  StressTest,
  BrandSystem,
  BrandMutation,
  WhatIfResult,
  RealitySimulatorResult,
  ABExperiment,
  AudienceRoom,
  GuardianResult,
  GuardianViolation,
  VisualDNA,
  CrisisScenario,
  CrisisEvaluation,
  CultureAdaptation,
  LaunchKitItem,
  LaunchKit,
} from './types';

// ── Utility ─────────────────────────────────────────────────
function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: string): T {
  return arr[hash(seed) % arr.length];
}

function pickN<T>(arr: T[], n: number, seed: string): T[] {
  const results: T[] = [];
  const used = new Set<number>();
  for (let i = 0; i < n; i++) {
    let idx = hash(seed + i) % arr.length;
    while (used.has(idx)) idx = (idx + 1) % arr.length;
    used.add(idx);
    results.push(arr[idx]);
  }
  return results;
}

// ── AIProvider Interface ────────────────────────────────────
export interface AIProvider {
  detectBlindSpots(idea: IdeaInput): Promise<BlindSpotResult>;
  synthesizeBrandDNA(idea: IdeaInput, blindSpots?: BlindSpot[]): Promise<BrandDNA>;
  generateBrandWorlds(dna: BrandDNA, idea: IdeaInput): Promise<BrandWorld[]>;
  runBrandBattle(worlds: BrandWorld[], dna: BrandDNA, selectedWorldId: string): Promise<BrandBattle>;
  runStressTest(world: BrandWorld, dna: BrandDNA): Promise<StressTest>;
  generateBrandSystem(world: BrandWorld, dna: BrandDNA, battle: BrandBattle): Promise<BrandSystem>;
  runBrandMutation(system: BrandSystem, dna: BrandDNA, variable: string, newValue: string): Promise<BrandMutation>;
  runWhatIfMachine(system: BrandSystem, dna: BrandDNA, transformation: string): Promise<WhatIfResult>;
  runRealitySimulator(project: any): Promise<RealitySimulatorResult>;
  runABExperiment(system: BrandSystem, type: string, valA: string, valB: string): Promise<ABExperiment>;
  runAudienceRoom(system: BrandSystem, dna: BrandDNA): Promise<AudienceRoom>;
  generateVisualDNA(system: BrandSystem, dna: BrandDNA, world: BrandWorld): Promise<VisualDNA>;
  generateCultureAdaptation(system: BrandSystem, dna: BrandDNA, market: string): Promise<CultureAdaptation>;
  checkConsistency(content: string, system: BrandSystem, dna: BrandDNA, isLocked?: boolean): Promise<GuardianResult>;
  generateCrisisScenarios(system: BrandSystem): Promise<CrisisScenario[]>;
  evaluateCrisisResponse(system: BrandSystem, situation: string, responseContent: string): Promise<CrisisEvaluation>;
  generateLaunchKit(system: BrandSystem, world: BrandWorld, dna: BrandDNA): Promise<LaunchKit>;
}

// ── Mock AI Provider ────────────────────────────────────────
export class MockAIProvider implements AIProvider {

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async detectBlindSpots(idea: IdeaInput): Promise<BlindSpotResult> {
    await this.delay(1500);

    const seed = idea.idea + idea.audience;
    const h = hash(seed);

    const possibleSpots: Omit<BlindSpot, 'id' | 'status'>[] = [
      {
        statement: "Everyone is my customer.",
        category: "Audience assumption",
        severity: "high",
        evidence: "The interview answers repeatedly describe college-student workflows but the audience field claims 'everyone'.",
        whyItMatters: "A product for everyone is a product for no one. Without a specific wedge, messaging will be too generic to convert.",
        affectedBrandDecisions: ["Audience", "Positioning", "Tone"],
        suggestedQuestion: "If you could only sell to one group for the next 12 months, who would it be?",
        alternatives: [
          "College students who need reliable crews",
          "Recent grads building side projects",
          "Hackathon participants"
        ]
      },
      {
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
        ]
      },
      {
        statement: "There are no competitors.",
        category: "Competition assumption",
        severity: "high",
        evidence: "Alternatives mentioned are generic platforms like Discord and LinkedIn, implying no direct competitors.",
        whyItMatters: "If there are no competitors, there might be no market. Or worse, the real competitor is 'doing nothing'.",
        affectedBrandDecisions: ["Positioning", "Differentiator"],
        suggestedQuestion: "What is the hacky workaround people use today that you are replacing?",
        alternatives: [
          "Position against the specific friction of Discord",
          "Position as the anti-LinkedIn",
          "Position against 'asking whoever is nearby'"
        ]
      },
      {
        statement: "Users will definitely prefer this.",
        category: "Behavior assumption",
        severity: "low",
        evidence: "The motivation expresses a personal pain point assumed to be universal.",
        whyItMatters: "Founders often project their own high intent onto a low-intent audience.",
        affectedBrandDecisions: ["Tone", "Messaging Pillars"],
        suggestedQuestion: "Why might someone try this and immediately leave?",
        alternatives: [
          "Acknowledge the friction of starting",
          "Focus on immediate first-session value",
          "Use a more empathetic, less demanding tone"
        ]
      }
    ];

    // Pick 2 or 3 blind spots deterministically
    const numSpots = 2 + (h % 2);
    const selectedSpots = pickN(possibleSpots, numSpots, seed);

    return {
      spots: selectedSpots.map((spot, i) => ({
        ...spot,
        id: `bs-${i}-${h}`,
        status: 'pending'
      })),
      summary: `Found ${numSpots} potential assumptions that could weaken the brand's positioning. Addressing these now will create a sharper DNA.`,
      status: 'complete'
    };
  }

  async synthesizeBrandDNA(idea: IdeaInput, blindSpots?: BlindSpot[]): Promise<BrandDNA> {
    await this.delay(1800);

    const seed = idea.idea + idea.audience;
    const h = hash(seed);

    const personalities = [
      ['Direct', 'Opinionated', 'Precise', 'Honest'],
      ['Energetic', 'Bold', 'Challenger', 'Irreverent'],
      ['Thoughtful', 'Calm', 'Principled', 'Strategic'],
      ['Warm', 'Human', 'Empathetic', 'Grounded'],
      ['Ambitious', 'Focused', 'Systematic', 'Sharp'],
    ];

    const territories = [
      'The feeling of knowing you made the right choice.',
      'Clarity in a world designed to overwhelm you.',
      'Progress that is visible and earned.',
      'Belonging without having to explain yourself.',
      'Momentum that compounds.',
    ];

    const voices = [
      ['Specific over vague', 'Action over aspiration', 'Evidence over promise'],
      ['Direct over diplomatic', 'Earned confidence', 'No filler words'],
      ['Short sentences', 'Real examples', 'Omit the obvious'],
      ['Human before corporate', 'Name the tension', 'Acknowledge the gap'],
    ];

    const principles = [
      ['Never overpromise', 'Serve the signal not the noise', 'Make the next step obvious'],
      ['Earn trust before attention', 'Specificity is respect', 'Be the proof not the pitch'],
      ['Own a point of view', 'Exclude on purpose', 'Progress over perfection'],
    ];

    const selectedPersonality = personalities[h % personalities.length];
    const selectedTerritory = territories[h % territories.length];
    const selectedVoice = voices[h % voices.length];
    const selectedPrinciples = principles[h % principles.length];

    const audience = idea.audience || 'people who want a better way';
    const problem = idea.problem || `${audience} spend too much time on workarounds`;
    let insight = `The core tension is not a lack of information — it's an excess of it. The audience doesn't need more options; they need a better filter. That's the wedge.`;

    if (blindSpots && blindSpots.length > 0) {
      const acceptedSpots = blindSpots.filter(s => s.status === 'accepted');
      if (acceptedSpots.length > 0) {
        insight = `Adjusted based on validated assumptions: ${acceptedSpots.map(s => s.statement).join(' ')} ${insight}`;
      }
    }

    const industry = idea.industry || 'technology';
    const ideaText = idea.idea;

    return {
      coreIdea: `${ideaText} — designed to make the right move feel obvious.`,
      targetUser: `${audience} who have the intent but not yet the clarity.`,
      coreProblem: problem || `${audience} are forced to stitch together improvised solutions that make a high-intent moment feel accidental.`,
      valueProposition: `${ideaText} turns context into momentum by making the right choice feel visible, timely, and worth acting on.`,
      motivations: [
        `Feel early without feeling alone`,
        `Make progress without asking permission`,
        `Find the people worth building with`,
      ],
      painPoints: [
        `Scattered information across too many tools`,
        `The moment of decision is unclear`,
        `No signal for when to act`,
      ],
      differentiator: `It turns context and intent into a high-signal next step, instead of more options.`,
      personality: selectedPersonality,
      principles: selectedPrinciples,
      emotionalTerritory: selectedTerritory,
      positioning: `For ${audience} who need to act but can't find the signal, ${ideaText} is the tool that makes the right next move obvious — unlike ${idea.alternatives || 'existing solutions'}, which create more noise.`,
      voiceCharacteristics: selectedVoice,
      confidence: 82 + (h % 15),
      insight,
    };
  }

  async generateBrandWorlds(dna: BrandDNA, idea: IdeaInput): Promise<BrandWorld[]> {
    await this.delay(2200);

    const seed = dna.coreIdea + idea.idea;
    const h = hash(seed);

    const worldTemplates = [
      {
        namePrefix: 'THE SIGNAL',
        nameSuffix: 'ROOM',
        tagline: 'Make the right signal impossible to miss.',
        strategy: 'precision-signal',
        visual: 'High contrast editorial. Dense information tables. Signal-over-noise typography.',
        voice: 'Terse. Confident. No softening language. Numbers before adjectives.',
        whyWorks: 'Creates a credible wedge by making a useful exclusion — it filters, not aggregates.',
        risks: 'May feel too narrow for audiences who want community alongside clarity.',
        personality: 'Editorial, Precise, Opinionated',
        audience: 'Treats the audience as capable analysts who want the short version.',
      },
      {
        namePrefix: 'THE OPEN',
        nameSuffix: 'CIRCUIT',
        tagline: 'Momentum is a team sport.',
        strategy: 'kinetic-community',
        visual: 'Motion-forward. Connective lines. Energy-as-visual-metaphor.',
        voice: 'Energetic but specific. Uses second person actively. Verbs over nouns.',
        whyWorks: 'Turns participation into the product — the more people use it, the better it gets.',
        risks: 'Community-first positioning can feel generic if the utility is not proven first.',
        personality: 'Kinetic, Inclusive, Forward',
        audience: 'Positions the audience as contributors to a moving system, not just users.',
      },
      {
        namePrefix: 'THE QUIET',
        nameSuffix: 'ADVANTAGE',
        tagline: 'Confidence without the performance.',
        strategy: 'quiet-mastery',
        visual: 'Restrained. White space as signal. Typography does the heavy lifting.',
        voice: 'Calm authority. Never oversells. Lets the result speak first.',
        whyWorks: 'Differentiates by not competing on loudness — the positioning IS the product.',
        risks: 'Quieter brands need a strong proof point early or they lose attention quickly.',
        personality: 'Grounded, Assured, Specific',
        audience: 'Treats the audience as people who are tired of hype and want proof instead.',
      },
    ];

    // Generate world names based on idea
    const ideaWords = idea.idea.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const worldNames = [
      `THE ${ideaWords[0]?.toUpperCase() || 'SIGNAL'} ROOM`,
      `THE OPEN ${ideaWords[1]?.toUpperCase() || 'CIRCUIT'}`,
      `THE QUIET ${ideaWords[2]?.toUpperCase() || 'ADVANTAGE'}`,
    ];

    return worldTemplates.map((t, i) => ({
      id: `world-${i + 1}`,
      name: worldNames[i] || `${t.namePrefix} ${t.nameSuffix}`,
      tagline: t.tagline,
      strategicIdea: `A ${t.strategy} world for ${dna.targetUser}. ${dna.coreIdea.split('.')[0]} — but framed as ${t.tagline.toLowerCase()}`,
      positioning: dna.positioning.replace('obvious', i === 0 ? 'precise' : i === 1 ? 'kinetic' : 'calm'),
      personality: t.personality,
      audienceRelationship: t.audience,
      visualDirection: t.visual,
      voiceDirection: t.voice,
      whyItWorks: t.whyWorks,
      risks: t.risks,
      differentiationScore: 78 + (hash(seed + i) % 20),
      signalScore: 72 + (hash(seed + i + 'signal') % 22),
    }));
  }

  async runBrandBattle(
    worlds: BrandWorld[],
    dna: BrandDNA,
    selectedWorldId: string
  ): Promise<BrandBattle> {
    await this.delay(2500);

    const world = worlds.find(w => w.id === selectedWorldId) || worlds[0];
    const seed = world.name + dna.coreIdea;

    const agents: AgentResult[] = [
      {
        agentId: 'strategist',
        agentName: 'Strategist',
        role: 'Does the positioning make strategic sense?',
        status: 'complete',
        finding: `The ${world.name} direction gives ${dna.coreIdea.split('—')[0].trim()} a credible wedge: it makes a choice about what to ignore.`,
        evidence: `A point of view gets stronger when it creates a useful exclusion, not when it tries to welcome everyone.`,
        concern: `The claim needs a proof point in the first 10 seconds or it reads as aspiration, not strategy.`,
        score: 88 + (hash(seed + 'strat') % 10),
        recommendation: `Own the moment of choosing the right next move.`,
      },
      {
        agentId: 'audience',
        agentName: 'Audience Agent',
        role: 'Would the target audience care?',
        status: 'complete',
        finding: `${dna.targetUser} will recognize the frustration, but they will need to feel progress within the first session.`,
        evidence: `Users in this category switch tools frequently. Retention is won in minutes, not months.`,
        concern: `The personality (${world.personality}) must be felt in the UI, not just the copy. If the product feels generic, the brand won't save it.`,
        score: 82 + (hash(seed + 'audience') % 14),
        recommendation: `Lead with a concrete first signal — show them the next move immediately.`,
      },
      {
        agentId: 'skeptic',
        agentName: 'Skeptic',
        role: 'What could fail?',
        status: 'complete',
        finding: `The category is crowded. "${world.tagline}" sounds differentiated but the actual behavior needs to earn that claim.`,
        evidence: `${world.risks}`,
        concern: `If competitors pivot to the same language, the positioning loses its edge within 18 months.`,
        score: 71 + (hash(seed + 'skeptic') % 12),
        recommendation: `Anchor the brand in a behavior only this product can own — not just a tone.`,
      },
      {
        agentId: 'creative',
        agentName: 'Creative Director',
        role: 'Is this memorable and distinctive?',
        status: 'complete',
        finding: `"${world.name}" has naming potential. The visual direction (${world.visualDirection.split('.')[0]}) gives enough of a brief to execute.`,
        evidence: `Memorable brands make one unexpected choice. The visual and naming direction here gives the designers a starting point that isn't a blank page.`,
        concern: `${world.voiceDirection.split('.')[0]} is a strong constraint — it needs to be defended in every touchpoint consistently.`,
        score: 85 + (hash(seed + 'creative') % 12),
        recommendation: `Develop the naming system before the visual system. Name first, design second.`,
      },
      {
        agentId: 'naming',
        agentName: 'Naming Analyst',
        role: 'Does the language feel ownable and non-generic?',
        status: 'complete',
        finding: `"${world.name}" is ownable. The uppercase editorial convention creates distinctiveness without requiring trademark imagination.`,
        evidence: `Names that double as a worldview are harder to copy. "${world.name}" makes a claim about perspective, not just function.`,
        concern: `Avoid letting the tagline become the only signal. The name needs to work standalone in small formats.`,
        score: 80 + (hash(seed + 'naming') % 16),
        recommendation: `Test the name in three formats: favicon, business card, and spoken aloud.`,
      },
    ];

    return {
      agents,
      collectiveInsight: `${world.name} is the strongest direction if the product can deliver a concrete signal in the first 60 seconds. The brand is only as good as the first moment it makes the right move feel obvious. Build toward that moment, not around it.`,
      recommendation: `Proceed with ${world.name}. Anchor the positioning in one specific behavior the product performs better than anything else.`,
      status: 'complete',
    };
  }

  async runStressTest(world: BrandWorld, dna: BrandDNA): Promise<StressTest> {
    await this.delay(1600);

    const seed = world.name + dna.coreIdea;

    const issues: GenericIssue[] = [
      {
        element: 'Tagline',
        original: world.tagline,
        problem: `"${world.tagline.split(' ').slice(0, 3).join(' ')}..." uses aspirational language without specificity`,
        whyGeneric: `This tagline could describe any tool in the category. It does not make a claim about what specifically changes.`,
        improvement: `Replace the aspiration with the precise behavior. What exactly becomes easier — and for whom?`,
        alternatives: [
          `Make the ${dna.targetUser.split(' ')[0]} decision unavoidable.`,
          `The one thing you shouldn't have to guess.`,
          `${dna.differentiator.split(' ').slice(0, 6).join(' ')}.`,
        ],
        riskLevel: 'medium',
      },
      {
        element: 'Value Proposition',
        original: dna.valueProposition.split('.')[0],
        problem: `"turns context into momentum" is a pattern used across 40+ SaaS products`,
        whyGeneric: `Momentum is an overused metaphor in B2B and product brands. It signals nothing specific about the mechanism.`,
        improvement: `Name the specific thing that changes. Use a before/after frame rather than a metaphor.`,
        alternatives: [
          `Before: ${dna.coreProblem.split(' ').slice(0, 8).join(' ')}. After: the right move is already visible.`,
          `Not another tool. The last step before the right decision.`,
          `${dna.differentiator}`,
        ],
        riskLevel: 'high',
      },
      {
        element: 'Voice',
        original: world.voiceDirection.split('.')[0],
        problem: `Voice descriptions like "${world.voiceDirection.split('.')[0]}" are execution notes, not behavioral commitments`,
        whyGeneric: `"Confident" is what every brand says. What does confidence look like in a rejection, a pricing page, an error state?`,
        improvement: `Define the voice as a specific constraint: what the brand will never say, not just how it sounds.`,
        alternatives: [
          `Never say "empower." Say what specifically changes instead.`,
          `Avoid adjectives that the audience must take on faith. Use data points.`,
          `Write every sentence as if the reader has 6 seconds.`,
        ],
        riskLevel: 'medium',
      },
      {
        element: 'Positioning',
        original: dna.positioning.split('—')[0].trim(),
        problem: `"For ${dna.targetUser.split(' ').slice(0, 3).join(' ')}..." follows the Clayton Christensen format verbatim`,
        whyGeneric: `Positioning statements in this format are templates, not owned positions. Any competitor can replace the nouns.`,
        improvement: `Start with the tension, not the audience. The tension is the signal; the audience is secondary.`,
        alternatives: [
          `${dna.coreProblem.split('.')[0]}. ${world.name} is the answer to that specific problem.`,
          `Most tools in this space add information. ${world.name.split(' ').slice(-1)[0]} removes the decision cost.`,
        ],
        riskLevel: 'low',
      },
    ];

    return {
      input: world.name,
      inputType: 'Brand World',
      issues,
      overallRisk: 'medium',
      summary: `${world.name} has real differentiation potential but 4 elements are currently indistinguishable from the category average. The highest-risk item is the value proposition — it must name the specific behavior, not a metaphor for it.`,
      status: 'complete',
    };
  }

  async generateBrandSystem(
    world: BrandWorld,
    dna: BrandDNA,
    _battle: BrandBattle
  ): Promise<BrandSystem> {
    await this.delay(2000);

    const seed = world.name + dna.coreIdea;
    const h = hash(seed);

    const namingOptions = [
      world.name.split(' ').slice(-1)[0],
      world.name.split(' ')[1],
      dna.differentiator.split(' ').slice(0, 2).join(''),
    ];

    const brandName = namingOptions[h % namingOptions.length] || world.name.split(' ')[1];

    return {
      brandName: brandName.charAt(0).toUpperCase() + brandName.slice(1).toLowerCase(),
      namingDirection: `${world.name} — editorial uppercase naming that makes a worldview claim rather than a feature claim. Domain and trademark search recommended before finalizing.`,
      positioningStatement: `For ${dna.targetUser}, ${brandName} is the tool that makes ${dna.differentiator}. Unlike ${dna.positioning.split('unlike')[1]?.trim() || 'existing alternatives that add noise'}, we make the signal visible.`,
      valueProposition: dna.valueProposition,
      tagline: world.tagline,
      brandPromise: `${world.tagline} — Every time. Not just in the pitch.`,
      personality: dna.personality,
      principles: dna.principles,
      voice: dna.voiceCharacteristics,
      messagingPillars: [
        `Signal: ${dna.differentiator.split(' ').slice(0, 8).join(' ')}`,
        `Audience: ${dna.targetUser.split(',')[0]}`,
        `Behavior: ${world.audienceRelationship}`,
        `Promise: ${world.tagline}`,
      ],
      visualDirection: {
        color: world.visualDirection.split('.')[0] + '. Primary: near-black. Accent: one opinionated color for signal moments.',
        typography: 'Bold editorial weight for headlines. Regular for body. Monospace for data and numbers. No decorative fonts.',
        imagery: world.visualDirection.split('. ').slice(-1)[0] + ' Photography that shows states of progress, not achievement.',
      },
      doExamples: [
        `"${dna.differentiator.split(' ').slice(0, 6).join(' ')}."`,
        `"The next move is already visible."`,
        `"Built for ${dna.targetUser.split(' ').slice(0, 3).join(' ')}."`,
        `Use numbers: "Reduced decision time from 3 hours to 12 minutes."`,
      ],
      dontExamples: [
        `"Empowering teams to unlock their full potential."`,
        `"The all-in-one platform for everything you need."`,
        `"Revolutionary AI-powered solution."`,
        `Adjectives that need the audience to take them on faith.`,
      ],
    };
  }

  async runBrandMutation(system: BrandSystem, dna: BrandDNA, variable: string, newValue: string): Promise<BrandMutation> {
    await this.delay(2000);
    const seed = system.brandName + variable + newValue;
    const h = hash(seed);

    // Create a modified copy of the brand system based on the variable
    const mutatedBrand: BrandSystem = { ...system };
    
    const changedElements: { element: string; original: string; newValue: string; intensity: 'low' | 'moderate' | 'major' }[] = [];
    const unchangedElements: string[] = [];

    // Track original values
    const originalAudience = dna.targetUser; // Not technically in BrandSystem directly, but used in Positioning
    const originalPositioning = system.positioningStatement;
    const originalPersonality = system.personality;
    const originalTone = system.voice;
    const originalTagline = system.tagline;

    if (variable === 'Audience') {
      mutatedBrand.positioningStatement = originalPositioning.replace(originalAudience.split(',')[0], newValue);
      changedElements.push({ element: 'Audience', original: originalAudience, newValue, intensity: 'major' });
      
      const newPersonality = [...originalPersonality];
      newPersonality[0] = (h % 2 === 0) ? 'Strategic' : 'Pragmatic';
      newPersonality[1] = (h % 3 === 0) ? 'Confident' : 'Calculated';
      mutatedBrand.personality = newPersonality;
      changedElements.push({ element: 'Personality', original: originalPersonality.join(', '), newValue: newPersonality.join(', '), intensity: 'major' });

      mutatedBrand.voice = ['Professional', 'Data-driven', 'No fluff'];
      changedElements.push({ element: 'Tone', original: originalTone.join(', '), newValue: mutatedBrand.voice.join(', '), intensity: 'major' });

      mutatedBrand.tagline = `${system.tagline.split('.')[0]}. Built for ${newValue}.`;
      changedElements.push({ element: 'Tagline', original: originalTagline, newValue: mutatedBrand.tagline, intensity: 'major' });

      mutatedBrand.visualDirection = { ...system.visualDirection, color: 'Muted slate. Primary: deep navy. Accent: stark white.' };
      changedElements.push({ element: 'Visual direction', original: 'Previous direction', newValue: mutatedBrand.visualDirection.color, intensity: 'moderate' });

      unchangedElements.push('Name', 'Core Problem', 'Brand Promise');
    } else if (variable === 'Tone') {
      mutatedBrand.voice = newValue.split(',').map(s => s.trim());
      changedElements.push({ element: 'Tone', original: originalTone.join(', '), newValue, intensity: 'major' });
      
      mutatedBrand.tagline = `The ${newValue.split(',')[0].toLowerCase()} way to ${dna.differentiator.split(' ')[0]}.`;
      changedElements.push({ element: 'Tagline', original: originalTagline, newValue: mutatedBrand.tagline, intensity: 'moderate' });

      unchangedElements.push('Name', 'Audience', 'Visual direction', 'Brand Promise');
    } else {
      // Generic fallback
      mutatedBrand.positioningStatement = `Updated positioning based on ${variable}: ${newValue}`;
      changedElements.push({ element: variable, original: 'Previous value', newValue, intensity: 'major' });
      unchangedElements.push('Name', 'Audience', 'Visual direction', 'Tone');
    }

    return {
      id: `mutation-${h}`,
      variable,
      newValue,
      changedElements,
      unchangedElements,
      reasoning: `Changing the ${variable} to "${newValue}" fundamentally shifts how the brand builds trust. We adapted the personality and tone to match this new expectation, while preserving the core problem and naming.`,
      mutatedBrand,
      status: 'pending'
    };
  }

  async runWhatIfMachine(system: BrandSystem, dna: BrandDNA, transformation: string): Promise<WhatIfResult> {
    await this.delay(2000);
    const seed = system.brandName + transformation;
    const h = hash(seed);

    const mutatedBrand: BrandSystem = { ...system };
    
    // Default fallback
    let personalityNew = 'Challenger';
    let toneNew = 'Assertive';
    let visualNew = 'Strong geometry';
    let taglineNew = 'The standard is broken. We fixed it.';
    let audienceNew = 'More ambitious, Less approachable';

    if (transformation === 'BOLDER') {
      personalityNew = 'Challenger, Aggressive, Sharp';
      toneNew = 'Assertive, Unapologetic';
      visualNew = 'High contrast, Stark typography, Red accents';
      taglineNew = `Don't just ${dna.differentiator.split(' ')[0]}. Own it.`;
      audienceNew = 'More polarizing, higher urgency';
    } else if (transformation === 'PREMIUM') {
      personalityNew = 'Exclusive, Refined, Assured';
      toneNew = 'Understated, Confident, Brief';
      visualNew = 'Generous white space, Serif typography, Monochrome';
      taglineNew = `The standard for ${dna.targetUser.split(' ')[0]}.`;
      audienceNew = 'Higher trust, higher perceived price';
    } else if (transformation === 'HUMAN') {
      personalityNew = 'Empathetic, Warm, Honest';
      toneNew = 'Conversational, Vulnerable';
      visualNew = 'Soft shapes, Warm colors, Authentic photography';
      taglineNew = `Finally, a way to ${dna.differentiator.split(' ')[0]} that feels right.`;
      audienceNew = 'More approachable, highly relatable';
    } else if (transformation === 'TECHNICAL') {
      personalityNew = 'Precise, Logical, Systemic';
      toneNew = 'Data-driven, Jargon-fluent, Direct';
      visualNew = 'Code-like monospace, Dark mode, Blue/Green accents';
      taglineNew = `The infrastructure for ${dna.differentiator.split(' ')[0]}.`;
      audienceNew = 'Highly credible to engineers, alienating to beginners';
    } else {
      personalityNew = `Infused with ${transformation.toLowerCase()}`;
      toneNew = `Adapted for ${transformation.toLowerCase()}`;
    }

    mutatedBrand.personality = personalityNew.split(',').map(s => s.trim());
    mutatedBrand.voice = toneNew.split(',').map(s => s.trim());
    mutatedBrand.tagline = taglineNew;
    mutatedBrand.visualDirection = { ...system.visualDirection, color: visualNew };

    return {
      id: `whatif-${h}`,
      transformation,
      changes: {
        personality: {
          element: 'Personality',
          original: system.personality.join(', '),
          newValue: personalityNew,
        },
        tone: {
          element: 'Tone',
          original: system.voice.join(', '),
          newValue: toneNew,
        },
        messaging: {
          element: 'Messaging',
          original: system.positioningStatement.slice(0, 40) + '...',
          newValue: `Shifted to prioritize ${transformation.toLowerCase()} angles.`,
        },
        tagline: {
          element: 'Tagline',
          original: system.tagline,
          newValue: taglineNew,
        },
        visual: {
          element: 'Visual Direction',
          original: system.visualDirection.color,
          newValue: visualNew,
        },
        audiencePerception: {
          element: 'Audience Perception',
          original: 'Baseline trust',
          newValue: audienceNew,
        }
      },
      mutatedBrand,
      status: 'pending'
    };
  }

  async runRealitySimulator(project: any): Promise<RealitySimulatorResult> {
    await this.delay(2500);
    const system = project.brandSystem as BrandSystem;
    const dna = project.brandDNA as BrandDNA;

    const seed = system.brandName + dna.targetUser;
    const h = hash(seed);

    return {
      scenariosTested: 8,
      potentialConflicts: 3,
      strongAreas: 4,
      needsAttention: 2,
      survivalMap: {
        clarity: 75,
        consistency: 90,
        differentiation: 82,
        audienceFit: 88,
        voiceStability: 85,
      },
      scenarios: [
        {
          id: 'sim-1',
          title: 'FIRST LAUNCH',
          situation: 'The product launches on Product Hunt to early adopters who skim rapidly.',
          audienceReaction: "They understand the UI but miss the underlying methodology.",
          brandResponseRequirement: "Requires the brand to restate its core thesis without sounding defensive.",
          riskLevel: 'LOW',
          why: `Your ${system.personality[0]} personality holds up well under scrutiny.`,
          affectedElements: ['Value proposition', 'Launch message'],
          recommendedAction: `Anchor the launch message on the contrast with competitors, explicitly naming the methodology.`,
          brandAlignment: 'Strongly aligned with current DNA.',
          status: 'pending'
        },
        {
          id: 'sim-2',
          title: 'CUSTOMER CONFUSION',
          situation: 'A user says: "I don\'t understand what this product actually does."',
          audienceReaction: "Frustration leading to immediate churn if not clarified.",
          brandResponseRequirement: "Needs a clear, jargon-free explanation that retains the brand's tone.",
          riskLevel: 'HIGH',
          why: `The tagline "${system.tagline}" communicates emotion but not function.`,
          affectedElements: ['Tagline', 'Landing headline', 'Value proposition'],
          recommendedAction: `Clarify the landing headline while preserving the ${system.personality[0]} personality.`,
          brandAlignment: 'Conflict between emotional positioning and required clarity.',
          status: 'pending'
        },
        {
          id: 'sim-3',
          title: 'COMPETITOR CHALLENGE',
          situation: 'A well-funded competitor copies your core feature and claims they invented it.',
          audienceReaction: "The audience looks to you to see if you panic or maintain authority.",
          brandResponseRequirement: "Requires a calm, dismissive, or highly confident response.",
          riskLevel: 'MEDIUM',
          why: `Your voice is "${system.voice[0]}", which is excellent for maintaining high ground, but you must avoid sounding arrogant.`,
          affectedElements: ['Messaging', 'Social tone'],
          recommendedAction: `Rely on your differentiator: "${dna.differentiator}". Let the competitor fight over the feature; you own the outcome.`,
          brandAlignment: 'Well-aligned with the "Quiet Advantage" world logic.',
          status: 'pending'
        },
        {
          id: 'sim-4',
          title: 'NEGATIVE SOCIAL COMMENT',
          situation: 'A prominent influencer calls the product "overpriced for what it is."',
          audienceReaction: "Followers echo the sentiment without trying the product.",
          brandResponseRequirement: "Must address the value explicitly without engaging in a flame war.",
          riskLevel: 'MEDIUM',
          why: `Your ${dna.targetUser} expects you to justify the premium without sounding defensive.`,
          affectedElements: ['Voice', 'PositioningStatement'],
          recommendedAction: `Lean into the exclusivity. Acknowledge it's not for everyone, reinforcing your target audience.`,
          brandAlignment: 'Fits the Challenger/Premium personality if executed carefully.',
          status: 'pending'
        }
      ],
      status: 'complete'
    };
  }

  async runABExperiment(system: BrandSystem, type: string, valA: string, valB: string): Promise<ABExperiment> {
    await this.delay(2000);
    const h = hash(system.brandName + type + valA + valB);

    const isOptionAStronger = h % 2 === 0;

    return {
      id: `ab-${h}`,
      experimentType: type,
      optionA: {
        value: valA,
        clarity: isOptionAStronger ? 85 : 70,
        memorability: isOptionAStronger ? 70 : 85,
        distinctiveness: isOptionAStronger ? 60 : 80,
        audienceFit: 90,
        brandAlignment: 85,
        risks: isOptionAStronger ? ['Might blend in with category norms'] : ['Requires audience education to understand fully'],
        reasoning: isOptionAStronger 
          ? `Direct and functional. Aligns well with the pragmatic side of the ${system.personality[0]} personality, but lacks emotional punch.` 
          : `High emotional resonance and distinctiveness, but sacrifices immediate clarity. Fits the ${system.personality[0]} angle perfectly if the audience is willing to think.`,
        summary: isOptionAStronger ? 'Clearer but more generic.' : 'More distinctive but requires explanation.'
      },
      optionB: {
        value: valB,
        clarity: !isOptionAStronger ? 85 : 70,
        memorability: !isOptionAStronger ? 70 : 85,
        distinctiveness: !isOptionAStronger ? 60 : 80,
        audienceFit: 85,
        brandAlignment: 90,
        risks: !isOptionAStronger ? ['Might blend in with category norms'] : ['Requires audience education to understand fully'],
        reasoning: !isOptionAStronger 
          ? `Direct and functional. Aligns well with the pragmatic side of the ${system.personality[0]} personality, but lacks emotional punch.` 
          : `High emotional resonance and distinctiveness, but sacrifices immediate clarity. Fits the ${system.personality[0]} angle perfectly if the audience is willing to think.`,
        summary: !isOptionAStronger ? 'Clearer but more generic.' : 'More distinctive but requires explanation.'
      },
      status: 'pending'
    };
  }

  async runAudienceRoom(system: BrandSystem, dna: BrandDNA): Promise<AudienceRoom> {
    await this.delay(2000);
    const seed = system.brandName + dna.targetUser;
    const h = hash(seed);

    return {
      reactions: [
        {
          id: 'target-user',
          persona: 'Target User',
          firstImpression: "Feels energetic and modern.",
          appeal: "The product seems easy to understand and speaks directly to my problems.",
          confusion: "The tagline doesn't clearly explain what it does technically.",
          objection: "Feels similar to other AI productivity products I've seen.",
          memorableElement: system.tagline,
          trustLevel: "High",
          clarityScore: 85,
          distinctivenessScore: 65,
          audienceFitScore: 92,
          improvementSuggestion: "Add a concrete example of what the tool outputs."
        },
        {
          id: 'skeptical',
          persona: 'Skeptical User',
          firstImpression: "Looks like another marketing gimmick.",
          appeal: "The promise is strong if they can actually deliver it.",
          confusion: "I don't get how it's better than my current workflow.",
          objection: "I doubt the AI is as smart as they claim.",
          memorableElement: system.positioningStatement.slice(0, 30) + '...',
          trustLevel: "Low",
          clarityScore: 70,
          distinctivenessScore: 50,
          audienceFitScore: 40,
          improvementSuggestion: "Provide a live demo or case study upfront."
        },
        {
          id: 'budget',
          persona: 'Budget-Conscious User',
          firstImpression: "Sleek, probably expensive.",
          appeal: "It looks very premium and well-designed.",
          confusion: "No mention of pricing or free tier.",
          objection: "I can probably do this for free with ChatGPT.",
          memorableElement: system.valueProposition,
          trustLevel: "Medium",
          clarityScore: 80,
          distinctivenessScore: 60,
          audienceFitScore: 70,
          improvementSuggestion: "Emphasize time/money saved to justify the premium feel."
        },
        {
          id: 'professional',
          persona: 'Industry Professional',
          firstImpression: "A bit too casual.",
          appeal: "The core problem is real and accurately described.",
          confusion: "Is this enterprise-ready?",
          objection: "The tone feels a bit too informal for serious work.",
          memorableElement: system.brandPromise,
          trustLevel: "Medium",
          clarityScore: 90,
          distinctivenessScore: 75,
          audienceFitScore: 60,
          improvementSuggestion: "Tone down the hype and focus on reliability."
        },
        {
          id: 'early-adopter',
          persona: 'Early Adopter',
          firstImpression: "I want to try this immediately.",
          appeal: "The unique angle on the problem is refreshing.",
          confusion: "Where is the API or integration list?",
          objection: "Hope it's not vaporware.",
          memorableElement: system.brandName,
          trustLevel: "High",
          clarityScore: 85,
          distinctivenessScore: 90,
          audienceFitScore: 95,
          improvementSuggestion: "Show the raw tech underneath the polished UI."
        }
      ],
      consensus: {
        clarity: 82,
        memorability: 74,
        distinctiveness: 68,
        trust: 79,
        audienceFit: 71
      },
      agreement: "4/5 personas found the core problem relatable and the visual direction premium.",
      disagreement: "The Industry Professional considered the tone too casual, while the Target User found it energetic.",
      insight: "The main unresolved issue is the balance between approachable (for the target user) and professional (to build trust with skeptics).",
      status: 'complete'
    };
  }

  async generateVisualDNA(system: BrandSystem, dna: BrandDNA, world: BrandWorld): Promise<VisualDNA> {
    await this.delay(2000);
    const seed = system.brandName + world.visualDirection;
    const h = hash(seed);

    const isPlayful = system.personality.join(' ').toLowerCase().includes('playful');

    return {
      typography: isPlayful 
        ? "Display: Rounded Sans (e.g. Recoleta or Fredoka) \nBody: Clean Geometric Sans (e.g. Inter)" 
        : "Display: Sharp Grotesk (e.g. Space Grotesk or Helvetica Now) \nBody: Highly legible Sans (e.g. Roboto)",
      colors: {
        primary: isPlayful ? '#F43F5E' : '#2563EB',
        secondary: isPlayful ? '#10B981' : '#4F46E5',
        accent: isPlayful ? '#FBBF24' : '#06B6D4',
        background: isPlayful ? '#FFF1F2' : '#F8FAFC',
        text: '#0F172A',
        description: isPlayful ? 'Vibrant, energetic, and highly saturated.' : 'Deep, trustworthy, and high contrast.'
      },
      composition: isPlayful ? 'Asymmetrical, floating elements, overlap.' : 'Grid-based, structured, lots of negative space.',
      shapes: isPlayful ? 'Organic, soft curves, blobs.' : 'Sharp edges, rigid geometry, precise lines.',
      icons: isPlayful ? 'Chunky, filled, duo-tone.' : 'Thin line, minimalist, monochromatic.',
      imagery: isPlayful ? 'Bright photography with expressive faces, cutouts.' : 'Moody, abstract 3D renders or desaturated lifestyle.',
      logoDirection: isPlayful ? 'Custom wordmark with a subtle smile/wink in the negative space.' : 'Minimalist logomark pairing with a tracking-heavy geometric sans.',
      uiStyle: isPlayful ? 'Neubrutalism or soft glassmorphism with heavy shadows.' : 'Flat, brutalist, or hyper-minimal.',
      avoid: [
        isPlayful ? 'Stiff corporate stock photos' : 'Overly saturated gradients',
        'Generic system fonts',
        'Cluttered layouts'
      ],
      status: 'complete'
    };
  }

  async generateCultureAdaptation(system: BrandSystem, dna: BrandDNA, market: string): Promise<CultureAdaptation> {
    await this.delay(1800);
    const seed = system.brandName + market;
    const h = hash(seed);

    let toneAdaptation = "Directly translate the current tone.";
    let consideration = "Ensure local idioms translate correctly.";

    if (market.toLowerCase() === 'japan') {
      toneAdaptation = "Soften direct challenges to competitors. Emphasize harmony, reliability, and long-term trust.";
      consideration = "Potential cultural consideration: Direct confrontation is often viewed poorly. May require local validation on visual mascots.";
    } else if (market.toLowerCase() === 'germany') {
      toneAdaptation = "Increase focus on data privacy, engineering quality, and literal feature descriptions.";
      consideration = "Potential cultural consideration: Hyperbole and emotional marketing are less effective. Focus on concrete utility.";
    } else if (market.toLowerCase() === 'india') {
      toneAdaptation = "Emphasize value-for-money, community validation, and family/network benefits.";
      consideration = "Potential cultural consideration: High price sensitivity and strong reliance on word-of-mouth. May require local validation on pricing pages.";
    } else if (market.toLowerCase() === 'usa') {
      toneAdaptation = "Lean into bold, individualistic claims. Action-oriented and highly optimistic.";
      consideration = "Standard baseline. High tolerance for challenger brands.";
    } else if (market.toLowerCase() === 'uk') {
      toneAdaptation = "Incorporate subtle wit or self-deprecation. Tone down the earnestness.";
      consideration = "Potential cultural consideration: Overtly earnest or overly enthusiastic claims may induce skepticism.";
    }

    return {
      id: `culture-${h}`,
      market,
      corePreserved: [
        dna.coreProblem,
        dna.differentiator,
        system.positioningStatement.substring(0, 50) + "..."
      ],
      adaptedElements: [
        {
          element: "Tone",
          original: system.voice[0],
          adapted: toneAdaptation
        },
        {
          element: "Messaging Example",
          original: system.tagline,
          adapted: `[Adapted] ${system.tagline} (adjusted for local nuance)`
        },
        {
          element: "Visual Association",
          original: "Universal",
          adapted: "Adapted to reflect local diversity and architectural/lifestyle context."
        }
      ],
      considerations: [
        consideration,
        "Remember: Do not treat this as universal truth. Always test with local stakeholders."
      ],
      status: 'pending'
    };
  }

  async checkConsistency(
    content: string,
    system: BrandSystem,
    dna: BrandDNA,
    isLocked: boolean = false
  ): Promise<GuardianResult> {
    await this.delay(1400);

    const seed = content + system.brandName;
    const h = hash(seed);

    const contentLower = content.toLowerCase();
    const genericPhrases = [
      'unlock', 'empower', 'synergy', 'revolutionary', 'all-in-one',
      'seamless', 'cutting-edge', 'innovative', 'leverage', 'paradigm',
      'everyone', 'full potential', 'world-class', 'best-in-class',
    ];

    const violations: GuardianViolation[] = [];
    let deductions = 0;

    if (isLocked) {
      if (contentLower.includes('corporate') || contentLower.includes('leverage')) {
        violations.push({
          id: `vio-${hash(content + 'tone')}`,
          expected: `${system.personality[0]} + ${system.voice[0]}`,
          generated: 'Corporate + overly formal',
          violation: 'Tone mismatch against Locked Brand DNA',
          fixedContent: content.replace(/leverage/gi, 'use').replace(/corporate/gi, 'startup'),
          status: 'pending'
        });
        deductions += 15;
      }
    }

    genericPhrases.forEach(phrase => {
      if (contentLower.includes(phrase)) {
        violations.push({
          id: `vio-${hash(content + phrase)}`,
          expected: `Distinctive vocabulary from ${system.brandName}`,
          generated: `Generic phrase: "${phrase}"`,
          violation: `Uses generic phrase: "${phrase}" — this could be written by any brand in the category`,
          fixedContent: content.replace(new RegExp(phrase, 'gi'), '[better word]'),
          status: 'pending'
        });
        deductions += 8;
      }
    });

    // Check for brand voice characteristics
    const brandVoiceTerms = dna.voiceCharacteristics.map(v => v.toLowerCase().split(' ')[0]);
    const hasVoiceSignals = brandVoiceTerms.some(t => contentLower.includes(t));

    if (!hasVoiceSignals) {
      violations.push({
        id: `vio-${hash(content + 'voice')}`,
        expected: `Sounds like ${system.brandName}`,
        generated: 'Generic brand voice',
        violation: `Does not sound like ${system.brandName} — the voice characteristics are absent`,
        fixedContent: `[Rewrite with ${dna.voiceCharacteristics[0]} tone] ${content}`,
        status: 'pending'
      });
      deductions += 10;
    }

    // Check if it references audience
    const audienceFirstWords = dna.targetUser.split(' ').slice(0, 3).map(w => w.toLowerCase());
    const referencesAudience = audienceFirstWords.some(w => contentLower.includes(w));

    if (!referencesAudience) {
      violations.push({
        id: `vio-${hash(content + 'audience')}`,
        expected: `Directly references ${dna.targetUser}`,
        generated: 'Abstract audience benefit',
        violation: `The audience benefit is abstract rather than observable`,
        fixedContent: content.trim() + ` (for ${dna.targetUser})`,
        status: 'pending'
      });
      deductions += 7;
    }

    const baseScore = 88 - deductions + (h % 5);
    const consistencyScore = Math.max(20, Math.min(98, baseScore));
    const voiceMatch = Math.max(25, Math.min(95, consistencyScore + (h % 10) - 5));
    const personalityMatch = Math.max(30, Math.min(95, consistencyScore + (h % 8) - 3));
    const positioningMatch = Math.max(20, Math.min(90, consistencyScore - (h % 12)));

    let label = 'STRONG SIGNAL';
    if (consistencyScore < 50) label = 'NEEDS A REWRITE';
    else if (consistencyScore < 70) label = 'NEEDS A NUDGE';
    else if (consistencyScore < 85) label = 'ON TRACK';

    const rewrites = [
      `${system.tagline.split('.')[0]}. ${dna.differentiator.split(' ').slice(0, 10).join(' ')}.`,
      `For ${dna.targetUser.split(' ').slice(0, 4).join(' ')}: ${dna.differentiator}`,
      `${dna.coreProblem.split('.')[0]}. ${system.brandName} changes that.`,
    ];

    return {
      content,
      consistencyScore,
      voiceMatch,
      personalityMatch,
      positioningMatch,
      label,
      summary: violations.length > 1
        ? `The content is optimistic, but it could be swapped into almost any startup homepage. The current system is more precise, human, and action-oriented.`
        : `The content is closely aligned with the brand system. Small refinements can push it from good to ownable.`,
      violations,
      suggestedRewrite: rewrites[h % rewrites.length],
      status: 'complete',
    };
  }

  async generateCrisisScenarios(system: BrandSystem): Promise<CrisisScenario[]> {
    await this.delay(2000);
    return [
      {
        id: 'scenario-1',
        type: 'Public Misunderstanding',
        situation: 'A high-profile user misunderstands your core feature and tweets that your product is a scam.',
        options: [
          { id: 'opt-1a', style: 'Defensive', content: 'Actually, you misunderstood how our platform works. If you read the docs...' },
          { id: 'opt-1b', style: 'Apologetic', content: 'We are so incredibly sorry for the confusion! We will immediately rewrite our onboarding to fix this.' },
          { id: 'opt-1c', style: 'Transparent + Corrective', content: 'We can see why it looks that way! Here’s what’s actually happening under the hood...' }
        ]
      },
      {
        id: 'scenario-2',
        type: 'Competitor Attack',
        situation: 'A direct competitor launches a campaign mocking your pricing model.',
        options: [
          { id: 'opt-2a', style: 'Aggressive', content: 'Funny coming from a company that hasn’t shipped a new feature since 2021.' },
          { id: 'opt-2b', style: 'High Ground', content: 'We focus on building the best product for our users. Pricing reflects the value.' },
          { id: 'opt-2c', style: 'Playful', content: 'Rent free in their heads 💅' }
        ]
      }
    ];
  }

  async evaluateCrisisResponse(system: BrandSystem, situation: string, responseContent: string): Promise<CrisisEvaluation> {
    await this.delay(1500);
    const seed = situation + responseContent;
    const h = hash(seed);

    const isDefensive = responseContent.includes('misunderstood') || responseContent.includes('Actually') || responseContent.includes('Funny coming');
    const isApologetic = responseContent.includes('sorry') || responseContent.includes('apologize');
    
    let alignment = 85;
    let trust = 90;
    let voice = 80;
    let reasoning = "This response navigates the crisis while staying true to the brand's core principles.";

    if (isDefensive) {
      alignment = 60; trust = 40; voice = 70;
      reasoning = "The response is overly defensive, damaging trust and straying from the brand's intended approachable personality.";
    } else if (isApologetic) {
      alignment = 75; trust = 85; voice = 65;
      reasoning = "Protects trust effectively, but the tone becomes overly submissive, contradicting the brand's confident positioning.";
    } else {
      alignment = 92; trust = 95; voice = 88;
      reasoning = "Perfectly balanced. Transparently addresses the issue without losing the brand's unique voice.";
    }

    return {
      brandAlignment: alignment,
      trustPreservation: trust,
      voiceAlignment: voice,
      reasoning
    };
  }

  async generateLaunchKit(
    system: BrandSystem,
    world: BrandWorld,
    dna: BrandDNA
  ): Promise<LaunchKit> {
    await this.delay(1800);

    const items: LaunchKitItem[] = [
      {
        id: 'elevator',
        title: 'Elevator Pitch',
        subtitle: '30-second version',
        content: `${system.brandName} helps ${dna.targetUser} ${dna.differentiator}. Most tools add more options. We make the right one obvious. That's the whole product.`,
        channel: 'Investor / networking conversations',
      },
      {
        id: 'hero',
        title: 'Homepage Hero',
        subtitle: 'Above the fold',
        content: `**${system.tagline}**\n\n${dna.valueProposition}\n\n[Get early access] [See how it works]`,
        channel: 'Landing page',
      },
      {
        id: 'bio-short',
        title: 'Short Bio',
        subtitle: '1 sentence',
        content: `${system.brandName} — ${system.tagline.toLowerCase()}`,
        channel: 'Profile, app store, press mention',
      },
      {
        id: 'bio-social',
        title: 'Social Bio',
        subtitle: 'Instagram / Twitter / LinkedIn',
        content: `${system.tagline}\nFor ${dna.targetUser.split(',')[0]}.\n${world.name} →`,
        channel: 'Social media profile',
      },
      {
        id: 'launch-post',
        title: 'Launch Announcement',
        subtitle: 'Product Hunt / Twitter launch',
        content: `We spent 6 months asking: why does the right move still feel hard to find?\n\nThe answer was never more information. It was better signal.\n\nToday we're launching ${system.brandName}.\n\n${system.positioningStatement.split('.')[0]}.\n\nEarly access is open. Link in bio.`,
        channel: 'Product Hunt / Twitter / LinkedIn',
      },
      {
        id: 'sample-post',
        title: 'Sample Social Post',
        subtitle: 'Evergreen content',
        content: `The best tool isn't the one with the most features.\n\nIt's the one that makes your next move obvious.\n\n${dna.differentiator}\n\n— ${system.brandName}`,
        channel: 'Instagram / LinkedIn feed',
      },
      {
        id: 'visual-brief',
        title: 'Visual Brief',
        subtitle: 'For designers',
        content: `**Color:** ${system.visualDirection.color}\n\n**Typography:** ${system.visualDirection.typography}\n\n**Imagery:** ${system.visualDirection.imagery}\n\n**Personality reference:** ${system.personality.join(', ')}`,
        channel: 'Design handoff',
      },
      {
        id: 'voice-guide',
        title: 'Brand Voice Guide',
        subtitle: 'For writers and team',
        content: `**We sound like:** ${system.voice.join(' · ')}\n\n**DO:**\n${system.doExamples.map(d => `• ${d}`).join('\n')}\n\n**DON'T:**\n${system.dontExamples.map(d => `• ${d}`).join('\n')}`,
        channel: 'Internal team / contractors',
      },
    ];

    return {
      thesis: `${dna.differentiator.split(' ').slice(0, 12).join(' ')}.`,
      items,
      status: 'complete',
    };
  }
}

// ── Singleton Export ─────────────────────────────────────────
export const aiProvider: AIProvider = new MockAIProvider();
