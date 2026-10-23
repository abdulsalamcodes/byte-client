import type { AuthUser, RegisterPayload, TokenResponse } from '@/src/types/auth';
import type {
  AttemptResult,
  ChallengeConfig,
  ChallengeView,
  ChallengeVisibility,
  GenerateQuizPayload,
  LeaderboardEntry,
  PublicChallengeSummary,
  QuizQuestion,
  SubmitAttemptPayload,
} from '@/src/types/quiz';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function isUnauthorized(error: unknown) {
  return error instanceof ApiError && error.status === 401;
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH';
  token?: string | null;
  json?: unknown;
  form?: Record<string, string>;
};

// FastAPI returns `detail` as a string, or as a list of validation issues.
function errorMessage(body: unknown, fallback: string) {
  const detail = (body as { detail?: unknown } | null)?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    const messages = detail
      .map((issue) => (issue as { msg?: unknown })?.msg)
      .filter((msg): msg is string => typeof msg === 'string');
    if (messages.length) return messages.join(' ');
  }
  return fallback;
}

async function request(path: string, { method = 'GET', token, json, form }: RequestOptions = {}) {
  const headers: Record<string, string> = {};
  let body: BodyInit | undefined;
  if (json !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(json);
  } else if (form) {
    body = new URLSearchParams(form);
  }
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, { method, headers, body });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new ApiError(res.status, errorMessage(errorBody, `Request failed (${res.status})`));
  }
  return res;
}

async function requestJson<T>(path: string, options?: RequestOptions): Promise<T> {
  const res = await request(path, options);
  return (await res.json()) as T;
}

export function registerAccount(payload: RegisterPayload) {
  return requestJson<TokenResponse>('/auth/register', { method: 'POST', json: payload });
}

export function login(email: string, password: string) {
  return requestJson<TokenResponse>('/auth/token', {
    method: 'POST',
    form: { username: email, password },
  });
}

export function fetchCurrentUser(token: string) {
  return requestJson<AuthUser>('/auth/me', { token });
}

export function generateQuiz(token: string, payload: GenerateQuizPayload) {
  return requestJson<QuizQuestion[]>('/quiz/generate', { method: 'POST', token, json: payload });
}

export function createChallenge(
  token: string,
  payload: { questions: QuizQuestion[]; config: ChallengeConfig; is_public?: boolean }
) {
  return requestJson<ChallengeVisibility>('/quiz/challenges', { method: 'POST', token, json: payload });
}

export function setChallengeVisibility(token: string, code: string, isPublic: boolean) {
  return requestJson<ChallengeVisibility>(`/quiz/challenges/${encodeURIComponent(code)}`, {
    method: 'PATCH',
    token,
    json: { is_public: isPublic },
  });
}

export function fetchChallenge(code: string) {
  return requestJson<ChallengeView>(`/quiz/challenges/${encodeURIComponent(code)}`);
}

export function fetchPublicChallenges() {
  return requestJson<PublicChallengeSummary[]>('/quiz/challenges');
}

export function fetchLeaderboard(code: string) {
  return requestJson<LeaderboardEntry[]>(`/quiz/challenges/${encodeURIComponent(code)}/attempts`);
}

export function submitAttempt(token: string, code: string, payload: SubmitAttemptPayload) {
  return requestJson<AttemptResult>(`/quiz/challenges/${encodeURIComponent(code)}/attempts`, {
    method: 'POST',
    token,
    json: payload,
  });
}
