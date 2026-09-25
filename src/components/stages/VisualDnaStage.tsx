'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState } from 'react';
import { ArrowRight, Palette, Type, Layout, MousePointerClick, Send, Lock } from 'lucide-react';

export default function VisualDnaStage() {
  const { project, setVisualDNA, sendVisualDnaToBrandSystem, markStageComplete } = useStore();
  const [loading, setLoading] = useState(false);

  const { brandDNA, brandSystem, worlds, selectedWorldId, visualDNA } = project;
  if (!brandDNA || !brandSystem || !worlds || !selectedWorldId) return null;
  const world = worlds.find(w => w.id === selectedWorldId)!;

  const handleRun = async () => {
    setLoading(true);
    try {
      const result = await aiProvider.generateVisualDNA(brandSystem, brandDNA, world);
      setVisualDNA(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    sendVisualDnaToBrandSystem();
  };

  const handleComplete = () => {
    markStageComplete('visualDna');
  };

  const renderColorSwatch = (color: string, label: string) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ width: '100%', height: '48px', background: color, borderRadius: '6px', border: '1px solid var(--border)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</span>
        <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{color}</span>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.05em' }}>
          / 07i / VISUAL DNA
        </span>
      </div>

      <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '16px' }}>
        Turn strategy into a visual system.
      </h1>

      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6, maxWidth: '800px' }}>
        We take your Brand Personality, Positioning, and selected Brand World, and generate a structured Visual DNA outlining the colors, typography, shapes, and rules.
      </p>

      {!visualDNA || visualDNA.status !== 'complete' ? (
        <button className="btn-primary" onClick={handleRun} disabled={loading} style={{ marginBottom: '40px' }}>
          {loading ? (
            <>
              <span className="animate-spin-slow" style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
              Generating Visual DNA...
            </>
          ) : (
            <>
              <Palette size={14} /> Generate Visual System
            </>
          )}
        </button>
      ) : (
        <div className="animate-slide-in" style={{ marginBottom: '40px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '24px' }}>
            <div className="stage-card">
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Palette size={16} color="var(--accent)" /> Color Palette
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', fontStyle: 'italic' }}>
                {visualDNA.colors.description}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {renderColorSwatch(visualDNA.colors.primary, 'Primary')}
                {renderColorSwatch(visualDNA.colors.secondary, 'Secondary')}
                {renderColorSwatch(visualDNA.colors.accent, 'Accent')}
                {renderColorSwatch(visualDNA.colors.background, 'Background')}
              </div>
            </div>

            <div className="stage-card">
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Type size={16} color="var(--accent)" /> Typography & Layout
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Typography</span>
                  <p style={{ fontSize: '14px', color: 'var(--text-primary)', whiteSpace: 'pre-line' }}>{visualDNA.typography}</p>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Composition</span>
                  <p style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{visualDNA.composition}</p>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Shapes</span>
                  <p style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{visualDNA.shapes}</p>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>UI Style</span>
                  <p style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{visualDNA.uiStyle}</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
            <div className="stage-card">
               <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Imagery & Icons</h3>
               <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '12px' }}><strong>Imagery:</strong> {visualDNA.imagery}</p>
               <p style={{ fontSize: '13px', color: 'var(--text-primary)' }}><strong>Icons:</strong> {visualDNA.icons}</p>
            </div>
            <div className="stage-card" style={{ borderLeft: '3px solid #DC2626' }}>
               <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Strictly Avoid</h3>
               <ul style={{ paddingLeft: '20px', margin: 0 }}>
                 {visualDNA.avoid.map(item => (
                   <li key={item} style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>{item}</li>
                 ))}
               </ul>
            </div>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layout size={18} /> Component Previews
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Landing Page Hero Preview */}
              <div style={{ 
                background: visualDNA.colors.background, 
                color: visualDNA.colors.text, 
                padding: '40px 24px', 
                borderRadius: '12px', 
                border: '1px solid var(--border)',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '12px', color: visualDNA.colors.accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {brandSystem.brandName}
                </span>
                <h2 style={{ fontSize: '28px', fontWeight: 800, marginTop: '16px', marginBottom: '16px', lineHeight: 1.1 }}>
                  {brandSystem.tagline || brandSystem.valueProposition}
                </h2>
                <button style={{ 
                  background: visualDNA.colors.primary, 
                  color: '#fff', 
                  border: 'none', 
                  padding: '12px 24px', 
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                  Get Started
                </button>
              </div>

              {/* Mobile App Card Preview */}
              <div style={{ 
                background: 'var(--bg-card)', 
                padding: '24px', 
                borderRadius: '12px', 
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ 
                  background: visualDNA.colors.background, 
                  width: '100%', 
                  maxWidth: '280px',
                  padding: '20px',
                  borderRadius: '16px',
                  boxShadow: `0 10px 25px -5px ${visualDNA.colors.primary}30`,
                  border: `1px solid ${visualDNA.colors.primary}20`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: visualDNA.colors.secondary }} />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: visualDNA.colors.text }}>{brandSystem.brandName} Update</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Just now</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', color: visualDNA.colors.text, opacity: 0.8, lineHeight: 1.5, marginBottom: '16px' }}>
                    {brandSystem.positioningStatement.split('.')[0]}.
                  </p>
                  <div style={{ 
                    background: visualDNA.colors.primary, 
                    color: '#fff', 
                    padding: '10px', 
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}>
                    <MousePointerClick size={14} /> Action Button
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
            <button className="btn-outline" onClick={handleRun} disabled={loading}>
              Regenerate Visual Direction
            </button>
            <button className="btn-primary" onClick={handleSend} disabled={visualDNA.isLocked}>
              <Send size={14} /> Send to Brand System
            </button>
          </div>
        </div>
      )}

      <div className="divider" />
      
      <button className="btn-primary" onClick={handleComplete}>
        Continue to DNA Lock <ArrowRight size={14} />
      </button>
    </div>
  );
}
