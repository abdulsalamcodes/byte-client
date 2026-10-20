import { describe, expect, it } from '@jest/globals';
import type { QuizQuestion } from '@/src/types/quiz';
import { scoreAnswers, toChallengeConfig, withGradedAnswers } from './lab';

const question = (overrides: Partial<QuizQuestion> = {}): QuizQuestion => ({
  question: 'Which keyword defines a function?',
  options: ['func', 'def', 'fn'],
  ...overrides,
});

describe('scoreAnswers', () => {
  it('counts answers that match the answer key', () => {
    const questions = [question({ answer: 'def' }), question({ answer: 'fn' })];
    expect(scoreAnswers(questions, { 0: 'def', 1: 'func' })).toBe(1);
  });

  it('never awards points for questions without an answer key', () => {
    expect(scoreAnswers([question()], { 0: 'def' })).toBe(0);
  });
});

describe('withGradedAnswers', () => {
  it('reveals answers and explanations from server results', () => {
    const graded = withGradedAnswers(
      [question(), question({ explanation: 'kept' })],
      [
        { is_correct: false, correct_answer: 'def', explanation: 'Python uses def.' },
        { is_correct: true, correct_answer: 'fn', explanation: null },
      ]
    );

    expect(graded[0]).toMatchObject({ answer: 'def', explanation: 'Python uses def.' });
    expect(graded[1]).toMatchObject({ answer: 'fn', explanation: 'kept' });
  });
});

describe('toChallengeConfig', () => {
  it('keeps only challenge fields and stores an empty focus as null', () => {
    expect(
      toChallengeConfig({
        lang: 'Python',
        difficulty: 'easy',
        num_questions: 5,
        lab_format: 'debugging',
        focus: '',
        model: 'gpt-oss:20b',
        stream: false,
      })
    ).toEqual({
      lang: 'Python',
      difficulty: 'easy',
      num_questions: 5,
      lab_format: 'debugging',
      focus: null,
      model: 'gpt-oss:20b',
    });
  });
});
