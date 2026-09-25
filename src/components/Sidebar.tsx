'use client';

import { useStore } from '@/lib/store';
import { STAGE_ORDER, STAGE_LABELS, STAGE_NUMBERS } from '@/lib/types';
import type { Stage } from '@/lib/types';
import { Check, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const { project, setCurrentStage, canAccessStage } = useStore();

  const handleNav = (stage: Stage) => {
    if (canAccessStage(stage)) {
      setCurrentStage(stage);
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside
      style={{
        width: '260px',
        minWidth: '260px',
        background: 'var(--bg)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        gap: '4px',
      }}
    >
      <p
        style={{
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: '12px',
          paddingLeft: '12px',
        }}
      >
        Study Index
      </p>

      {STAGE_ORDER.map((stage) => {
        const isActive = mounted ? project.currentStage === stage : stage === 'idea';
        const isComplete = mounted ? project.completedStages.includes(stage) : false;
        const isLocked = mounted ? !canAccessStage(stage) : stage !== 'idea';
        const num = STAGE_NUMBERS[stage];
        const label = STAGE_LABELS[stage];

        return (
          <button
            key={stage}
            onClick={() => handleNav(stage)}
            disabled={isLocked}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '8px',
              border: 'none',
              cursor: isLocked ? 'default' : 'pointer',
              transition: 'all 0.15s ease',
              background: isActive ? 'var(--bg-dark)' : 'transparent',
              color: isActive ? '#FFFFFF' : isLocked ? 'var(--text-muted)' : 'var(--text-secondary)',
              opacity: isLocked ? 0.45 : 1,
              textAlign: 'left',
              width: '100%',
            }}
            onMouseEnter={e => {
              if (!isLocked && !isActive) {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.04)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
              }
            }}
            onMouseLeave={e => {
              if (!isLocked && !isActive) {
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
              }
            }}
          >
            {/* Status icon */}
            <span
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: isComplete
                  ? '1.5px solid var(--accent)'
                  : isActive
                  ? '1.5px solid rgba(255,255,255,0.5)'
                  : '1.5px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                background: isComplete ? 'var(--accent-light)' : 'transparent',
              }}
            >
              {isComplete ? (
                <Check size={10} color="var(--accent)" strokeWidth={3} />
              ) : isLocked ? (
                <Lock size={9} color="currentColor" strokeWidth={2} />
              ) : (
                <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'currentColor' }}>
                  {num}
                </span>
              )}
            </span>

            <span style={{ fontSize: '14px', fontWeight: isActive ? 500 : 400 }}>
              {label}
            </span>

            {/* Active dot */}
            {isActive && (
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  marginLeft: 'auto',
                  animation: 'pulse-dot 1.5s ease-in-out infinite',
                }}
              />
            )}
          </button>
        );
      })}

      {/* Bottom guardian signal */}
      <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
        <div style={{ height: '1px', background: 'var(--border)', marginBottom: '16px' }} />
        <p style={{ fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
          Current Signal
        </p>
        {mounted && project.brandSystem ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--bg-dark)',
              borderRadius: '100px',
              padding: '6px 12px',
              cursor: 'pointer',
            }}
            onClick={() => setCurrentStage('guardian')}
          >
            <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#fff' }}>
              {project.brandSystem.brandName.slice(0, 1).toUpperCase()}
            </span>
            <span style={{ fontSize: '12px', color: '#FFFFFF', fontWeight: 500 }}>Guardian active</span>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--bg-dark)',
              borderRadius: '100px',
              padding: '6px 12px',
              opacity: 0.4,
            }}
          >
            <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#fff' }}>
              N
            </span>
            <span style={{ fontSize: '12px', color: '#FFFFFF', fontWeight: 500 }}>No signal yet</span>
          </div>
        )}
      </div>
    </aside>
  );
}
