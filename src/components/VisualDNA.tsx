'use client';

import React from 'react';
import { Type, Palette, Layout, Hexagon, Image, Sparkles, Monitor, Ban, Pen } from 'lucide-react';
import type { VisualDNA, BrandSystem } from '@/lib/types';

// Map font descriptors to real Google Fonts for live preview
function inferFontFamily(typo: string): { heading: string; body: string } {
  const t = typo.toLowerCase();
  if (t.includes('serif') && !t.includes('sans')) return { heading: "'Playfair Display', serif", body: "'Lora', serif" };
  if (t.includes('mono') || t.includes('technical')) return { heading: "'Space Mono', monospace", body: "'IBM Plex Mono', monospace" };
  if (t.includes('geometric') || t.includes('futur')) return { heading: "'Outfit', sans-serif", body: "'Inter', sans-serif" };
  if (t.includes('round') || t.includes('friendly')) return { heading: "'Nunito', sans-serif", body: "'Nunito Sans', sans-serif" };
  if (t.includes('slab')) return { heading: "'Roboto Slab', serif", body: "'Roboto', sans-serif" };
  return { heading: "'Inter', sans-serif", body: "'Inter', sans-serif" };
}

function inferShapeSVG(shapesDesc: string, accentColor: string): React.ReactNode {
  const s = shapesDesc.toLowerCase();
  const col = accentColor || '#D9531E';
  if (s.includes('circle') || s.includes('round') || s.includes('organic')) {
    return (
      <svg width="200" height="80" viewBox="0 0 200 80">
        <circle cx="40" cy="40" r="30" fill="none" stroke={col} strokeWidth="2" opacity="0.6" />
        <circle cx="100" cy="40" r="20" fill={col} opacity="0.15" />
        <circle cx="155" cy="40" r="35" fill="none" stroke={col} strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
      </svg>
    );
  }
  if (s.includes('angular') || s.includes('sharp') || s.includes('triangle')) {
    return (
      <svg width="200" height="80" viewBox="0 0 200 80">
        <polygon points="40,10 70,70 10,70" fill="none" stroke={col} strokeWidth="2" opacity="0.6" />
        <polygon points="100,20 130,60 70,60" fill={col} opacity="0.15" />
        <rect x="140" y="20" width="40" height="40" fill="none" stroke={col} strokeWidth="1" strokeDasharray="4 4" opacity="0.4" transform="rotate(15 160 40)" />
      </svg>
    );
  }
  // Default: geometric mix
  return (
    <svg width="200" height="80" viewBox="0 0 200 80">
      <rect x="10" y="15" width="50" height="50" rx="4" fill="none" stroke={col} strokeWidth="2" opacity="0.6" />
      <circle cx="110" cy="40" r="25" fill={col} opacity="0.12" />
      <rect x="150" y="20" width="35" height="35" rx="2" fill="none" stroke={col} strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
    </svg>
  );
}

function SectionHeader({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
      <Icon size={14} color="var(--accent)" />
      <h3 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
        {label}
      </h3>
    </div>
  );
}

