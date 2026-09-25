'use client';

import { useStore } from '@/lib/store';
import { aiProvider } from '@/lib/ai-provider';
import { useState } from 'react';
import { ArrowRight, Globe2, Anchor, Shuffle, Save, AlertTriangle } from 'lucide-react';

export default function CultureAdaptationStage() {
  const { project, addCultureAdaptation, saveCultureAdaptation, markStageComplete } = useStore();
  const [loading, setLoading] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState('India');
  const [customMarket, setCustomMarket] = useState('');

  const { brandDNA, brandSystem, cultureAdaptations = [] } = project;
  if (!brandDNA || !brandSystem) return null;

  const currentAdaptation = cultureAdaptations.find(a => a.status === 'pending');

  const handleRun = async () => {
    const market = selectedMarket === 'Custom' ? customMarket : selectedMarket;
    if (!market.trim()) return;
    
    setLoading(true);
    try {
      const result = await aiProvider.generateCultureAdaptation(brandSystem, brandDNA, market);
      addCultureAdaptation(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    markStageComplete('cultureAdaptation');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.05em' }}>
          / 07j / CULTURE ADAPTATION LAB
        </span>
      </div>

      <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '16px' }}>
        Adapt globally. Preserve the core.
      </h1>

      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6, maxWidth: '700px' }}>
        Explore how your brand expression might shift in different markets. We preserve your core value proposition while adapting tone, messaging, and visual associations. 
        <em>Note: AI predictions should always be validated locally.</em>
      </p>

      {!currentAdaptation ? (
        <div className="stage-card" style={{ marginBottom: '40px', maxWidth: '500px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
            Select Market
          </label>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <select
              className="input-field"
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              style={{ flex: 1, cursor: 'pointer' }}
            >
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="Japan">Japan</option>
              <option value="Germany">Germany</option>
              <option value="UK">UK</option>
              <option value="Custom">Custom (Type below)</option>
            </select>
          </div>
          
          {selectedMarket === 'Custom' && (
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Brazil, Gen-Z TikTok..."
              value={customMarket}
              onChange={(e) => setCustomMarket(e.target.value)}
              style={{ marginBottom: '16px' }}
            />
          )}

          <button className="btn-primary" onClick={handleRun} disabled={loading || (selectedMarket === 'Custom' && !customMarket.trim())}>
            {loading ? (
              <>
                <span className="animate-spin-slow" style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                Adapting Brand...
              </>
            ) : (
              <>
                <Globe2 size={16} /> Generate Adaptation
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="animate-slide-in" style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Local Expression: <span style={{ color: 'var(--accent)' }}>{currentAdaptation.market}</span></h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '24px' }}>
            {/* Core Preserved */}
            <div className="stage-card" style={{ background: 'var(--bg-card)', borderColor: '#16A34A' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                <Anchor size={14} /> Core Brand (Unchanged)
              </h3>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                {currentAdaptation.corePreserved.map((item, i) => (
                  <li key={i} style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.5 }}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Adapted Elements */}
            <div className="stage-card" style={{ background: 'var(--bg-card)' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                <Shuffle size={14} /> Local Expression (Adapted)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {currentAdaptation.adaptedElements.map((el, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', paddingBottom: '16px', borderBottom: i < currentAdaptation.adaptedElements.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>{el.element}</span>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textDecoration: 'line-through', opacity: 0.7 }}>{el.original}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Adapted For {currentAdaptation.market}</span>
                      <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{el.adapted}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background: '#D9770615', border: '1px solid #D9770630', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#D97706', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <AlertTriangle size={14} /> Why & Considerations
            </h3>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              {currentAdaptation.considerations.map((c, i) => (
                <li key={i} style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '6px', lineHeight: 1.5, fontStyle: 'italic' }}>{c}</li>
              ))}
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-primary" onClick={() => saveCultureAdaptation(currentAdaptation.id)}>
              <Save size={16} /> Save as Variant
            </button>
            <button className="btn-outline" onClick={() => setSelectedMarket('India')}>
              Try Another Market
            </button>
          </div>
        </div>
      )}

      {cultureAdaptations.filter(a => a.status === 'saved').length > 0 && !currentAdaptation && (
         <div style={{ marginBottom: '40px' }}>
           <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Saved Adaptations</h3>
           <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
             {cultureAdaptations.filter(a => a.status === 'saved').map(a => (
               <div key={a.id} className="badge badge-accent" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                 <Globe2 size={12} /> {a.market}
               </div>
             ))}
           </div>
         </div>
      )}

      <div className="divider" />
      
      <button className="btn-primary" onClick={handleComplete}>
        Continue to DNA Lock <ArrowRight size={14} />
      </button>
    </div>
  );
}
