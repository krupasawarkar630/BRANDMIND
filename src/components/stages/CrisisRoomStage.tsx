'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState } from 'react';
import { ArrowRight, AlertOctagon, CheckCircle2, ShieldAlert, RefreshCw, Sparkles } from 'lucide-react';
import type { CrisisTest, CrisisScenario } from '@/lib/types';
import StageEmptyState from '@/components/StageEmptyState';
import AsyncProgressState from '@/components/AsyncProgressState';
import { toast } from '@/lib/toast';

export default function CrisisRoomStage() {
  const { project, setCrisisRoomScenarios, evaluateCrisisResponse, saveCrisisResponse, markStageComplete } = useStore();
  const [loading, setLoading] = useState(false);
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { brandSystem, crisisRoom } = project;
  if (!brandSystem) {
    return <StageEmptyState stage="crisisRoom" prerequisiteStage="system" />;
  }

  const handleEnterCrisisMode = async () => {
    setError(null);
    setLoading(true);
    try {
      const scenarios = await aiProvider.generateCrisisScenarios(brandSystem);
      setCrisisRoomScenarios(scenarios);
      toast.warning('Generated 3 adversarial crisis scenarios.', 'Crisis Mode Active');
    } catch (e: any) {
      console.error(e);
      setError(e?.message || 'Failed to generate crisis scenarios. Please try again.');
      toast.error('Crisis simulation failed.', 'Generation Error');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = async (scenario: CrisisScenario, optionId: string, content: string) => {
    const existingTestId = `test-${scenario.id}`;
    setEvaluatingId(scenario.id);
    setError(null);

    // Reset pending evaluation
    evaluateCrisisResponse(
      {
        id: existingTestId,
        scenarioId: scenario.id,
        scenarioTitle: scenario.type,
        situation: scenario.situation,
        selectedResponse: content,
        status: 'pending',
      },
      { brandAlignment: 0, trustPreservation: 0, voiceAlignment: 0, reasoning: '' }
    );

    try {
      const evaluation = await aiProvider.evaluateCrisisResponse(brandSystem, scenario.situation, content);
      evaluateCrisisResponse(
        {
          id: existingTestId,
          scenarioId: scenario.id,
          scenarioTitle: scenario.type,
          situation: scenario.situation,
          selectedResponse: content,
          status: 'evaluated',
        },
        evaluation
      );
      toast.success('Evaluated crisis response alignment against locked rules.', 'Evaluation Complete');
    } catch (e: any) {
      console.error(e);
      toast.error('Failed to evaluate crisis response.', 'Evaluation Error');
    } finally {
      setEvaluatingId(null);
    }
  };

  const handleSave = (testId: string) => {
    saveCrisisResponse(testId);
    toast.success('Crisis resolution recorded to Decision Timeline.', 'Decision Saved');
  };

  const handleComplete = () => {
    markStageComplete('crisisRoom');
  };

  const scenarios = crisisRoom?.scenarios || [];
  const tests = crisisRoom?.tests || [];

  const steps = [
    { label: 'Synthesizing Hostile Scenarios', detail: 'Public relations backlashes, competitor attacks, and outages' },
    { label: 'Calibrating Brand Tone Constraints', detail: 'Testing response alignment against locked principles' },
    { label: 'Simulating Public Perception Shifts', detail: 'Estimating trust preservation and voice fidelity' },
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '880px' }}>
      <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent)',
            letterSpacing: '0.05em',
          }}
        >
          / 08b / BRAND CRISIS ROOM
        </span>
        <span className="badge badge-accent">Hostile Testing</span>
      </div>

      <h1
        style={{
          fontSize: '32px',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
          marginBottom: '16px',
        }}
      >
        Test consistency under pressure.
      </h1>

      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.6 }}>
        Any brand can sound inspiring on a landing page. How does yours react when the audience or press attacks? Choose simulated responses and evaluate alignment against your locked Brand DNA.
      </p>

      <AsyncProgressState
        isLoading={loading}
        error={error}
        onRetry={handleEnterCrisisMode}
        steps={steps}
        title="Generating High-Stakes Crisis Scenarios"
      />

      {!crisisRoom ? (
        !loading && (
          <button
            className="btn-primary"
            onClick={handleEnterCrisisMode}
            disabled={loading}
            style={{
              background: '#DC2626',
              borderColor: '#B91C1C',
              color: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
            }}
          >
            <AlertOctagon size={16} /> ENTER CRISIS MODE
          </button>
        )
      ) : (
        <div className="animate-slide-in">
          {scenarios.map((scenario) => {
            const test = tests.find((t) => t.scenarioId === scenario.id);
            const isEvaluated = test?.status === 'evaluated' || test?.status === 'saved';
            const isEvaluatingThis = evaluatingId === scenario.id;

            return (
              <div
                key={scenario.id}
                style={{
                  marginBottom: '32px',
                  background: 'var(--bg-card)',
                  border: `1px solid ${
                    test?.status === 'saved' ? 'rgba(22, 163, 74, 0.4)' : 'rgba(220, 38, 38, 0.25)'
                  }`,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                  borderRadius: '16px',
                  padding: '28px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    marginBottom: '24px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'rgba(220, 38, 38, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      border: '1px solid rgba(220, 38, 38, 0.2)',
                    }}
                  >
                    <ShieldAlert size={18} color="#DC2626" />
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        color: '#DC2626',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        display: 'block',
                        marginBottom: '6px',
                      }}
                    >
                      CRISIS SCENARIO: {scenario.type}
                    </span>
                    <p style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 600 }}>
                      "{scenario.situation}"
                    </p>
                  </div>
                </div>

                {isEvaluatingThis ? (
                  <div style={{ padding: '32px', textAlign: 'center' }}>
                    <span
                      className="animate-spin-slow"
                      style={{
                        display: 'inline-block',
                        width: '24px',
                        height: '24px',
                        border: '2px solid rgba(217, 83, 30, 0.2)',
                        borderTopColor: 'var(--accent)',
                        borderRadius: '50%',
                        marginBottom: '12px',
                      }}
                    />
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Evaluating Response Alignment Against Locked DNA...
                    </div>
                  </div>
                ) : !isEvaluated ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Choose your brand's response:
                    </span>
                    {scenario.options.map((opt) => (
                      <button
                        key={opt.id}
                        style={{
                          textAlign: 'left',
                          display: 'block',
                          width: '100%',
                          padding: '18px 20px',
                          background: 'rgba(0,0,0,0.02)',
                          border: '1px solid var(--border)',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          color: 'var(--text-primary)',
                          transition: 'all 0.2s',
                        }}
                        onClick={() => handleOptionSelect(scenario, opt.id, opt.content)}
                        disabled={loading || !!evaluatingId}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = 'var(--accent-light)';
                          e.currentTarget.style.borderColor = 'var(--accent)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'rgba(0,0,0,0.02)';
                          e.currentTarget.style.borderColor = 'var(--border)';
                        }}
                      >
                        <span
                          style={{
                            fontSize: '10px',
                            color: 'var(--accent)',
                            textTransform: 'uppercase',
                            fontWeight: 800,
                            display: 'block',
                            marginBottom: '6px',
                            letterSpacing: '0.06em',
                          }}
                        >
                          {opt.style} Strategy
                        </span>
                        <span
                          style={{
                            fontSize: '14px',
                            color: 'var(--text-primary)',
                            lineHeight: 1.5,
                            display: 'block',
                            fontWeight: 500,
                          }}
                        >
                          "{opt.content}"
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      padding: '24px',
                      background: 'rgba(0,0,0,0.02)',
                      borderRadius: '12px',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div style={{ marginBottom: '24px' }}>
                      <span
                        style={{
                          fontSize: '10px',
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          display: 'block',
                          marginBottom: '6px',
                        }}
                      >
                        Selected Response
                      </span>
                      <p
                        style={{
                          fontSize: '14px',
                          color: 'var(--text-primary)',
                          fontStyle: 'italic',
                          lineHeight: 1.5,
                          fontWeight: 500,
                        }}
                      >
                        "{test.selectedResponse}"
                      </p>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '16px',
                        marginBottom: '24px',
                      }}
                    >
                      {[
                        { label: 'Brand Alignment', val: test.evaluation!.brandAlignment },
                        { label: 'Trust Preservation', val: test.evaluation!.trustPreservation },
                        { label: 'Voice Alignment', val: test.evaluation!.voiceAlignment },
                      ].map((m) => (
                        <div
                          key={m.label}
                          style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            padding: '16px',
                            borderRadius: '10px',
                            textAlign: 'center',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '28px',
                              fontWeight: 800,
                              color: m.val > 80 ? '#16A34A' : m.val > 60 ? '#D97706' : '#DC2626',
                              fontFamily: 'var(--font-mono)',
                              marginBottom: '4px',
                            }}
                          >
                            {m.val}%
                          </div>
                          <span
                            style={{
                              fontSize: '10px',
                              color: 'var(--text-muted)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              fontWeight: 700,
                            }}
                          >
                            {m.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        padding: '16px',
                        background: 'var(--accent-light)',
                        border: '1px solid var(--accent)',
                        borderRadius: '8px',
                        marginBottom: '24px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          color: 'var(--accent)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          display: 'block',
                          marginBottom: '8px',
                        }}
                      >
                        AI Consistency Audit
                      </span>
                      <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 500 }}>
                        {test.evaluation!.reasoning}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      {test.status !== 'saved' ? (
                        <>
                          <button
                            className="btn-primary"
                            onClick={() => handleSave(test.id)}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                          >
                            <CheckCircle2 size={14} /> Save Crisis Resolution
                          </button>
                          <button
                            className="btn-outline"
                            onClick={() =>
                              evaluateCrisisResponse(
                                { ...test, status: 'pending' },
                                { brandAlignment: 0, trustPreservation: 0, voiceAlignment: 0, reasoning: '' }
                              )
                            }
                          >
                            Revise Response
                          </button>
                        </>
                      ) : (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#16A34A',
                            fontSize: '13px',
                            fontWeight: 700,
                          }}
                        >
                          <CheckCircle2 size={16} /> Saved to Decision Timeline
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="divider" />

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className="btn-primary"
          onClick={handleComplete}
          disabled={!crisisRoom}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
        >
          Continue to Launch Kit <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
