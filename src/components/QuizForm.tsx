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
import { tryParseQuestions } from '@/src/utils/parser';
import { labTracks } from '@/src/content/tracks';
import type { LabSession } from '@/src/utils/lab';
import { API_BASE_URL } from '@/src/utils/api';

type Props = {
  onQuestions: (questions: QuizQuestion[], config: QuizFormValues) => void;
  progress?: LabSession[];
};

export function QuizForm({ onQuestions, progress = [] }: Props) {
  const questionPresets = [5, 10, 15];
  const focusOptions = Array.from(
    new Set(labTracks.flatMap((track) => track.concepts))
  );

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      displayName: '',
      lang: 'JavaScript',
      num_questions: 5,
      difficulty: 'easy',
      model: 'gpt-oss:20b',
      stream: false,
      focus: 'Scope and closures',
    },
    mode: 'onChange',
  });

  const [phase, setPhase] = React.useState<'onboarding' | 'form'>('onboarding');
  const [languageOpen, setLanguageOpen] = React.useState(false);
  const [languageQuery, setLanguageQuery] = React.useState('');
  const languageRef = React.useRef<HTMLDivElement | null>(null);
  const selectedLanguage = form.watch('lang');
  const filteredLanguages = languageOptions.filter((lang) =>
    lang.toLowerCase().includes(languageQuery.trim().toLowerCase())
  );
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
      focus: values.focus,
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
        onQuestions(data, values);
      } else {
        const text = await res.text();
        const parsed = tryParseQuestions(text);
        if (parsed && parsed.length) {
          onQuestions(parsed, values);
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

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!languageRef.current?.contains(event.target as Node)) {
        setLanguageOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  useEffect(() => {
    const storedName = localStorage.getItem('displayName');
    if (storedName) {
      form.setValue('displayName', storedName);
      setPhase('form');
      setShowForm(true);
    }
  }, [form]);

  return (
    <div className="relative">
      {phase === 'onboarding' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20">
            <div>
              <p className="meta-type mb-7 text-[10px] text-orange-700">
                Coding practice studio / 01
              </p>
              <h1 className="display-type max-w-2xl text-6xl leading-[0.88] text-stone-950 sm:text-7xl">
                Make the next question count.
              </h1>
              <p className="mt-7 max-w-lg text-lg leading-8 text-stone-600">
                Build a focused set of coding questions, then work through it
                without the noise.
              </p>
              {progress.length > 0 && (
              <div className="mt-10 grid max-w-lg grid-cols-3 border-t border-stone-300 pt-5">
                <div>
                  <p className="meta-type text-[10px] text-stone-500">Sessions</p>
                  <p className="mt-2 text-xl font-semibold text-stone-900">{progress.length}</p>
                </div>
                <div className="border-l border-stone-300 pl-4">
                  <p className="meta-type text-[10px] text-stone-500">Questions</p>
                  <p className="mt-2 text-xl font-semibold text-stone-900">
                    {progress.reduce((total, session) => total + session.total, 0)}
                  </p>
                </div>
                <div className="border-l border-stone-300 pl-4">
                  <p className="meta-type text-[10px] text-stone-500">Best</p>
                  <p className="mt-2 text-xl font-semibold text-stone-900">
                    {Math.round(
                      Math.max(...progress.map((session) => (session.score / session.total) * 100))
                    )}%
                  </p>
                </div>
              </div>
            )}

            <div className="mt-12 grid max-w-lg grid-cols-2 border-t border-stone-300 pt-5">
                <div>
                  <p className="meta-type text-[10px] text-stone-500">01</p>
                  <p className="mt-2 text-sm font-semibold text-stone-800">
                    Choose your brief
                  </p>
                </div>
                <div className="border-l border-stone-300 pl-5">
                  <p className="meta-type text-[10px] text-stone-500">02</p>
                  <p className="mt-2 text-sm font-semibold text-stone-800">
                    Take the set
                  </p>
                </div>
              </div>
            </div>

            <div className="surface-card p-7 sm:p-9">
              <p className="meta-type mb-10 text-[10px] text-stone-500">
                First, your name
              </p>
              <div className="mb-7">
                <label className="mb-2 block text-sm font-semibold text-stone-800">
                  What should we call you?
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter your display name"
                    {...form.register('displayName')}
                    className="field-control w-full px-4 py-3.5 text-stone-900 placeholder:text-stone-400"
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
                          localStorage.setItem('displayName', dn);
                        } else {
                          form.trigger('displayName');
                        }
                      }
                    }}
                  />
                  {form.formState.errors.displayName && (
                    <p className="mt-2 text-sm text-red-700">
                      {form.formState.errors.displayName.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                className="accent-button group flex w-full items-center justify-between px-5 py-3.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-orange-500/20"
                onClick={() => {
                  const dn = form.getValues('displayName');
                  const res = quizFormSchema.shape.displayName.safeParse(dn);

                  if (res.success) {
                    setPhase('form');
                    setTimeout(() => setShowForm(true), 50);
                    localStorage.setItem('displayName', dn);
                  } else {
                    form.trigger('displayName');
                  }
                }}
              >
                Continue
                <span className="text-lg transition-transform group-hover:translate-x-1" aria-hidden="true">
                  →
                </span>
              </button>

              <p className="mt-6 border-t border-stone-300 pt-4 text-xs leading-5 text-stone-500">
                Your name is kept in this browser so you can pick up where you
                left off.
              </p>
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
                className="group flex h-10 w-10 items-center justify-center border border-stone-400 bg-transparent transition-colors hover:border-stone-900 hover:bg-stone-900 hover:text-stone-50"
              >
                <svg
                  className="h-5 w-5 text-stone-600 transition-colors group-hover:text-stone-50"
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
                <p className="meta-type mb-2 text-[10px] text-orange-700">
                  Coding practice studio / 02
                </p>
                <h2 className="display-type text-4xl text-stone-950">
                  Set the brief.
                </h2>
                <p className="mt-2 text-sm text-stone-600">
                  Decide what you want to practice, then start the set.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={form.handleSubmit(submitForm)} className="space-y-6">
            <div className="surface-card p-6 sm:p-8">
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Programming Language Select */}
                <div className="sm:col-span-2" ref={languageRef}>
                  <label className="mb-2 block text-sm font-semibold text-stone-800">
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
                    <button
                      type="button"
                      aria-haspopup="listbox"
                      aria-expanded={languageOpen}
                      onClick={() => {
                        setLanguageOpen((open) => !open);
                        setLanguageQuery('');
                      }}
                      className="field-control flex w-full items-center justify-between py-3 pl-11 pr-10 text-left"
                    >
                      <span>{selectedLanguage}</span>
                    </button>
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

                    {languageOpen && (
                      <div className="absolute z-30 mt-2 w-full border border-stone-300 bg-stone-50 shadow-xl">
                        <div className="border-b border-stone-300 p-2">
                          <input
                            value={languageQuery}
                            onChange={(event) => setLanguageQuery(event.target.value)}
                            placeholder="Search language"
                            autoFocus
                            className="w-full border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-orange-600"
                          />
                        </div>
                        <div className="max-h-56 overflow-y-auto py-1" role="listbox">
                          {filteredLanguages.length > 0 ? (
                            filteredLanguages.map((lang) => (
                              <button
                                key={lang}
                                type="button"
                                role="option"
                                aria-selected={selectedLanguage === lang}
                                onClick={() => {
                                  form.setValue('lang', lang, { shouldDirty: true, shouldValidate: true });
                                  setLanguageOpen(false);
                                  setLanguageQuery('');
                                }}
                                className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
                                  selectedLanguage === lang
                                    ? 'bg-stone-900 text-stone-50'
                                    : 'text-stone-800 hover:bg-orange-50 hover:text-orange-900'
                                }`}
                              >
                                <span>{lang}</span>
                                {selectedLanguage === lang && <span aria-hidden="true">✓</span>}
                              </button>
                            ))
                          ) : (
                            <p className="px-3 py-3 text-sm text-stone-500">No language found.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {form.formState.errors.lang && (
                    <p className="mt-1.5 text-sm text-red-700">
                      {form.formState.errors.lang.message}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-stone-800">
                    Focus area
                  </label>
                  <select
                    {...form.register('focus')}
                    className="field-control w-full appearance-none px-4 py-3"
                  >
                    <option value="">Mixed practice</option>
                    {focusOptions.map((focus) => (
                      <option key={focus} value={focus}>
                        {focus}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs leading-5 text-stone-500">
                    A focused brief makes the session easier to revisit and measure.
                  </p>
                </div>

                {/* Number of Questions */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-stone-800">
                    Number of Questions
                  </label>
                  <input
                    type="number"
                    {...form.register('num_questions', { valueAsNumber: true })}
                    className="field-control w-full px-4 py-3"
                    min={1}
                    max={50}
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {questionPresets.map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => {
                          form.setValue('num_questions', num, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }}
                        className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all ${
                          form.watch('num_questions') === num
                            ? 'border-orange-600 bg-orange-100 text-orange-800'
                            : 'border-stone-300 bg-transparent text-stone-700 hover:border-orange-500 hover:text-orange-800'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  {form.formState.errors.num_questions && (
                    <p className="mt-1.5 text-sm text-red-700">
                      {form.formState.errors.num_questions.message}
                    </p>
                  )}
                </div>

                {/* Difficulty */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-stone-800">
                    Difficulty Level
                  </label>
                  <div className="relative">
                    <select
                      {...form.register('difficulty')}
                      className="field-control w-full appearance-none px-4 py-3 pr-10"
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
                  <div className="mt-2 flex flex-wrap gap-2">
                    {difficultyOptions.map((d) => {
                      const isActive = form.watch('difficulty') === d;
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() =>
                            form.setValue('difficulty', d, {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }
                          className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all ${
                            isActive
                              ? 'border-orange-600 bg-orange-100 text-orange-800'
                              : 'border-stone-300 bg-transparent text-stone-700 hover:border-orange-500 hover:text-orange-800'
                          }`}
                        >
                          {d.charAt(0).toUpperCase() + d.slice(1)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Model */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-stone-800">
                    Question engine
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
                      className="field-control w-full appearance-none py-3 pl-11 pr-10"
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
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 sm:order-1">
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
                  className="accent-button group relative overflow-hidden px-8 py-3.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-orange-500/20 disabled:cursor-not-allowed disabled:opacity-50 sm:order-2"
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
                </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
