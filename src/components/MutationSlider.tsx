'use client';

import React from 'react';

export default function MutationSlider({
  labelLeft,
  labelRight,
  value,
  onChange,
  disabled = false
}: {
  labelLeft: string;
  labelRight: string;
  value: number; // 0 to 100
  onChange: (val: number) => void;
  disabled?: boolean;
}) {
  return (
    <div style={{ width: '100%', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: value < 50 ? 'var(--text-primary)' : 'var(--text-muted)', transition: 'color 0.3s ease' }}>
          {labelLeft}
        </span>
        <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: value > 50 ? 'var(--text-primary)' : 'var(--text-muted)', transition: 'color 0.3s ease' }}>
          {labelRight}
        </span>
      </div>
      <div style={{ position: 'relative', height: '32px', display: 'flex', alignItems: 'center' }}>
        {/* Track */}
        <div style={{ position: 'absolute', left: 0, right: 0, height: '6px', background: 'var(--border)', borderRadius: '3px' }}>
          <div style={{ position: 'absolute', left: '50%', top: '-3px', bottom: '-3px', width: '2px', background: 'var(--text-muted)' }} />
        </div>
        {/* Fill */}
        <div style={{ position: 'absolute', left: value < 50 ? `${value}%` : '50%', right: value > 50 ? `${100 - value}%` : '50%', height: '6px', background: 'var(--accent)', borderRadius: '3px', transition: 'all 0.1s ease' }} />
        {/* Native Input Range */}
        <input 
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          style={{
            position: 'absolute',
            width: '100%',
            opacity: 0,
            cursor: disabled ? 'not-allowed' : 'ew-resize',
            height: '32px'
          }}
        />
        {/* Visual Thumb */}
        <div style={{
          position: 'absolute',
          left: `${value}%`,
          transform: 'translateX(-50%)',
          width: '18px',
          height: '18px',
          background: 'var(--bg-card)',
          borderRadius: '50%',
          border: '2px solid var(--accent)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          pointerEvents: 'none',
          transition: 'left 0.05s ease'
        }} />
      </div>
    </div>
  );
}
