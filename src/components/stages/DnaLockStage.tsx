'use client';

import { useStore } from '@/lib/store';
import { ArrowRight, ShieldCheck, Lock, Unlock } from 'lucide-react';
import DNALock from '@/components/DNALock';
import StageEmptyState from '@/components/StageEmptyState';
import { toast } from '@/lib/toast';

export default function DnaLockStage() {
  const { project, lockBrandDna, unlockBrandDna, markStageComplete } = useStore();

  const { brandDNA, brandSystem, brandDnaLocked } = project;
  if (!brandDNA || !brandSystem) {
    return <StageEmptyState stage="dnaLock" prerequisiteStage="system" />;
  }

  const handleLock = () => {
    lockBrandDna();
    toast.success('Brand DNA locked as single source of truth.', 'DNA Locked');
  };

  const handleUnlock = (reason: string) => {
    unlockBrandDna(reason);
    toast.warning(`Unlocked Brand DNA for revision: "${reason}"`, 'DNA Unlocked');
  };

  const handleComplete = () => {
    if (!brandDnaLocked) {
      toast.info('Continuing to Guardian. You can lock your DNA anytime.', 'Unlocking Guidance');
    }
    markStageComplete('dnaLock');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '920px' }}>
      <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent)',
            letterSpacing: '0.05em',
          }}
        >
          / 07j / BRAND DNA LOCK
        </span>
        {brandDnaLocked && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#16A34A',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              background: 'rgba(22, 163, 74, 0.12)',
              border: '1px solid rgba(22, 163, 74, 0.3)',
              padding: '4px 12px',
              borderRadius: '100px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ShieldCheck size={13} /> AUTHORITATIVE LOCK
          </span>
        )}
      </div>

      <h1
        style={{
          fontSize: 'clamp(28px, 4vw, 40px)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
          marginBottom: '16px',
        }}
      >
        Finalize the strategic foundation.
      </h1>

      <p
        style={{
          fontSize: '15px',
          color: 'var(--text-secondary)',
          marginBottom: '36px',
          lineHeight: 1.6,
          maxWidth: '720px',
        }}
      >
        Locking the Brand DNA establishes it as the inviolable source of truth. All downstream guardian checks, launch kit assets, and future generation requests will enforce these locked rules.
      </p>

      <DNALock
        brandDNA={brandDNA}
        brandSystem={brandSystem}
        isLocked={!!brandDnaLocked}
        onLock={handleLock}
        onUnlock={handleUnlock}
      />

      <div className="divider" style={{ marginTop: '40px' }} />

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className="btn-primary"
          onClick={handleComplete}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
        >
          Continue to Consistency Guardian <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
