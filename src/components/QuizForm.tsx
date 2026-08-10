'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  quizFormSchema,
  difficultyOptions,
  languageOptions,
  modelOptions,
  labFormatOptions,
  type QuizFormValues,
} from '@/src/schemas/quizForm';
import type { QuizQuestion, GenerateQuizPayload } from '@/src/types/quiz';
import { tryParseQuestions } from '@/src/utils/parser';
import { labTracks } from '@/src/content/tracks';
import { API_BASE_URL } from '@/src/utils/api';
import { SearchableSelect } from '@/src/components/SearchableSelect';
import { chooseQuestionEngine } from '@/src/utils/modelPolicy';

type Props = {
  displayName: string;
  onBack: () => void;
  onQuestions: (questions: QuizQuestion[], config: QuizFormValues) => void;
};

const showModelPicker = process.env.NEXT_PUBLIC_SHOW_MODEL_PICKER === 'true';

export function QuizForm({ displayName, onBack, onQuestions }: Props) {
  const questionPresets = [5, 10, 15];
  const focusOptions = Array.from(
    new Set(labTracks.flatMap((track) => track.concepts))
  );
  const languageSelectOptions = languageOptions.map((lang) => ({
    value: lang,
    label: lang,
  }));
  const focusSelectOptions = [
    { value: '', label: 'Mixed practice' },
    ...focusOptions.map((focus) => ({ value: focus, label: focus })),
  ];
  const difficultySelectOptions = difficultyOptions.map((difficulty) => ({
    value: difficulty,
    label: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
  }));
  const modelSelectOptions = modelOptions.map((model) => ({
    value: model,
    label: model,
  }));
  const labFormatSelectOptions = labFormatOptions.map((format) => ({
    value: format.value,
    label: format.label,
  }));

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      displayName,
      lang: 'JavaScript',
      num_questions: 5,
      difficulty: 'easy',
      model: 'gpt-oss:20b',
      stream: false,
      focus: 'Scope and closures',
      lab_format: 'concept-check',
    },
    mode: 'onChange',
  });

  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    form.setValue('displayName', displayName, {
      shouldDirty: false,
      shouldValidate: true,
    });
  }, [displayName, form]);

  const submitForm = async (values: QuizFormValues) => {
    setError(null);
    setLoading(true);

    const selectedModel = showModelPicker
      ? values.model
      : chooseQuestionEngine({
          difficulty: values.difficulty,
          labFormat: values.lab_format,
          questionCount: values.num_questions,
        });
    const configWithModel: QuizFormValues = { ...values, model: selectedModel };
    const payload: GenerateQuizPayload = {
      lang: values.lang,
      num_questions: values.num_questions,
      difficulty: values.difficulty,
      model: selectedModel,
      stream: values.stream,
      focus: values.focus,
      lab_format: values.lab_format,
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
        onQuestions(data, configWithModel);
      } else {
        const text = await res.text();
        const parsed = tryParseQuestions(text);
        if (parsed && parsed.length) {
          onQuestions(parsed, configWithModel);
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

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8 flex items-start gap-3">
        <button
          type="button"
          onClick={onBack}
          className="group flex h-10 w-10 shrink-0 items-center justify-center border border-stone-400 bg-transparent transition-colors hover:border-stone-900 hover:bg-stone-900 hover:text-stone-50"
          aria-label="Back to onboarding"
        >
          <svg
            className="h-5 w-5 text-stone-600 transition-colors group-hover:text-stone-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <p className="meta-type mb-2 text-[10px] text-orange-700">
            Coding practice studio / 02
          </p>
          <h1 className="display-type text-5xl leading-none text-stone-950 sm:text-6xl">
            Set the brief.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600">
            Decide what you want to practice, then start the lab. Results and challenge sharing stay attached to this setup.
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(submitForm)} className="space-y-6">
        <input type="hidden" {...form.register('displayName')} />

        <div className="surface-card p-6 sm:p-8">
          <div className="mb-7 flex flex-col gap-3 border-b border-stone-300 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="meta-type mb-2 text-[10px] text-stone-500">Participant</p>
              <p className="text-xl font-semibold text-stone-950">{displayName}</p>
            </div>
            <button
              type="button"
              onClick={onBack}
              className="self-start border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-700 transition-colors hover:border-stone-900 hover:bg-stone-900 hover:text-stone-50 sm:self-auto"
            >
              Change name
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-stone-800">
                Programming Language
              </label>
              <SearchableSelect
                value={form.watch('lang')}
                options={languageSelectOptions}
                searchPlaceholder="Search language"
                leadingIcon={
                  <svg className="h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                }
                onChange={(value) =>
                  form.setValue('lang', value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
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
              <SearchableSelect
                value={form.watch('focus')}
                options={focusSelectOptions}
                searchPlaceholder="Search focus"
                onChange={(value) =>
                  form.setValue('focus', value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
              <p className="mt-2 text-xs leading-5 text-stone-500">
                A focused brief makes the session easier to revisit and measure.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-stone-800">
                Practice format
              </label>
              <SearchableSelect
                value={form.watch('lab_format')}
                options={labFormatSelectOptions}
                searchPlaceholder="Search format"
                onChange={(value) =>
                  form.setValue('lab_format', value as QuizFormValues['lab_format'], {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
              <p className="mt-2 text-xs leading-5 text-stone-500">
                Choose the reasoning mode: concepts, debugging, review, tests, or design tradeoffs.
              </p>
            </div>

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

            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-800">
                Difficulty Level
              </label>
              <SearchableSelect
                value={form.watch('difficulty')}
                options={difficultySelectOptions}
                searchPlaceholder="Search difficulty"
                onChange={(value) =>
                  form.setValue('difficulty', value as QuizFormValues['difficulty'], {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
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

            {showModelPicker && (
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-stone-800">
                  Question engine
                </label>
                <SearchableSelect
                  value={form.watch('model')}
                  options={modelSelectOptions}
                  searchPlaceholder="Search engine"
                  leadingIcon={
                    <svg className="h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                  onChange={(value) =>
                    form.setValue('model', value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                />
                <p className="mt-2 text-xs leading-5 text-stone-500">
                  Internal override. Hidden for users unless NEXT_PUBLIC_SHOW_MODEL_PICKER is enabled.
                </p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 sm:order-1">
            <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-stone-500">
            Generated labs are reviewed against strict answer formatting and can be shared as short challenge links.
          </p>
          <button
            type="submit"
            disabled={loading}
            className="accent-button group relative shrink-0 overflow-hidden px-8 py-3.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-orange-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 whitespace-nowrap">
              {loading ? (
                <>
                  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
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
                  Generate Lab
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
