'use client';

import { useStore } from '@/lib/store';
import { useState } from 'react';
import { ArrowRight, Lock, Unlock, AlertTriangle } from 'lucide-react';

export default function DnaLockStage() {
  const { project, lockBrandDna, unlockBrandDna, markStageComplete } = useStore();
  const [unlockReason, setUnlockReason] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);

  const { brandDNA, brandSystem, brandDnaLocked } = project;
  if (!brandDNA || !brandSystem) return null;

  const handleComplete = () => {
    markStageComplete('dnaLock');
  };

  const handleUnlock = () => {
    if (!unlockReason.trim()) return;
    unlockBrandDna(unlockReason);
    setUnlockReason('');
    setIsUnlocking(false);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.05em' }}>
          / 07h / BRAND DNA LOCK
        </span>
      </div>

      <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '16px' }}>
        Finalize the strategic foundation.
      </h1>

      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.6 }}>
        Locking the Brand DNA establishes it as the authoritative context for all future content generation and guardian checks.
      </p>

      <div className="stage-card" style={{ marginBottom: '40px', borderColor: brandDnaLocked ? '#16A34A' : 'var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {brandDnaLocked ? <Lock size={18} color="#16A34A" /> : <Unlock size={18} color="var(--text-muted)" />}
            {brandDnaLocked ? 'BRAND DNA LOCKED' : 'CURRENT BRAND DNA'}
          </h2>
          {brandDnaLocked && (
            <span className="badge" style={{ background: '#16A34A20', color: '#16A34A', borderColor: '#16A34A' }}>AUTHORITATIVE</span>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Audience</span>
            <p style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{brandDNA.targetUser}</p>
          </div>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Positioning</span>
            <p style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{brandSystem.positioningStatement}</p>
          </div>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Personality</span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {brandSystem.personality.map(p => <span key={p} className="badge badge-muted">{p}</span>)}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Voice</span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {brandSystem.voice.map(v => <span key={v} className="badge badge-muted">{v}</span>)}
            </div>
          </div>
        </div>

        {!brandDnaLocked ? (
          <button className="btn-primary" onClick={() => lockBrandDna()} style={{ width: '100%', justifyContent: 'center' }}>
            <Lock size={16} /> LOCK BRAND DNA
          </button>
        ) : (
          <div>
            {!isUnlocking ? (
              <button className="btn-outline" onClick={() => setIsUnlocking(true)} style={{ width: '100%', justifyContent: 'center' }}>
                <Unlock size={16} /> Unlock for Revision
              </button>
            ) : (
              <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '16px' }}>
                  <AlertTriangle size={16} color="#D97706" style={{ marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Why are you changing the brand?</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>This reason will be stored in the Decision Timeline.</p>
                  </div>
                </div>
                <textarea
                  className="input-field"
                  placeholder="e.g. Realized our target audience is actually enterprise, not prosumer."
                  value={unlockReason}
                  onChange={e => setUnlockReason(e.target.value)}
                  rows={2}
                  style={{ marginBottom: '12px' }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-primary" onClick={handleUnlock} disabled={!unlockReason.trim()}>
                    Confirm Unlock
                  </button>
                  <button className="btn-outline" onClick={() => setIsUnlocking(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="divider" />
      
      <button className="btn-primary" onClick={handleComplete}>
        Continue to Guardian <ArrowRight size={14} />
      </button>
    </div>
  );
}
