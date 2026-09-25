'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import type { IdeaInput } from '@/lib/types';
import { ArrowRight, Zap } from 'lucide-react';

const DEMO_DATA: IdeaInput = {
  idea: "An app that helps college students find teammates for hackathons, side projects, and startup ideas",
  audience: "College students who want to build things but don't have a reliable crew",
  industry: "EdTech / Community",
  problem: "Students have to stitch together group chats, Discord servers, campus clubs, and asking whoever is nearby — which makes a high-intent moment feel accidental",
  alternatives: "Discord, LinkedIn, random campus events",
  motivation: "I was at a hackathon alone and watched teams with 4 people build things I knew I could build if I had the right crew",
  tone: "Direct and human, not corporate",
};

export default function IdeaStage() {
  const { setIdea, markStageComplete, setBrandDNA } = useStore();
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
  const [error, setError] = useState('');

  const handleChange = (field: keyof IdeaInput, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const loadDemo = () => {
    setForm(DEMO_DATA);
  };

  const handleSubmit = async () => {
    if (!form.idea.trim() || !form.audience.trim()) {
      setError('Please fill in at least the idea and audience fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      setIdea(form);
      const bs = await aiProvider.detectBlindSpots(form);
      useStore.getState().setBlindSpots(bs);
      markStageComplete('idea');
    } catch (e) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
      {/* Stage header */}
      <div style={{ marginBottom: '8px' }}>
        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.05em' }}>
          / 01 / IDEA INTAKE
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px', gap: '16px' }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          Start with the rough version.
        </h1>
        <span className="badge badge-accent" style={{ flexShrink: 0, marginTop: '8px' }}>Context Seed</span>
      </div>

      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6 }}>
        No pitch deck polish required. Give the lab enough material to find the tension worth owning.
      </p>

      <div className="divider" />

      {/* Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Main idea */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: 'var(--text-primary)' }}>
            What are you building? <span style={{ color: 'var(--accent)' }}>*</span>
          </label>
          <textarea
            className="input-field"
            rows={4}
            placeholder="An app that helps..."
            value={form.idea}
            onChange={e => handleChange('idea', e.target.value)}
            style={{ resize: 'vertical' }}
          />
          <p style={{ fontSize: '12px', color: 'var(--accent)', marginTop: '6px' }}>
            Describe the behavior change, not the feature list.
          </p>
        </div>

        {/* Two columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
              Who is it for? <span style={{ color: 'var(--accent)' }}>*</span>
            </label>
            <input
              className="input-field"
              type="text"
              placeholder="People who..."
              value={form.audience}
              onChange={e => handleChange('audience', e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
              Industry / category
            </label>
            <input
              className="input-field"
              type="text"
              placeholder="Community, fintech, edtech..."
              value={form.industry}
              onChange={e => handleChange('industry', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
            What problem does it solve?
          </label>
          <textarea
            className="input-field"
            rows={3}
            placeholder="Right now, people have to..."
            value={form.problem}
            onChange={e => handleChange('problem', e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
              Current alternatives
            </label>
            <input
              className="input-field"
              type="text"
              placeholder="Discord, LinkedIn, spreadsheets..."
              value={form.alternatives}
              onChange={e => handleChange('alternatives', e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
              Tone / personality
            </label>
            <input
              className="input-field"
              type="text"
              placeholder="Direct, warm, technical..."
              value={form.tone}
              onChange={e => handleChange('tone', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
            What motivated you to build this?
          </label>
          <textarea
            className="input-field"
            rows={2}
            placeholder="The moment I realized this needed to exist was..."
            value={form.motivation}
            onChange={e => handleChange('motivation', e.target.value)}
          />
        </div>

        {error && (
          <p style={{ fontSize: '13px', color: '#DC2626', padding: '10px 14px', background: '#FEF2F2', borderRadius: '8px', border: '1px solid #FECACA' }}>
            {error}
          </p>
        )}

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
            style={{ minWidth: '180px' }}
          >
            {loading ? (
              <>
                <span className="animate-spin-slow" style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                Analyzing assumptions...
              </>
            ) : (
              <>
                Analyze for Blind Spots
                <ArrowRight size={14} />
              </>
            )}
          </button>

          <button
            className="btn-outline"
            onClick={loadDemo}
            disabled={loading}
            style={{ gap: '6px' }}
          >
            <Zap size={13} />
            Load demo
          </button>
        </div>
      </div>
    </div>
  );
}
