'use client';

import React, { useState } from 'react';
import { Lock, Unlock, AlertTriangle, Shield, Eye, Fingerprint, CheckCircle2 } from 'lucide-react';
import type { BrandDNA, BrandSystem } from '@/lib/types';

interface DNALockProps {
  brandDNA: BrandDNA;
  brandSystem: BrandSystem;
  isLocked: boolean;
  onLock: () => void;
  onUnlock: (reason: string) => void;
}

export default function DNALock({ brandDNA, brandSystem, isLocked, onLock, onUnlock }: DNALockProps) {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockReason, setUnlockReason] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLock = () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }
    onLock();
    setShowConfirm(false);
  };

  const handleUnlock = () => {
    if (!unlockReason.trim()) return;
    onUnlock(unlockReason);
    setUnlockReason('');
    setIsUnlocking(false);
  };

  const foundations = [
    { label: 'Target Audience', value: brandDNA.targetUser, icon: '👥' },
    { label: 'Positioning', value: brandSystem.positioningStatement, icon: '🎯' },
    { label: 'Value Proposition', value: brandSystem.valueProposition, icon: '💎' },
    { label: 'Tagline', value: brandSystem.tagline, icon: '✨' },
    { label: 'Brand Promise', value: brandSystem.brandPromise, icon: '🤝' },
  ];

  const listFoundations = [
    { label: 'Personality', items: brandSystem.personality, color: 'var(--accent)' },
    { label: 'Voice', items: brandSystem.voice, color: '#16A34A' },
    { label: 'Principles', items: brandSystem.principles, color: '#8B5CF6' },
    { label: 'Messaging Pillars', items: brandSystem.messagingPillars, color: '#0EA5E9' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* STATUS BANNER */}
      {isLocked ? (
        <div style={{
          background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.08), rgba(22, 163, 74, 0.02))',
          border: '1px solid rgba(22, 163, 74, 0.3)',
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 0%, rgba(22, 163, 74, 0.1), transparent 60%)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(22, 163, 74, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(22, 163, 74, 0.3)' }}>
                <Lock size={24} color="#16A34A" />
              </div>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#16A34A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              🔒 DNA LOCKED
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.5 }}>
              All future outputs — Guardian checks, Launch Kit generation, and content creation — will be validated against this locked foundation. Changes require an explicit unlock with a stated reason.
            </p>
          </div>
        </div>
      ) : (
        <div style={{
          background: 'rgba(217, 119, 6, 0.06)',
          border: '1px dashed rgba(217, 119, 6, 0.4)',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <Unlock size={24} color="#D97706" />
          </div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
            DNA Unlocked
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Review the strategic foundation below, then lock it to finalize.
          </p>
        </div>
      )}

      {/* STRATEGIC FOUNDATION */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <Fingerprint size={16} color="var(--accent)" />
          <h3 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
            Strategic Foundation
          </h3>
        </div>

        {/* TEXT FIELDS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          {foundations.map(f => (
            <div key={f.label} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              borderRadius: '10px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px'
            }}>
              <span style={{ fontSize: '18px', lineHeight: 1 }}>{f.icon}</span>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>
                  {f.label}
                </span>
                <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 500 }}>{f.value}</p>
              </div>
              {isLocked && <Shield size={14} color="#16A34A" />}
            </div>
          ))}
        </div>

        {/* TAG LISTS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
          {listFoundations.map(f => (
            <div key={f.label} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              borderRadius: '10px',
              padding: '16px'
            }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '12px' }}>
                {f.label}
              </span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {f.items.map(item => (
                  <span key={item} style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: '100px',
                    background: f.color + '15',
                    color: f.color,
                    border: `1px solid ${f.color}30`
                  }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* VISUAL DIRECTION */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          borderRadius: '10px',
          padding: '16px',
          marginBottom: '32px'
        }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '12px' }}>
            Visual Direction
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Color</span>
              <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{brandSystem.visualDirection.color}</p>
            </div>
            <div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Typography</span>
              <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{brandSystem.visualDirection.typography}</p>
            </div>
            <div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Imagery</span>
              <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{brandSystem.visualDirection.imagery}</p>
            </div>
          </div>
        </div>

        {/* DO / DON'T */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
          <div style={{
            background: 'rgba(22, 163, 74, 0.05)',
            border: '1px solid rgba(22, 163, 74, 0.2)',
            borderRadius: '10px',
            padding: '16px'
          }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '12px' }}>
              ✓ Words to Use
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {brandSystem.doExamples.map(d => (
                <span key={d} style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500 }}>• {d}</span>
              ))}
            </div>
          </div>
          <div style={{
            background: 'rgba(220, 38, 38, 0.05)',
            border: '1px solid rgba(220, 38, 38, 0.2)',
            borderRadius: '10px',
            padding: '16px'
          }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '12px' }}>
              ✗ Words to Avoid
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {brandSystem.dontExamples.map(d => (
                <span key={d} style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500 }}>• {d}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* LOCK / UNLOCK ACTIONS */}
      {!isLocked ? (
        <div>
          {!showConfirm ? (
            <button
              onClick={handleLock}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              <Lock size={16} /> LOCK BRAND DNA
            </button>
          ) : (
            <div style={{
              background: 'var(--accent-light)',
              border: '1px solid var(--accent)',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center'
            }}>
              <CheckCircle2 size={24} color="var(--accent)" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Ready to lock?
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', maxWidth: '400px', margin: '0 auto 20px auto' }}>
                Once locked, all future AI outputs will be validated against this foundation. You can unlock later, but it will require a stated reason and create a timeline event.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={handleLock}
                  className="btn-primary"
                  style={{ padding: '10px 24px', borderRadius: '6px', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Lock size={14} /> Confirm Lock
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="btn-outline"
                  style={{ padding: '10px 24px', borderRadius: '6px', fontWeight: 600, fontSize: '13px' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          {!isUnlocking ? (
            <button
              onClick={() => setIsUnlocking(true)}
              style={{
                width: '100%',
                padding: '14px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => { e.currentTarget.style.color = '#D97706'; e.currentTarget.style.borderColor = '#D97706'; }}
              onMouseOut={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <Unlock size={14} /> Request Unlock for Revision
            </button>
          ) : (
            <div style={{
              background: 'rgba(217, 119, 6, 0.06)',
              border: '1px solid rgba(217, 119, 6, 0.3)',
              borderRadius: '12px',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                <AlertTriangle size={18} color="#D97706" style={{ marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#D97706', marginBottom: '4px' }}>Why are you unlocking?</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    This reason will be recorded as a new Decision Timeline event for full traceability.
                  </p>
                </div>
              </div>
              <textarea
                value={unlockReason}
                onChange={e => setUnlockReason(e.target.value)}
                placeholder="e.g. Realized our target audience is actually enterprise, not prosumer."
                rows={3}
                style={{
                  width: '100%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '12px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  resize: 'vertical',
                  marginBottom: '16px',
                  outline: 'none'
                }}
              />
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleUnlock}
                  disabled={!unlockReason.trim()}
                  className="btn-primary"
                  style={{
                    padding: '10px 20px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: unlockReason.trim() ? 1 : 0.5,
                    cursor: unlockReason.trim() ? 'pointer' : 'not-allowed'
                  }}
                >
                  <Unlock size={14} /> Confirm Unlock
                </button>
                <button
                  onClick={() => { setIsUnlocking(false); setUnlockReason(''); }}
                  className="btn-outline"
                  style={{ padding: '10px 20px', borderRadius: '6px', fontWeight: 600, fontSize: '13px' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
