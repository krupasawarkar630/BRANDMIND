'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProjectState, Stage, IdeaInput, BlindSpotResult, BrandDNA, BrandWorld, BrandBattle, StressTest, BrandSystem, AudienceRoom, BrandMutation, WhatIfResult, RealitySimulatorResult, ABExperiment, TimelineEvent, VisualDNA, GuardianResult, CrisisScenario, CrisisTest, CrisisEvaluation, CultureAdaptation, LaunchKit } from './types';
import { STAGE_ORDER } from './types';

function makeId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function now(): string {
  return new Date().toISOString();
}

function createEmptyProject(): ProjectState {
  return {
    id: makeId(),
    createdAt: now(),
    updatedAt: now(),
    currentStage: 'idea',
    idea: null,
    blindSpots: null,
    brandDNA: null,
    worlds: null,
    selectedWorldId: null,
    battle: null,
    stressTest: null,
    brandSystem: null,
    brandSystemHistory: [],
    brandVariants: [],
    audienceRoom: null,
    mutations: [],
    whatIfResult: null,
    realitySimulator: null,
    abExperiments: [],
    timeline: [],
    visualDNA: null,
    cultureAdaptations: [],
    brandDnaLocked: false,
    guardian: null,
    crisisRoom: null,
    launchKit: null,
    completedStages: [],
  };
}

interface Store {
  project: ProjectState;
  resetProject: () => void;
  setIdea: (idea: IdeaInput) => void;
  setBlindSpots: (blindSpots: BlindSpotResult) => void;
  updateBlindSpotStatus: (id: string, status: 'accepted' | 'rejected' | 'explored') => void;
  setBrandDNA: (dna: BrandDNA) => void;
  setWorlds: (worlds: BrandWorld[]) => void;
  selectWorld: (id: string) => void;
  setBattle: (battle: BrandBattle) => void;
  setStressTest: (st: StressTest) => void;
  setBrandSystem: (bs: BrandSystem) => void;
  setAudienceRoom: (room: AudienceRoom | ((prev: AudienceRoom | null) => AudienceRoom)) => void;
  addMutation: (mutation: BrandMutation) => void;
  applyMutation: (mutationId: string) => void;
  discardMutation: (mutationId: string) => void;
  setWhatIfResult: (result: WhatIfResult | null) => void;
  applyWhatIf: (id: string) => void;
  saveWhatIfAsVariant: (id: string) => void;
  discardWhatIf: (id: string) => void;
  setRealitySimulator: (result: RealitySimulatorResult) => void;
  updateSimulatorScenarioStatus: (id: string, status: 'pending' | 'accepted_fix' | 'ignored' | 'sent_to_guardian') => void;
  addABExperiment: (exp: ABExperiment) => void;
  resolveABExperiment: (id: string, choice: 'chose_a' | 'chose_b' | 'kept_both') => void;
  addTimelineEvent: (event: Omit<TimelineEvent, 'id' | 'timestamp'>) => void;
  setVisualDNA: (v: VisualDNA) => void;
  lockVisualDNA: () => void;
  sendVisualDnaToBrandSystem: () => void;
  addCultureAdaptation: (c: CultureAdaptation) => void;
  saveCultureAdaptation: (id: string) => void;
  lockBrandDna: () => void;
  unlockBrandDna: (reason: string) => void;
  setGuardian: (g: GuardianResult) => void;
  fixGuardianViolation: (id: string) => void;
  setCrisisRoomScenarios: (scenarios: CrisisScenario[]) => void;
  evaluateCrisisResponse: (test: CrisisTest, evaluation: CrisisEvaluation) => void;
  saveCrisisResponse: (testId: string) => void;
  setLaunchKit: (lk: LaunchKit) => void;
  markStageComplete: (stage: Stage) => void;
  setCurrentStage: (stage: Stage) => void;
  canAccessStage: (stage: Stage) => boolean;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      project: createEmptyProject(),

      resetProject: () => set({ project: createEmptyProject() }),

