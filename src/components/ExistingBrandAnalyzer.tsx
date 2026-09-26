'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import {
  FileText,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Globe,
  Layers,
  Wand2,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import type { BrandAnalyzerResult } from '@/lib/types';
import EvidenceDrilldown from '@/components/EvidenceDrilldown';

interface ExistingBrandAnalyzerProps {
  onAdoptDna: (analyzed: BrandAnalyzerResult) => void;
}

export default function ExistingBrandAnalyzer({ onAdoptDna }: ExistingBrandAnalyzerProps) {
  const { setBrandAnalyzerResult, setIdea, setBrandDNA, markStageComplete } = useStore();
  const [pastedCopy, setPastedCopy] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BrandAnalyzerResult | null>(null);

  const sampleBrandCopy = `BrandMind is the deterministic operating system for brand strategy. We eliminate brand drift and fragmented creative direction by running multi-agent consensus battles on every strategic pivot. Unlike superficial AI copy generators that hallucinate generic marketing fluff, BrandMind maintains an immutable Brand Memory and enforces strict Guardian consistency across all touchpoints. Built for high-growth founders and serious creative directors who care about mathematical positioning precision.`;

  const handleAnalyze = async () => {
    if (!pastedCopy.trim()) return;
    setLoading(true);
    try {
      const res = await aiProvider.analyzeExistingBrand(pastedCopy);
      setResult(res);
      setBrandAnalyzerResult(res);
    } finally {
      setLoading(false);
    }
  };

  const handleAdoptAndEnterPipeline = () => {
    if (!result) return;

    // Populate Idea and initial DNA from analyzed copy
    const populatedIdea = {
      idea: result.extractedPositioning,
      audience: result.impliedAudience,
      industry: 'AI / SaaS / Technology',
      problem: result.coreDna.coreProblem,
      differentiator: result.coreDna.differentiator,
      tone: result.extractedTone.join(', ')
    };

    setIdea(populatedIdea);
    onAdoptDna(result);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Introduction Card */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '24px 32px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 800 }}>
            Existing Brand Analyzer · Real NLP Extraction
          </span>
          <span className="badge badge-accent">PASTED CONTENT ENGINE</span>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
          Analyze and deconstruct your current live brand copy.
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          Paste your homepage copy, pitch deck narrative, or product description. The engine extracts your implied positioning, tone archetypes, and underlying Brand DNA while identifying hidden inconsistencies.
        </p>

        {/* Future crawler hook notice */}
        <div
          style={{
            marginTop: '16px',
            padding: '10px 14px',
            borderRadius: '8px',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: 'var(--text-muted)',
          }}
        >
          <Globe size={14} color="var(--accent)" />
          <span>
            <strong>Architecture note:</strong> Direct web crawler/URL ingestion pipeline is structured for future production API connectors. Current analysis operates on direct verified pasted copy.
          </span>
        </div>
      </div>

      {/* Input Area */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '24px 32px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Paste Brand Content / Website Copy *
          </label>
          <button
            type="button"
            onClick={() => setPastedCopy(sampleBrandCopy)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Sparkles size={12} /> Load Sample Copy
          </button>
        </div>

        <textarea
          rows={6}
          className="input-base"
          style={{ resize: 'vertical', lineHeight: 1.6 }}
          placeholder="Paste your homepage hero copy, about page text, or product value proposition..."
          value={pastedCopy}
          onChange={e => setPastedCopy(e.target.value)}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button
            className="btn-primary"
            onClick={handleAnalyze}
            disabled={loading || !pastedCopy.trim()}
          >
            {loading ? (
              <>
                <span className="animate-spin-slow" style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} />
                Extracting Brand Physics...
              </>
            ) : (
              <>
                <Wand2 size={14} /> Deconstruct & Extract Brand DNA
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results View */}
      {result && (
        <div className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Top Metric Bar */}
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
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Strategic Extraction Quality
              </span>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {result.sourceTextLength} Words Processed · {result.detectedInconsistencies.length} Gaps Flagged
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <EvidenceDrilldown
                score={result.readinessScore}
                label="Copy Readiness"
                category="NLP Content Extraction"
              />
              <button className="btn-primary" onClick={handleAdoptAndEnterPipeline}>
                Adopt Analyzed DNA & Enter Pipeline <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Extracted DNA Attributes Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            
            {/* Extracted Positioning */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>
                Extracted Core Positioning
              </span>
              <p style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600, margin: 0, lineHeight: 1.5 }}>
                {result.extractedPositioning}
              </p>
            </div>

            {/* Implied Audience */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>
                Implied Target Audience
              </span>
              <p style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600, margin: 0, lineHeight: 1.5 }}>
                {result.impliedAudience}
              </p>
            </div>

            {/* Extracted Tone Archetypes */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>
                Tone Archetypes
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {result.extractedTone.map((tone, i) => (
                  <span key={i} className="badge badge-accent">
                    {tone}
                  </span>
                ))}
              </div>
            </div>

            {/* Core Differentiator */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>
                Core Differentiator
              </span>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                {result.coreDna.differentiator}
              </p>
            </div>

          </div>

          {/* Copy Inconsistencies & Recommendations */}
          {result.detectedInconsistencies.length > 0 && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px 32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <AlertTriangle size={16} color="#D97706" />
                <h3 style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)', margin: 0 }}>
                  Detected Strategic Inconsistencies ({result.detectedInconsistencies.length})
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {result.detectedInconsistencies.map((gap, i) => (
                  <div key={i} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {gap.element}
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          padding: '2px 8px',
                          borderRadius: '100px',
                          background: gap.severity === 'high' ? 'rgba(220, 38, 38, 0.1)' : 'rgba(217, 119, 6, 0.1)',
                          color: gap.severity === 'high' ? '#DC2626' : '#D97706',
                        }}
                      >
                        {gap.severity} severity
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                      {gap.observation}
                    </p>
                    <div style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 600 }}>
                      Recommendation: {gap.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
