import { z } from 'zod';
import type { Difficulty } from '@/src/types/quiz';

export const difficultyOptions: Difficulty[] = ['easy', 'medium', 'hard'];

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
  'qwen3-vl:235b',
  'ministral-3:3b',
  'deepseek-r1:7b',
  'gemma3:270m',
  'phi3:3.8b',
] as const;

export const quizFormSchema = z.object({
  displayName: z
    .string()
    .min(1, 'Display name is required')
    .max(50, 'Display name is too long'),
  lang: z.string().min(1, 'Language is required'),
  num_questions: z
    .number()
    .int('Must be an integer')
    .min(1, 'Min 1 question')
    .max(50, 'Max 50 questions')
    .default(5),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  model: z.string().min(1).default('gpt-oss:20b'),
  stream: z.boolean().default(false),
});

export type QuizFormValues = z.infer<typeof quizFormSchema>;
