'use client';

import { create } from 'zustand';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastStore {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).slice(2, 9);
    const newToast: ToastMessage = { ...toast, id };
    set((state) => ({ toasts: [...state.toasts, newToast] }));

    const duration = toast.duration ?? (toast.type === 'error' ? 6000 : 3500);
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      }, duration);
    }
    return id;
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
  clearToasts: () => set({ toasts: [] }),
}));

export const toast = {
  success: (message: string, title?: string, action?: ToastMessage['action']) =>
    useToastStore.getState().addToast({ type: 'success', message, title, action }),
  error: (message: string, title?: string, action?: ToastMessage['action']) =>
    useToastStore.getState().addToast({ type: 'error', message, title, action }),
  info: (message: string, title?: string, action?: ToastMessage['action']) =>
    useToastStore.getState().addToast({ type: 'info', message, title, action }),
  warning: (message: string, title?: string, action?: ToastMessage['action']) =>
    useToastStore.getState().addToast({ type: 'warning', message, title, action }),
};
