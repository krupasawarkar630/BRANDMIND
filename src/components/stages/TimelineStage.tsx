'use client';

import { useStore } from '@/lib/store';
import { ArrowRight, GitCommit, Search, GitBranch } from 'lucide-react';

export default function TimelineStage() {
  const { project, markStageComplete } = useStore();
  
  const { timeline = [], brandSystem } = project;
  if (!brandSystem) return null;

  const handleComplete = () => {
    markStageComplete('timeline');
  };

  const formatDate = (ts: string) => {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.05em' }}>
          / 07g / BRAND DECISION TIMELINE
        </span>
        <span className="badge badge-accent">HISTORY</span>
      </div>

      <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '16px' }}>
        How your brand evolved.
      </h1>

      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.6 }}>
        Every strategic pivot, mutation, and A/B choice is logged here. This creates a transparent record of why your brand is the way it is, preventing future stakeholders from reversing critical decisions blindly.
      </p>

      {timeline.length === 0 ? (
        <div className="stage-card" style={{ textAlign: 'center', padding: '40px' }}>
          <GitBranch size={24} color="var(--text-muted)" style={{ margin: '0 auto 16px auto' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
            No decisions logged yet
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Use the Brand Mutation Lab or A/B Experiments to modify your brand system and start building your timeline.
          </p>
        </div>
      ) : (
        <div style={{ position: 'relative', paddingLeft: '24px', marginBottom: '40px' }}>
          <div style={{ position: 'absolute', left: '7px', top: '0', bottom: '0', width: '2px', background: 'var(--border)' }} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {timeline.map((evt, i) => (
              <div key={evt.id} style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-30px', top: '2px', width: '14px', height: '14px', borderRadius: '50%', background: 'var(--bg)', border: '2px solid var(--accent)', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '4px', height: '4px', background: 'var(--accent)', borderRadius: '50%' }} />
                </div>
                
                <div className="stage-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', display: 'block' }}>
                        {evt.stage}
                      </span>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {evt.decision}
                      </h3>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {formatDate(evt.timestamp)}
                    </span>
                  </div>

                  {evt.previousValue && evt.newValue && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px', background: 'var(--bg)', padding: '12px', borderRadius: '6px' }}>
                      <div>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Previous</span>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>{evt.previousValue}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '10px', color: '#16A34A', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>New</span>
                        <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{evt.newValue}</p>
                      </div>
                    </div>
                  )}

                  <div style={{ marginBottom: '16px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Why it changed</span>
                    <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                      {evt.reason}
                    </p>
                  </div>

                  {evt.affectedElements && evt.affectedElements.length > 0 && (
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Affected:</span>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {evt.affectedElements.map(el => (
                          <span key={el} className="badge badge-muted">{el}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <button className="btn-outline" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => alert('Feature coming soon: View historical snapshot.')}>
                      <Search size={12} /> View Previous Version
                    </button>
                    <button className="btn-outline" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => alert('Feature coming soon: Compare diffs side-by-side.')}>
                      <GitCommit size={12} /> Compare
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="divider" />
      
      <button className="btn-primary" onClick={handleComplete}>
        Continue to Guardian <ArrowRight size={14} />
      </button>
    </div>
  );
}
