'use client';

import Link from 'next/link';
import React from 'react';
import type { PublicChallengeSummary } from '@/src/types/quiz';
import { API_BASE_URL } from '@/src/utils/api';

function formatDuration(seconds: number | null | undefined) {
  if (seconds == null) return '-';
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return minutes > 0 ? `${minutes}m ${remaining}s` : `${remaining}s`;
}

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(new Date(timestamp * 1000));
}

export function ChallengeDirectory() {
  const [challenges, setChallenges] = React.useState<PublicChallengeSummary[]>([]);
  const [status, setStatus] = React.useState<'loading' | 'ready' | 'error'>('loading');

  React.useEffect(() => {
    let cancelled = false;

    fetch(`${API_BASE_URL}/quiz/challenges`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text().catch(() => ''));
        return res.json() as Promise<PublicChallengeSummary[]>;
      })
      .then((data) => {
        if (cancelled) return;
        setChallenges(data);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === 'loading') {
    return (
      <div className="surface-card p-6 text-sm font-semibold text-stone-700">
        Loading public challenges...
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="border border-red-300 bg-red-50 p-6 text-sm text-red-800">
        Public challenges could not be loaded. Check that the Byte server is running.
      </div>
    );
  }

  if (challenges.length === 0) {
    return (
      <div className="surface-card p-7 sm:p-8">
        <p className="meta-type text-[10px] text-stone-500">No public challenges yet</p>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-stone-950">
          Be the first to publish a challenge.
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600">
          Create a lab, use the publish action on the results page, and it will appear here for anyone to join.
        </p>
        <Link href="/" className="accent-button mt-6 inline-flex min-w-48 items-center justify-between px-5 py-3.5 text-sm font-semibold">
          Create a lab
          <span aria-hidden="true">{'->'}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {challenges.map((challenge) => (
        <article key={challenge.code} className="border border-stone-300 bg-stone-50/80 p-5 transition-colors hover:border-stone-500 hover:bg-white sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="meta-type border border-orange-300 bg-orange-50 px-2.5 py-1 text-[10px] text-orange-800">
                  {challenge.lab_format.replace(/-/g, ' ')}
                </span>
                <span className="meta-type border border-stone-300 bg-white px-2.5 py-1 text-[10px] text-stone-600">
                  {challenge.difficulty}
                </span>
              </div>
              <h2 className="text-xl font-semibold tracking-tight text-stone-950">{challenge.title}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Created by {challenge.creator_name} · {challenge.question_count} questions · {formatDate(challenge.created_at)}
              </p>
            </div>
            <Link href={`/${challenge.code}`} className="accent-button inline-flex items-center justify-between gap-8 px-5 py-3 text-sm font-semibold">
              Join challenge
              <span aria-hidden="true">{'->'}</span>
            </Link>
          </div>

          <div className="mt-5 grid gap-3 border-t border-stone-300 pt-5 sm:grid-cols-3">
            <div>
              <p className="meta-type text-[10px] text-stone-500">Attempts</p>
              <p className="mt-1 text-lg font-semibold text-stone-950">{challenge.attempt_count}</p>
            </div>
            <div>
              <p className="meta-type text-[10px] text-stone-500">Best score</p>
              <p className="mt-1 text-lg font-semibold text-stone-950">
                {challenge.best_score === null || challenge.best_total === null
                  ? '-'
                  : `${challenge.best_score}/${challenge.best_total}`}
              </p>
            </div>
            <div>
              <p className="meta-type text-[10px] text-stone-500">Fastest clean</p>
              <p className="mt-1 text-lg font-semibold text-stone-950">
                {formatDuration(challenge.fastest_clean_seconds)}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
