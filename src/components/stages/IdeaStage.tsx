'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import type { IdeaInput, BrandAnalyzerResult } from '@/lib/types';
import { ArrowRight, Zap, FileText, PlusCircle, Sparkles, Layers } from 'lucide-react';
import ExistingBrandAnalyzer from '@/components/ExistingBrandAnalyzer';
import AsyncProgressState from '@/components/AsyncProgressState';
import { toast } from '@/lib/toast';

const TEMPLATES: Array<{ name: string; icon: string; data: IdeaInput }> = [
  {
    name: 'Campus Matcher',
    icon: '🎓',
    data: {
      idea: 'An app that helps college students find teammates for hackathons, side projects, and startup ideas',
      audience: "College students who want to build things but don't have a reliable crew",
      industry: 'EdTech / Community',
      problem: 'Students have to stitch together group chats, Discord servers, and random campus clubs, making high-intent teaming feel accidental',
      alternatives: 'Discord, LinkedIn, random campus events',
      motivation: 'I was at a hackathon alone and watched 4-person teams build things I could build if I had the right crew',
      tone: 'Direct, energized, and human — not corporate',
    },
  },
  {
    name: 'DevSecOps Vault',
    icon: '🛡️',
    data: {
      idea: 'Automated secret rotation and security posture verification for Kubernetes clusters',
      audience: 'Platform engineers and DevSecOps leads managing multi-cloud infra',
      industry: 'Developer Tools / CyberSecurity',
      problem: 'Engineers hardcode tokens in microservice configs because enterprise IAM setups take weeks of red tape',
      alternatives: 'HashiCorp Vault, AWS Secrets Manager, manual audits',
      motivation: 'Witnessed a production breach due to a leaked staging API key in a GitHub commit',
      tone: 'Precision-first, technical, authoritative',
    },
  },
  {
    name: 'Creator Financials',
    icon: '💳',
    data: {
      idea: 'Instant invoice factoring and revenue-share banking designed for independent YouTube & Twitch creators',
      audience: 'Full-time digital creators with unpredictable monthly brand-deal payouts',
      industry: 'FinTech / Creator Economy',
      problem: 'Traditional banks treat creators as high-risk unemployed workers despite 6-figure recurring sponsorship backlogs',
      alternatives: 'Traditional business credit cards, PayPal working capital',
      motivation: 'Top creators waiting 90 days for Net-60 brand deals while needing to pay editors on day 1',
      tone: 'Empowering, transparent, hyper-modern',
    },
  },
];

