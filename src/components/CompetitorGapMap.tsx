'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import {
  Compass,
  Plus,
  Trash2,
  Sparkles,
  User,
  Zap,
  Target,
  ArrowUpRight,
  Info,
  CheckCircle2,
  TrendingUp,
  MapPin
} from 'lucide-react';
import type { Competitor, CompetitorGapMapData } from '@/lib/types';
import EvidenceDrilldown from '@/components/EvidenceDrilldown';

export default function CompetitorGapMap() {
  const { project, setCompetitorMap } = useStore();
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  // Local form for adding a new competitor
  const [showAddForm, setShowAddForm] = useState(false);
  const [compName, setCompName] = useState('');
  const [compTagline, setCompTagline] = useState('');
  const [compPositioning, setCompPositioning] = useState('');
  const [compAudience, setCompAudience] = useState('');
  const [compWeakness, setCompWeakness] = useState('');

  const mapData: CompetitorGapMapData = project.competitorMap || {
    xAxisLabel: 'Tactical Execution → Strategic Architecture',
    yAxisLabel: 'Superficial / Template → Deterministic & Institutional',
    competitors: [
      {
        id: 'comp-1',
        name: 'Legacy Enterprise Suite',
        tagline: 'The monolithic standard',
        claimedPositioning: 'Comprehensive management for Fortune 500 procurement',
        targetAudience: 'Global IT Procurement',
        strengths: ['Brand awareness', 'Broad vendor compliance'],
        weaknesses: ['Bloated interface', 'Slow execution', 'Rigid templates'],
        xCoord: 25,
        yCoord: 85,
        isUserInput: false,
      },
      {
        id: 'comp-2',
        name: 'Generic AI Copy Gen',
        tagline: 'Instant marketing in 1 click',
        claimedPositioning: 'Superficial copy generation for small businesses',
        targetAudience: 'Solopreneurs & casual marketers',
        strengths: ['Low cost', 'Fast generation'],
        weaknesses: ['Hallucinates generic filler', 'Zero strategic memory', 'Inconsistent tone'],
        xCoord: 80,
        yCoord: 20,
        isUserInput: false,
      },
      {
        id: 'comp-3',
        name: 'Manual Agency Consultancy',
        tagline: 'Bespoke 6-month brand strategy',
        claimedPositioning: 'High-touch executive workshops and static slide decks',
        targetAudience: 'Chief Marketing Officers',
        strengths: ['Deep qualitative research', 'High polish'],
        weaknesses: ['Extremely expensive ($100k+)', 'Static PDFs that get forgotten immediately'],
        xCoord: 30,
        yCoord: 35,
        isUserInput: false,
      }
    ],
    brandCoords: { x: 82, y: 80 },
    whitespaceZones: [
      {
        name: 'Autonomous Strategic Intelligence',
        description: 'Uncontested zone: Continuous brand memory + rigorous multi-agent consensus without manual agency overhead.',
        opportunityScore: 94,
        recommendedAngle: `Own the intersection of deterministic brand physics and dynamic multi-agent stress testing.`,
        coordinates: { x: 80, y: 80 }
      },
      {
        name: 'Real-Time Guardian Governance',
        description: 'Automated policy enforcement that prevents brand drift before copy ever goes live.',
        opportunityScore: 88,
        recommendedAngle: `Position as the deterministic operating system for brand consistency.`,
        coordinates: { x: 65, y: 85 }
      }
    ],
    aiInferences: [
      {
        competitorName: 'Legacy Enterprise Suite',
        inferredVulnerability: 'Vulnerable to: Bloated interface and lack of modern agile intelligence',
        confidence: 91
      },
      {
        competitorName: 'Generic AI Copy Gen',
        inferredVulnerability: 'Vulnerable to: Hallucinates generic filler with zero brand memory',
        confidence: 94
      },
      {
        competitorName: 'Manual Agency Consultancy',
        inferredVulnerability: 'Vulnerable to: Sells static slide decks with no continuous enforcement',
        confidence: 89
      }
    ]
  };

  const handleAddCompetitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compName.trim()) return;

    setLoading(true);
    try {
      const newComp: Competitor = {
        id: `comp-user-${Date.now()}`,
        name: compName.trim(),
        tagline: compTagline.trim() || 'Competitor',
        claimedPositioning: compPositioning.trim() || 'Alternative market solution',
        targetAudience: compAudience.trim() || 'General market',
        strengths: ['Established userbase'],
        weaknesses: compWeakness.trim() ? [compWeakness.trim()] : ['Generic messaging'],
        xCoord: 35 + (Math.random() * 30),
        yCoord: 30 + (Math.random() * 35),
        isUserInput: true,
      };

      const updatedCompetitors = [...mapData.competitors, newComp];
      const recalculated = await aiProvider.generateCompetitorGapMap(
        project.idea || { idea: 'Brand', audience: 'Audience', industry: 'Industry' },
        updatedCompetitors
      );

      setCompetitorMap(recalculated);
      setCompName('');
      setCompTagline('');
      setCompPositioning('');
      setCompAudience('');
      setCompWeakness('');
      setShowAddForm(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCompetitor = (id: string) => {
    const updated = mapData.competitors.filter(c => c.id !== id);
    setCompetitorMap({
      ...mapData,
      competitors: updated,
    });
    if (selectedItem?.id === id) setSelectedItem(null);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Header Card */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 800 }}>
              Positioning & Whitespace Architecture
            </span>
            <span className="badge badge-accent">
              COMPETITOR GAP MAP
            </span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Where your brand wins uncontested territory.
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '6px 0 0 0' }}>
            Clearly separates <strong>User-Reported Facts</strong> from <strong>AI Strategic Inferences</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="btn-outline"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus size={14} /> {showAddForm ? 'Cancel' : 'Add Competitor'}
          </button>
        </div>
      </div>

      {/* Add Competitor Drawer Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddCompetitor}
          className="animate-slide-in"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--accent)',
            borderRadius: '16px',
            padding: '24px 32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <User size={16} color="var(--accent)" />
            <h3 style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)', margin: 0 }}>
              Add Competitor (User-Provided Data)
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Competitor Name *
              </label>
              <input
                type="text"
                className="input-base"
                placeholder="e.g. Acme Corp"
                value={compName}
                onChange={e => setCompName(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Their Tagline / Slogan
              </label>
              <input
                type="text"
                className="input-base"
                placeholder="e.g. The simple way to build"
                value={compTagline}
                onChange={e => setCompTagline(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Claimed Positioning
              </label>
              <input
                type="text"
                className="input-base"
                placeholder="e.g. Enterprise grade security"
                value={compPositioning}
                onChange={e => setCompPositioning(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Primary Vulnerability / Weakness
              </label>
              <input
                type="text"
                className="input-base"
                placeholder="e.g. Slow support, bloated features"
                value={compWeakness}
                onChange={e => setCompWeakness(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn-outline" onClick={() => setShowAddForm(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Plotting Coordinates...' : 'Add & Recalculate Gap Map'}
            </button>
          </div>
        </form>
      )}

      {/* Main 2D Matrix Canvas & Inspector Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Interactive 2D Coordinate Matrix */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Matrix Top Label */}
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              ▲ {mapData.yAxisLabel.split('→')[1] || 'Institutional Rigor'}
            </span>
          </div>

          {/* 2D Coordinate Box */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '380px',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            {/* Grid Crosshairs */}
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(0,0,0,0.06)', borderLeft: '1px dashed var(--border)' }} />
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(0,0,0,0.06)', borderTop: '1px dashed var(--border)' }} />

            {/* Quadrant Watermarks */}
            <span style={{ position: 'absolute', top: '10px', left: '12px', fontSize: '10px', color: 'var(--text-muted)', opacity: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>
              Niche / Traditional
            </span>
            <span style={{ position: 'absolute', top: '10px', right: '12px', fontSize: '10px', color: 'var(--accent)', opacity: 0.7, fontWeight: 800, textTransform: 'uppercase' }}>
              ★ Uncontested Alpha
            </span>
            <span style={{ position: 'absolute', bottom: '10px', left: '12px', fontSize: '10px', color: 'var(--text-muted)', opacity: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>
              Legacy Commodity
            </span>
            <span style={{ position: 'absolute', bottom: '10px', right: '12px', fontSize: '10px', color: 'var(--text-muted)', opacity: 0.5, fontWeight: 700, textTransform: 'uppercase' }}>
              Superficial Noise
            </span>

            {/* Whitespace Zone Rings */}
            {mapData.whitespaceZones.map((zone, i) => (
              <div
                key={i}
                onClick={() => setSelectedItem({ type: 'zone', data: zone })}
                title={`Whitespace Opportunity: ${zone.name}`}
                style={{
                  position: 'absolute',
                  left: `${zone.coordinates.x}%`,
                  top: `${100 - zone.coordinates.y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: 'rgba(22, 163, 74, 0.06)',
                  border: '1.5px dashed rgba(22, 163, 74, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 2,
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ fontSize: '9px', fontWeight: 800, color: '#16A34A', textTransform: 'uppercase', textAlign: 'center', padding: '4px' }}>
                  Whitespace
                </span>
              </div>
            ))}

            {/* Competitor Nodes */}
            {mapData.competitors.map((comp) => {
              const isSelected = selectedItem?.data?.id === comp.id;
              return (
                <div
                  key={comp.id}
                  onClick={() => setSelectedItem({ type: 'competitor', data: comp })}
                  title={`${comp.name} (${comp.isUserInput ? 'User Fact' : 'AI Inferred'})`}
                  style={{
                    position: 'absolute',
                    left: `${comp.xCoord}%`,
                    top: `${100 - comp.yCoord}%`,
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                    zIndex: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <div
                    style={{
                      width: isSelected ? '18px' : '14px',
                      height: isSelected ? '18px' : '14px',
                      borderRadius: '50%',
                      background: comp.isUserInput ? '#3b82f6' : '#64748b',
                      border: '2px solid white',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      transition: 'all 0.15s ease',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {comp.name}
                  </span>
                </div>
              );
            })}

            {/* Your Brand Star Anchor */}
            <div
              onClick={() => setSelectedItem({ type: 'brand', data: { name: project.brandDNA?.differentiator || 'Your Brand' } })}
              title="Your Brand Anchor Position"
              style={{
                position: 'absolute',
                left: `${mapData.brandCoords.x}%`,
                top: `${100 - mapData.brandCoords.y}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  border: '3px solid white',
                  boxShadow: '0 0 15px var(--accent), 0 2px 8px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <Sparkles size={12} />
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: 'var(--accent)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--accent)',
                  padding: '2px 8px',
                  borderRadius: '100px',
                  whiteSpace: 'nowrap',
                }}
              >
                ★ YOUR BRAND
              </span>
            </div>
          </div>

          {/* Matrix Bottom Label */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            <span>◄ Tactical Execution</span>
            <span>{mapData.xAxisLabel}</span>
            <span>Strategic Architecture ►</span>
          </div>
        </div>

        {/* Selected Entity Inspector Panel */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '24px',
            minHeight: '440px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {selectedItem ? (
            <div>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      padding: '2px 8px',
                      borderRadius: '100px',
                      background: selectedItem.type === 'brand'
                        ? 'var(--accent-light)'
                        : selectedItem.type === 'zone'
                        ? 'rgba(22, 163, 74, 0.1)'
                        : selectedItem.data.isUserInput
                        ? 'rgba(59, 130, 246, 0.1)'
                        : 'rgba(100, 116, 139, 0.1)',
                      color: selectedItem.type === 'brand'
                        ? 'var(--accent)'
                        : selectedItem.type === 'zone'
                        ? '#16A34A'
                        : selectedItem.data.isUserInput
                        ? '#3b82f6'
                        : '#64748b',
                    }}
                  >
                    {selectedItem.type === 'brand'
                      ? 'TARGET POSTURE'
                      : selectedItem.type === 'zone'
                      ? 'WHITESPACE OPPORTUNITY'
                      : selectedItem.data.isUserInput
                      ? 'USER REPORTED FACT'
                      : 'AI COMPETITOR INFERENCE'}
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: '8px 0 2px 0' }}>
                    {selectedItem.data.name}
                  </h3>
                  {selectedItem.data.tagline && (
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>
                      "{selectedItem.data.tagline}"
                    </p>
                  )}
                </div>

                {selectedItem.type === 'competitor' && selectedItem.data.isUserInput && (
                  <button
                    onClick={() => handleRemoveCompetitor(selectedItem.data.id)}
                    style={{ background: 'transparent', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '4px' }}
                    title="Remove competitor"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {/* Data Breakdown */}
              {selectedItem.type === 'competitor' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                  <div style={{ background: 'var(--bg)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <User size={13} color="#3b82f6" />
                      <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        User-Provided Claim
                      </span>
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 500 }}>
                      {selectedItem.data.claimedPositioning}
                    </p>
                  </div>

                  <div style={{ background: 'rgba(220, 38, 38, 0.04)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(220, 38, 38, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <Zap size={13} color="#DC2626" />
                      <span style={{ fontSize: '10px', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase' }}>
                        Strategic Vulnerability
                      </span>
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 500 }}>
                      {selectedItem.data.weaknesses?.join(', ') || 'Vulnerable to deterministic positioning'}
                    </p>
                  </div>
                </div>
              )}

              {selectedItem.type === 'zone' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {selectedItem.data.description}
                  </p>
                  <div style={{ background: 'rgba(22, 163, 74, 0.05)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(22, 163, 74, 0.2)' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#16A34A', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      Recommended Strategic Angle
                    </span>
                    <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600, margin: 0 }}>
                      {selectedItem.data.recommendedAngle}
                    </p>
                  </div>
                </div>
              )}

              {selectedItem.type === 'brand' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ background: 'var(--accent-light)', padding: '14px', borderRadius: '8px', border: '1px solid var(--accent)' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      Your Distinctive Wedge
                    </span>
                    <p style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600, margin: 0 }}>
                      {project.brandDNA?.differentiator || 'Autonomous Brand Architecture'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, textAlign: 'center', color: 'var(--text-muted)' }}>
              <Compass size={32} color="var(--text-muted)" style={{ marginBottom: '12px', opacity: 0.5 }} />
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Click any marker or whitespace zone</span>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0', maxWidth: '220px' }}>
                Inspect competitor claimed vs. actual posture and explore market alpha.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
