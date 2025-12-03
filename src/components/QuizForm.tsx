'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  quizFormSchema,
  difficultyOptions,
  languageOptions,
  modelOptions,
  type QuizFormValues,
} from '@/src/schemas/quizForm';
import type { QuizQuestion, GenerateQuizPayload } from '@/src/types/quiz';
import { StreamViewer } from '@/src/components/StreamViewer';
import { tryParseQuestions } from '@/src/utils/parser';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

type Props = {
  onQuestions: (questions: QuizQuestion[]) => void;
};

export function QuizForm({ onQuestions }: Props) {
  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      displayName: '',
      lang: 'JavaScript',
      num_questions: 5,
      difficulty: 'easy',
      model: 'gpt-oss:20b',
      stream: false,
    },
    mode: 'onChange',
  });

  const [phase, setPhase] = React.useState<'onboarding' | 'form'>('onboarding');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showForm, setShowForm] = React.useState(false);

  const submitForm = async (values: QuizFormValues) => {
    setError(null);
    setLoading(true);
    const payload: GenerateQuizPayload = {
      lang: values.lang,
      num_questions: values.num_questions,
      difficulty: values.difficulty,
      model: values.model,
      stream: values.stream,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/quiz/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        if (res.status === 422) {
          throw new Error(`Validation error (422): ${txt}`);
        }
        throw new Error(
          `${res.status} ${res.statusText}${txt ? `: ${txt}` : ''}`
        );
      }

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = (await res.json()) as QuizQuestion[];
        onQuestions(data);
      } else {
        const text = await res.text();
        const parsed = tryParseQuestions(text);
        if (parsed && parsed.length) {
          onQuestions(parsed);
        } else {
          throw new Error('Failed to parse server response');
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const startStream = async () => {
    const values = form.getValues();
    const payload: GenerateQuizPayload = {
      lang: values.lang,
      num_questions: values.num_questions,
      difficulty: values.difficulty,
      model: values.model,
      stream: true,
    };
    return fetch(`${API_BASE_URL}/quiz/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  };

  useEffect(() => {
    const storedName = localStorage.getItem('displayName');
    if (storedName) {
      form.setValue('displayName', storedName);
      setPhase('form');
    }
  }, [form]);

  return (
    <div className="relative">
      {phase === 'onboarding' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Hero Section */}
          <div className="mb-8 text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 to-purple-600 shadow-lg shadow-purple-500/50">
              <svg
                className="h-10 w-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            {/* AI Powered Badge */}
            <div className="mb-6 max-w-max mx-auto flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-700 dark:border-violet-900/50 dark:bg-violet-950/50 dark:text-violet-300">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              AI Powered
            </div>
            <h1 className="mb-3 bg-linear-to-r from-violet-600 to-purple-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
              Welcome to Byte Quiz
            </h1>
            <p className="mx-auto max-w-md text-lg text-zinc-600 dark:text-zinc-400">
              Test your coding knowledge and challenge yourself—let&apos;s start
              by getting your name.
            </p>
          </div>

          {/* Onboarding Card */}
          <div className="mx-auto max-w-md">
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl shadow-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  What should we call you?
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter your display name"
                    {...form.register('displayName')}
                    className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 text-zinc-900 transition-all placeholder:text-zinc-400 hover:border-zinc-300 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:border-zinc-600 dark:focus:border-violet-500"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const dn = form.getValues('displayName');
                        const res =
                          quizFormSchema.shape.displayName.safeParse(dn);
                        if (res.success) {
                          setPhase('form');
                          setTimeout(() => setShowForm(true), 50);
                        } else {
                          form.trigger('displayName');
                        }
                      }
                    }}
                  />
                  {form.formState.errors.displayName && (
                    <div className="mt-2 flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {form.formState.errors.displayName.message}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                className="group relative w-full overflow-hidden rounded-xl bg-linear-to-r from-violet-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:shadow-xl hover:shadow-violet-500/40 focus:outline-none focus:ring-4 focus:ring-violet-500/50 disabled:opacity-50"
                onClick={() => {
                  const dn = form.getValues('displayName');
                  const res = quizFormSchema.shape.displayName.safeParse(dn);

                  if (res.success) {
                    setPhase('form');
                    setTimeout(() => setShowForm(true), 50);

                    // store to local storage
                    localStorage.setItem('displayName', dn);
                  } else {
                    form.trigger('displayName');
                  }
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Continue
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
                <div className="absolute inset-0 z-0 bg-linear-to-r from-violet-700 to-purple-700 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-zinc-500">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Your data stays private and secure
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`animate-in fade-in slide-in-from-bottom-4 duration-700 ${showForm ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Form Header */}
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setPhase('onboarding');
                  setShowForm(false);
                }}
                className="group flex h-10 w-10 items-center justify-center rounded-xl border-2 border-zinc-200 bg-white transition-all hover:border-violet-500 hover:bg-violet-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-violet-500 dark:hover:bg-violet-950"
              >
                <svg
                  className="h-5 w-5 text-zinc-600 transition-colors group-hover:text-violet-600 dark:text-zinc-400 dark:group-hover:text-violet-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  Configure Your Quiz
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Customize the settings to generate your perfect quiz
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={form.handleSubmit(submitForm)} className="space-y-6">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Programming Language Select */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Programming Language
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <svg
                        className="h-5 w-5 text-zinc-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                      </svg>
                    </div>
                    <select
                      {...form.register('lang')}
                      className="w-full appearance-none rounded-xl border-2 border-zinc-200 bg-white py-3 pl-11 pr-10 text-zinc-900 transition-all hover:border-zinc-300 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:border-zinc-600 dark:focus:border-violet-500"
                    >
                      {languageOptions.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg
                        className="h-5 w-5 text-zinc-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                  {form.formState.errors.lang && (
                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                      {form.formState.errors.lang.message}
                    </p>
                  )}
                </div>

                {/* Number of Questions */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Number of Questions
                  </label>
                  <input
                    type="number"
                    {...form.register('num_questions', { valueAsNumber: true })}
                    className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 text-zinc-900 transition-all placeholder:text-zinc-400 hover:border-zinc-300 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:border-zinc-600 dark:focus:border-violet-500"
                    min={1}
                    max={50}
                  />
                  {form.formState.errors.num_questions && (
                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                      {form.formState.errors.num_questions.message}
                    </p>
                  )}
                </div>

                {/* Difficulty */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Difficulty Level
                  </label>
                  <div className="relative">
                    <select
                      {...form.register('difficulty')}
                      className="w-full appearance-none rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 pr-10 text-zinc-900 transition-all hover:border-zinc-300 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:border-zinc-600 dark:focus:border-violet-500"
                    >
                      {difficultyOptions.map((d) => (
                        <option key={d} value={d}>
                          {d.charAt(0).toUpperCase() + d.slice(1)}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg
                        className="h-5 w-5 text-zinc-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Model */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    AI Model
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <svg
                        className="h-5 w-5 text-zinc-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <select
                      {...form.register('model')}
                      className="w-full appearance-none rounded-xl border-2 border-zinc-200 bg-white py-3 pl-11 pr-10 text-zinc-900 transition-all hover:border-zinc-300 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:border-zinc-600 dark:focus:border-violet-500"
                    >
                      {modelOptions.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg
                        className="h-5 w-5 text-zinc-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Stream Mode Toggle */}
                <div className="sm:col-span-2">
                  <label className="flex cursor-pointer items-center justify-between rounded-xl border-2 border-zinc-200 bg-zinc-50 p-4 transition-all hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-zinc-600">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-950">
                        <svg
                          className="h-5 w-5 text-violet-600 dark:text-violet-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-zinc-900 dark:text-white">
                          Stream Mode
                        </div>
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">
                          See quiz generation in real-time
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        {...form.register('stream')}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-zinc-300 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-violet-600 peer-checked:after:translate-x-full peer-focus:ring-4 peer-focus:ring-violet-500/20 dark:bg-zinc-600"></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-400 sm:order-1">
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
                <span>{error}</span>
              </div>
            )}
            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={loading}
                className="group relative overflow-hidden rounded-xl bg-linear-to-r from-violet-600 to-purple-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:shadow-xl hover:shadow-violet-500/40 focus:outline-none focus:ring-4 focus:ring-violet-500/50 disabled:cursor-not-allowed disabled:opacity-50 sm:order-2"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg
                        className="h-5 w-5 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Quiz
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
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 z-0 bg-linear-to-r from-violet-700 to-purple-700 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            </div>

            {/* Stream Viewer */}
            {form.watch('stream') && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <StreamViewer
                  start={startStream}
                  onParsed={(qs) => onQuestions(qs)}
                />
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
