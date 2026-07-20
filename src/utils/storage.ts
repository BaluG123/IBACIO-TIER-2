import AsyncStorage from '@react-native-async-storage/async-storage';

const DRAFT_PREFIX = 'writing_draft_';
const STREAK_KEY = 'writing_streak';
const STREAK_LAST_KEY = 'writing_streak_last';
const ESSAY_PROGRESS_KEY = 'essay_progress';
const MOCK_HISTORY_KEY = 'mock_self_scores';

export async function saveDraft(id: string, text: string): Promise<void> {
  try {
    await AsyncStorage.setItem(
      `${DRAFT_PREFIX}${id}`,
      JSON.stringify({text, updatedAt: Date.now()}),
    );
  } catch (e) {
    console.warn('Draft save failed', e);
  }
}

export async function loadDraft(id: string): Promise<string> {
  try {
    const raw = await AsyncStorage.getItem(`${DRAFT_PREFIX}${id}`);
    if (!raw) {
      return '';
    }
    const parsed = JSON.parse(raw);
    return parsed.text ?? '';
  } catch {
    return '';
  }
}

export async function clearDraft(id: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(`${DRAFT_PREFIX}${id}`);
  } catch {
    /* ignore */
  }
}

export async function recordWritingDay(): Promise<number> {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const last = await AsyncStorage.getItem(STREAK_LAST_KEY);
    let streak = Number((await AsyncStorage.getItem(STREAK_KEY)) || '0');

    if (last === today) {
      return streak;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = yesterday.toISOString().slice(0, 10);

    if (last === yKey) {
      streak += 1;
    } else {
      streak = 1;
    }

    await AsyncStorage.setItem(STREAK_KEY, String(streak));
    await AsyncStorage.setItem(STREAK_LAST_KEY, today);
    return streak;
  } catch {
    return 0;
  }
}

export async function getWritingStreak(): Promise<number> {
  try {
    return Number((await AsyncStorage.getItem(STREAK_KEY)) || '0');
  } catch {
    return 0;
  }
}

export type EssayProgress = Record<string, {completed: boolean; at?: number}>;

export async function getEssayProgress(): Promise<EssayProgress> {
  try {
    const raw = await AsyncStorage.getItem(ESSAY_PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export async function markEssayComplete(topicId: string): Promise<void> {
  try {
    const progress = await getEssayProgress();
    progress[topicId] = {completed: true, at: Date.now()};
    await AsyncStorage.setItem(ESSAY_PROGRESS_KEY, JSON.stringify(progress));
    await recordWritingDay();
  } catch (e) {
    console.warn('Essay progress save failed', e);
  }
}

export type MockSelfScore = {
  id: string;
  mockId: string;
  essay: number;
  rc: number;
  laq: number;
  total: number;
  at: number;
};

export async function saveMockScore(
  entry: Omit<MockSelfScore, 'at'>,
): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(MOCK_HISTORY_KEY);
    const list: MockSelfScore[] = raw ? JSON.parse(raw) : [];
    list.unshift({...entry, at: Date.now()});
    await AsyncStorage.setItem(
      MOCK_HISTORY_KEY,
      JSON.stringify(list.slice(0, 20)),
    );
    await recordWritingDay();
  } catch (e) {
    console.warn('Mock score save failed', e);
  }
}

export async function getMockHistory(): Promise<MockSelfScore[]> {
  try {
    const raw = await AsyncStorage.getItem(MOCK_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