      setIdea: (idea: IdeaInput) =>
        set(s => ({
          project: { ...s.project, idea, updatedAt: now() },
        })),

      setBlindSpots: (blindSpots: BlindSpotResult) =>
        set(s => ({
          project: { ...s.project, blindSpots, updatedAt: now() },
        })),

      updateBlindSpotStatus: (id: string, status: 'accepted' | 'rejected' | 'explored') =>
        set(s => {
          if (!s.project.blindSpots) return s;
          const updatedSpots = s.project.blindSpots.spots.map(spot => 
            spot.id === id ? { ...spot, status } : spot
          );
          return {
            project: { 
              ...s.project, 
              blindSpots: { ...s.project.blindSpots, spots: updatedSpots },
              updatedAt: now() 
            }
          };
        }),

      setBrandDNA: (brandDNA: BrandDNA) =>
        set(s => ({
          project: { ...s.project, brandDNA, updatedAt: now() },
        })),

      setWorlds: (worlds: BrandWorld[]) =>
        set(s => ({
          project: { ...s.project, worlds, updatedAt: now() },
        })),

      selectWorld: (selectedWorldId: string) =>
        set(s => ({
          project: { ...s.project, selectedWorldId, updatedAt: now() },
        })),

      setBattle: (battle: BrandBattle) =>
        set(s => ({
          project: { ...s.project, battle, updatedAt: now() },
        })),

      setStressTest: (stressTest: StressTest) =>
        set(s => ({
          project: { ...s.project, stressTest, updatedAt: now() },
        })),

      setBrandSystem: (brandSystem: BrandSystem) =>
        set(s => ({
          project: { ...s.project, brandSystem, updatedAt: now() },
        })),

      setAudienceRoom: (room) =>
        set(s => {
          const nextRoom = typeof room === 'function' ? room(s.project.audienceRoom) : room;
          return { project: { ...s.project, audienceRoom: nextRoom, updatedAt: now() } };
        }),

      addMutation: (mutation: BrandMutation) =>
        set(s => ({
          project: { ...s.project, mutations: [...(s.project.mutations || []), mutation], updatedAt: now() },
        })),

      applyMutation: (mutationId: string) =>
        set(s => {
          const mutations = s.project.mutations || [];
          const mutation = mutations.find(m => m.id === mutationId);
          if (!mutation || !s.project.brandSystem) return s;
          
          const updatedMutations = mutations.map(m =>
            m.id === mutationId ? { ...m, status: 'applied' as const } : m
          );

          const event: TimelineEvent = {
            id: `evt-${makeId()}`,
            stage: 'Mutation Lab',
            decision: `Changed ${mutation.variable} to "${mutation.newValue}"`,
            previousValue: mutation.changedElements.find(c => c.element === mutation.variable)?.original,
            newValue: mutation.newValue,
            reason: mutation.reasoning,
            source: 'USER',
            timestamp: now(),
            affectedElements: mutation.changedElements.map(c => c.element)
          };

          return {
            project: {
              ...s.project,
              brandSystemHistory: [...s.project.brandSystemHistory, s.project.brandSystem],
              brandSystem: mutation.mutatedBrand,
              mutations: updatedMutations,
              timeline: [...(s.project.timeline || []), event],
              updatedAt: now()
            }
          };
        }),

      discardMutation: (mutationId: string) =>
        set(s => {
          const mutations = s.project.mutations || [];
          const updatedMutations = mutations.map(m =>
            m.id === mutationId ? { ...m, status: 'discarded' as const } : m
          );
          return {
            project: { ...s.project, mutations: updatedMutations, updatedAt: now() }
          };
        }),

      setWhatIfResult: (result: WhatIfResult | null) =>
        set(s => ({
          project: { ...s.project, whatIfResult: result, updatedAt: now() }
        })),

