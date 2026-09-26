'use client';

import React from 'react';
import { useToastStore, ToastMessage } from '@/lib/toast';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const TOAST_ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const TOAST_COLORS = {
  success: {
    bg: 'rgba(22, 163, 74, 0.12)',
    border: 'rgba(22, 163, 74, 0.35)',
    text: '#22c55e',
    icon: '#16a34a',
  },
  error: {
    bg: 'rgba(220, 38, 38, 0.12)',
    border: 'rgba(220, 38, 38, 0.35)',
    text: '#ef4444',
    icon: '#dc2626',
  },
  info: {
    bg: 'rgba(37, 99, 235, 0.12)',
    border: 'rgba(37, 99, 235, 0.35)',
    text: '#3b82f6',
    icon: '#2563eb',
  },
  warning: {
    bg: 'rgba(217, 119, 6, 0.12)',
    border: 'rgba(217, 119, 6, 0.35)',
    text: '#f59e0b',
    icon: '#d97706',
  },
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '420px',
        width: 'calc(100vw - 48px)',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => {
        const Icon = TOAST_ICONS[toast.type] || Info;
        const color = TOAST_COLORS[toast.type] || TOAST_COLORS.info;

        return (
          <div
            key={toast.id}
            role="status"
            className="animate-slide-in"
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '14px 16px',
              background: 'var(--bg-card)',
              backgroundColor: 'rgba(20, 20, 22, 0.95)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${color.border}`,
              borderRadius: '12px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
              color: 'var(--text-primary)',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: color.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '1px',
              }}
            >
              <Icon size={16} color={color.icon} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              {toast.title && (
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: color.text,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '2px',
                  }}
                >
                  {toast.title}
                </div>
              )}
              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  lineHeight: 1.45,
                  fontWeight: 500,
                  wordBreak: 'break-word',
                }}
              >
                {toast.message}
              </div>

              {toast.action && (
                <button
                  onClick={() => {
                    toast.action?.onClick();
                    removeToast(toast.id);
                  }}
                  style={{
                    marginTop: '8px',
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: color.text,
                    background: color.bg,
                    border: `1px solid ${color.border}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  {toast.action.label}
                </button>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                flexShrink: 0,
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
