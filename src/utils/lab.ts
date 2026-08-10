import type { QuizFormValues } from '@/src/schemas/quizForm';
import type { QuizQuestion } from '@/src/types/quiz';

export const LAB_SESSIONS_KEY = 'byte-lab-sessions';

export type LabSession = {
  id: string;
  completedAt: string;
  score: number;
  total: number;
  config: Pick<QuizFormValues, 'lang' | 'difficulty' | 'num_questions' | 'lab_format'>;
};

export type LabChallenge = {
  questions: QuizQuestion[];
  config: QuizFormValues;
};

export function readLabSessions(): LabSession[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = window.localStorage.getItem(LAB_SESSIONS_KEY);
    return stored ? (JSON.parse(stored) as LabSession[]) : [];
  } catch {
    return [];
  }
}

export function saveLabSession(session: LabSession) {
  if (typeof window === 'undefined') return;

  const sessions = [session, ...readLabSessions()].slice(0, 30);
  window.localStorage.setItem(LAB_SESSIONS_KEY, JSON.stringify(sessions));
}

export function buildChallengeUrl(code: string) {
  if (typeof window === 'undefined') return '';

  // New share links use the canonical /code route. Legacy ?c= links remain readable.
  return new URL(`/${encodeURIComponent(code)}`, window.location.origin).toString();
}

export function readChallengeCodeFromLocation(): string | null {
  if (typeof window === 'undefined') return null;

  // Support both the current /ABC123 route and older shared links using ?c=ABC123.
  const queryCode = new URLSearchParams(window.location.search).get('c');
  if (queryCode && /^[A-Za-z0-9]{6}$/.test(queryCode)) return queryCode;

  const pathCode = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
  return /^[A-Za-z0-9]{6}$/.test(pathCode) ? pathCode : null;
}

export function clearChallengeFromLocation() {
  if (typeof window === 'undefined') return;
  window.history.replaceState(null, '', '/');
}

export function getDailyLabKey() {
  return new Date().toISOString().slice(0, 10);
}
