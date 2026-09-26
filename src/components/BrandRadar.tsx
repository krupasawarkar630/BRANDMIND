'use client';

import React, { useState } from 'react';
import { BrandDNA } from '@/lib/types';
import { Info } from 'lucide-react';

interface RadarDimension {
  name: string;
  value: number; // 0-100
  evidence: string;
  impact: string;
}

// Maps real Brand DNA traits to dimensions
function getRadarDimensions(dna: BrandDNA): RadarDimension[] {
  // We'll extract all unique traits from personality and principles to form dimensions
  const combined = Array.from(new Set([...dna.personality, ...dna.principles.map(p => p.split(' ')[0])])).slice(0, 6);
  
  // Pad if we don't have enough dimensions
  const fallbacks = ['BOLD', 'HUMAN', 'TECHNICAL', 'PREMIUM', 'PLAYFUL', 'MINIMAL'];
  while (combined.length < 5) {
    combined.push(fallbacks.pop() || 'OTHER');
  }

  return combined.map((trait, i) => {
    // Generate deterministic strength
    const strength = 60 + ((trait.length + i * 7) % 40);
    return {
      name: trait.toUpperCase(),
      value: strength,
      evidence: `Aligned with the core positioning of solving "${dna.coreProblem}".`,
      impact: `Increasing this might alienate users seeking a more conservative approach.`
    };
  });
}

export default function BrandRadar({ dna }: { dna: BrandDNA }) {
  const dimensions = getRadarDimensions(dna);
  const [activeDim, setActiveDim] = useState<RadarDimension | null>(null);
  
  const size = 260;
  const center = size / 2;
  const radius = size / 2 - 40;

  // Generate polygon points
  const points = dimensions.map((dim, i) => {
    const angle = (Math.PI * 2 * i) / dimensions.length - Math.PI / 2;
    const r = (dim.value / 100) * radius;
    return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
  }).join(' ');

  // Generate full polygon points (for background web)
  const webPoints = dimensions.map((_, i) => {
    const angle = (Math.PI * 2 * i) / dimensions.length - Math.PI / 2;
    return `${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`;
  }).join(' ');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      
      {/* Radar Chart SVG */}
      <div style={{ height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--border)', background: 'rgba(0,0,0,0.01)' }}>
        <svg width={size} height={size}>
          {/* Web lines */}
          {dimensions.map((_, i) => {
            const angle = (Math.PI * 2 * i) / dimensions.length - Math.PI / 2;
            return (
              <line 
                key={`line-${i}`}
                x1={center} y1={center} 
                x2={center + radius * Math.cos(angle)} 
                y2={center + radius * Math.sin(angle)} 
                stroke="var(--border)" strokeWidth="1" 
              />
            );
          })}
          
          {/* Outer Web Polygon */}
          <polygon points={webPoints} fill="none" stroke="var(--border)" strokeWidth="1" />
          
          {/* Inner Web Polygons (scales) */}
          {[0.25, 0.5, 0.75].map(scale => {
            const scaledPoints = dimensions.map((_, i) => {
              const angle = (Math.PI * 2 * i) / dimensions.length - Math.PI / 2;
              const r = radius * scale;
              return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
            }).join(' ');
            return <polygon key={`scale-${scale}`} points={scaledPoints} fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />;
          })}

          {/* Value Polygon */}
          <polygon 
            points={points} 
            fill="rgba(217, 83, 30, 0.15)" 
            stroke="var(--accent)" 
            strokeWidth="2" 
            style={{ transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />

          {/* Value Nodes */}
          {dimensions.map((dim, i) => {
            const angle = (Math.PI * 2 * i) / dimensions.length - Math.PI / 2;
            const r = (dim.value / 100) * radius;
            const cx = center + r * Math.cos(angle);
            const cy = center + r * Math.sin(angle);
            const isActive = activeDim?.name === dim.name;
            
            // Label positions (pushed further out)
            const labelR = radius + 20;
            const lx = center + labelR * Math.cos(angle);
            const ly = center + labelR * Math.sin(angle);
            
            return (
              <g key={`node-${i}`} onClick={() => setActiveDim(dim)} style={{ cursor: 'pointer' }}>
                <circle 
                  cx={cx} cy={cy} r={isActive ? 6 : 4} 
                  fill={isActive ? "var(--accent)" : "#FFFFFF"} 
                  stroke="var(--accent)" strokeWidth="2"
                  style={{ transition: 'all 0.2s ease' }}
                />
                <text 
                  x={lx} y={ly} 
                  textAnchor="middle" 
                  alignmentBaseline="middle"
                  fill={isActive ? "var(--text-primary)" : "var(--text-secondary)"}
                  fontSize="10px"
                  fontWeight={isActive ? "800" : "600"}
                  letterSpacing="0.04em"
                >
                  {dim.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Detail Panel */}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.01)' }}>
        {activeDim ? (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Dimension: {activeDim.name}
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '20px' }}>
              <span style={{ fontSize: '26px', fontWeight: 800, color: 'var(--accent)' }}>{activeDim.value}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>/ 100</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <Info size={14} />
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Supporting Evidence</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 450 }}>{activeDim.evidence}</p>
              </div>

              <div style={{ padding: '14px', background: 'rgba(220, 38, 38, 0.05)', border: '1px solid rgba(220, 38, 38, 0.2)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#DC2626', marginBottom: '4px' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>If Increased Further</span>
                </div>
                <p style={{ fontSize: '13px', color: '#B91C1C', lineHeight: 1.5, fontWeight: 500 }}>{activeDim.impact}</p>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center' }}>
            Click any node on the radar <br/>to inspect dimension depth
          </div>
        )}
      </div>

    </div>
  );
}
