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
  const answeredCount = Object.keys(answers).length;
  const isReadyToSubmit = answeredCount === questions.length && score === null;

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
    if (percentage >= 80) return 'text-emerald-700';
    if (percentage >= 60) return 'text-orange-700';
    return 'text-red-700';
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
          className="surface-card group p-6 transition-all hover:-translate-y-0.5 hover:border-stone-500"
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center bg-stone-900 text-sm font-bold text-stone-50">
              {i + 1}
            </span>
            <span className="meta-type text-[10px] text-stone-500">
              Question {i + 1} of {questions.length}
            </span>
          </div>
          <h3 className="mb-5 text-xl font-semibold leading-relaxed tracking-tight text-stone-950">
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
                    aria-pressed={selected}
                    aria-label={`Question ${i + 1}, option ${idx + 1}: ${opt}`}
                    className={`group/option relative w-full rounded-xl border-2 px-4 py-3 text-left font-medium transition-all ${
                      showCorrect
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : isWrong
                          ? 'border-red-600 bg-red-50 text-red-800'
                          : selected
                            ? 'border-orange-600 bg-orange-50 text-orange-900'
                            : 'border-stone-300 bg-stone-50 text-stone-700 hover:border-orange-500 hover:bg-orange-50'
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
        <div className="surface-card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:w-auto">
            <div className="mb-3 flex items-center justify-between text-sm text-stone-600">
              <span>Progress</span>
              <span>
                {answeredCount}/{questions.length} answered
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden bg-stone-300 sm:w-64">
              <div
                className="h-full bg-orange-600 transition-all duration-300"
                style={{ width: `${(answeredCount / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 sm:justify-end">
            {score !== null && (
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
            {score !== null ? (
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
              <Button onClick={submit} isDisabled={!isReadyToSubmit}>
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

          {score === null && !isReadyToSubmit && (
            <p className="w-full text-sm text-stone-500 sm:text-right">
              Select an answer for every question to submit.
            </p>
          )}

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
