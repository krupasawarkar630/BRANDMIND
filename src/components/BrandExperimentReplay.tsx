'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import {
  RotateCcw,
  GitBranch,
  Play,
  CheckCircle,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Eye
} from 'lucide-react';
import type { TimelineEvent } from '@/lib/types';

interface BrandExperimentReplayProps {
  events: TimelineEvent[];
}

export default function BrandExperimentReplay({ events }: BrandExperimentReplayProps) {
  const { project, rollbackToTimelineSnapshot, branchFromTimelineSnapshot } = useStore();
  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(events.length - 1);
  const [branchName, setBranchName] = useState('');
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!events || events.length === 0) return null;

  const activeEvent = events[Math.min(selectedEventIndex, events.length - 1)];

  const handleRollback = (eventId: string) => {
    if (confirm(`Rollback brand state to decision: "${activeEvent.decision}"?`)) {
      rollbackToTimelineSnapshot(eventId);
      setFeedback(`Successfully restored brand state to decision from ${new Date(activeEvent.timestamp).toLocaleTimeString()}.`);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchName.trim()) return;
    branchFromTimelineSnapshot(activeEvent.id, branchName.trim());
    setFeedback(`Created exploratory variant branch "${branchName}".`);
    setBranchName('');
    setShowBranchModal(false);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '24px 32px',
        marginBottom: '32px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 800 }}>
              Interactive Version Timeline
            </span>
            <span className="badge badge-accent">EXPERIMENT REPLAY</span>
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Inspect & Replay Brand Evolution ({events.length} Milestones)
          </h3>
        </div>

        {feedback && (
          <div className="animate-fade-in" style={{ fontSize: '12px', color: '#16A34A', background: 'rgba(22, 163, 74, 0.1)', padding: '6px 12px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle size={14} /> {feedback}
          </div>
        )}
      </div>

      {/* Stepper Timeline Bar */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '12px' }}>
          {events.map((ev, i) => {
            const isSelected = i === selectedEventIndex;
            return (
              <button
                key={ev.id}
                type="button"
                onClick={() => setSelectedEventIndex(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '100px',
                  border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                  background: isSelected ? 'var(--accent-light)' : 'var(--bg)',
                  color: isSelected ? 'var(--accent)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: isSelected ? 700 : 500,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  flexShrink: 0,
                }}
              >
                <Clock size={12} />
                <span>Step {i + 1}: {ev.stage}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Snapshot Comparator Card */}
      {activeEvent && (
        <div
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '2px' }}>
                LOGGED ON {new Date(activeEvent.timestamp).toLocaleString()} BY {activeEvent.source}
              </span>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                {activeEvent.decision}
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '6px 0 0 0', fontStyle: 'italic' }}>
                "{activeEvent.reason}"
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn-outline"
                onClick={() => setShowBranchModal(true)}
                title="Branch an alternate variant from this point"
              >
                <GitBranch size={14} /> Branch Variant
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={() => handleRollback(activeEvent.id)}
                style={{ color: '#D97706', borderColor: 'rgba(217, 119, 6, 0.4)' }}
                title="Revert current brand state back to this milestone"
              >
                <RotateCcw size={14} /> Rollback
              </button>
            </div>
          </div>

          {/* Diff Values if any */}
          {(activeEvent.previousValue || activeEvent.newValue) && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '4px' }}>
              {activeEvent.previousValue && (
                <div style={{ background: 'rgba(0,0,0,0.02)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '2px' }}>
                    Before This Decision
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>
                    {activeEvent.previousValue}
                  </span>
                </div>
              )}
              {activeEvent.newValue && (
                <div style={{ background: 'var(--accent-light)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--accent)' }}>
                  <span style={{ fontSize: '10px', color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '2px' }}>
                    After This Decision
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>
                    {activeEvent.newValue}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Branch Modal */}
      {showBranchModal && (
        <form
          onSubmit={handleBranch}
          style={{
            marginTop: '16px',
            background: 'var(--bg)',
            border: '1px solid var(--accent)',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <GitBranch size={16} color="var(--accent)" />
          <input
            type="text"
            className="input-base"
            placeholder="Name for new branch variant (e.g. Enterprise Edition, Playful Spin-off)"
            value={branchName}
            onChange={e => setBranchName(e.target.value)}
            style={{ flex: 1 }}
            required
            autoFocus
          />
          <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
            Create Fork
          </button>
          <button type="button" className="btn-outline" onClick={() => setShowBranchModal(false)}>
            Cancel
          </button>
        </form>
      )}

    </div>
  );
}
