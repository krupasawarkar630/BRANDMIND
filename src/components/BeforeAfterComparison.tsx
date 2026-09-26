'use client';

import React, { useState } from 'react';
import { ArrowRight, Sparkles, Activity, FileDiff, Eye, ChevronDown, ChevronUp } from 'lucide-react';

function computeWordDiff(before: string, after: string) {
  if (!before && !after) return { beforeTokens: [], afterTokens: [] };
  const bWords = before.split(/(\s+)/);
  const aWords = after.split(/(\s+)/);

  const bSet = new Set(bWords.map((w) => w.trim().toLowerCase()).filter(Boolean));
  const aSet = new Set(aWords.map((w) => w.trim().toLowerCase()).filter(Boolean));

  const beforeTokens = bWords.map((word, i) => {
    const clean = word.trim().toLowerCase();
    const isRemoved = clean && !aSet.has(clean);
    return {
      text: word,
      type: isRemoved ? ('removed' as const) : ('same' as const),
    };
  });

  const afterTokens = aWords.map((word, i) => {
    const clean = word.trim().toLowerCase();
    const isAdded = clean && !bSet.has(clean);
    return {
      text: word,
      type: isAdded ? ('added' as const) : ('same' as const),
    };
  });

  return { beforeTokens, afterTokens };
}

export default function BeforeAfterComparison({
  title,
  beforeText,
  afterText,
  intensity = 'moderate',
  reasoning,
}: {
  title: string;
  beforeText: string;
  afterText: string;
  intensity?: 'low' | 'moderate' | 'major';
  reasoning?: string;
}) {
  const [showDiff, setShowDiff] = useState(true);
  const [showReasoning, setShowReasoning] = useState(false);

  const intensityColors = {
    low: { badge: 'rgba(22, 163, 74, 0.15)', text: '#16a34a', border: 'rgba(22, 163, 74, 0.3)' },
    moderate: { badge: 'rgba(217, 119, 6, 0.15)', text: '#d97706', border: 'rgba(217, 119, 6, 0.3)' },
    major: { badge: 'rgba(220, 38, 38, 0.15)', text: '#dc2626', border: 'rgba(220, 38, 38, 0.3)' },
  };

  const style = intensityColors[intensity] || intensityColors.moderate;
  const { beforeTokens, afterTokens } = computeWordDiff(beforeText || '', afterText || '');

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 18px',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(0,0,0,0.02)',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={14} color="var(--accent)" />
          <span
            style={{
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
            }}
          >
            {title}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setShowDiff(!showDiff)}
            style={{
              background: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: showDiff ? 'var(--accent)' : 'var(--text-muted)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              padding: '2px 6px',
            }}
            title="Toggle word diff highlights"
          >
            <FileDiff size={12} />
            {showDiff ? 'Diff Active' : 'Plain Text'}
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 8px',
              borderRadius: '100px',
              background: style.badge,
              border: `1px solid ${style.border}`,
            }}
          >
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: style.text,
              }}
            />
            <span
              style={{
                fontSize: '10px',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: style.text,
              }}
            >
              {intensity} shift
            </span>
          </div>
        </div>
      </div>

      {/* Before / After Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'stretch',
        }}
      >
        {/* BEFORE */}
        <div style={{ padding: '20px', position: 'relative' }}>
          <span
            style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 700,
              marginBottom: '10px',
              display: 'block',
            }}
          >
            Original Baseline
          </span>
          <div
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              fontWeight: 450,
            }}
          >
            {showDiff && beforeText ? (
              beforeTokens.map((tok, i) => (
                <span
                  key={i}
                  style={
                    tok.type === 'removed'
                      ? {
                          backgroundColor: 'rgba(220, 38, 38, 0.15)',
                          color: '#ef4444',
                          textDecoration: 'line-through',
                          borderRadius: '2px',
                          padding: '1px 2px',
                        }
                      : {}
                  }
                >
                  {tok.text}
                </span>
              ))
            ) : (
              beforeText || '—'
            )}
          </div>
        </div>

        {/* ARROW DIVIDER */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 8px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border)',
            }}
          >
            <ArrowRight size={14} color="var(--accent)" />
          </div>
        </div>

        {/* AFTER */}
        <div
          style={{
            padding: '20px',
            background: 'var(--accent-light)',
            borderLeft: '1px solid rgba(217, 83, 30, 0.15)',
            position: 'relative',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              color: 'var(--accent)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 800,
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={12} /> Mutated Output
          </span>
          <div
            style={{
              fontSize: '14px',
              color: 'var(--text-primary)',
              lineHeight: 1.6,
              fontWeight: 600,
            }}
          >
            {showDiff && afterText ? (
              afterTokens.map((tok, i) => (
                <span
                  key={i}
                  style={
                    tok.type === 'added'
                      ? {
                          backgroundColor: 'rgba(22, 163, 74, 0.2)',
                          color: '#22c55e',
                          borderRadius: '2px',
                          padding: '1px 2px',
                          borderBottom: '2px solid #16a34a',
                        }
                      : {}
                  }
                >
                  {tok.text}
                </span>
              ))
            ) : (
              afterText || '—'
            )}
          </div>
        </div>
      </div>

      {/* Progressive Disclosure: Strategic Reasoning */}
      {reasoning && (
        <div
          style={{
            borderTop: '1px solid var(--border)',
            background: 'rgba(0, 0, 0, 0.02)',
            padding: '10px 18px',
          }}
        >
          <button
            onClick={() => setShowReasoning(!showReasoning)}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--text-muted)',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <span>Why this mutation occurred</span>
            {showReasoning ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showReasoning && (
            <p
              className="animate-fade-in"
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
                marginTop: '8px',
                fontStyle: 'italic',
              }}
            >
              "{reasoning}"
            </p>
          )}
        </div>
      )}
    </div>
  );
}
