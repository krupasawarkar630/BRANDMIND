'use client';

import React, { useState, useEffect } from 'react';
import type { GenericIssue, StressTest } from '@/lib/types';
import { ScanSearch, AlertTriangle, ShieldCheck, XOctagon, RefreshCw, ArrowRight } from 'lucide-react';

const RISK_COLORS: Record<string, string> = {
  high: '#DC2626',
  medium: '#D97706',
  low: '#16A34A',
};

function IssueCard({ issue }: { issue: GenericIssue }) {
  const [action, setAction] = useState<'keep' | 'rework' | 'reject' | null>(null);

  return (
    <div className="animate-fade-in" style={{ 
      background: 'var(--bg-card)', 
      border: `1.5px solid ${RISK_COLORS[issue.riskLevel] || 'var(--border)'}`, 
      borderRadius: '12px', 
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
    }}>
      {/* Warning indicator line */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: RISK_COLORS[issue.riskLevel] }} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <AlertTriangle size={14} color={RISK_COLORS[issue.riskLevel]} />
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, color: RISK_COLORS[issue.riskLevel] }}>
              {issue.riskLevel} Risk • {issue.element}
            </span>
          </div>
          <h4 style={{ fontSize: '18px', color: 'var(--text-primary)', fontWeight: 800, letterSpacing: '-0.01em' }}>{issue.problem}</h4>
        </div>
        <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', background: 'var(--bg)', border: '1px solid var(--border)', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>
          GENERIC PATTERN
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '20px', padding: '16px', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border)', borderRadius: '8px' }}>
        <div>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.06em', fontWeight: 700 }}>Why it feels generic</span>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '4px', fontWeight: 450 }}>{issue.whyGeneric}</p>
        </div>
        <div>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.06em', fontWeight: 700 }}>Alternative Direction</span>
          <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5, marginTop: '4px', fontWeight: 500 }}>{issue.improvement}</p>
        </div>
      </div>

      {/* Action Bar */}
      <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
        <button 
          onClick={() => setAction('keep')}
          style={{
            flex: 1, padding: '10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer',
            background: action === 'keep' ? 'rgba(22, 163, 74, 0.12)' : 'var(--bg)',
            border: `1.5px solid ${action === 'keep' ? '#16A34A' : 'var(--border)'}`,
            color: action === 'keep' ? '#15803D' : 'var(--text-primary)',
            transition: 'all 0.2s ease'
          }}
        >
          <ShieldCheck size={14} color={action === 'keep' ? '#16A34A' : 'var(--text-secondary)'} /> KEEP
        </button>
        <button 
          onClick={() => setAction('rework')}
          style={{
            flex: 1, padding: '10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer',
            background: action === 'rework' ? 'rgba(217, 119, 6, 0.12)' : 'var(--bg)',
            border: `1.5px solid ${action === 'rework' ? '#D97706' : 'var(--border)'}`,
            color: action === 'rework' ? '#B45309' : 'var(--text-primary)',
            transition: 'all 0.2s ease'
          }}
        >
          <RefreshCw size={14} color={action === 'rework' ? '#D97706' : 'var(--text-secondary)'} /> REWORK
        </button>
        <button 
          onClick={() => setAction('reject')}
          style={{
            flex: 1, padding: '10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer',
            background: action === 'reject' ? 'rgba(220, 38, 38, 0.12)' : 'var(--bg)',
            border: `1.5px solid ${action === 'reject' ? '#DC2626' : 'var(--border)'}`,
            color: action === 'reject' ? '#B91C1C' : 'var(--text-primary)',
            transition: 'all 0.2s ease'
          }}
        >
          <XOctagon size={14} color={action === 'reject' ? '#DC2626' : 'var(--text-secondary)'} /> REJECT
        </button>
      </div>
    </div>
  );
}

export default function GenericityScanner({ 
  stressTest, 
  onNext, 
  loadingNext 
}: { 
  stressTest: StressTest;
  onNext: () => void;
  loadingNext: boolean;
}) {
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'complete'>('idle');
  const [scanIndex, setScanIndex] = useState(0);

  const targets = ['POSITIONING', 'NAMING', 'TAGLINE', 'VOICE', 'VISUAL DIRECTION'];

  useEffect(() => {
    if (scanState === 'scanning') {
      const interval = setInterval(() => {
        setScanIndex(prev => {
          if (prev >= targets.length - 1) {
            clearInterval(interval);
            setTimeout(() => setScanState('complete'), 500);
            return prev;
          }
          return prev + 1;
        });
      }, 600);
      return () => clearInterval(interval);
    }
  }, [scanState, targets.length]);

  return (
    <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
      
      {/* Scanner Header */}
      <div style={{ padding: '32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ScanSearch size={24} color="var(--accent)" />
            ANTI-GENERIC SCANNER
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>Scanning brand components for industry defaults and cliches.</p>
        </div>
        
        {scanState === 'idle' && (
          <button 
            className="btn-primary" 
            onClick={() => { setScanState('scanning'); setScanIndex(0); }}
          >
            INITIALIZE SCAN
          </button>
        )}
      </div>

      {/* Scanning Animation */}
      {scanState === 'scanning' && (
        <div style={{ padding: '64px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid rgba(217, 83, 30, 0.2)', borderTopColor: 'var(--accent)', animation: 'spin 1s linear infinite', marginBottom: '24px' }} />
          <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>
            SCANNING: {targets[scanIndex]}...
          </div>
          <div style={{ width: '200px', height: '4px', background: 'var(--border)', marginTop: '16px', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--accent)', width: `${((scanIndex + 1) / targets.length) * 100}%`, transition: 'width 0.3s ease' }} />
          </div>
        </div>
      )}

      {/* Results */}
      {scanState === 'complete' && (
        <div className="animate-fade-in" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ padding: '6px 14px', background: 'rgba(220, 38, 38, 0.1)', color: '#DC2626', border: '1px solid rgba(220, 38, 38, 0.2)', borderRadius: '100px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em' }}>
              {stressTest.issues.length} PATTERNS DETECTED
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            {stressTest.issues.map((issue, i) => (
              <IssueCard key={i} issue={issue} />
            ))}
          </div>

          <div style={{ padding: '24px', background: 'rgba(0, 0, 0, 0.02)', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <h4 style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>Overall Assessment</h4>
            <p style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.6, fontWeight: 500 }}>{stressTest.summary}</p>
          </div>

          <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn-primary"
              onClick={onNext}
              disabled={loadingNext}
            >
              {loadingNext ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="animate-spin-slow" style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                  GENERATING SYSTEM...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  PROCEED TO BRAND SYSTEM
                  <ArrowRight size={16} />
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Add spin animation to global styles via style tag just for this component */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
