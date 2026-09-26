'use client';

import React from 'react';
import { ArrowRight, Sparkles, Activity } from 'lucide-react';

export default function BeforeAfterComparison({
  title,
  beforeText,
  afterText,
  intensity = 'moderate'
}: {
  title: string;
  beforeText: string;
  afterText: string;
  intensity?: 'low' | 'moderate' | 'major';
}) {
  const intensityColors = {
    low: '#16A34A',     // green
    moderate: '#D97706', // amber
    major: '#DC2626'     // red
  };

  const color = intensityColors[intensity];

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={14} color="var(--accent)" />
          <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
            {title}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }} />
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: color }}>
            {intensity} shift
          </span>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'stretch' }}>
        
        {/* BEFORE */}
        <div style={{ padding: '20px', position: 'relative' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px', display: 'block' }}>Current state</span>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 450 }}>
            {beforeText || '—'}
          </p>
        </div>

        {/* DIVIDER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
            <ArrowRight size={14} color="var(--accent)" />
          </div>
        </div>

        {/* AFTER */}
        <div style={{ padding: '20px', background: 'var(--accent-light)', borderLeft: '1px solid rgba(217, 83, 30, 0.15)', position: 'relative' }}>
          <span style={{ fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={12} /> New state
          </span>
          <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6, fontWeight: 600 }}>
            {afterText || '—'}
          </p>
        </div>

      </div>
    </div>
  );
}
