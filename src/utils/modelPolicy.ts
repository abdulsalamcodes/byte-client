import type { Difficulty, LabFormat } from '@/src/types/quiz';
import { modelOptions } from '@/src/schemas/quizForm';

const DEFAULT_MODEL = 'gpt-oss:20b';
const REASONING_MODEL = 'gpt-oss:120b';
const CODE_REASONING_MODEL = 'kimi-k2.7-code';
const FAST_MODEL = 'gpt-oss:20b';

const codeHeavyFormats: LabFormat[] = [
  'debugging',
  'code-review',
  'code-reasoning',
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
  if (input.difficulty === 'hard' || input.labFormat === 'system-design') {
    return safeModel(REASONING_MODEL);
  }

  if (codeHeavyFormats.includes(input.labFormat)) {
    return safeModel(CODE_REASONING_MODEL);
  }

  if (input.difficulty === 'easy' && input.questionCount <= 5) {
    return safeModel(FAST_MODEL);
  }

  return DEFAULT_MODEL;
}
