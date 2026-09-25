'use client';

import { useStore } from '@/lib/store';
import { RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const { project, resetProject } = useStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleReset = () => {
    if (confirm('Start a new brand study? Current progress will be lost.')) {
      resetProject();
    }
  };

  return (
    <header
      style={{
        height: '52px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: '16px',
        background: 'var(--bg)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <div
          style={{
            width: '30px',
            height: '30px',
            background: 'var(--bg-dark)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="5" height="5" rx="1" fill="white"/>
            <rect x="9" y="2" width="5" height="5" rx="1" fill="var(--accent)"/>
            <rect x="2" y="9" width="5" height="5" rx="1" fill="var(--accent)" opacity="0.4"/>
            <rect x="9" y="9" width="5" height="5" rx="1" fill="white"/>
          </svg>
        </div>
        <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          BRANDMIND<span style={{ color: 'var(--accent)' }}>.</span>
        </span>
      </div>

      {/* Divider */}
      <div style={{ width: '1px', height: '20px', background: 'var(--border)' }} />

      {/* Idea preview */}
      {mounted && project.idea?.idea && (
        <span
          style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '320px',
          }}
        >
          {project.idea.idea.slice(0, 60)}{project.idea.idea.length > 60 ? '...' : ''}
        </span>
      )}
      {(!mounted || !project.idea?.idea) && (
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Untitled brand study
        </span>
      )}

      {/* Right actions */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 10px',
            borderRadius: '100px',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-mono)',
            background: 'var(--accent-light)',
            color: 'var(--accent)',
            border: '1px solid var(--accent)',
          }}
        >
          Mock Intelligence
        </span>

        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          LOCAL PROJECT / {mounted && project.completedStages.length > 0 ? 'SAVED' : 'DRAFT'}
        </span>

        <button
          onClick={handleReset}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            padding: '4px 8px',
            borderRadius: '6px',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.04)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
          }}
          title="Start new study"
        >
          <RotateCcw size={13} />
        </button>
      </div>
    </header>
  );
}