export default function IdeaStage() {
  const { setIdea, markStageComplete } = useStore();
  const [activeTab, setActiveTab] = useState<'new' | 'analyze'>('new');
  const [form, setForm] = useState<IdeaInput>({
    idea: '',
    audience: '',
    industry: '',
    problem: '',
    alternatives: '',
    motivation: '',
    tone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof IdeaInput, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const applyTemplate = (tmpl: (typeof TEMPLATES)[0]) => {
    setForm(tmpl.data);
    toast.info(`Loaded template: "${tmpl.name}"`, 'Template Applied');
  };

  const executePipeline = async (inputData: IdeaInput) => {
    setError(null);
    setLoading(true);
    try {
      setIdea(inputData);
      const bs = await aiProvider.detectBlindSpots(inputData);
      useStore.getState().setBlindSpots(bs);
      toast.success('Identified assumptions & market blind spots.', 'Analysis Ready');
      markStageComplete('idea');
    } catch (e: any) {
      console.error(e);
      setError(e?.message || 'Failed to detect blind spots. Please check your network and try again.');
      toast.error('Could not complete blind spot analysis.', 'Analysis Interrupted');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.idea.trim() || !form.audience.trim()) {
      setError('Please fill in at least the "What are you building?" and "Who is it for?" fields.');
      return;
    }
    await executePipeline(form);
  };

  const handleAdoptAnalyzed = async (analyzed: BrandAnalyzerResult) => {
    const generatedIdea: IdeaInput = {
      idea: analyzed.extractedPositioning,
      audience: analyzed.impliedAudience,
      industry: 'Technology / Platform',
      problem: analyzed.coreDna.coreProblem,
      alternatives: 'Traditional legacy platforms & fragmented agencies',
      tone: analyzed.extractedTone.join(', '),
    };
    await executePipeline(generatedIdea);
  };

  const steps = [
    { label: 'Ingesting Brand Concept', detail: 'Parsing core value proposition and user friction' },
    { label: 'Scanning Industry Blind Spots', detail: 'Cross-referencing failure vectors and generic tropes' },
    { label: 'Formulating Validation Questions', detail: 'Structuring strategic challenges for review' },
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '920px' }}>
      {/* Stage header */}
      <div style={{ marginBottom: '8px' }}>
        <span
          style={{
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent)',
            letterSpacing: '0.05em',
          }}
        >
          / 01 / IDEA & BRAND INTAKE
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '12px',
          gap: '16px',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
          }}
        >
          Start with the raw concept.
        </h1>
        <span className="badge badge-accent" style={{ flexShrink: 0, marginTop: '8px' }}>
          Context Seed
        </span>
      </div>

      <p
        style={{
          fontSize: '15px',
          color: 'var(--text-secondary)',
          marginBottom: '24px',
          lineHeight: 1.6,
        }}
      >
        Build a brand from scratch with structured intuition, or deconstruct live marketing copy using NLP extraction.
      </p>

      {/* Mode Switcher Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('new')}
          style={{
            padding: '8px 18px',
            borderRadius: '100px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: activeTab === 'new' ? 'var(--text-primary)' : 'var(--bg-card)',
            color: activeTab === 'new' ? 'var(--bg)' : 'var(--text-secondary)',
            border: `1px solid ${activeTab === 'new' ? 'var(--text-primary)' : 'var(--border)'}`,
            transition: 'all 0.15s ease',
          }}
        >
          <PlusCircle size={15} /> New Brand Concept
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('analyze')}
          style={{
            padding: '8px 18px',
            borderRadius: '100px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: activeTab === 'analyze' ? 'var(--text-primary)' : 'var(--bg-card)',
            color: activeTab === 'analyze' ? 'var(--bg)' : 'var(--text-secondary)',
            border: `1px solid ${activeTab === 'analyze' ? 'var(--text-primary)' : 'var(--border)'}`,
            transition: 'all 0.15s ease',
          }}
        >
          <FileText size={15} /> Analyze Existing Live Brand Copy
        </button>
      </div>

      {activeTab === 'analyze' ? (
        <ExistingBrandAnalyzer onAdoptDna={handleAdoptAnalyzed} />
      ) : (
        <>
          {/* Quick Concept Templates */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.02)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '14px 18px',
              marginBottom: '28px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Layers size={13} /> Quick Archetype Presets:
              </span>
              <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 600 }}>
                Click to autofill structured examples
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.name}
                  type="button"
                  onClick={() => applyTemplate(tmpl)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.background = 'var(--accent-light)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.background = 'var(--bg-card)';
                  }}
                >
                  <span>{tmpl.icon}</span>
                  <span>{tmpl.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Async Loading & Error State */}
          <AsyncProgressState
            isLoading={loading}
            error={error}
            onRetry={handleSubmit}
            steps={steps}
            title="Scanning Brand Hypotheses for Blind Spots"
          />

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {/* Main idea */}
            <div>
              <label
                htmlFor="idea-input"
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  marginBottom: '8px',
                  color: 'var(--text-primary)',
                }}
              >
                What are you building?{' '}
                <span style={{ color: 'var(--accent)' }} aria-hidden="true">
                  *
                </span>
                <span className="sr-only">(required)</span>
              </label>
              <textarea
                id="idea-input"
                className="input-field"
                rows={4}
                placeholder="An app that helps..."
                value={form.idea}
                onChange={(e) => handleChange('idea', e.target.value)}
                style={{ resize: 'vertical' }}
                aria-required="true"
                aria-describedby="idea-hint"
              />
              <p id="idea-hint" style={{ fontSize: '12px', color: 'var(--accent)', marginTop: '6px' }}>
                Describe the behavior change and human outcome, not just a technical feature list.
              </p>
            </div>

            {/* Two columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label
                  htmlFor="audience-input"
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 600,
                    marginBottom: '8px',
                  }}
                >
                  Who is it for?{' '}
                  <span style={{ color: 'var(--accent)' }} aria-hidden="true">
                    *
                  </span>
                  <span className="sr-only">(required)</span>
                </label>
                <input
                  id="audience-input"
                  className="input-field"
                  type="text"
                  placeholder="People who..."
                  value={form.audience}
                  onChange={(e) => handleChange('audience', e.target.value)}
                  aria-required="true"
                />
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 600,
                    marginBottom: '8px',
                  }}
                >
                  Industry / category
                </label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="Community, fintech, edtech..."
                  value={form.industry}
                  onChange={(e) => handleChange('industry', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  marginBottom: '8px',
                }}
              >
                What problem does it solve?
              </label>
              <textarea
                className="input-field"
                rows={3}
                placeholder="Right now, people have to stitch together..."
                value={form.problem}
                onChange={(e) => handleChange('problem', e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 600,
                    marginBottom: '8px',
                  }}
                >
                  Current alternatives
                </label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="Discord, spreadsheets, manual agencies..."
                  value={form.alternatives}
                  onChange={(e) => handleChange('alternatives', e.target.value)}
                />
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 600,
                    marginBottom: '8px',
                  }}
                >
                  Desired tone / personality
                </label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="Direct, warm, precision-first, playful..."
                  value={form.tone}
                  onChange={(e) => handleChange('tone', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  marginBottom: '8px',
                }}
              >
                What motivated you to build this?
              </label>
              <textarea
                className="input-field"
                rows={2}
                placeholder="The moment I realized this needed to exist was..."
                value={form.motivation}
                onChange={(e) => handleChange('motivation', e.target.value)}
              />
            </div>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginTop: '8px',
              }}
            >
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  minWidth: '220px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                }}
              >
                {loading ? (
                  <span>Detecting Blind Spots...</span>
                ) : (
                  <>
                    Analyze for Blind Spots
                    <ArrowRight size={15} />
                  </>
                )}
              </button>

              <button
                className="btn-outline"
                onClick={() => {
                  applyTemplate(TEMPLATES[0]);
                  executePipeline(TEMPLATES[0].data);
                }}
                disabled={loading}
                style={{
                  gap: '6px',
                  color: 'var(--accent)',
                  borderColor: 'rgba(217, 83, 30, 0.4)',
                }}
                title="Autofill preset and immediately run analysis"
              >
                <Zap size={14} /> Quick Demo & Run
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
