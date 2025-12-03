'use client';

import React from 'react';
import { tryParseQuestions } from '@/src/utils/parser';
import type { QuizQuestion } from '@/src/types/quiz';

type Props = {
  start: () => Promise<Response>;
  onParsed?: (questions: QuizQuestion[]) => void;
};

export function StreamViewer({ start, onParsed }: Props) {
  const [text, setText] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const textAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Auto-scroll to bottom when new text arrives
    if (textAreaRef.current) {
      textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
    }
  }, [text]);

  const begin = async () => {
    setError(null);
    setText('');
    setLoading(true);
    try {
      const res = await start();
      if (!res.ok) {
        const t = await res.text().catch(() => '');
        throw new Error(`${res.status} ${res.statusText}${t ? `: ${t}` : ''}`);
      }
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('No readable stream');
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setText((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || 'Streaming error');
    } finally {
      setLoading(false);
    }
  };

  const parseNow = () => {
    const q = tryParseQuestions(text);
    if (q && q.length > 0) {
      onParsed?.(q);
    }
  };

  return (
    <div className="rounded-2xl border-2 border-violet-200 bg-violet-50/50 p-6 dark:border-violet-900 dark:bg-violet-950/20">
      <div className="mb-4 flex items-center gap-2">
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
          <h3 className="font-semibold text-violet-900 dark:text-violet-100">
            Stream Mode Active
          </h3>
          <p className="text-sm text-violet-600 dark:text-violet-400">
            Watch the quiz generate in real-time
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={begin}
          disabled={loading}
          className="group relative overflow-hidden rounded-xl bg-violet-600 px-4 py-2.5 font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:shadow-xl hover:shadow-violet-500/40 focus:outline-none focus:ring-4 focus:ring-violet-500/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="relative z-10 flex items-center gap-2">
            {loading ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
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
                Streaming...
              </>
            ) : (
              <>
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
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Start Stream
              </>
            )}
          </span>
        </button>

        <button
          type="button"
          onClick={parseNow}
          disabled={!text}
          className="rounded-xl border-2 border-violet-300 bg-white px-4 py-2.5 font-semibold text-violet-700 transition-all hover:border-violet-400 hover:bg-violet-50 focus:outline-none focus:ring-4 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-violet-700 dark:bg-zinc-900 dark:text-violet-300 dark:hover:bg-violet-950"
        >
          <span className="flex items-center gap-2">
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
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            Parse JSON
          </span>
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border-2 border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
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
          {error}
        </div>
      )}

      <div
        ref={textAreaRef}
        className="relative min-h-64 max-h-96 overflow-auto rounded-xl border-2 border-violet-200 bg-white p-4 font-mono text-sm dark:border-violet-800 dark:bg-zinc-900"
      >
        {text ? (
          <pre className="whitespace-pre-wrap text-zinc-900 dark:text-zinc-100">
            {text}
          </pre>
        ) : (
          <div className="flex h-full min-h-64 items-center justify-center text-zinc-400 dark:text-zinc-600">
            <div className="text-center">
              <svg
                className="mx-auto mb-3 h-12 w-12 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="font-sans">Stream output will appear here...</p>
              <p className="mt-1 text-xs">
                Click &ldquo;Start Stream&rdquo; to begin
              </p>
            </div>
          </div>
        )}
        {loading && (
          <div className="absolute bottom-4 right-4">
            <div className="flex items-center gap-2 rounded-lg bg-violet-100 px-3 py-1.5 text-xs font-medium text-violet-700 dark:bg-violet-950 dark:text-violet-300">
              <div className="h-2 w-2 animate-pulse rounded-full bg-violet-600"></div>
              Live
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
