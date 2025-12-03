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
    <div className="relative min-h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Gradient Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-violet-400/20 blur-3xl dark:bg-violet-600/10"></div>
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-400/20 blur-3xl dark:bg-purple-600/10"></div>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {!showResults ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <QuizForm onQuestions={handleQuestionsGenerated} />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Results Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">
                  Quiz Results
                </h1>
                {config && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-md bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                      {config.lang}
                    </span>
                    <span className="inline-flex items-center rounded-md bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                      {config.difficulty.charAt(0).toUpperCase() +
                        config.difficulty.slice(1)}
                    </span>
                    <span className="inline-flex items-center rounded-md bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      {config.model}
                    </span>
                  </div>
                )}
                <p className="text-zinc-600 dark:text-zinc-400">
                  {enableTaking
                    ? 'Select your answers and submit to see your score'
                    : 'Review your answers below'}
                </p>
              </div>
              <button
                onClick={handleGenerateNew}
                className="group flex items-center gap-2 rounded-xl border-2 border-zinc-200 bg-white px-4 py-2 font-medium text-zinc-700 transition-all hover:border-violet-500 hover:bg-violet-50 hover:text-violet-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-violet-500 dark:hover:bg-violet-950"
              >
                <svg
                  className="h-5 w-5 transition-transform group-hover:-rotate-45"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                New Quiz
              </button>
            </div>

            {/* Quiz Mode Toggle */}
            <div className="mb-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white">
                    Quiz Mode
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {enableTaking
                      ? 'Test yourself by selecting answers'
                      : 'View all correct answers'}
                  </p>
                </div>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-zinc-200 bg-zinc-50 px-4 py-2 transition-all hover:border-violet-500 dark:border-zinc-700 dark:bg-zinc-800">
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {enableTaking ? 'Taking Quiz' : 'Review Mode'}
                  </span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={enableTaking}
                      onChange={(e) => setEnableTaking(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-zinc-300 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-violet-600 peer-checked:after:translate-x-full dark:bg-zinc-600"></div>
                  </div>
                </label>
              </div>
            </div>

            {/* Quiz Questions */}
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
