'use client';

import { useStore } from '@/lib/store';
import { useState } from 'react';
import type { LaunchKitItem } from '@/lib/types';
import { Copy, Check, FileJson, FileText, Download, Share2, ArrowUpRight } from 'lucide-react';

function KitCard({ item }: { item: LaunchKitItem }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format markdown-ish content
  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} style={{ fontWeight: 700, marginBottom: '4px' }}>{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.startsWith('• ')) {
        return <p key={i} style={{ paddingLeft: '12px', marginBottom: '4px' }}>{line}</p>;
      }
      if (line.startsWith('[') && line.includes(']')) {
        return null; // Skip placeholder buttons
      }
      if (line === '') return <br key={i} />;
      return <p key={i} style={{ marginBottom: '4px', lineHeight: 1.6 }}>{line}</p>;
    });
  };

  return (
    <div className="stage-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>{item.title}</h3>
            <ArrowUpRight size={12} color="var(--text-muted)" />
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {item.channel}
          </p>
        </div>
        <button
          onClick={handleCopy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '5px 10px',
            background: copied ? 'var(--accent-light)' : 'var(--bg)',
            border: `1px solid ${copied ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: '6px',
            fontSize: '11px',
            cursor: 'pointer',
            color: copied ? 'var(--accent)' : 'var(--text-secondary)',
            transition: 'all 0.2s ease',
          }}
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.7, background: 'var(--bg)', padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
        {renderContent(item.content)}
      </div>
    </div>
  );
}

export default function LaunchStage() {
  const { project } = useStore();
  const launchKit = project.launchKit;
  const brandDNA = project.brandDNA;
  const brandSystem = project.brandSystem;

  if (!launchKit || !brandSystem || !brandDNA) return null;

  const handleCopyAll = () => {
    let md = `# BRAND KIT: ${brandSystem.brandName}\n\n`;
    md += `## BRAND OVERVIEW\n`;
    md += `**Problem:** ${brandDNA.coreProblem}\n\n`;
    md += `**Audience:** ${brandDNA.targetUser}\n\n`;
    md += `**Positioning:** ${brandSystem.positioningStatement}\n\n`;
    md += `**Value Proposition:** ${brandDNA.differentiator}\n\n`;
    
    md += `## BRAND IDENTITY\n`;
    md += `**Name:** ${brandSystem.brandName}\n\n`;
    md += `**Tagline:** ${brandSystem.tagline}\n\n`;
    md += `**One-line Pitch:** ${brandSystem.brandPromise}\n\n`;
    md += `**Personality:** ${brandSystem.personality.join(', ')}\n\n`;
    md += `**Principles:**\n`;
    brandSystem.principles.forEach(p => md += `- ${p}\n`);
    md += `\n**Voice:** ${brandSystem.voice.join(', ')}\n\n`;
    md += `**Words to Use:** ${brandSystem.doExamples.join(', ')}\n\n`;
    md += `**Words to Avoid:** ${brandSystem.dontExamples.join(', ')}\n\n`;
    
    if (project.visualDNA) {
      md += `## VISUAL DNA\n`;
      md += `**Colors:** Primary: ${project.visualDNA.colors.primary} | Secondary: ${project.visualDNA.colors.secondary} | Accent: ${project.visualDNA.colors.accent}\n\n`;
      md += `**Typography:** ${project.visualDNA.typography}\n\n`;
      md += `**Logo Direction:** ${project.visualDNA.logoDirection}\n\n`;
      md += `**Imagery Direction:** ${project.visualDNA.imagery}\n\n`;
    }

    md += `## LAUNCH KIT\n`;
    md += `**Thesis:** ${launchKit.thesis}\n\n`;
    launchKit.items.forEach(i => {
      md += `### ${i.title} (${i.channel})\n${i.content}\n\n`;
    });

    navigator.clipboard.writeText(md);
    alert('Brand Kit copied as Markdown!');
  };

  const handleExportJSON = () => {
    const data = {
      overview: {
        problem: brandDNA.coreProblem,
        audience: brandDNA.targetUser,
        positioning: brandSystem.positioningStatement,
        valueProp: brandDNA.differentiator,
      },
      identity: {
        name: brandSystem.brandName,
        tagline: brandSystem.tagline,
        pitch: brandSystem.brandPromise,
        personality: brandSystem.personality,
        principles: brandSystem.principles,
        voice: brandSystem.voice,
        wordsToUse: brandSystem.doExamples,
        wordsToAvoid: brandSystem.dontExamples,
      },
      visuals: project.visualDNA,
      launchContent: launchKit
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${brandSystem.brandName.toLowerCase().replace(/\\s+/g, '-')}-brand-kit.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    window.print(); // Relies on the browser's native PDF generation
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(`https://brandmind.app/share/${project.id}`);
    alert('Share link copied to clipboard!');
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '8px' }}>
        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.05em' }}>
          / 09 / LAUNCH KIT
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px', gap: '16px' }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          Take the system into the world.
        </h1>
        <span className="badge badge-accent" style={{ flexShrink: 0, marginTop: '8px' }}>Ready to Ship</span>
      </div>

      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6, maxWidth: '600px' }}>
        A first set of launch expressions, all held to the same point of view. Use them as working material, not a finish line.
      </p>

      <div className="divider" />

      {/* Thesis */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          background: 'var(--accent-light)',
          border: '1px solid var(--accent)',
          borderRadius: '12px',
          marginBottom: '24px',
          gap: '20px',
        }}
      >
        <div>
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '8px' }}>
            Launch Thesis
          </p>
          <p style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.4, color: 'var(--text-primary)', maxWidth: '600px' }}>
            {launchKit.thesis}
          </p>
        </div>
        <button
          className="btn-outline"
          onClick={() => {}}
          style={{ flexShrink: 0 }}
        >
          Regenerate
        </button>
      </div>

      {/* Kit items grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {launchKit.items.map(item => (
          <KitCard key={item.id} item={item} />
        ))}
      </div>

      {/* Export Options */}
      <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border)' }} className="print-hide">
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Export Brand Kit</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Download the finalized Brand System, DNA, Visuals, and Launch Kit. Internal AI simulation data is excluded.
        </p>
        
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={handleDownloadPDF}>
            <Download size={14} />
            Download PDF
          </button>
          <button className="btn-outline" onClick={handleExportJSON}>
            <FileJson size={14} />
            Export JSON
          </button>
          <button className="btn-outline" onClick={handleCopyAll}>
            <FileText size={14} />
            Copy Markdown
          </button>
          <button className="btn-outline" onClick={handleShareLink}>
            <Share2 size={14} />
            Copy Share Link
          </button>
        </div>
      </div>
    </div>
  );
}

// Add global print styles for PDF generation
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @media print {
      body { background: white; color: black; }
      .print-hide, nav, header, button { display: none !important; }
      .stage-card { border: 1px solid #ccc; box-shadow: none; break-inside: avoid; }
      * { text-shadow: none !important; box-shadow: none !important; }
    }
  `;
  document.head.appendChild(style);
}
