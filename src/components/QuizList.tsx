'use client';

import React from 'react';
import { QuizQuestion } from '@/src/types/quiz';
import { Button } from './Button';

function splitQuestionCode(question: string, code?: string) {
  const match = question.match(/\s*```[\w-]*\n?([\s\S]*?)```\s*/);
  if (!match) return { prompt: question, code };

  return {
    prompt: question.replace(match[0], ' ').replace(/\s+/g, ' ').trim(),
    code: code || match[1].trim(),
  };
}

type Props = {
  questions: QuizQuestion[];
  enableTaking?: boolean;
  handleGenerateNew: () => void;
  onComplete?: (score: number, total: number, durationSeconds: number, answers: Record<number, string>) => void;
};

const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

export function QuizList({
  questions,
  enableTaking,
  handleGenerateNew,
  onComplete,
}: Props) {
  const [answers, setAnswers] = React.useState<Record<number, string>>({});
  const [score, setScore] = React.useState<number | null>(null);
  const [startedAt, setStartedAt] = React.useState(() => Date.now());
  const [durationSeconds, setDurationSeconds] = React.useState<number | null>(null);
  const answeredCount = Object.keys(answers).length;
  const isReadyToSubmit = answeredCount === questions.length && score === null;

  // Reset answers and score when enableTaking changes (for retake functionality)
  React.useEffect(() => {
    if (enableTaking) {
      setAnswers({});
      setScore(null);
      setDurationSeconds(null);
      setStartedAt(Date.now());
    }
  }, [enableTaking]);

  const submit = () => {
    if (!enableTaking) return;
    let s = 0;
    questions.forEach((q, i) => {
      if (answers[i] && answers[i] === q.answer) s += 1;
    });
    const elapsed = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
    setScore(s);
    setDurationSeconds(elapsed);
    onComplete?.(s, questions.length, elapsed, answers);
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
    setDurationSeconds(null);
    setStartedAt(Date.now());
  };

  return (
    <div className="space-y-6">
      {questions.map((q, i) => {
        const display = splitQuestionCode(q.question, q.code);

        return (
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
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {q.lab_format && (
              <span className="meta-type border border-orange-300 bg-orange-50 px-2 py-1 text-[9px] text-orange-800">
                {q.lab_format.replace(/-/g, ' ')}
              </span>
            )}
            {!q.lab_format && q.kind === 'code-review' && (
              <span className="meta-type border border-orange-300 bg-orange-50 px-2 py-1 text-[9px] text-orange-800">
                Code review
              </span>
            )}
            {q.concept && (
              <span className="meta-type border border-stone-300 px-2 py-1 text-[9px] text-stone-500">
                {q.concept}
              </span>
            )}
            {q.verified === true && (
              <span className="meta-type border border-emerald-300 bg-emerald-50 px-2 py-1 text-[9px] text-emerald-800">
                Verified
              </span>
            )}
            {q.verified === false && q.verification_reason && (
              <span className="meta-type border border-red-300 bg-red-50 px-2 py-1 text-[9px] text-red-800">
                Needs review
              </span>
            )}
          </div>
          <h3 className="mb-5 text-xl font-semibold leading-relaxed tracking-tight text-stone-950">
            {display.prompt}
          </h3>
          {q.verified === false && q.verification_reason && (
            <p className="mb-5 border-l-2 border-red-500 bg-red-50 px-3 py-2 text-sm leading-6 text-red-800">
              {q.verification_reason}
            </p>
          )}
          {q.scenario && (
            <div className="mb-5 border border-stone-300 bg-stone-50 p-4 text-sm leading-6 text-stone-700">
              <p className="meta-type mb-2 text-[10px] text-stone-500">Scenario</p>
              <p>{q.scenario}</p>
            </div>
          )}
          {display.code && (
            <pre className="mb-5 max-w-full overflow-x-auto border border-stone-300 bg-stone-950 p-4 text-left font-mono text-sm leading-6 text-stone-100">
              <code className="block whitespace-pre">{display.code.trim()}</code>
            </pre>
          )}
          {q.diff && (
            <pre className="mb-5 max-w-full overflow-x-auto border border-stone-300 bg-stone-950 p-4 text-left font-mono text-sm leading-6 text-stone-100">
              <code className="block whitespace-pre">{q.diff.trim()}</code>
            </pre>
          )}
          {q.logs && (
            <pre className="mb-5 max-w-full overflow-x-auto border border-stone-300 bg-stone-100 p-4 text-left font-mono text-sm leading-6 text-stone-700">
              <code className="block whitespace-pre">{q.logs.trim()}</code>
            </pre>
          )}
          {q.constraints && q.constraints.length > 0 && (
            <div className="mb-5 border border-stone-300 bg-stone-50 p-4 text-sm leading-6 text-stone-700">
              <p className="meta-type mb-2 text-[10px] text-stone-500">Constraints</p>
              <ul className="list-disc space-y-1 pl-5">
                {q.constraints.map((constraint) => (
                  <li key={constraint}>{constraint}</li>
                ))}
              </ul>
            </div>
          )}
          {q.tradeoffs && q.tradeoffs.length > 0 && (
            <div className="mb-5 border border-stone-300 bg-stone-50 p-4 text-sm leading-6 text-stone-700">
              <p className="meta-type mb-2 text-[10px] text-stone-500">Tradeoffs</p>
              <ul className="list-disc space-y-1 pl-5">
                {q.tradeoffs.map((tradeoff) => (
                  <li key={tradeoff}>{tradeoff}</li>
                ))}
              </ul>
            </div>
          )}
          <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4">
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
                    className={`group/option relative flex min-h-20 w-full items-start gap-3 overflow-hidden border px-4 py-4 text-left transition-all focus:outline-none focus:ring-4 focus:ring-orange-500/15 ${
                      showCorrect
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-[inset_4px_0_0_#059669]'
                        : isWrong
                          ? 'border-red-600 bg-red-50 text-red-900 shadow-[inset_4px_0_0_#dc2626]'
                          : selected
                            ? 'border-orange-600 bg-orange-50 text-orange-950 shadow-[inset_4px_0_0_#ea580c]'
                            : 'border-stone-300 bg-stone-50 text-stone-800 hover:border-orange-500 hover:bg-orange-50/70 hover:shadow-[inset_4px_0_0_#f97316]'
                    } ${!enableTaking || score !== null ? 'cursor-default' : 'cursor-pointer hover:-translate-y-0.5'}`}
                  >
                    <span
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border text-xs font-black ${
                        showCorrect
                          ? 'border-emerald-600 bg-emerald-700 text-white'
                          : isWrong
                            ? 'border-red-600 bg-red-700 text-white'
                            : selected
                              ? 'border-orange-600 bg-orange-700 text-white'
                              : 'border-stone-300 bg-white text-stone-500 group-hover/option:border-orange-500 group-hover/option:text-orange-800'
                      }`}
                      aria-hidden="true"
                    >
                      {optionLabels[idx] ?? idx + 1}
                    </span>
                    <span className="min-w-0 flex-1 text-sm font-semibold leading-6 sm:text-base">
                      {opt}
                    </span>
                    {(showCorrect || isWrong) && (
                      <span className="mt-1 shrink-0" aria-hidden="true">
                        {showCorrect ? (
                          <svg
                            className="h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-5 w-5"
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
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          {(score !== null || !enableTaking) && (q.explanation || q.source) && (
            <div className="mt-5 border-t border-stone-300 pt-4 text-sm leading-6 text-stone-600">
              {q.explanation && <p>{q.explanation}</p>}
              {q.source && <p className="mt-2 text-xs text-stone-500">Source: {q.source}</p>}
            </div>
          )}
        </div>
        );
      })}

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
                  New Lab
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
                <span className="relative z-10 flex min-w-40 items-center justify-center gap-2 whitespace-nowrap">
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
                {durationSeconds !== null ? ` in ${durationSeconds}s` : ''}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
