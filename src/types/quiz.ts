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
