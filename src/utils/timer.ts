/** Count words in free-text (whitespace-separated). */
export function countWords(text: string): number {
  if (!text || !text.trim()) {
    return 0;
  }
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

/** Format seconds as MM:SS */
export function formatTimer(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

/**
 * Gentle timer color: green → amber → red by remaining ratio.
 * @param remainingSeconds seconds left
 * @param totalSeconds original duration
 */
export function timerColor(
  remainingSeconds: number,
  totalSeconds: number,
): string {
  if (totalSeconds <= 0) {
    return '#10b981';
  }
  const ratio = remainingSeconds / totalSeconds;
  if (ratio > 0.4) {
    return '#10b981';
  }
  if (ratio > 0.15) {
    return '#f59e0b';
  }
  return '#ef4444';
}

export function todayDateKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDateKey(dateKey: string): Date {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d);
}
