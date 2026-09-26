'use client';

import { useStore } from '@/lib/store';
import { ArrowRight } from 'lucide-react';
import DNALock from '@/components/DNALock';
import StageEmptyState from '@/components/StageEmptyState';

export default function DnaLockStage() {
  const { project, lockBrandDna, unlockBrandDna, markStageComplete } = useStore();

  const { brandDNA, brandSystem, brandDnaLocked } = project;
  if (!brandDNA || !brandSystem) {
    return <StageEmptyState stage="dnaLock" prerequisiteStage="system" />;
  }

  const handleComplete = () => {
    markStageComplete('dnaLock');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.05em' }}>
          / 07h / BRAND DNA LOCK
        </span>
        {brandDnaLocked && (
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid rgba(22,163,74,0.3)', padding: '4px 10px', borderRadius: '4px' }}>
            AUTHORITATIVE
          </span>
        )}
      </div>

      <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '16px' }}>
        Finalize the strategic foundation.
      </h1>

      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.6, maxWidth: '700px' }}>
        Locking the Brand DNA establishes it as the single source of truth. All future guardian checks, content generation, and launch kit outputs will be validated against this locked foundation.
      </p>

      <DNALock
        brandDNA={brandDNA}
        brandSystem={brandSystem}
        isLocked={!!brandDnaLocked}
        onLock={() => lockBrandDna()}
        onUnlock={(reason) => unlockBrandDna(reason)}
      />

      <div className="divider" style={{ marginTop: '40px' }} />
      
      <button className="btn-primary" onClick={handleComplete}>
        Continue to Guardian <ArrowRight size={14} />
      </button>
    </div>
  );
}
