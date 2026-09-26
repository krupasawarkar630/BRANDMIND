'use client';

import React from 'react';
import type { BlindSpot } from '@/lib/types';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, XCircle, Search } from 'lucide-react';

const SEVERITY_CONFIG: Record<string, { color: string, bg: string, border: string, icon: React.ElementType, label: string }> = {
  high: { color: '#DC2626', bg: 'rgba(220, 38, 38, 0.08)', border: '#DC2626', icon: AlertTriangle, label: 'CRITICAL ASSUMPTION' },
  medium: { color: '#D97706', bg: 'rgba(217, 119, 6, 0.08)', border: '#D97706', icon: AlertCircle, label: 'POTENTIAL BLIND SPOT' },
  low: { color: '#2563EB', bg: 'rgba(37, 99, 235, 0.08)', border: '#2563EB', icon: Info, label: 'WEAK SIGNAL' },
};

export default function BlindSpotSignal({ spot, onUpdate }: { spot: BlindSpot; onUpdate: (status: 'accepted' | 'rejected' | 'explored') => void }) {
  const config = SEVERITY_CONFIG[spot.severity] || SEVERITY_CONFIG.medium;
  const Icon = config.icon;

  const isProcessed = spot.status !== 'pending';

  return (
    <div className="animate-fade-in" style={{
      background: 'var(--bg-card)',
      border: `1.5px solid ${isProcessed ? 'var(--border)' : config.border}`,
      borderRadius: '14px',
      overflow: 'hidden',
      opacity: isProcessed ? 0.8 : 1,
      transition: 'all 0.3s ease',
      position: 'relative',
      boxShadow: isProcessed ? '0 1px 4px rgba(0,0,0,0.03)' : '0 4px 16px rgba(0,0,0,0.06)'
    }}>
      {/* Indicator Line */}
      {!isProcessed && (
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: config.color }} />
      )}

      <div style={{ padding: '28px' }}>
        
        {/* Header Signal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '7px', background: isProcessed ? 'rgba(0,0,0,0.04)' : config.bg, borderRadius: '8px', color: isProcessed ? 'var(--text-muted)' : config.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={16} />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', color: isProcessed ? 'var(--text-muted)' : config.color, textTransform: 'uppercase' }}>
                {config.label}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>
                Category: {spot.category}
              </div>
            </div>
          </div>
          {isProcessed && (
            <div style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 700,
              padding: '4px 10px',
              background: spot.status === 'accepted' ? 'rgba(22, 163, 74, 0.1)' : spot.status === 'explored' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(220, 38, 38, 0.1)',
              borderRadius: '6px',
              color: spot.status === 'accepted' ? '#15803D' : spot.status === 'explored' ? '#1D4ED8' : '#B91C1C',
              border: `1px solid ${spot.status === 'accepted' ? '#16A34A' : spot.status === 'explored' ? '#2563EB' : '#DC2626'}`
            }}>
              STATUS: {spot.status}
            </div>
          )}
        </div>

        {/* The Assumption */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.35 }}>
            "{spot.statement}"
          </h4>
        </div>

        {/* Deep Dive Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '24px',
          padding: '20px',
          background: 'rgba(0, 0, 0, 0.02)',
          border: '1px solid var(--border)',
          borderRadius: '10px'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.08em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
              Evidence
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6, fontWeight: 450 }}>
              {spot.evidence}
            </p>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.08em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
              Consequence / Why it matters
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6, fontWeight: 450 }}>
              {spot.whyItMatters}
            </p>
          </div>
        </div>

        {/* Suggested Action */}
        <div style={{ marginBottom: '24px', padding: '16px 20px', background: 'var(--accent-light)', border: '1px solid rgba(217, 83, 30, 0.2)', borderRadius: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ width: '6px', height: '6px', background: 'var(--accent)', borderRadius: '50%' }} />
            <span style={{ fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.08em', fontWeight: 800, textTransform: 'uppercase' }}>
              Interrogation Prompt
            </span>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--text-primary)', fontStyle: 'italic', fontWeight: 500, lineHeight: 1.5 }}>
            "{spot.suggestedQuestion}"
          </p>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 500 }}>
            Impacts: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{spot.affectedBrandDecisions.join(', ')}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <button
            onClick={() => onUpdate('accepted')}
            style={{
              flex: 1, padding: '12px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer',
              background: spot.status === 'accepted' ? 'rgba(22, 163, 74, 0.12)' : 'var(--bg)',
              border: `1.5px solid ${spot.status === 'accepted' ? '#16A34A' : 'var(--border)'}`,
              color: spot.status === 'accepted' ? '#15803D' : 'var(--text-primary)',
              transition: 'all 0.2s ease'
            }}
          >
            <CheckCircle2 size={16} color={spot.status === 'accepted' ? '#16A34A' : 'var(--text-secondary)'} /> ACCEPT FLAW
          </button>
          <button
            onClick={() => onUpdate('explored')}
            style={{
              flex: 1, padding: '12px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer',
              background: spot.status === 'explored' ? 'rgba(37, 99, 235, 0.12)' : 'var(--bg)',
              border: `1.5px solid ${spot.status === 'explored' ? '#2563EB' : 'var(--border)'}`,
              color: spot.status === 'explored' ? '#1D4ED8' : 'var(--text-primary)',
              transition: 'all 0.2s ease'
            }}
          >
            <Search size={16} color={spot.status === 'explored' ? '#2563EB' : 'var(--text-secondary)'} /> EXPLORE
          </button>
          <button
            onClick={() => onUpdate('rejected')}
            style={{
              flex: 1, padding: '12px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer',
              background: spot.status === 'rejected' ? 'rgba(220, 38, 38, 0.12)' : 'var(--bg)',
              border: `1.5px solid ${spot.status === 'rejected' ? '#DC2626' : 'var(--border)'}`,
              color: spot.status === 'rejected' ? '#B91C1C' : 'var(--text-primary)',
              transition: 'all 0.2s ease'
            }}
          >
            <XCircle size={16} color={spot.status === 'rejected' ? '#DC2626' : 'var(--text-secondary)'} /> REJECT SIGNAL
          </button>
        </div>

      </div>
    </div>
  );
}
