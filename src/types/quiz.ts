export type Difficulty = "easy" | "medium" | "hard";

export type LabFormat =
  | "concept-check"
  | "code-reasoning"
  | "debugging"
  | "code-review"
  | "refactoring"
  | "test-writing"
  | "system-design";

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
  kind?: 'multiple-choice' | 'code-review';
  lab_format?: LabFormat;
  scenario?: string | null;
  code?: string;
  logs?: string | null;
  diff?: string | null;
  constraints?: string[];
  tradeoffs?: string[];
  concept?: string;
  explanation?: string;
  source?: string;
  verified?: boolean;
  verification_reason?: string | null;
};

export type GenerateQuizPayload = {
  lang: string;
  num_questions: number; // 1-50
  difficulty: Difficulty;
  model: string;
  stream: boolean;
  focus?: string;
  lab_format?: LabFormat;
};

export type ChallengeAttempt = {
  id: string;
  display_name: string;
  score: number;
  total: number;
  duration_seconds: number;
  answers: Record<string, string>;
  completed_at: number;
};

export type ChallengeAttemptPayload = {
  display_name: string;
  score: number;
  total: number;
  duration_seconds: number;
  answers: Record<string, string>;
};

export type PublicChallengeSummary = {
  code: string;
  title: string;
  creator_name: string;
  lang: string;
  difficulty: string;
  lab_format: LabFormat;
  focus?: string | null;
  question_count: number;
  attempt_count: number;
  best_score?: number | null;
  best_total?: number | null;
  fastest_clean_seconds?: number | null;
  created_at: number;
};
