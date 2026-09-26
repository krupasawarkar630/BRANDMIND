'use client';

import React, { useState } from 'react';
import { ShieldAlert, ArrowRight, Activity, Zap, MessageSquare, AlertTriangle, Crosshair, TrendingUp } from 'lucide-react';
import { BrandSurvivalMap, SimulatorScenario } from '@/lib/types';

export default function RealitySimulator({
  survivalMap,
  scenarios,
  onAction
}: {
  survivalMap: BrandSurvivalMap & { trust?: number };
  scenarios: SimulatorScenario[];
  onAction: (id: string, action: 'accepted_fix' | 'ignored' | 'sent_to_guardian') => void;
}) {
  const [activeDimension, setActiveDimension] = useState<string | null>(null);

  const RISK_COLORS = {
    LOW: '#16A34A',
    MEDIUM: '#D97706',
    HIGH: '#DC2626',
  };

  const dimensions = [
    { key: 'differentiation', label: 'Differentiation', val: survivalMap.differentiation, icon: Zap },
    { key: 'audienceFit', label: 'Audience Fit', val: survivalMap.audienceFit, icon: Crosshair },
    { key: 'voiceStability', label: 'Voice Stability', val: survivalMap.voiceStability, icon: MessageSquare },
    { key: 'clarity', label: 'Clarity', val: survivalMap.clarity, icon: Activity },
    { key: 'consistency', label: 'Consistency', val: survivalMap.consistency, icon: TrendingUp },
    { key: 'trust', label: 'Trust', val: survivalMap.trust || Math.min(100, (survivalMap.consistency + survivalMap.clarity) / 2), icon: ShieldAlert },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      
      {/* BRAND HEALTH */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
            Brand Health Diagnostics
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid var(--accent)', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>
            AI-GENERATED SIMULATION
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
          {dimensions.map(dim => {
            const Icon = dim.icon;
            const isActive = activeDimension === dim.key;
            return (
              <div 
                key={dim.key} 
                onClick={() => setActiveDimension(isActive ? null : dim.key)}
                style={{ 
                  background: isActive ? 'var(--accent-light)' : 'var(--bg-card)', 
                  border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`, 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  borderRadius: '12px', 
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: `${dim.val}%`, height: '3px', background: isActive ? 'var(--accent)' : 'rgba(0,0,0,0.15)', transition: 'width 1s ease' }} />
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Icon size={14} color={isActive ? 'var(--accent)' : 'var(--text-muted)'} />
                  <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}>
                    {dim.label}
                  </span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {dim.val}
                </div>
              </div>
            );
          })}
        </div>

        {activeDimension && (
          <div className="animate-slide-in" style={{ marginTop: '16px', background: 'var(--bg-card)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', borderLeft: '3px solid var(--accent)', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
              Diagnostic Trace: {dimensions.find(d => d.key === activeDimension)?.label}
            </span>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Score derived from simulated stress tests across {scenarios.length} scenarios. 
              {activeDimension === 'differentiation' && ' Identifies overlaps with generic patterns in competitor analysis.'}
              {activeDimension === 'audienceFit' && ' Reflects projected resonance against target personas.'}
              {activeDimension === 'voiceStability' && ' Measures tone drift during high-stress scenarios like negative social comments.'}
              {activeDimension === 'clarity' && ' Based on immediate comprehension by simulated early adopters.'}
              {activeDimension === 'consistency' && ' Evaluates alignment across positioning, visuals, and messaging.'}
              {activeDimension === 'trust' && ' Measures perceived authenticity and reliability.'}
            </p>
          </div>
        )}
      </div>

      {/* SCENARIOS */}
      <div>
        <h2 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '24px' }}>
          Simulated Stress Tests
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {scenarios.map(sc => (
            <div key={sc.id} style={{ 
              background: 'var(--bg-card)', 
              border: `1px solid ${sc.status !== 'pending' ? 'var(--border)' : RISK_COLORS[sc.riskLevel] + '40'}`, 
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              borderRadius: '16px',
              padding: '24px',
              opacity: sc.status !== 'pending' ? 0.75 : 1,
              transition: 'all 0.3s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: RISK_COLORS[sc.riskLevel] + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AlertTriangle size={16} color={RISK_COLORS[sc.riskLevel]} />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '0.02em', color: 'var(--text-primary)' }}>
                    {sc.title}
                  </h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Risk</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: RISK_COLORS[sc.riskLevel], textTransform: 'uppercase', background: RISK_COLORS[sc.riskLevel] + '15', padding: '4px 10px', borderRadius: '100px', border: `1px solid ${RISK_COLORS[sc.riskLevel]}30` }}>
                    {sc.riskLevel}
                  </span>
                </div>
              </div>

              {/* VISUAL SEQUENCE */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', gap: '16px', alignItems: 'stretch', marginBottom: '24px' }}>
                
                {/* 1. SCENARIO */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '8px' }}>Situation</span>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{sc.situation}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowRight size={14} color="var(--text-muted)" />
                </div>

                {/* 2. RESPONSE */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '8px' }}>Brand Response</span>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.5 }}>{sc.brandResponseRequirement || "Standard operational response based on Brand DNA."}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowRight size={14} color="var(--text-muted)" />
                </div>

                {/* 3. REACTION */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '8px' }}>Audience Reaction</span>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, fontStyle: 'italic' }}>"{sc.audienceReaction}"</p>
                </div>

              </div>

              {/* RECOMMENDATION / FIX */}
              <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Zap size={14} color="var(--accent)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>AI Strategic Recommendation</span>
                    <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 600 }}>{sc.recommendedAction}</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {sc.affectedElements.map(el => (
                      <span key={el} style={{ fontSize: '10px', background: 'rgba(0,0,0,0.04)', border: '1px solid var(--border)', padding: '4px 8px', borderRadius: '4px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
                        {el}
                      </span>
                    ))}
                  </div>

                  {sc.status === 'pending' ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => onAction(sc.id, 'accepted_fix')} className="btn-primary" style={{ fontSize: '12px', fontWeight: 600, padding: '8px 16px', borderRadius: '6px' }}>
                        Accept Fix
                      </button>
                      <button onClick={() => onAction(sc.id, 'ignored')} className="btn-outline" style={{ fontSize: '12px', fontWeight: 600, padding: '8px 16px', borderRadius: '6px' }}>
                        Ignore
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {sc.status.replace('_', ' ')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
