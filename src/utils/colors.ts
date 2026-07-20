/** Shared theme hex tokens — keep in sync with THEME.md */
export const colors = {
  background: '#0b1220',
  card: '#111827',
  border: '#1f2937',
  primary: '#3b82f6',
  primaryDeep: '#1e3a8a',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  text: '#ffffff',
  muted: '#9ca3af',
  soft: '#e5e7eb',
  whatsapp: '#25D366',
  accentEssay: '#38bdf8',
  accentRC: '#f472b6',
  accentLAQ: '#a78bfa',
  accentTopics: '#f59e0b',
  accentDaily: '#10b981',
  accentMock: '#3b82f6',
  accentModel: '#14b8a6',
} as const;

export type ColorKey = keyof typeof colors;
