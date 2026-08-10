'use client';

import React from 'react';
import { QuizForm } from '@/src/components/QuizForm';
import { QuizList } from '@/src/components/QuizList';
import type { QuizQuestion } from '@/src/types/quiz';
import type { QuizFormValues } from '@/src/schemas/quizForm';

export default function Home() {
  const [questions, setQuestions] = React.useState<QuizQuestion[] | null>(null);
  const [config, setConfig] = React.useState<QuizFormValues | null>(null);
  const [enableTaking, setEnableTaking] = React.useState(true);
  const [showResults, setShowResults] = React.useState(false);

  const handleQuestionsGenerated = (
    qs: QuizQuestion[],
    cfg: QuizFormValues
  ) => {
    setQuestions(qs);
    setConfig(cfg);
    setShowResults(true);
  };

  const handleGenerateNew = () => {
    setQuestions(null);
    setConfig(null);
    setShowResults(false);
    setEnableTaking(true);
  };

  return (
    <div className="app-shell min-h-screen">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 lg:px-10 lg:py-9">
        <header className="mb-16 flex items-center justify-between border-b border-stone-300 pb-5">
          <div className="flex items-baseline gap-2 text-stone-900">
            <span className="text-lg font-black tracking-[-0.08em]">BYTE</span>
            <span className="text-stone-400">/</span>
            <span className="meta-type text-[10px] text-stone-500">QUIZ</span>
          </div>
          <div className="meta-type text-[10px] text-stone-500">
            {showResults ? '02 / REVIEW' : '01 / SETUP'}
          </div>
        </header>

        {!showResults ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <QuizForm onQuestions={handleQuestionsGenerated} />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <section className="mb-10 flex flex-col gap-8 border-b border-stone-300 pb-10 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="meta-type mb-4 text-[10px] text-orange-700">
                  Assessment / {config?.lang ?? 'Coding'}
                </p>
                <h1 className="display-type max-w-2xl text-5xl leading-[0.95] text-stone-950 sm:text-6xl">
                  Review your quiz.
                </h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-stone-600">
                  Work through each prompt at your own pace. Your score stays on
                  this page until you start another set.
                </p>
              </div>
              <button
                onClick={handleGenerateNew}
                className="flex w-full items-center justify-center gap-2 border border-stone-400 bg-transparent px-5 py-3 text-sm font-semibold text-stone-800 transition-colors hover:border-stone-900 hover:bg-stone-900 hover:text-stone-50 sm:w-auto"
              >
                New quiz
                <span aria-hidden="true">+</span>
              </button>
            </section>

            <div className="surface-card mb-8 p-5 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="meta-type mb-2 text-[10px] text-stone-500">
                    Viewing mode
                  </p>
                  <h2 className="text-xl font-semibold tracking-tight text-stone-950">
                    {enableTaking ? 'Take the assessment' : 'Review answers'}
                  </h2>
                  <p className="mt-1 text-sm text-stone-600">
                    {enableTaking
                      ? 'Choose one answer per question, then submit when ready.'
                      : 'Correct answers are marked for reference.'}
                  </p>
                </div>
                <label className="flex cursor-pointer items-center gap-3 self-start border border-stone-300 bg-stone-100 px-3 py-2">
                  <span className="text-xs font-semibold text-stone-700">
                    {enableTaking ? 'Taking' : 'Review'}
                  </span>
                  <span className="relative">
                    <input
                      type="checkbox"
                      checked={enableTaking}
                      onChange={(e) => setEnableTaking(e.target.checked)}
                      className="peer sr-only"
                      aria-label="Toggle quiz taking mode"
                    />
                    <span className="block h-5 w-9 rounded-full bg-stone-400 transition-colors peer-checked:bg-orange-600" />
                    <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
                  </span>
                </label>
              </div>

              {questions && (
                <div className="mt-6 grid grid-cols-3 border-t border-stone-300 pt-5">
                  <div>
                    <p className="meta-type text-[10px] text-stone-500">Questions</p>
                    <p className="mt-1 text-xl font-semibold text-stone-950">
                      {questions.length}
                    </p>
                  </div>
                  <div className="border-l border-stone-300 pl-4">
                    <p className="meta-type text-[10px] text-stone-500">Level</p>
                    <p className="mt-1 text-xl font-semibold capitalize text-stone-950">
                      {config?.difficulty ?? '—'}
                    </p>
                  </div>
                  <div className="border-l border-stone-300 pl-4">
                    <p className="meta-type text-[10px] text-stone-500">Format</p>
                    <p className="mt-1 text-xl font-semibold text-stone-950">
                      Multiple choice
                    </p>
                  </div>
                </div>
              )}
            </div>

            {questions && (
              <QuizList
                questions={questions}
                enableTaking={enableTaking}
                handleGenerateNew={handleGenerateNew}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
