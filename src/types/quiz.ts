export type Difficulty = "easy" | "medium" | "hard";

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
};

export type GenerateQuizPayload = {
  lang: string;
  num_questions: number; // 1-50
  difficulty: Difficulty;
  model: string;
  stream: boolean;
};
