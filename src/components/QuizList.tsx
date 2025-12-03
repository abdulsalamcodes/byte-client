'use client';

import React from 'react';
import { QuizQuestion } from '@/src/types/quiz';
import { Button } from './Button';

type Props = {
  questions: QuizQuestion[];
  enableTaking?: boolean;
  handleGenerateNew: () => void;
};

export function QuizList({
  questions,
  enableTaking,
  handleGenerateNew,
}: Props) {
  const [answers, setAnswers] = React.useState<Record<number, string>>({});
  const [score, setScore] = React.useState<number | null>(null);

  // Reset answers and score when enableTaking changes (for retake functionality)
  React.useEffect(() => {
    if (enableTaking) {
      setAnswers({});
      setScore(null);
    }
  }, [enableTaking]);

  const submit = () => {
    if (!enableTaking) return;
    let s = 0;
    questions.forEach((q, i) => {
      if (answers[i] && answers[i] === q.answer) s += 1;
    });
    setScore(s);
  };

  const getScoreColor = () => {
    if (score === null) return '';
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const handleRetakeQuiz = () => {
    setAnswers({});
    setScore(null);
  };

  return (
    <div className="space-y-6">
      {questions.map((q, i) => (
        <div
          key={i}
          className="group rounded-2xl border-2 border-zinc-200 bg-white p-6 transition-all hover:border-violet-500 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none"
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-sm font-bold text-violet-600 dark:bg-violet-950 dark:text-violet-400">
              {i + 1}
            </span>
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Question {i + 1} of {questions.length}
            </span>
          </div>
          <h3 className="mb-4 text-lg font-semibold leading-relaxed text-zinc-900 dark:text-white">
            {q.question}
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {q.options.map((opt, idx) => {
              const isCorrect = opt === q.answer;
              const selected = answers[i] === opt;
              const isWrong =
                enableTaking && score !== null && selected && !isCorrect;
              const showCorrect =
                (!enableTaking && isCorrect) || (score !== null && isCorrect);

              return (
                <li key={idx}>
                  <button
                    type="button"
                    disabled={!enableTaking || score !== null}
                    onClick={() => setAnswers((a) => ({ ...a, [i]: opt }))}
                    className={`group/option relative w-full rounded-xl border-2 px-4 py-3 text-left font-medium transition-all ${
                      showCorrect
                        ? 'border-green-500 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-950 dark:text-green-300'
                        : isWrong
                          ? 'border-red-500 bg-red-50 text-red-700 dark:border-red-600 dark:bg-red-950 dark:text-red-300'
                          : selected
                            ? 'border-violet-500 bg-violet-50 text-violet-700 dark:border-violet-600 dark:bg-violet-950 dark:text-violet-300'
                            : 'border-zinc-200 bg-white text-zinc-700 hover:border-violet-300 hover:bg-violet-50/50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-violet-700 dark:hover:bg-violet-950/30'
                    } ${!enableTaking || score !== null ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <span className="flex items-center gap-2">
                      {showCorrect && (
                        <svg
                          className="h-5 w-5 shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      {isWrong && (
                        <svg
                          className="h-5 w-5 shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      <span>{opt}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {enableTaking && (
        <div className="flex flex-col gap-4 rounded-2xl border-2 border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:items-center sm:justify-between">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {score && (
              <Button onClick={handleRetakeQuiz} variant="outline">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Retake Quiz
                </span>
              </Button>
            )}
            {score ? (
              <Button onClick={handleGenerateNew}>
                <span className="relative z-10 flex items-center gap-2">
                  Generate New Quiz
                  <svg
                    className="h-5 w-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </Button>
            ) : (
              <Button onClick={submit} isDisabled={score !== null}>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {score === null ? 'Submit Answers' : 'Submitted'}
                  <svg
                    className="h-5 w-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>
              </Button>
            )}
          </div>

          {score !== null && (
            <div
              className={`flex items-center gap-3 text-lg font-bold ${getScoreColor()}`}
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>
                Score: {score} / {questions.length} (
                {Math.round((score / questions.length) * 100)}%)
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