      applyWhatIf: (id: string) =>
        set(s => {
          if (!s.project.whatIfResult || s.project.whatIfResult.id !== id || !s.project.brandSystem) return s;
          return {
            project: {
              ...s.project,
              brandSystemHistory: [...s.project.brandSystemHistory, s.project.brandSystem],
              brandSystem: s.project.whatIfResult.mutatedBrand,
              whatIfResult: { ...s.project.whatIfResult, status: 'applied' as const },
              updatedAt: now()
            }
          };
        }),

      saveWhatIfAsVariant: (id: string) =>
        set(s => {
          if (!s.project.whatIfResult || s.project.whatIfResult.id !== id) return s;
          return {
            project: {
              ...s.project,
              brandVariants: [...(s.project.brandVariants || []), s.project.whatIfResult.mutatedBrand],
              whatIfResult: { ...s.project.whatIfResult, status: 'saved_as_variant' as const },
              updatedAt: now()
            }
          };
        }),

      discardWhatIf: (id: string) =>
        set(s => {
          if (!s.project.whatIfResult || s.project.whatIfResult.id !== id) return s;
          return {
            project: {
              ...s.project,
              whatIfResult: { ...s.project.whatIfResult, status: 'discarded' as const },
              updatedAt: now()
            }
          };
        }),

      setRealitySimulator: (realitySimulator: RealitySimulatorResult) =>
        set(s => ({
          project: { ...s.project, realitySimulator, updatedAt: now() }
        })),

      updateSimulatorScenarioStatus: (id: string, status) =>
        set(s => {
          if (!s.project.realitySimulator) return s;
          const scenarios = s.project.realitySimulator.scenarios.map(sc => 
            sc.id === id ? { ...sc, status } : sc
          );
          return {
            project: {
              ...s.project,
              realitySimulator: { ...s.project.realitySimulator, scenarios },
              updatedAt: now()
            }
          };
        }),

      addABExperiment: (exp: ABExperiment) =>
        set(s => ({
          project: { ...s.project, abExperiments: [...(s.project.abExperiments || []), exp], updatedAt: now() }
        })),

      resolveABExperiment: (id: string, choice) =>
        set(s => {
          const abExps = s.project.abExperiments || [];
          const exp = abExps.find(e => e.id === id);
          if (!exp || !s.project.brandSystem) return s;

          const updatedExps = abExps.map(e => 
            e.id === id ? { ...e, status: choice } : e
          );
          
          const nextBrandSystem = { ...s.project.brandSystem };
          const updatedHistory = [...s.project.brandSystemHistory];
          
          const events: TimelineEvent[] = [];
          
          if (choice === 'chose_a' || choice === 'chose_b') {
            const selectedOpt = choice === 'chose_a' ? exp.optionA : exp.optionB;
            const selectedVal = selectedOpt.value;
            updatedHistory.push(s.project.brandSystem);
            
            let prevValue = '';
            const affected: string[] = [];

            if (exp.experimentType === 'Tagline A vs B') {
              prevValue = nextBrandSystem.tagline;
              nextBrandSystem.tagline = selectedVal;
              affected.push('Tagline');
            } else if (exp.experimentType === 'Name A vs B') {
              prevValue = nextBrandSystem.brandName;
              nextBrandSystem.brandName = selectedVal;
              affected.push('Name');
            } else if (exp.experimentType === 'Positioning A vs B') {
              prevValue = nextBrandSystem.positioningStatement;
              nextBrandSystem.positioningStatement = selectedVal;
              affected.push('Positioning');
            } else if (exp.experimentType === 'Voice A vs B') {
              prevValue = nextBrandSystem.voice.join(', ');
              nextBrandSystem.voice = selectedVal.split(',').map(v => v.trim());
              affected.push('Voice');
            }
            
            events.push({
              id: `evt-${makeId()}`,
              stage: 'A/B Experiment',
              decision: `Selected ${choice === 'chose_a' ? 'Option A' : 'Option B'} for ${exp.experimentType.replace(' A vs B', '')}`,
              previousValue: prevValue,
              newValue: selectedVal,
              reason: selectedOpt.summary,
              source: 'USER',
              timestamp: now(),
              affectedElements: affected
            });
          }

          return {
            project: {
              ...s.project,
              abExperiments: updatedExps,
              brandSystemHistory: updatedHistory,
              brandSystem: nextBrandSystem,
              timeline: [...s.project.timeline, ...events],
              updatedAt: now()
            }
          };
        }),

