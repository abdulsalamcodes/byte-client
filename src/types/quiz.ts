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
  // Absent on shared challenges until the server grades a submission.
  answer?: string;
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
  focus?: string;
  lab_format?: LabFormat;
};

export type ChallengeConfig = {
  lang: string;
  difficulty: Difficulty;
  num_questions: number;
  lab_format: LabFormat;
  focus?: string | null;
  model?: string | null;
};

export type ChallengeView = {
  code: string;
  questions: QuizQuestion[];
  config: ChallengeConfig;
  is_public: boolean;
  creator_id: string;
  creator_name: string;
  created_at: number;
};

export type ChallengeVisibility = {
  code: string;
  is_public: boolean;
};

export type LeaderboardEntry = {
  id: string;
  user_id: string;
  display_name: string;
  score: number;
  total: number;
  duration_seconds: number;
  completed_at: number;
};

export type SubmitAttemptPayload = {
  answers: Record<string, string>;
  duration_seconds: number;
};

export type QuestionResult = {
  is_correct: boolean;
  correct_answer: string;
  explanation?: string | null;
};

export type AttemptResult = {
  score: number;
  total: number;
  results: QuestionResult[];
  ranked: boolean;
  unranked_reason?: 'creator' | 'repeat' | null;
  entry?: LeaderboardEntry | null;
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
