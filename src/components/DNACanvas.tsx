'use client';

import React, { useState, useEffect } from 'react';
import { BrandDNA } from '@/lib/types';
import { Info, ShieldAlert, Target } from 'lucide-react';

export interface TraitDetail {
  id: string;
  name: string;
  strength: number; // 0-100
  rationale: string;
  evidence: string;
  avoid: string[];
  audienceExpectation: string;
  x: number;
  y: number;
}

// Mock service interface that takes real DNA and expands it into detailed trait nodes
// In the future, this would be generated directly by the AI model in BrandDNA
function expandTraits(dna: BrandDNA): TraitDetail[] {
  const traits = [...dna.personality];
  
  // Distribute nodes in a circle
  const radius = 120;
  const center = 150;
  
  return traits.map((trait, i) => {
    const angle = (i / traits.length) * Math.PI * 2 - Math.PI / 2;
    // Deterministic mock generation based on string lengths and index
    const hash = trait.length + i;
    
    return {
      id: trait.toLowerCase().replace(/\s+/g, '-'),
      name: trait,
      strength: 70 + (hash % 30),
      rationale: `Selected because the core problem is "${dna.coreProblem}".`,
      evidence: dna.insight,
      avoid: ['Generic messaging', 'Vague promises'],
      audienceExpectation: dna.targetUser,
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  });
}

function DNANode({ 
  trait, 
  isActive, 
  onClick 
}: { 
  trait: TraitDetail; 
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <g 
      transform={`translate(${trait.x}, ${trait.y})`} 
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      className={`dna-node ${isActive ? 'active' : ''}`}
    >
      <circle 
        r={isActive ? 28 : 22} 
        fill={isActive ? 'rgba(217, 83, 30, 0.12)' : 'rgba(0, 0, 0, 0.03)'}
        stroke={isActive ? 'var(--accent)' : 'var(--border)'}
        strokeWidth="2"
        style={{ transition: 'all 0.3s ease' }}
      />
      {isActive && (
        <circle r={34} fill="none" stroke="rgba(217, 83, 30, 0.4)" strokeWidth="1" strokeDasharray="4 4">
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="10s" repeatCount="indefinite" />
        </circle>
      )}
      <text 
        y={isActive ? 45 : 35} 
        textAnchor="middle" 
        fill={isActive ? 'var(--text-primary)' : 'var(--text-secondary)'}
        fontSize="11px"
        fontWeight={isActive ? "800" : "600"}
        letterSpacing="0.05em"
        style={{ transition: 'all 0.3s ease' }}
      >
        {trait.name.toUpperCase()}
      </text>
    </g>
  );
}

export default function DNACanvas({ dna }: { dna: BrandDNA }) {
  const [traits, setTraits] = useState<TraitDetail[]>([]);
  const [activeTrait, setActiveTrait] = useState<TraitDetail | null>(null);

  useEffect(() => {
    const expanded = expandTraits(dna);
    setTraits(expanded);
    if (expanded.length > 0) setActiveTrait(expanded[0]);
  }, [dna]);

  if (traits.length === 0) return null;

  // Calculate stability indicator based on consistency of the DNA inputs
  const stability = Math.min(99, 70 + dna.personality.length * 2 + dna.principles.length * 3);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      
      {/* Constellation Canvas */}
      <div style={{ position: 'relative', height: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--border)', background: 'rgba(0,0,0,0.01)' }}>
        
        <div style={{ position: 'absolute', top: 16, left: 16 }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>DNA Stability</div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#15803D' }}>{stability}%</div>
        </div>

        <svg width="300" height="300" style={{ overflow: 'visible' }}>
          {/* Constellation Lines */}
          <g stroke="var(--border)" strokeWidth="1.5">
            {traits.map((t1, i) => 
              traits.slice(i + 1).map(t2 => (
                <line key={`${t1.id}-${t2.id}`} x1={t1.x} y1={t1.y} x2={t2.x} y2={t2.y} />
              ))
            )}
          </g>
          
          {/* Nodes */}
          {traits.map(trait => (
            <DNANode 
              key={trait.id} 
              trait={trait} 
              isActive={activeTrait?.id === trait.id}
              onClick={() => setActiveTrait(trait)}
            />
          ))}
        </svg>
      </div>

      {/* Trait Detail Panel */}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
        {activeTrait ? (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>{activeTrait.name}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <div style={{ height: '6px', background: 'var(--border)', flex: 1, borderRadius: '3px' }}>
                <div style={{ height: '100%', background: 'var(--accent)', width: `${activeTrait.strength}%`, borderRadius: '3px' }} />
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{activeTrait.strength}/100</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ padding: '12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <Info size={14} />
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Rationale</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 450 }}>{activeTrait.rationale}</p>
              </div>

              <div style={{ padding: '12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <Target size={14} />
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Audience Expectation</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 450 }}>{activeTrait.audienceExpectation}</p>
              </div>

              <div style={{ padding: '12px', background: 'rgba(220, 38, 38, 0.05)', border: '1px solid rgba(220, 38, 38, 0.2)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#DC2626', marginBottom: '4px' }}>
                  <ShieldAlert size={14} />
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Traits to Avoid</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: '16px', color: '#B91C1C', fontSize: '13px', fontWeight: 500 }}>
                  {activeTrait.avoid.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            Select a node to inspect trait details
          </div>
        )}
      </div>

    </div>
  );
}
