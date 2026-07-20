import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DAILY_PROMPTS_BASE_URL,
  CACHE_PREFIX,
  MANIFEST_CACHE_KEY,
} from '../config/dailyPrompts';

const bundledManifest = require('../assets/daily-prompts/manifest.json');

const bundledEditions: Record<string, DailyEdition> = {
  '2026-07-20': require('../assets/daily-prompts/2026-07-20.json'),
  '2026-07-19': require('../assets/daily-prompts/2026-07-19.json'),
  '2026-07-18': require('../assets/daily-prompts/2026-07-18.json'),
  '2026-07-17': require('../assets/daily-prompts/2026-07-17.json'),
  '2026-07-16': require('../assets/daily-prompts/2026-07-16.json'),
};

export type DailyEdition = {
  date: string;
  editionTitle: string;
  editionTitle_hi?: string;
  essayTopic: {
    title: string;
    title_hi?: string;
    category: string;
    hints: string[];
    hints_hi?: string[];
    modelOutline: string;
    modelOutline_hi?: string;
  };
  longAnswers: Array<{
    id: string;
    domain: string;
    question: string;
    question_hi?: string;
    keyPoints: string[];
    keyPoints_hi?: string[];
    modelAnswer: string;
    modelAnswer_hi?: string;
  }>;
  comprehension: {
    passage: string;
    passage_hi?: string;
    questions: Array<{
      q: string;
      q_hi?: string;
      model: string;
      model_hi?: string;
    }>;
  };
  tipOfDay: string;
  tipOfDay_hi?: string;
};

const saveCache = async (key: string, data: unknown) => {
  try {
    await AsyncStorage.setItem(
      key,
      JSON.stringify({data, cachedAt: Date.now()}),
    );
  } catch (e) {
    console.warn('Daily prompts cache write failed', e);
  }
};

const readCache = async <T>(key: string): Promise<T | null> => {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    return (parsed.data ?? null) as T | null;
  } catch {
    return null;
  }
};

const fetchJson = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
};

export const clearDailyPromptsCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const promptKeys = keys.filter(
      k => k === MANIFEST_CACHE_KEY || k.startsWith(CACHE_PREFIX),
    );
    if (promptKeys.length) {
      await AsyncStorage.multiRemove(promptKeys);
    }
  } catch (e) {
    console.warn('Failed to clear daily prompts cache', e);
  }
};

export const formatDateKey = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const getLocalizedField = (
  obj: Record<string, unknown>,
  field: string,
  lang: string,
) => {
  if (lang === 'hi') {
    const hiValue = obj[`${field}_hi`];
    if (hiValue) {
      return hiValue;
    }
  }
  return obj[field] ?? '';
};

export const getLocalizedEdition = (
  edition: DailyEdition | null,
  lang: string,
): DailyEdition | null => {
  if (!edition) {
    return null;
  }
  const hi = lang === 'hi';
  return {
    ...edition,
    editionTitle:
      hi && edition.editionTitle_hi
        ? edition.editionTitle_hi
        : edition.editionTitle,
    tipOfDay:
      hi && edition.tipOfDay_hi ? edition.tipOfDay_hi : edition.tipOfDay,
    essayTopic: {
      ...edition.essayTopic,
      title:
        hi && edition.essayTopic.title_hi
          ? edition.essayTopic.title_hi
          : edition.essayTopic.title,
      hints:
        hi && edition.essayTopic.hints_hi
          ? edition.essayTopic.hints_hi
          : edition.essayTopic.hints,
      modelOutline:
        hi && edition.essayTopic.modelOutline_hi
          ? edition.essayTopic.modelOutline_hi
          : edition.essayTopic.modelOutline,
    },
    longAnswers: (edition.longAnswers || []).map(la => ({
      ...la,
      question: hi && la.question_hi ? la.question_hi : la.question,
      keyPoints: hi && la.keyPoints_hi ? la.keyPoints_hi : la.keyPoints,
      modelAnswer: hi && la.modelAnswer_hi ? la.modelAnswer_hi : la.modelAnswer,
    })),
    comprehension: {
      passage:
        hi && edition.comprehension.passage_hi
          ? edition.comprehension.passage_hi
          : edition.comprehension.passage,
      questions: (edition.comprehension.questions || []).map(q => ({
        ...q,
        q: hi && q.q_hi ? q.q_hi : q.q,
        model: hi && q.model_hi ? q.model_hi : q.model,
      })),
    },
  };
};

export const fetchManifest = async (forceRefresh = false) => {
  if (forceRefresh) {
    await AsyncStorage.removeItem(MANIFEST_CACHE_KEY);
  }

  try {
    const remote = await fetchJson(
      `${DAILY_PROMPTS_BASE_URL}/manifest.json?t=${Date.now()}`,
    );
    if (remote?.dates?.length) {
      await saveCache(MANIFEST_CACHE_KEY, remote);
      return remote as {dates: string[]};
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.warn('Remote prompts manifest fetch failed', msg);
  }

  const cached = await readCache<{dates: string[]}>(MANIFEST_CACHE_KEY);
  if (cached?.dates?.length) {
    return cached;
  }

  return bundledManifest as {dates: string[]};
};

export const fetchDailyEdition = async (
  dateKey: string,
  forceRefresh = false,
): Promise<DailyEdition | null> => {
  const cacheKey = `${CACHE_PREFIX}${dateKey}`;

  if (forceRefresh) {
    await AsyncStorage.removeItem(cacheKey);
  }

  try {
    const remote = await fetchJson(
      `${DAILY_PROMPTS_BASE_URL}/${dateKey}.json?t=${Date.now()}`,
    );
    if (remote?.essayTopic && remote?.longAnswers?.length) {
      await saveCache(cacheKey, remote);
      return remote as DailyEdition;
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.warn(`Remote edition ${dateKey} failed`, msg);
  }

  const cached = await readCache<DailyEdition>(cacheKey);
  if (cached?.essayTopic) {
    return cached;
  }

  return bundledEditions[dateKey] || null;
};

export const getDomainColor = (domain: string) => {
  const map: Record<string, string> = {
    'Current Affairs': '#3b82f6',
    Economics: '#f59e0b',
    'Socio-political': '#a78bfa',
    Economy: '#f59e0b',
    National: '#3b82f6',
  };
  return map[domain] || '#60a5fa';
};
