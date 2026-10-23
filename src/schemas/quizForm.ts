import { z } from 'zod';
import type { Difficulty, LabFormat } from '@/src/types/quiz';

export const difficultyOptions: Difficulty[] = ['easy', 'medium', 'hard'];

export const labFormatOptions: Array<{ value: LabFormat; label: string }> = [
  { value: 'concept-check', label: 'Concept check' },
  { value: 'code-reasoning', label: 'Code reasoning' },
  { value: 'debugging', label: 'Debugging' },
  { value: 'code-review', label: 'Code review' },
  { value: 'refactoring', label: 'Refactoring' },
  { value: 'test-writing', label: 'Test writing' },
  { value: 'system-design', label: 'System design' },
];

export const languageOptions = [
  'JavaScript',
  'Python',
  'TypeScript',
  'Java',
  'C++',
  'C#',
  'Go',
  'Rust',
  'PHP',
  'Ruby',
  'Swift',
  'Kotlin',
  'Dart',
  'R',
  'SQL',
  'HTML/CSS',
  'Shell/Bash',
] as const;

export const modelOptions = [
  'gpt-oss:20b',
  'gpt-oss:120b',
] as const;

export const quizFormSchema = z.object({
  lang: z.string().min(1, 'Language is required'),
  num_questions: z
    .number()
    .int('Must be an integer')
    .min(1, 'Min 1 question')
    .max(50, 'Max 50 questions')
    .default(5),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  model: z.string().min(1).default('gpt-oss:20b'),
  focus: z.string().max(100).default(''),
  lab_format: z
    .enum([
      'concept-check',
      'code-reasoning',
      'debugging',
      'code-review',
      'refactoring',
      'test-writing',
      'system-design',
    ])
    .default('concept-check'),
});

export type QuizFormValues = z.infer<typeof quizFormSchema>;