export default function VisualDNABoard({
  visualDNA,
  brandSystem
}: {
  visualDNA: VisualDNA;
  brandSystem: BrandSystem;
}) {
  const fonts = inferFontFamily(visualDNA.typography);
  const colors = visualDNA.colors;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ROW 1: TYPOGRAPHY + COLOR */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* TYPOGRAPHY */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', borderRadius: '16px', padding: '28px', overflow: 'hidden' }}>
          <SectionHeader icon={Type} label="Typography" />
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontFamily: fonts.heading, fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '4px' }}>
              {brandSystem.brandName}
            </p>
            <p style={{ fontFamily: fonts.heading, fontSize: '20px', fontWeight: 600, color: 'var(--text-secondary)', lineHeight: 1.2, marginBottom: '16px' }}>
              Aa Bb Cc Dd Ee
            </p>
            <p style={{ fontFamily: fonts.body, fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              The quick brown fox jumps over the lazy dog. 0123456789. {brandSystem.tagline}
            </p>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, fontWeight: 500 }}>
              {visualDNA.typography}
            </p>
          </div>
        </div>

        {/* COLOR */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', borderRadius: '16px', padding: '28px' }}>
          <SectionHeader icon={Palette} label="Color Palette" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            {[
              { color: colors.primary, label: 'Primary' },
              { color: colors.secondary, label: 'Secondary' },
              { color: colors.accent, label: 'Accent' },
            ].map(c => (
              <div key={c.label}>
                <div style={{ width: '100%', aspectRatio: '1', borderRadius: '12px', background: c.color, marginBottom: '8px', border: '1px solid rgba(0,0,0,0.1)', boxShadow: `0 4px 12px ${c.color}25` }} />
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: 700 }}>{c.label}</span>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 600 }}>{c.color}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            {[
              { color: colors.background, label: 'Background' },
              { color: colors.text, label: 'Text' },
            ].map(c => (
              <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border)', padding: '8px 12px', borderRadius: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: c.color, border: '1px solid var(--border)', flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: 700 }}>{c.label}</span>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 600 }}>{c.color}</span>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>{colors.description}</p>
        </div>
      </div>

      {/* ROW 2: COMPOSITION + SHAPES + ICONOGRAPHY */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>

        {/* COMPOSITION */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', borderRadius: '16px', padding: '28px' }}>
          <SectionHeader icon={Layout} label="Composition" />
          <div style={{ background: 'rgba(0,0,0,0.02)', borderRadius: '8px', padding: '16px', marginBottom: '16px', border: '1px dashed var(--border)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ height: '8px', width: '60%', background: colors.primary, borderRadius: '2px', opacity: 0.8 }} />
              <div style={{ height: '4px', width: '90%', background: 'rgba(0,0,0,0.1)', borderRadius: '2px' }} />
              <div style={{ height: '4px', width: '75%', background: 'rgba(0,0,0,0.1)', borderRadius: '2px' }} />
              <div style={{ height: '14px' }} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ height: '28px', flex: 1, background: colors.primary + '20', borderRadius: '4px', border: `1px solid ${colors.primary}50` }} />
                <div style={{ height: '28px', flex: 1, background: 'rgba(0,0,0,0.04)', borderRadius: '4px', border: '1px solid var(--border)' }} />
              </div>
            </div>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{visualDNA.composition}</p>
        </div>

        {/* SHAPES */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', borderRadius: '16px', padding: '28px' }}>
          <SectionHeader icon={Hexagon} label="Shapes" />
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', padding: '12px 0' }}>
            {inferShapeSVG(visualDNA.shapes, colors.accent)}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{visualDNA.shapes}</p>
        </div>

        {/* ICONOGRAPHY */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', borderRadius: '16px', padding: '28px' }}>
          <SectionHeader icon={Sparkles} label="Iconography" />
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '16px', padding: '12px 0' }}>
            {[Pen, Sparkles, Layout, Hexagon].map((IconItem, i) => (
              <div key={i} style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${colors.primary}${i === 0 ? '20' : '08'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${colors.primary}${i === 0 ? '50' : '20'}` }}>
                <IconItem size={18} color={i === 0 ? colors.primary : 'var(--text-muted)'} />
              </div>
            ))}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{visualDNA.icons}</p>
        </div>
      </div>

      {/* ROW 3: IMAGERY + LOGO DIRECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* IMAGERY */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', borderRadius: '16px', padding: '28px' }}>
          <SectionHeader icon={Image} label="Imagery" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
            {[colors.primary, colors.secondary, colors.accent].map((col, i) => (
              <div key={i} style={{
                aspectRatio: i === 0 ? '4/3' : '1',
                borderRadius: '8px',
                background: `linear-gradient(${135 + i * 45}deg, ${col}25, ${col}08)`,
                border: `1px solid ${col}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gridRow: i === 0 ? '1 / 3' : 'auto'
              }}>
                <Image size={20} color={col} style={{ opacity: 0.6 }} />
              </div>
            ))}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{visualDNA.imagery}</p>
        </div>

        {/* LOGO DIRECTION */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', borderRadius: '16px', padding: '28px' }}>
          <SectionHeader icon={Pen} label="Logo Direction" />
          <div style={{
            background: `linear-gradient(135deg, ${colors.background || '#F4F3EF'}, ${colors.primary}15)`,
            borderRadius: '12px',
            padding: '32px',
            marginBottom: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid var(--border)`,
            minHeight: '100px'
          }}>
            <span style={{ fontFamily: fonts.heading, fontSize: '28px', fontWeight: 800, color: colors.text || 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {brandSystem.brandName}
            </span>
            <span style={{ fontSize: '10px', color: colors.accent, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '6px', fontWeight: 700 }}>
              {brandSystem.tagline?.split(' ').slice(0, 4).join(' ')}
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{visualDNA.logoDirection}</p>
        </div>
      </div>

      {/* ROW 4: UI LANGUAGE + AVOID */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* UI LANGUAGE */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', borderRadius: '16px', padding: '28px' }}>
          <SectionHeader icon={Monitor} label="UI Language" />
          <div style={{
            background: colors.background || '#FFFFFF',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '16px',
            border: `1px solid var(--border)`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontFamily: fonts.heading, fontSize: '14px', fontWeight: 700, color: colors.text || 'var(--text-primary)' }}>{brandSystem.brandName}</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors.accent }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(0,0,0,0.15)' }} />
              </div>
            </div>
            <div style={{ height: '4px', width: '100%', background: 'rgba(0,0,0,0.06)', borderRadius: '2px', marginBottom: '12px' }}>
              <div style={{ height: '100%', width: '65%', background: colors.primary, borderRadius: '2px' }} />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ flex: 1, height: '26px', background: colors.primary, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#FFF' }}>Primary</span>
              </div>
              <div style={{ flex: 1, height: '26px', background: 'transparent', borderRadius: '4px', border: `1px solid ${colors.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: colors.primary }}>Secondary</span>
              </div>
            </div>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{visualDNA.uiStyle}</p>
        </div>

        {/* AVOID */}
        <div style={{ background: 'rgba(220, 38, 38, 0.03)', border: '1px solid rgba(220, 38, 38, 0.2)', borderRadius: '16px', padding: '28px' }}>
          <SectionHeader icon={Ban} label="Strictly Avoid" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {visualDNA.avoid.map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                background: 'rgba(220, 38, 38, 0.05)',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(220, 38, 38, 0.12)'
              }}>
                <span style={{ color: '#DC2626', fontSize: '14px', lineHeight: 1, fontWeight: 700 }}>✕</span>
                <span style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.4, fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
