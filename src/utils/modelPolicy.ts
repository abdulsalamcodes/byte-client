import type { Difficulty, LabFormat } from '@/src/types/quiz';
import { modelOptions } from '@/src/schemas/quizForm';

const DEFAULT_MODEL = 'gpt-oss:20b';
const REASONING_MODEL = 'qwen3-vl:235b';
const FAST_MODEL = 'ministral-3:3b';

const reasoningHeavyFormats: LabFormat[] = [
  'system-design',
  'debugging',
  'code-review',
  'refactoring',
];

function supportedModel(model: string) {
  return modelOptions.includes(model as (typeof modelOptions)[number]);
}

function safeModel(model: string) {
  return supportedModel(model) ? model : DEFAULT_MODEL;
}

export function chooseQuestionEngine(input: {
  difficulty: Difficulty;
  labFormat: LabFormat;
  questionCount: number;
}) {
  if (input.difficulty === 'hard' || reasoningHeavyFormats.includes(input.labFormat)) {
    return safeModel(REASONING_MODEL);
  }

  if (input.difficulty === 'easy' && input.questionCount <= 5) {
    return safeModel(FAST_MODEL);
  }

  return DEFAULT_MODEL;
}
