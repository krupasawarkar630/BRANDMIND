'use client';

import React, { useState } from 'react';
import type { AudienceReaction, AudienceRoom } from '@/lib/types';
import { Users, User, ArrowRight, Zap, Target, BarChart2, MessageSquare, AlertCircle } from 'lucide-react';

function PersonaNode({ 
  reaction, 
  index, 
  total, 
  isActive, 
  onClick 
}: { 
  reaction: AudienceReaction; 
  index: number; 
  total: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const angle = (index / total) * Math.PI * 2;
  const radius = 180;
  const cx = 240 + radius * Math.cos(angle);
  const cy = 240 + radius * Math.sin(angle);

  return (
    <g 
      transform={`translate(${cx}, ${cy})`} 
      onClick={onClick}
      style={{ cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      {/* Connector */}
      <line x1={-radius * Math.cos(angle)} y1={-radius * Math.sin(angle)} x2={0} y2={0} stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" strokeDasharray="4 4" />
      
      {/* Node Base */}
      <circle 
        r={isActive ? 36 : 28} 
        fill={isActive ? 'rgba(37, 99, 235, 0.15)' : 'var(--bg-card)'}
        stroke={isActive ? '#2563EB' : 'var(--border)'}
        strokeWidth="2"
        style={{ transition: 'all 0.3s ease' }}
      />
      
      {/* Outer Glow */}
      {isActive && (
        <circle r={44} fill="none" stroke="rgba(37, 99, 235, 0.4)" strokeWidth="1.5">
          <animate attributeName="r" values="40; 48; 40" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8; 0; 0.8" dur="2s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Icon */}
      <g transform="translate(-12, -12)" color={isActive ? '#2563EB' : 'var(--text-secondary)'}>
        <User size={24} />
      </g>

      {/* Label Box */}
      <rect x="-42" y={isActive ? 45 : 35} width="84" height="20" rx="4" fill="var(--bg-card)" stroke={isActive ? '#2563EB' : 'var(--border)'} strokeWidth="1" />
      <text 
        y={isActive ? 59 : 49} 
        textAnchor="middle" 
        fill={isActive ? '#2563EB' : 'var(--text-primary)'}
        fontSize="10px"
        fontWeight="700"
        letterSpacing="0.05em"
        style={{ textTransform: 'uppercase' }}
      >
        {reaction.persona.substring(0, 12)}
      </text>
    </g>
  );
}

export default function AudienceRoomVisualizer({ 
  room,
  brandName,
  onNext 
}: { 
  room: AudienceRoom;
  brandName: string;
  onNext: () => void;
}) {
  const [activeReactionId, setActiveReactionId] = useState<string | null>(room.reactions[0]?.id || null);
  const [viewMode, setViewMode] = useState<'persona' | 'consensus'>('persona');

  const activeReaction = room.reactions.find(r => r.id === activeReactionId);

  return (
    <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
      
      {/* Header Warning */}
      <div style={{ background: 'rgba(217, 119, 6, 0.08)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderBottom: '1px solid rgba(217, 119, 6, 0.2)' }}>
        <Zap size={14} color="#D97706" />
        <span style={{ fontSize: '11px', fontWeight: 800, color: '#D97706', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          AI-SIMULATED AUDIENCE REACTION (NOT REAL USER RESEARCH)
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', minHeight: '500px' }}>
        
        {/* Left: Visual Room */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--border)', padding: '32px', background: 'var(--bg)' }}>
          
          <div style={{ position: 'absolute', top: 24, left: 24, display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setViewMode('persona')}
              style={{
                background: viewMode === 'persona' ? 'var(--accent)' : 'var(--bg-card)',
                border: `1px solid ${viewMode === 'persona' ? 'var(--accent)' : 'var(--border)'}`,
                color: viewMode === 'persona' ? '#FFFFFF' : 'var(--text-secondary)',
                padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer'
              }}
            >
              Persona Views
            </button>
            <button 
              onClick={() => setViewMode('consensus')}
              style={{
                background: viewMode === 'consensus' ? 'var(--accent)' : 'var(--bg-card)',
                border: `1px solid ${viewMode === 'consensus' ? 'var(--accent)' : 'var(--border)'}`,
                color: viewMode === 'consensus' ? '#FFFFFF' : 'var(--text-secondary)',
                padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer'
              }}
            >
              Room Consensus
            </button>
          </div>

          <svg width="480" height="480" style={{ overflow: 'visible' }}>
            {/* Center Brand Node */}
            <g transform="translate(240, 240)">
              <circle r="56" fill="var(--bg-card)" stroke="var(--border)" strokeWidth="1.5" />
              <circle r="48" fill="rgba(217, 83, 30, 0.06)" stroke="var(--accent)" strokeWidth="1" />
              <text y="-8" textAnchor="middle" fill="var(--text-muted)" fontSize="10px" fontWeight="700" letterSpacing="0.1em">TARGET</text>
              <text y="12" textAnchor="middle" fill="var(--text-primary)" fontSize="16px" fontWeight="800" letterSpacing="0.05em">{brandName.substring(0, 10).toUpperCase()}</text>
            </g>

            {/* Personas */}
            {room.reactions.map((reaction, i) => (
              <PersonaNode 
                key={reaction.id}
                reaction={reaction}
                index={i}
                total={room.reactions.length}
                isActive={viewMode === 'persona' && activeReactionId === reaction.id}
                onClick={() => { setActiveReactionId(reaction.id); setViewMode('persona'); }}
              />
            ))}
          </svg>

        </div>

        {/* Right: Inspector */}
        <div style={{ background: 'var(--bg-card)', display: 'flex', flexDirection: 'column' }}>
          
          {viewMode === 'persona' && activeReaction && (
            <div className="animate-fade-in" style={{ padding: '32px 24px', flex: 1, overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Users size={16} color="#2563EB" />
                <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Simulated Persona
                </span>
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '24px', lineHeight: 1.2 }}>
                {activeReaction.persona}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Reaction */}
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>First Impression</div>
                  <div style={{ padding: '14px', background: 'rgba(37, 99, 235, 0.05)', borderRadius: '8px', borderLeft: '3px solid #2563EB', border: '1px solid rgba(37, 99, 235, 0.15)' }}>
                    <p style={{ fontSize: '14px', color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: 1.5, fontWeight: 500 }}>"{activeReaction.firstImpression}"</p>
                  </div>
                </div>

                {/* Grid stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: '#16A34A', letterSpacing: '0.1em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Attracted By</div>
                    <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.4, fontWeight: 500 }}>{activeReaction.appeal}</p>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#DC2626', letterSpacing: '0.1em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Confused By</div>
                    <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.4, fontWeight: 500 }}>{activeReaction.confusion}</p>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#D97706', letterSpacing: '0.1em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Objection</div>
                    <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.4, fontWeight: 500 }}>{activeReaction.objection}</p>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#8B5CF6', letterSpacing: '0.1em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Memorable Element</div>
                    <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.4, fontWeight: 500 }}>{activeReaction.memorableElement}</p>
                  </div>
                </div>

                {/* Metrics */}
                <div style={{ display: 'flex', gap: '16px', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border)', padding: '14px', borderRadius: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>Clarity</div>
                    <div style={{ height: '5px', background: 'rgba(0,0,0,0.08)', borderRadius: '3px' }}><div style={{ height: '100%', width: `${activeReaction.clarityScore}%`, background: '#2563EB', borderRadius: '3px' }}/></div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>Distinctiveness</div>
                    <div style={{ height: '5px', background: 'rgba(0,0,0,0.08)', borderRadius: '3px' }}><div style={{ height: '100%', width: `${activeReaction.distinctivenessScore}%`, background: '#2563EB', borderRadius: '3px' }}/></div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>Audience Fit</div>
                    <div style={{ height: '5px', background: 'rgba(0,0,0,0.08)', borderRadius: '3px' }}><div style={{ height: '100%', width: `${activeReaction.audienceFitScore}%`, background: '#2563EB', borderRadius: '3px' }}/></div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {viewMode === 'consensus' && (
            <div className="animate-fade-in" style={{ padding: '32px 24px', flex: 1, overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <BarChart2 size={16} color="#8B5CF6" />
                <span style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Room Consensus
                </span>
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '32px', lineHeight: 1.2 }}>
                Aggregate Analysis
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#16A34A', letterSpacing: '0.1em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Universal Agreement</div>
                  <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 500 }}>{room.agreement}</p>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#DC2626', letterSpacing: '0.1em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Key Disagreements</div>
                  <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 500 }}>{room.disagreement}</p>
                </div>
                <div style={{ padding: '16px', background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '10px', color: '#7C3AED', letterSpacing: '0.1em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Strategic Insight</div>
                  <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 600 }}>{room.insight}</p>
                </div>
              </div>
            </div>
          )}

          <div style={{ padding: '24px', borderTop: '1px solid var(--border)' }}>
            <button className="btn-primary" onClick={onNext} style={{ width: '100%', justifyContent: 'space-between' }}>
              PROCEED TO MUTATION LAB <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
