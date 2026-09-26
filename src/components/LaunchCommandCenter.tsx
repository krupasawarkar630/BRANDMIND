'use client';

import { useStore } from '@/lib/store';
import { useState } from 'react';
import {
  Copy, Check, Pencil, RefreshCw, Lock, Unlock,
  Download, FileJson, FileText, Share2, Zap,
  Palette, Megaphone, MessageSquare, Globe, CornerDownRight, X,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface CommandCard {
  id: string;
  section: string;
  label: string;
  sublabel?: string;
  content: string | string[];
  icon: React.ReactNode;
  color: string;
  wide?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Action Button
// ─────────────────────────────────────────────────────────────────────────────

function ActionBtn({
  icon,
  label,
  onClick,
  disabled,
  active,
  activeColor,
  style: extraStyle,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  activeColor?: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '5px 10px',
        borderRadius: '100px',
        border: `1px solid ${active ? (activeColor || 'var(--accent)') : 'var(--border)'}`,
        background: active ? `${activeColor || 'var(--accent)'}18` : 'transparent',
        color: active ? (activeColor || 'var(--accent)') : 'var(--text-muted)',
        fontSize: '11px',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'all 0.15s ease',
        fontFamily: 'var(--font-sans)',
        whiteSpace: 'nowrap',
        ...extraStyle,
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Individual Command Card Tile
// ─────────────────────────────────────────────────────────────────────────────

function CommandCardTile({
  card,
  onSave,
}: {
  card: CommandCard;
  onSave: (id: string, newContent: string | string[]) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [locked, setLocked] = useState(false);
  const [editing, setEditing] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [liveContent, setLiveContent] = useState<string | string[]>(card.content);
  const [editValue, setEditValue] = useState(
    Array.isArray(card.content) ? card.content.join('\n') : card.content
  );

  const flatText = Array.isArray(liveContent) ? liveContent.join('\n') : liveContent;

  const handleCopy = () => {
    navigator.clipboard.writeText(flatText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = () => {
    if (locked) return;
    setEditValue(flatText);
    setEditing(true);
  };

  const handleSaveEdit = () => {
    const newContent = Array.isArray(card.content)
      ? editValue.split('\n').filter(Boolean)
      : editValue;
    setLiveContent(newContent);
    onSave(card.id, newContent);
    setEditing(false);
  };

  const handleRegenerate = async () => {
    if (locked) return;
    setRegenerating(true);
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 700));
    // In production: call aiProvider and update content
    setRegenerating(false);
  };

  const renderContent = (raw: string | string[]) => {
    const lines = Array.isArray(raw) ? raw : raw.split('\n');
    return lines.map((line, i) => {
      if (!line.trim()) return <div key={i} style={{ height: '6px' }} />;
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={i} style={{ fontWeight: 700, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: card.color, marginBottom: '5px', marginTop: i > 0 ? '10px' : 0 }}>
            {line.replace(/\*\*/g, '')}
          </p>
        );
      }
      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <p key={i} style={{ fontSize: '13px', lineHeight: 1.65, color: 'var(--text-primary)', paddingLeft: '14px', position: 'relative', marginBottom: '3px' }}>
            <span style={{ position: 'absolute', left: 0, color: card.color }}>›</span>
            {line.replace(/^[•\-] /, '')}
          </p>
        );
      }
      return (
        <p key={i} style={{ fontSize: '13px', lineHeight: 1.7, color: 'var(--text-primary)', marginBottom: '3px' }}>
          {line}
        </p>
      );
    });
  };

  return (
    <div
      className="command-card-tile"
      style={{
        gridColumn: card.wide ? 'span 2' : 'span 1',
        background: 'var(--bg-card)',
        border: `1px solid ${locked ? card.color + '60' : 'var(--border)'}`,
        borderRadius: '14px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        opacity: regenerating ? 0.65 : 1,
        boxShadow: locked
          ? `0 0 0 2px ${card.color}20, 0 4px 16px rgba(0,0,0,0.06)`
          : '0 2px 8px rgba(0,0,0,0.035)',
      }}
    >
      {/* Card Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '13px 16px 11px',
          borderBottom: '1px solid var(--border)',
          background: `linear-gradient(120deg, ${card.color}09 0%, transparent 60%)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '30px', height: '30px', borderRadius: '8px',
              background: `${card.color}14`, border: `1px solid ${card.color}28`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: card.color, flexShrink: 0,
            }}
          >
            {card.icon}
          </div>
          <div>
            <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '1px' }}>
              {card.section}
            </p>
            <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {card.label}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {locked && (
            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: '100px', background: `${card.color}14`, color: card.color, border: `1px solid ${card.color}35`, fontFamily: 'var(--font-mono)' }}>
              LOCKED
            </span>
          )}
          {regenerating && (
            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: '100px', background: 'rgba(100,180,255,0.1)', color: '#4BA8F0', border: '1px solid rgba(100,180,255,0.28)', fontFamily: 'var(--font-mono)' }}>
              ↺ GENERATING
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: '15px 16px', flex: 1 }}>
        {editing ? (
          <div>
            <textarea
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              style={{
                width: '100%', minHeight: '110px', fontSize: '13px', lineHeight: 1.7,
                color: 'var(--text-primary)', background: 'var(--bg)',
                border: `1.5px solid ${card.color}`, borderRadius: '8px',
                padding: '10px 12px', fontFamily: 'var(--font-sans)', resize: 'vertical', outline: 'none',
              }}
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <button onClick={handleSaveEdit} style={{ padding: '6px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: 600, background: card.color, color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <CornerDownRight size={11} /> Save
              </button>
              <button onClick={() => setEditing(false)} style={{ padding: '6px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: 500, background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <X size={11} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>{renderContent(liveContent)}</div>
        )}
      </div>

      {/* Action Bar */}
      {!editing && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 12px', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.015)', flexWrap: 'wrap' }}>
          <ActionBtn icon={copied ? <Check size={11} /> : <Copy size={11} />} label={copied ? 'Copied!' : 'Copy'} onClick={handleCopy} active={copied} activeColor="#16A34A" />
          <ActionBtn icon={<Pencil size={11} />} label="Edit" onClick={handleEdit} disabled={locked} />
          <ActionBtn icon={<RefreshCw size={11} style={{ animation: regenerating ? 'spin-slow 1.2s linear infinite' : 'none' }} />} label="Regenerate" onClick={handleRegenerate} disabled={locked || regenerating} />
          <ActionBtn icon={locked ? <Unlock size={11} /> : <Lock size={11} />} label={locked ? 'Unlock' : 'Lock'} onClick={() => setLocked(l => !l)} active={locked} activeColor={card.color} style={{ marginLeft: 'auto' }} />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Status Dot
// ─────────────────────────────────────────────────────────────────────────────
function StatusDot({ active, label }: { active: boolean; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
      <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: active ? '#22C55E' : '#52525B', boxShadow: active ? '0 0 5px #22C55E88' : 'none' }} />
      <span style={{ fontSize: '11px', color: active ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>{label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Export Button
// ─────────────────────────────────────────────────────────────────────────────
function ExportBtn({ icon, label, onClick, active }: { icon: React.ReactNode; label: string; onClick: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '8px 16px', borderRadius: '100px',
        border: `1px solid ${active ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.12)'}`,
        background: active ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)',
        color: active ? '#22C55E' : 'rgba(255,255,255,0.7)',
        fontSize: '12px', fontWeight: 500, cursor: 'pointer',
        transition: 'all 0.2s ease', fontFamily: 'var(--font-sans)',
      }}
    >
      {icon}{label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main LaunchCommandCenter
// ─────────────────────────────────────────────────────────────────────────────

export default function LaunchCommandCenter() {
  const { project } = useStore();
  const { brandSystem: system, brandDNA: dna, launchKit, visualDNA } = project;
  const [overrides, setOverrides] = useState<Record<string, string | string[]>>({});
  const [exportCopied, setExportCopied] = useState(false);

  if (!system || !dna || !launchKit) return null;

  const getKitItem = (itemId: string) =>
    launchKit.items.find(i => i.id === itemId)?.content ?? '';

  const handleCardSave = (id: string, newContent: string | string[]) => {
    setOverrides(prev => ({ ...prev, [id]: newContent }));
  };

  // ── Card definitions ───────────────────────────────────────────────────────
  const cards: CommandCard[] = [
    // IDENTITY
    {
      id: 'brand-name',
      section: 'Brand Identity',
      label: 'Brand Name',
      content: overrides['brand-name'] ?? system.brandName,
      icon: <Zap size={14} />,
      color: '#D9531E',
    },
    {
      id: 'tagline',
      section: 'Brand Identity',
      label: 'Tagline',
      content: overrides['tagline'] ?? system.tagline,
      icon: <MessageSquare size={14} />,
      color: '#D9531E',
    },
    {
      id: 'brand-promise',
      section: 'Brand Identity',
      label: 'One-Line Pitch',
      sublabel: 'Brand Promise',
      content: overrides['brand-promise'] ?? system.brandPromise,
      icon: <CornerDownRight size={14} />,
      color: '#7C3AED',
      wide: true,
    },
    // STRATEGY
    {
      id: 'positioning',
      section: 'Strategy',
      label: 'Positioning Statement',
      content: overrides['positioning'] ?? system.positioningStatement,
      icon: <Globe size={14} />,
      color: '#0EA5E9',
      wide: true,
    },
    // CHARACTER
    {
      id: 'personality',
      section: 'Brand Character',
      label: 'Brand Personality',
      content: overrides['personality'] ?? system.personality,
      icon: <Zap size={14} />,
      color: '#F59E0B',
    },
    {
      id: 'voice',
      section: 'Brand Character',
      label: 'Brand Voice',
      content: overrides['voice'] ?? [
        `**We sound like:** ${system.voice.join(' · ')}`,
        '',
        '**DO:**',
        ...system.doExamples.map(d => `• ${d}`),
        '',
        "**DON'T:**",
        ...system.dontExamples.map(d => `• ${d}`),
      ],
      icon: <MessageSquare size={14} />,
      color: '#F59E0B',
    },
    // VISUAL
    {
      id: 'visual-direction',
      section: 'Visual Identity',
      label: 'Visual Direction',
      content: overrides['visual-direction'] ?? [
        `**Color:** ${system.visualDirection.color}`,
        `**Typography:** ${system.visualDirection.typography}`,
        `**Imagery:** ${system.visualDirection.imagery}`,
        ...(visualDNA ? [
          '',
          `**Primary:** ${visualDNA.colors.primary}`,
          `**Secondary:** ${visualDNA.colors.secondary}`,
          `**Accent:** ${visualDNA.colors.accent}`,
          `**Logo Direction:** ${visualDNA.logoDirection}`,
          `**UI Style:** ${visualDNA.uiStyle}`,
        ] : []),
      ],
      icon: <Palette size={14} />,
      color: '#EC4899',
      wide: true,
    },
    // LAUNCH COPY
    {
      id: 'hero',
      section: 'Launch Copy',
      label: 'Landing Headline',
      sublabel: 'Homepage hero',
      content: overrides['hero'] ?? (getKitItem('hero') || `**${system.tagline}**\n\n${dna.valueProposition}`),
      icon: <Megaphone size={14} />,
      color: '#10B981',
      wide: true,
    },
    {
      id: 'elevator',
      section: 'Launch Copy',
      label: 'Elevator Pitch',
      sublabel: '30-second version',
      content: overrides['elevator'] ?? getKitItem('elevator'),
      icon: <Megaphone size={14} />,
      color: '#10B981',
    },
    {
      id: 'bio-short',
      section: 'Launch Copy',
      label: 'Short Bio',
      sublabel: '1 sentence',
      content: overrides['bio-short'] ?? getKitItem('bio-short'),
      icon: <FileText size={14} />,
      color: '#10B981',
    },
    // SOCIAL LAUNCH
    {
      id: 'launch-post',
      section: 'Social Launch',
      label: 'Launch Announcement',
      sublabel: 'Product Hunt / Twitter',
      content: overrides['launch-post'] ?? getKitItem('launch-post'),
      icon: <Share2 size={14} />,
      color: '#6366F1',
      wide: true,
    },
    {
      id: 'bio-social',
      section: 'Social Launch',
      label: 'Social Bio',
      sublabel: 'Instagram / Twitter / LinkedIn',
      content: overrides['bio-social'] ?? getKitItem('bio-social'),
      icon: <Globe size={14} />,
      color: '#6366F1',
    },
    {
      id: 'sample-post',
      section: 'Content Examples',
      label: 'Sample Social Post',
      sublabel: 'Evergreen',
      content: overrides['sample-post'] ?? getKitItem('sample-post'),
      icon: <Share2 size={14} />,
      color: '#A855F7',
    },
    {
      id: 'voice-guide',
      section: 'Team Resources',
      label: 'Brand Voice Guide',
      sublabel: 'For writers & team',
      content: overrides['voice-guide'] ?? getKitItem('voice-guide'),
      icon: <FileText size={14} />,
      color: '#64748B',
      wide: true,
    },
  ];

  // ── Export ─────────────────────────────────────────────────────────────────
  const handleCopyAll = () => {
    let md = `# BRAND COMMAND CENTER: ${system.brandName}\n\n`;
    md += `## Launch Thesis\n${launchKit.thesis}\n\n`;
    cards.forEach(card => {
      const content = overrides[card.id] ?? card.content;
      const flat = Array.isArray(content) ? content.join('\n') : content;
      md += `### ${card.label} (${card.section})\n${flat}\n\n`;
    });
    navigator.clipboard.writeText(md);
    setExportCopied(true);
    setTimeout(() => setExportCopied(false), 2000);
  };

  const handleExportJSON = () => {
    const data: Record<string, unknown> = { brand: system.brandName, thesis: launchKit.thesis };
    cards.forEach(card => { data[card.id] = overrides[card.id] ?? card.content; });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${system.brandName.toLowerCase().replace(/\s+/g, '-')}-command-center.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Group by section ───────────────────────────────────────────────────────
  const sectionOrder = [
    'Brand Identity', 'Strategy', 'Brand Character',
    'Visual Identity', 'Launch Copy', 'Social Launch',
    'Content Examples', 'Team Resources',
  ];
  const grouped = sectionOrder.map(section => ({
    section,
    cards: cards.filter(c => c.section === section),
  })).filter(g => g.cards.length > 0);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="animate-fade-in" style={{ paddingBottom: '80px' }}>

      {/* ══════════════════════════════════════════════════════════════════
          COMMAND CENTER HEADER — dark mission control panel
      ══════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          background: 'var(--bg-dark)',
          borderRadius: '16px',
          padding: '28px 32px',
          marginBottom: '28px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative grid overlay */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.035, backgroundImage: 'repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 48px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 48px)', pointerEvents: 'none' }} />
        {/* Accent radial glow */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle,rgba(217,83,30,0.16) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            {/* Left: Brand info */}
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  / 09 / LAUNCH COMMAND CENTER
                </span>
                <div style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.15)' }} />
                <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                </span>
              </div>

              <h1 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.03em', color: '#FFFFFF', marginBottom: '8px' }}>
                {system.brandName}
              </h1>
              <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', marginBottom: '14px', letterSpacing: '-0.01em' }}>
                "{system.tagline}"
              </p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.38)', maxWidth: '480px', lineHeight: 1.65, fontStyle: 'normal' }}>
                {launchKit.thesis}
              </p>
            </div>

            {/* Right: Status panel */}
            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '18px 22px',
                minWidth: '190px',
                flexShrink: 0,
              }}
            >
              <p style={{ fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)', marginBottom: '14px' }}>
                SYSTEM STATUS
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <StatusDot active label="BRAND DNA · LOCKED" />
                <StatusDot active label="BRAND SYSTEM · LIVE" />
                <StatusDot active={launchKit.status === 'complete'} label="LAUNCH KIT · READY" />
                <StatusDot active={!!visualDNA} label={visualDNA ? 'VISUAL DNA · SYNCED' : 'VISUAL DNA · PENDING'} />
                <StatusDot active={project.brandDnaLocked} label={project.brandDnaLocked ? 'GUARDIAN · ACTIVE' : 'GUARDIAN · STANDBY'} />
              </div>
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <p style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                  MODULES
                </p>
                <p style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {cards.length}
                </p>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                  LOADED
                </p>
              </div>
            </div>
          </div>

          {/* ── Export command bar ─────────────────────────────────────── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', fontFamily: 'var(--font-mono)', marginRight: '4px' }}>
              EXPORT ›
            </span>
            <ExportBtn icon={exportCopied ? <Check size={12} /> : <FileText size={12} />} label={exportCopied ? 'Copied!' : 'Copy Markdown'} onClick={handleCopyAll} active={exportCopied} />
            <ExportBtn icon={<FileJson size={12} />} label="Export JSON" onClick={handleExportJSON} />
            <ExportBtn icon={<Download size={12} />} label="Download PDF" onClick={() => window.print()} />
            <ExportBtn icon={<Share2 size={12} />} label="Share Link" onClick={() => { navigator.clipboard.writeText(`https://brandmind.app/share/${project.id}`); alert('Share link copied!'); }} />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION GROUPS
      ══════════════════════════════════════════════════════════════════ */}
      {grouped.map(({ section, cards: sectionCards }) => (
        <div key={section} style={{ marginBottom: '32px' }}>
          {/* Section divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{ height: '1px', width: '20px', background: 'var(--border)' }} />
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
              {section}
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
              {sectionCards.length} MODULE{sectionCards.length !== 1 ? 'S' : ''}
            </span>
          </div>

          {/* Cards grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
            }}
          >
            {sectionCards.map(card => (
              <CommandCardTile
                key={card.id}
                card={card}
                onSave={handleCardSave}
              />
            ))}
          </div>
        </div>
      ))}

      {/* ══════════════════════════════════════════════════════════════════
          MISSION CONFIRMED footer
      ══════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          padding: '24px 28px',
          background: 'var(--accent-light)',
          border: '1px solid var(--accent)',
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>
            MISSION CONFIRMED
          </p>
          <p style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4, maxWidth: '520px' }}>
            {launchKit.thesis}
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.6 }}>
            All {cards.length} brand modules are loaded. Lock what's final. Edit what needs work. Ship when ready.
          </p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>BRAND VERSION</p>
          <p style={{ fontSize: '32px', fontWeight: 900, color: 'var(--accent)', letterSpacing: '-0.03em', lineHeight: 1 }}>v1.0</p>
          <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>{system.brandName.toUpperCase()}</p>
        </div>
      </div>

      {/* ── Inline styles ────────────────────────────────────────────────── */}
      <style>{`
        .command-card-tile {
          transition: transform 0.2s ease, box-shadow 0.2s ease !important;
        }
        .command-card-tile:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 28px rgba(0,0,0,0.09) !important;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media print {
          .command-card-tile button { display: none !important; }
          body { background: white !important; color: black !important; }
        }
      `}</style>
    </div>
  );
}
