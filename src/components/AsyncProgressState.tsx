'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, RefreshCw, CheckCircle2, Sparkles } from 'lucide-react';

export interface ProgressStep {
  label: string;
  detail?: string;
}

interface AsyncProgressStateProps {
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
  steps?: ProgressStep[];
  currentStepIndex?: number;
  title?: string;
  className?: string;
}

export default function AsyncProgressState({
  isLoading,
  error,
  onRetry,
  steps = [
    { label: 'Initializing AI Engine', detail: 'Connecting to semantic reasoning layer' },
    { label: 'Analyzing Brand Foundation', detail: 'Cross-referencing Brand DNA and Memory' },
    { label: 'Synthesizing Strategic Artifacts', detail: 'Validating against locked constraints' },
  ],
  currentStepIndex = 0,
  title = 'Processing Strategic Intelligence',
  className = '',
}: AsyncProgressStateProps) {
  const [elapsed, setElapsed] = useState(0);
  const [internalStep, setInternalStep] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      setElapsed(0);
      setInternalStep(0);
      timer = setInterval(() => {
        setElapsed((e) => e + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLoading]);

  // If external currentStepIndex is not explicitly updated, advance automatically based on elapsed time
  useEffect(() => {
    if (isLoading && steps.length > 1) {
      const stepDuration = 2; // seconds per step estimate
      const nextIndex = Math.min(Math.floor(elapsed / stepDuration), steps.length - 1);
      setInternalStep(nextIndex);
    }
  }, [elapsed, isLoading, steps.length]);

  const activeIndex = currentStepIndex > 0 ? currentStepIndex : internalStep;
  const progressPercent = Math.min(
    Math.round(((activeIndex + 0.5) / steps.length) * 100),
    95
  );

  if (!isLoading && !error) return null;

  return (
    <div
      className={`animate-fade-in ${className}`}
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${error ? 'rgba(220, 38, 38, 0.4)' : 'rgba(217, 83, 30, 0.3)'}`,
        borderRadius: '16px',
        padding: '28px',
        margin: '20px 0',
        boxShadow: error
          ? '0 4px 20px rgba(220, 38, 38, 0.08)'
          : '0 4px 24px rgba(217, 83, 30, 0.08)',
      }}
    >
      {error ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(220, 38, 38, 0.12)',
                border: '1px solid rgba(220, 38, 38, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#dc2626',
                flexShrink: 0,
              }}
            >
              <AlertCircle size={20} />
            </div>
            <div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#dc2626',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                Operation Interrupted
              </span>
              <h4
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '4px',
                }}
              >
                Unable to complete generation
              </h4>
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                }}
              >
                {error}
              </p>
            </div>
          </div>

          {onRetry && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button
                onClick={onRetry}
                className="btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                <RefreshCw size={14} /> Retry Generation
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(217, 83, 30, 0.12)',
                  border: '1px solid rgba(217, 83, 30, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent)',
                }}
              >
                <Sparkles size={16} className="animate-spin-slow" />
              </div>
              <div>
                <h4
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '2px',
                  }}
                >
                  {title}
                </h4>
                <span
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  Step {activeIndex + 1} of {steps.length} • {elapsed}s elapsed
                </span>
              </div>
            </div>

            <div
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--accent)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {progressPercent}%
            </div>
          </div>

          {/* Progress Bar */}
          <div
            style={{
              width: '100%',
              height: '6px',
              background: 'rgba(255, 255, 255, 0.06)',
              borderRadius: '3px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--accent) 0%, #ff8c42 100%)',
                borderRadius: '3px',
                transition: 'width 0.4s ease-out',
              }}
            />
          </div>

          {/* Step Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {steps.map((step, idx) => {
              const isCurrent = idx === activeIndex;
              const isPassed = idx < activeIndex;

              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: isCurrent ? 'rgba(217, 83, 30, 0.08)' : 'transparent',
                    border: isCurrent
                      ? '1px solid rgba(217, 83, 30, 0.2)'
                      : '1px solid transparent',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: isPassed
                        ? 'rgba(22, 163, 74, 0.15)'
                        : isCurrent
                        ? 'rgba(217, 83, 30, 0.2)'
                        : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${
                        isPassed
                          ? '#16a34a'
                          : isCurrent
                          ? 'var(--accent)'
                          : 'rgba(255, 255, 255, 0.1)'
                      }`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    {isPassed ? (
                      <CheckCircle2 size={12} color="#16a34a" />
                    ) : isCurrent ? (
                      <div
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: 'var(--accent)',
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          fontSize: '10px',
                          color: 'var(--text-muted)',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {idx + 1}
                      </span>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: isCurrent ? 700 : isPassed ? 600 : 500,
                        color: isCurrent
                          ? 'var(--text-primary)'
                          : isPassed
                          ? 'var(--text-secondary)'
                          : 'var(--text-muted)',
                      }}
                    >
                      {step.label}
                    </div>
                    {step.detail && isCurrent && (
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'var(--accent)',
                          marginTop: '2px',
                        }}
                      >
                        {step.detail}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
