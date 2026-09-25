'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState } from 'react';
import { ArrowRight, AlertOctagon, CheckCircle2, ShieldAlert } from 'lucide-react';
import type { CrisisTest, CrisisScenario } from '@/lib/types';

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
  if (!brandSystem) return null;

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
              <div key={scenario.id} className="stage-card" style={{ marginBottom: '24px', borderColor: test?.status === 'saved' ? '#16A34A' : 'var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                  <ShieldAlert size={20} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                      CRISIS: {scenario.type}
                    </h3>
                    <p style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                      "{scenario.situation}"
                    </p>
                  </div>
                </div>

                {!isEvaluated ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginLeft: '32px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Choose your brand's response:</p>
                    {scenario.options.map(opt => (
                      <button
                        key={opt.id}
                        className="btn-outline"
                        style={{ textAlign: 'left', display: 'block', height: 'auto', padding: '16px', whiteSpace: 'normal', position: 'relative' }}
                        onClick={() => handleOptionSelect(scenario, opt.id, opt.content)}
                        disabled={loading}
                      >
                        <span style={{ fontSize: '10px', color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                          Option: {opt.style}
                        </span>
                        <span style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                          "{opt.content}"
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div style={{ marginLeft: '32px', padding: '20px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div style={{ marginBottom: '20px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Your Response</span>
                      <p style={{ fontSize: '14px', color: 'var(--text-primary)', fontStyle: 'italic' }}>"{test.selectedResponse}"</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px', marginBottom: '24px' }}>
                      <div>
                        <ScoreBar label="Brand Alignment" value={test.evaluation!.brandAlignment} />
                        <ScoreBar label="Trust Preservation" value={test.evaluation!.trustPreservation} />
                        <ScoreBar label="Voice Alignment" value={test.evaluation!.voiceAlignment} />
                      </div>
                      <div style={{ padding: '16px', background: 'var(--bg)', borderRadius: '6px' }}>
                        <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>AI Assessment</h4>
                        <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                          {test.evaluation!.reasoning}
                        </p>
                      </div>
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16A34A', fontSize: '13px', fontWeight: 600 }}>
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