      addTimelineEvent: (event) =>
        set(s => ({
          project: { 
            ...s.project, 
            timeline: [...s.project.timeline, { ...event, id: `evt-${makeId()}`, timestamp: now() }],
            updatedAt: now() 
          }
        })),

      setVisualDNA: (v) =>
        set(s => ({
          project: { ...s.project, visualDNA: v, updatedAt: now() }
        })),

      lockVisualDNA: () =>
        set(s => {
          if (!s.project.visualDNA) return s;
          return {
            project: {
              ...s.project,
              visualDNA: { ...s.project.visualDNA, isLocked: true },
              updatedAt: now()
            }
          };
        }),

      sendVisualDnaToBrandSystem: () =>
        set(s => {
          if (!s.project.visualDNA || !s.project.brandSystem) return s;
          return {
            project: {
              ...s.project,
              brandSystemHistory: [...s.project.brandSystemHistory, s.project.brandSystem],
              brandSystem: {
                ...s.project.brandSystem,
                visualDirection: {
                  color: `${s.project.visualDNA.colors.primary}, ${s.project.visualDNA.colors.secondary}, ${s.project.visualDNA.colors.accent}`,
                  typography: s.project.visualDNA.typography,
                  imagery: s.project.visualDNA.imagery
                }
              },
              timeline: [...s.project.timeline, {
                id: `evt-${makeId()}`,
                stage: 'Visual DNA',
                decision: 'Updated Brand System with Visual DNA elements',
                reason: 'Sent Visual DNA to Brand System',
                source: 'USER',
                timestamp: now()
              }],
              updatedAt: now()
            }
          };
        }),

      addCultureAdaptation: (c) =>
        set(s => {
          const filtered = (s.project.cultureAdaptations || []).filter(x => x.status !== 'pending');
          return {
            project: {
              ...s.project,
              cultureAdaptations: [...filtered, c],
              updatedAt: now()
            }
          };
        }),

      saveCultureAdaptation: (id) =>
        set(s => {
          const adaptations = (s.project.cultureAdaptations || []).map(a => 
            a.id === id ? { ...a, status: 'saved' as const } : a
          );
          
          const adaptation = adaptations.find(a => a.id === id);
          if (!adaptation || !s.project.brandSystem) return s;

          // Create a brand variant based on this adaptation
          let variantContent = `Adapted for ${adaptation.market}:\n`;
          adaptation.adaptedElements.forEach(e => {
            variantContent += `- ${e.element}: ${e.adapted}\n`;
          });

          const variant: BrandSystem = {
            ...s.project.brandSystem,
            brandName: `${s.project.brandSystem.brandName} (${adaptation.market})`,
            brandPromise: `[Adapted] ${s.project.brandSystem.brandPromise}`
          };

          return {
            project: {
              ...s.project,
              cultureAdaptations: adaptations,
              brandVariants: [...s.project.brandVariants, variant],
              timeline: [...s.project.timeline, {
                id: `evt-${makeId()}`,
                stage: 'Culture Adaptation',
                decision: `Created local expression for ${adaptation.market}`,
                reason: `Cultural adaptation. Preserved: ${adaptation.corePreserved[0]}...`,
                source: 'USER',
                timestamp: now()
              }],
              updatedAt: now()
            }
          };
        }),

      lockBrandDna: () =>
        set(s => ({
          project: {
            ...s.project,
            brandDnaLocked: true,
            timeline: [...s.project.timeline, {
              id: `evt-${makeId()}`,
              stage: 'DNA Lock',
              decision: 'Locked Brand DNA',
              reason: 'Finalized strategic foundation.',
              source: 'USER',
              timestamp: now()
            }],
            updatedAt: now()
          }
        })),

