'use client';

import React from 'react';
import type { BrandWorld } from '@/lib/types';
import { ArrowRight, Activity, Eye, Zap, Target, ShieldAlert, Key } from 'lucide-react';

interface BrandWorldCardProps {
  world: BrandWorld;
  index: number;
  isSelected: boolean;
  onEnter: () => void;
}

export default function BrandWorldCard({ world, index, isSelected, onEnter }: BrandWorldCardProps) {
  return (
    <div 
      className={`world-card ${isSelected ? 'entered' : ''}`}
      style={{
        background: isSelected ? 'var(--bg-card)' : 'var(--bg-card)',
        border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: '16px',
        padding: '32px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isSelected ? '0 8px 30px rgba(217, 83, 30, 0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
        transform: isSelected ? 'translateY(-2px)' : 'none',
      }}
    >
      {/* Indicator Top Bar when selected */}
      {isSelected && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--accent)'
        }} />
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.12em', fontWeight: 700, textTransform: 'uppercase' }}>
            WORLD 0{index + 1}
          </span>
          <h2 style={{ fontSize: '26px', fontWeight: 900, color: 'var(--text-primary)', marginTop: '6px', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
            {world.name}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--accent)', fontWeight: 600, marginTop: '4px' }}>
            {world.tagline}
          </p>
        </div>
      </div>

      {/* Strategic Idea */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 450 }}>
          {world.strategicIdea}
        </p>
      </div>

      {/* Detail Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isSelected ? '1fr 1fr' : '1fr', 
        gap: '16px', 
        marginBottom: '28px',
        padding: '20px',
        background: 'rgba(0, 0, 0, 0.02)',
        border: '1px solid var(--border)',
        borderRadius: '10px'
      }}>
        <DetailItem icon={<Target size={16} />} label="Positioning" value={world.positioning} />
        <DetailItem icon={<Key size={16} />} label="Personality" value={world.personality} />
        <DetailItem icon={<Eye size={16} />} label="Visual Direction" value={world.visualDirection} />
        <DetailItem icon={<ShieldAlert size={16} />} label="Risk" value={world.risks} alert />
      </div>

      {/* Metrics */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '28px', padding: '16px', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border)', borderRadius: '10px' }}>
        <Metric label="Signal Strength" value={world.signalScore} />
        <Metric label="Differentiation" value={world.differentiationScore} />
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
        {!isSelected ? (
          <button 
            onClick={onEnter}
            className="btn-outline"
            style={{
              padding: '10px 20px',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              gap: '8px',
            }}
          >
            Select World
            <ArrowRight size={14} />
          </button>
        ) : (
          <div style={{
            color: 'var(--accent)',
            fontSize: '13px',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'var(--accent-light)',
            borderRadius: '100px',
            border: '1px solid rgba(217, 83, 30, 0.3)'
          }}>
            <Activity size={15} />
            Selected Direction
          </div>
        )}
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value, alert }: { icon: React.ReactNode, label: string, value: string, alert?: boolean }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: alert ? '#DC2626' : 'var(--text-muted)', marginBottom: '4px' }}>
        {icon}
        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>{label}</span>
      </div>
      <p style={{ fontSize: '13px', color: alert ? '#B91C1C' : 'var(--text-primary)', lineHeight: 1.5, fontWeight: alert ? 600 : 450 }}>{value}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string, value: number }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>
          {label}
        </span>
        <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--text-primary)' }}>
          {value}%
        </span>
      </div>
      <div style={{ height: '5px', width: '100%', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: 'var(--accent)', borderRadius: '3px' }} />
      </div>
    </div>
  );
}
