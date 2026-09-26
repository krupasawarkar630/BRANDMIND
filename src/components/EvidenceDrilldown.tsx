'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { ShieldCheck, HelpCircle, X, ChevronRight, CheckCircle, AlertCircle, FileText, Database } from 'lucide-react';
import type { EvidenceScore } from '@/lib/types';

interface EvidenceBadgeProps {
  score: number;
  label?: string;
  category: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function EvidenceDrilldown({
  score,
  label,
  category,
  size = 'md'
}: EvidenceBadgeProps) {
  const { project } = useStore();
  const [open, setOpen] = useState(false);

  const evidence: EvidenceScore = aiProvider.calculateEvidenceScore(category, project);

  const ringColor = score >= 80 ? '#16A34A' : score >= 60 ? '#D97706' : '#DC2626';

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Click to view verified evidence trail"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: size === 'sm' ? '2px 8px' : '4px 10px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '100px',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent)';
          (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent-light)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
          (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-card)';
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: ringColor,
          }}
        />
        <span style={{ fontSize: size === 'sm' ? '11px' : '12px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
          {score}%
        </span>
        {label && (
          <span style={{ fontSize: size === 'sm' ? '10px' : '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {label}
          </span>
        )}
        <span style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
          Why? <HelpCircle size={10} />
        </span>
      </button>

      {/* Evidence Drilldown Modal */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '24px',
          }}
          onClick={() => setOpen(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="animate-slide-in"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              maxWidth: '640px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '32px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              position: 'relative',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>
                    Evidence-Backed Score Trail
                  </span>
                  <span className="badge badge-accent" style={{ fontSize: '10px' }}>
                    {evidence.evidenceCount} VERIFIED SIGNALS
                  </span>
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Why {evidence.category} is {evidence.score}%
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Score Rationale Card */}
            <div
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '16px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              <Database size={18} color="var(--accent)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>
                  Deterministically Derived Score
                </span>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {evidence.rationale} No unexplained arbitrary numbers.
                </p>
              </div>
            </div>

            {/* Evidence Breakdown List */}
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
              Verified Signal Contributions
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {evidence.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <CheckCircle size={15} color="#16A34A" style={{ marginTop: '3px', flexShrink: 0 }} />
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>
                        {item.title}
                      </span>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                      color: item.impactScore >= 0 ? '#16A34A' : '#DC2626',
                      background: item.impactScore >= 0 ? 'rgba(22, 163, 74, 0.08)' : 'rgba(220, 38, 38, 0.08)',
                      padding: '3px 8px',
                      borderRadius: '100px',
                      flexShrink: 0,
                    }}
                  >
                    {item.impactScore >= 0 ? `+${item.impactScore}` : item.impactScore} pts
                  </span>
                </div>
              ))}
            </div>

            {/* Close Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary" onClick={() => setOpen(false)}>
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