      unlockBrandDna: (reason: string) =>
        set(s => ({
          project: {
            ...s.project,
            brandDnaLocked: false,
            timeline: [...s.project.timeline, {
              id: `evt-${makeId()}`,
              stage: 'DNA Lock',
              decision: 'Unlocked Brand DNA',
              reason: reason,
              source: 'USER',
              timestamp: now()
            }],
            updatedAt: now()
          }
        })),

      setGuardian: (guardian: GuardianResult) =>
        set(s => ({
          project: { ...s.project, guardian, updatedAt: now() },
        })),

      fixGuardianViolation: (id: string) =>
        set(s => {
          if (!s.project.guardian || !s.project.guardian.violations) return s;
          const violations = s.project.guardian.violations.map(v => 
            v.id === id ? { ...v, status: 'fixed' as const } : v
          );
          return {
            project: {
              ...s.project,
              guardian: { ...s.project.guardian, violations },
              updatedAt: now()
            }
          };
        }),

      setCrisisRoomScenarios: (scenarios) =>
        set(s => ({
          project: {
            ...s.project,
            crisisRoom: s.project.crisisRoom 
              ? { ...s.project.crisisRoom, scenarios } 
              : { scenarios, tests: [] },
            updatedAt: now()
          }
        })),

      evaluateCrisisResponse: (test, evaluation) =>
        set(s => {
          if (!s.project.crisisRoom) return s;
          const newTest: CrisisTest = { ...test, evaluation, status: 'evaluated' };
          
          const existingIndex = s.project.crisisRoom.tests.findIndex(t => t.id === test.id);
          const tests = [...s.project.crisisRoom.tests];
          if (existingIndex >= 0) {
            tests[existingIndex] = newTest;
          } else {
            tests.push(newTest);
          }

          return {
            project: {
              ...s.project,
              crisisRoom: { ...s.project.crisisRoom, tests },
              updatedAt: now()
            }
          };
        }),

      saveCrisisResponse: (testId) =>
        set(s => {
          if (!s.project.crisisRoom) return s;
          const tests = s.project.crisisRoom.tests.map(t => 
            t.id === testId ? { ...t, status: 'saved' as const } : t
          );
          
          const test = tests.find(t => t.id === testId);
          if (!test) return s;

          return {
            project: {
              ...s.project,
              crisisRoom: { ...s.project.crisisRoom, tests },
              timeline: [...s.project.timeline, {
                id: `evt-${makeId()}`,
                stage: 'Crisis Room',
                decision: `Saved response to: ${test.scenarioTitle}`,
                reason: test.evaluation?.reasoning || 'Brand aligned response.',
                source: 'USER',
                timestamp: now()
              }],
              updatedAt: now()
            }
          };
        }),

      setLaunchKit: (launchKit: LaunchKit) =>
        set(s => ({
          project: { ...s.project, launchKit, updatedAt: now() },
        })),

      markStageComplete: (stage: Stage) =>
        set(s => {
          const completed = s.project.completedStages.includes(stage)
            ? s.project.completedStages
            : [...s.project.completedStages, stage];
          const idx = STAGE_ORDER.indexOf(stage);
          const next = idx < STAGE_ORDER.length - 1 ? STAGE_ORDER[idx + 1] : stage;
          return {
            project: {
              ...s.project,
              completedStages: completed,
              currentStage: next,
              updatedAt: now(),
            },
          };
        }),

      setCurrentStage: (currentStage: Stage) =>
        set(s => ({
          project: { ...s.project, currentStage, updatedAt: now() },
        })),

      canAccessStage: (stage: Stage) => {
        const { project } = get();
        const idx = STAGE_ORDER.indexOf(stage);
        if (idx === 0) return true;
        const prevStage = STAGE_ORDER[idx - 1];
        return project.completedStages.includes(prevStage);
      },
    }),
    {
      name: 'brandmind-project-v1',
      partialize: (s) => ({ project: s.project }),
    }
  )
);
