export type Difficulty = "easy" | "medium" | "hard";

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
  kind?: 'multiple-choice' | 'code-review';
  code?: string;
  concept?: string;
  explanation?: string;
  source?: string;
  verified?: boolean;
};

export type GenerateQuizPayload = {
  lang: string;
  num_questions: number; // 1-50
  difficulty: Difficulty;
  model: string;
  stream: boolean;
  focus?: string;
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
