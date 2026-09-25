'use client';

import { useStore } from '@/lib/store';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Search, Crosshair, Shapes, Swords, Activity, Rocket, Info } from 'lucide-react';

export default function DemoPage() {
  const { project } = useStore();
  
  if (!project.idea) {
    return (
      <div style={{ padding: '80px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '24px' }}>No Active Project</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Start a project in the workspace to view it in Judge Mode.</p>
        <Link href="/workspace" className="btn-primary" style={{ display: 'inline-flex' }}>
          <ArrowLeft size={16} /> Back to Workspace
        </Link>
      </div>
    );
  }

  const findTimelineEvent = (stage: string) => {
    return project.timeline?.find(t => t.stage.toLowerCase().includes(stage.toLowerCase()));
  };

  const DecisionNode = ({ title, decision, reason }: { title: string, decision?: string, reason?: string }) => {
    if (!decision) return null;
    return (
      <details style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px', marginTop: '12px' }}>
        <summary style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info size={14} /> WHY THIS DECISION? ({title})
        </summary>
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: 600 }}>Decision: {decision}</p>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, fontStyle: 'italic' }}>Reason: {reason}</p>
        </div>
      </details>
    );
  };

  return (
    <div className="animate-fade-in" style={{ padding: '40px 24px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
        <div>
          <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.05em' }}>
            / JUDGE MODE
          </span>
          <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginTop: '8px' }}>
            BRANDMIND Demo
          </h1>
        </div>
        <Link href="/workspace" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={14} /> Back to Workspace
        </Link>
      </div>

      {/* Workflow Map */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '60px', padding: '24px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}><Search size={12}/> DISCOVER</span>
        <ArrowLeft size={12} style={{ transform: 'rotate(180deg)', color: 'var(--text-muted)' }} />
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}><Crosshair size={12}/> POSITION</span>
        <ArrowLeft size={12} style={{ transform: 'rotate(180deg)', color: 'var(--text-muted)' }} />
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}><Shapes size={12}/> SHAPE</span>
        <ArrowLeft size={12} style={{ transform: 'rotate(180deg)', color: 'var(--text-muted)' }} />
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}><Swords size={12}/> CHALLENGE</span>
        <ArrowLeft size={12} style={{ transform: 'rotate(180deg)', color: 'var(--text-muted)' }} />
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}><Activity size={12}/> TEST</span>
        <ArrowLeft size={12} style={{ transform: 'rotate(180deg)', color: 'var(--text-muted)' }} />
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '4px' }}><Rocket size={12}/> DELIVER</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
        
        {/* DISCOVER */}
        <section>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            1. Discover
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="stage-card">
              <h3 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Original Idea</h3>
              <p style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 500 }}>"{project.idea.idea}"</p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>Audience: {project.idea.audience}</p>
            </div>
            
            {project.blindSpots && (
              <div className="stage-card">
                <h3 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Founder Blind Spots Detected</h3>
                <ul style={{ paddingLeft: '16px', margin: 0 }}>
                  {project.blindSpots.spots.slice(0,2).map(s => (
                    <li key={s.id} style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '8px' }}>
                      <span style={{ color: '#DC2626', fontWeight: 600 }}>{s.category}:</span> {s.statement}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {project.brandDNA && (
            <div className="stage-card" style={{ marginTop: '24px' }}>
              <h3 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px' }}>Extracted Brand DNA</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Core Problem</span>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{project.brandDNA.coreProblem}</p>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Value Prop</span>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{project.brandDNA.valueProposition}</p>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Personality</span>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{project.brandDNA.personality.join(', ')}</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* POSITION */}
        {project.worlds && project.worlds.length > 0 && (
          <section>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              2. Position (Worlds)
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              {project.worlds.map(w => (
                <div key={w.id} className="stage-card" style={{ borderColor: w.id === project.selectedWorldId ? 'var(--accent)' : 'var(--border)', opacity: w.id === project.selectedWorldId ? 1 : 0.6 }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>{w.name}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '12px' }}>"{w.tagline}"</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{w.strategicIdea}</p>
                  {w.id === project.selectedWorldId && (
                    <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                      <CheckCircle2 size={14} /> Selected World
                    </div>
                  )}
                </div>
              ))}
            </div>
            <DecisionNode 
              title="World Selection" 
              decision={findTimelineEvent('world')?.decision} 
              reason={findTimelineEvent('world')?.reason} 
            />
          </section>
        )}

        {/* CHALLENGE */}
        {project.battle && (
          <section>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              3. Challenge (Brand Battle)
            </h2>
            <div className="stage-card" style={{ background: '#DC262610', borderColor: '#DC262630' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                <strong>Collective Insight:</strong> {project.battle.collectiveInsight}
              </p>
            </div>
          </section>
        )}

        {/* SHAPE */}
        {project.brandSystem && (
          <section>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              4. Shape (Brand System)
            </h2>
            <div className="stage-card">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '4px' }}>{project.brandSystem.brandName}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--accent)', fontWeight: 600, marginBottom: '16px' }}>{project.brandSystem.tagline}</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}><strong>Voice:</strong> {project.brandSystem.voice.join(', ')}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1.6 }}>
                    <strong>Positioning:</strong> {project.brandSystem.positioningStatement}
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                    <strong>Promise:</strong> {project.brandSystem.brandPromise}
                  </p>
                </div>
              </div>
            </div>

            <DecisionNode 
              title="Brand DNA Lock" 
              decision={project.brandDnaLocked ? "Locked DNA as Source of Truth" : undefined} 
              reason={project.brandDnaLocked ? "Prevents hallucination and preserves the core strategy across all subsequent generative tasks." : undefined} 
            />
          </section>
        )}

        {/* TEST */}
        {(project.audienceRoom || project.realitySimulator || project.crisisRoom) && (
          <section>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              5. Test & Simulate
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              
              {project.audienceRoom && (
                <div className="stage-card">
                  <h3 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>Audience Reaction</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    <strong>Consensus:</strong> {project.audienceRoom.agreement}
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <strong>Pushback:</strong> {project.audienceRoom.disagreement}
                  </p>
                </div>
              )}

              {project.realitySimulator && project.realitySimulator.scenarios.length > 0 && (
                <div className="stage-card">
                  <h3 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>Reality Simulator</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    <strong>Top Scenario:</strong> {project.realitySimulator.scenarios[0].situation}
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <strong>Risk:</strong> {project.realitySimulator.scenarios[0].riskLevel} — {project.realitySimulator.scenarios[0].audienceReaction}
                  </p>
                </div>
              )}

            </div>
          </section>
        )}

        {/* DELIVER */}
        {project.launchKit && (
          <section>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              6. Deliver (Launch)
            </h2>
            
            {project.guardian && (
              <div className="stage-card" style={{ marginBottom: '24px', background: '#16A34A10', borderColor: '#16A34A30' }}>
                <h3 style={{ fontSize: '12px', color: '#16A34A', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 700 }}>Consistency Guardian Passed</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Brand assets verified against Locked DNA.</p>
              </div>
            )}

            <div className="stage-card" style={{ background: 'var(--accent-light)', borderColor: 'var(--accent)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent)', marginBottom: '12px' }}>BRANDMIND RESULT</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '16px' }}>
                From rough idea → stress-tested brand system
              </p>
              <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: '8px' }}>
                <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>{project.launchKit.thesis}</p>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Includes: {project.launchKit.items.length} launch assets generated strictly from finalized brand context.</p>
              </div>
            </div>
          </section>
        )}

      </div>
      
      <div style={{ marginTop: '60px', textAlign: 'center' }}>
        <Link href="/workspace" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={16} /> Back to Workspace
        </Link>
      </div>

    </div>
  );
}
