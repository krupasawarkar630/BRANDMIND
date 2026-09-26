'use client';

import React from 'react';
import { Circle, ArrowRight, CornerDownRight, Zap, User } from 'lucide-react';
import type { TimelineEvent } from '@/lib/types';

export default function DecisionTimeline({ events }: { events: TimelineEvent[] }) {
  if (!events || events.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>
        No decisions recorded yet.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative', paddingLeft: '32px' }}>
      
      {/* VERTICAL LINE */}
      <div style={{ position: 'absolute', left: '16px', top: '16px', bottom: '16px', width: '2px', background: 'var(--border)' }} />

      {events.map((ev, i) => {
        const isLast = i === events.length - 1;
        
        return (
          <div key={ev.id} style={{ position: 'relative', paddingBottom: isLast ? '0' : '40px' }}>
            
            {/* NODE */}
            <div style={{ position: 'absolute', left: '-21px', top: '4px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--bg-card)', border: '2px solid var(--accent)', zIndex: 2 }} />
            
            {/* CONTENT CARD */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              
              {/* HEADER */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {ev.stage}
                  </span>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border)' }} />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: '100px' }}>
                  {ev.source === 'AI' ? <Zap size={12} color="var(--accent)" /> : <User size={12} color="#16A34A" />}
                  <span style={{ fontSize: '10px', fontWeight: 800, color: ev.source === 'AI' ? 'var(--accent)' : '#15803D', textTransform: 'uppercase' }}>
                    {ev.source} DECISION
                  </span>
                </div>
              </div>

              {/* DECISION */}
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1.4 }}>
                {ev.decision}
              </h3>

              {/* DIFF */}
              {(ev.previousValue || ev.newValue) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', background: 'rgba(0, 0, 0, 0.02)', border: '1px solid var(--border)', padding: '16px', borderRadius: '8px' }}>
                  {ev.previousValue && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', width: '60px', textTransform: 'uppercase', fontWeight: 700 }}>From:</span>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>{ev.previousValue}</span>
                    </div>
                  )}
                  {ev.newValue && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--accent)', width: '60px', textTransform: 'uppercase', fontWeight: 800 }}>To:</span>
                      <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>{ev.newValue}</span>
                    </div>
                  )}
                </div>
              )}

              {/* REASON */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CornerDownRight size={16} color="var(--accent)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Strategic Factor</span>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, fontStyle: 'italic', fontWeight: 450 }}>
                    "{ev.reason}"
                  </p>
                </div>
              </div>

              {/* AFFECTED ELEMENTS */}
              {ev.affectedElements && ev.affectedElements.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
                  {ev.affectedElements.map(el => (
                    <span key={el} style={{ fontSize: '10px', background: 'var(--bg)', border: '1px solid var(--border)', padding: '3px 8px', borderRadius: '4px', color: 'var(--text-primary)', textTransform: 'uppercase', fontWeight: 600 }}>
                      {el}
                    </span>
                  ))}
                </div>
              )}

            </div>
          </div>
        );
      })}
    </div>
  );
}
