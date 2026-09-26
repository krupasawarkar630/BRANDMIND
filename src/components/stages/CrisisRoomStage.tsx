'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState } from 'react';
import { ArrowRight, AlertOctagon, CheckCircle2, ShieldAlert } from 'lucide-react';
import type { CrisisTest, CrisisScenario } from '@/lib/types';
import StageEmptyState from '@/components/StageEmptyState';

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{value}%</span>
      </div>
      <div style={{ width: '100%', height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: value > 80 ? '#16A34A' : value > 60 ? '#D97706' : '#DC2626', transition: 'width 0.5s ease-out' }} />
      </div>
    </div>
  );
}

export default function CrisisRoomStage() {
  const { project, setCrisisRoomScenarios, evaluateCrisisResponse, saveCrisisResponse, markStageComplete } = useStore();
  const [loading, setLoading] = useState(false);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  
  const { brandSystem, crisisRoom } = project;
  if (!brandSystem) {
    return <StageEmptyState stage="crisisRoom" prerequisiteStage="system" />;
  }

  const handleEnterCrisisMode = async () => {
    setLoading(true);
    try {
      const scenarios = await aiProvider.generateCrisisScenarios(brandSystem);
      setCrisisRoomScenarios(scenarios);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = async (scenario: CrisisScenario, optionId: string, content: string) => {
    const existingTestId = `test-${scenario.id}`;
    
    // Reset if it was saved/evaluated
    evaluateCrisisResponse({
      id: existingTestId,
      scenarioId: scenario.id,
      scenarioTitle: scenario.type,
      situation: scenario.situation,
      selectedResponse: content,
      status: 'pending'
    }, { brandAlignment: 0, trustPreservation: 0, voiceAlignment: 0, reasoning: '' });

    setLoading(true);
    try {
      const evaluation = await aiProvider.evaluateCrisisResponse(brandSystem, scenario.situation, content);
      evaluateCrisisResponse({
        id: existingTestId,
        scenarioId: scenario.id,
        scenarioTitle: scenario.type,
        situation: scenario.situation,
        selectedResponse: content,
        status: 'pending'
      }, evaluation);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    markStageComplete('crisisRoom');
  };

  const scenarios = crisisRoom?.scenarios || [];
  const tests = crisisRoom?.tests || [];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.05em' }}>
          / 08b / BRAND CRISIS ROOM
        </span>
      </div>

      <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '16px' }}>
        Test consistency under pressure.
      </h1>

      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6 }}>
        Any brand can look good on a landing page. How does yours react when the audience attacks? 
        Select responses to simulated crises and let AI evaluate if you stayed on brand.
      </p>

      {!crisisRoom ? (
        <button 
          className="btn-primary" 
          onClick={handleEnterCrisisMode} 
          disabled={loading}
          style={{ background: '#DC2626', borderColor: '#B91C1C', color: '#fff' }}
        >
          {loading ? (
            <>
              <span className="animate-spin-slow" style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
              Generating Crises...
            </>
          ) : (
            <>
              <AlertOctagon size={16} /> ENTER CRISIS MODE
            </>
          )}
        </button>
      ) : (
        <div className="animate-slide-in">
          {scenarios.map((scenario) => {
            const test = tests.find(t => t.scenarioId === scenario.id);
            const isEvaluated = test?.status === 'evaluated' || test?.status === 'saved';

            return (
              <div key={scenario.id} style={{ marginBottom: '32px', background: 'var(--bg-card)', border: `1px solid ${test?.status === 'saved' ? 'rgba(22, 163, 74, 0.4)' : 'rgba(220, 38, 38, 0.25)'}`, boxShadow: '0 2px 10px rgba(0,0,0,0.04)', borderRadius: '16px', padding: '28px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(220, 38, 38, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(220, 38, 38, 0.2)' }}>
                    <ShieldAlert size={18} color="#DC2626" />
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>
                      CRISIS: {scenario.type}
                    </span>
                    <p style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 600 }}>
                      "{scenario.situation}"
                    </p>
                  </div>
                </div>

                {!isEvaluated ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Choose your brand's response:</span>
                    {scenario.options.map(opt => (
                      <button
                        key={opt.id}
                        style={{
                          textAlign: 'left', display: 'block', width: '100%', padding: '20px',
                          background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border)',
                          borderRadius: '10px', cursor: 'pointer', color: 'var(--text-primary)', transition: 'all 0.2s'
                        }}
                        onClick={() => handleOptionSelect(scenario, opt.id, opt.content)}
                        disabled={loading}
                        onMouseOver={e => { e.currentTarget.style.background = 'var(--accent-light)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.02)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                      >
                        <span style={{ fontSize: '10px', color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '8px', letterSpacing: '0.05em' }}>
                          {opt.style}
                        </span>
                        <span style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5, display: 'block', fontWeight: 500 }}>
                          "{opt.content}"
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '24px', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ marginBottom: '24px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Your Response</span>
                      <p style={{ fontSize: '14px', color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: 1.5, fontWeight: 500 }}>"{test.selectedResponse}"</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                      {[
                        { label: 'Brand Alignment', val: test.evaluation!.brandAlignment },
                        { label: 'Trust Preservation', val: test.evaluation!.trustPreservation },
                        { label: 'Voice Alignment', val: test.evaluation!.voiceAlignment },
                      ].map(m => (
                        <div key={m.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
                          <div style={{ fontSize: '28px', fontWeight: 800, color: m.val > 80 ? '#16A34A' : m.val > 60 ? '#D97706' : '#DC2626', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>{m.val}</div>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>{m.label}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ padding: '16px', background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: '8px', marginBottom: '24px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>AI Assessment</span>
                      <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 500 }}>
                        {test.evaluation!.reasoning}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      {test.status !== 'saved' ? (
                        <>
                          <button className="btn-primary" onClick={() => saveCrisisResponse(test.id)}>
                            <CheckCircle2 size={14} /> Save Crisis Response
                          </button>
                          <button className="btn-outline" onClick={() => evaluateCrisisResponse({ ...test, status: 'pending' }, { brandAlignment: 0, trustPreservation: 0, voiceAlignment: 0, reasoning: '' })}>
                            Revise Response
                          </button>
                        </>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16A34A', fontSize: '13px', fontWeight: 700 }}>
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
      
      <button className="btn-primary" onClick={handleComplete} disabled={!crisisRoom}>
        Continue to Launch <ArrowRight size={14} />
      </button>
    </div>
  );
}
