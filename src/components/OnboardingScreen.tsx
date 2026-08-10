'use client';

import React from 'react';
import { quizFormSchema } from '@/src/schemas/quizForm';

type Props = {
  initialName: string;
  onBack: () => void;
  onComplete: (displayName: string) => void;
};

export function OnboardingScreen({ initialName, onBack, onComplete }: Props) {
  const [displayName, setDisplayName] = React.useState(initialName);
  const [error, setError] = React.useState<string | null>(null);

  const continueToSetup = () => {
    const result = quizFormSchema.shape.displayName.safeParse(displayName);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Display name is required');
      return;
    }

    window.localStorage.setItem('displayName', displayName);
    onComplete(displayName);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <button
        type="button"
        onClick={onBack}
        className="mb-8 group flex h-10 w-10 items-center justify-center border border-stone-400 bg-transparent transition-colors hover:border-stone-900 hover:bg-stone-900 hover:text-stone-50"
        aria-label="Back to landing page"
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

      <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_28rem] lg:items-start lg:gap-16">
        <div>
          <p className="meta-type mb-5 text-[10px] text-orange-700">Start / 01</p>
          <h1 className="display-type max-w-3xl text-6xl leading-[0.9] text-stone-950 sm:text-7xl">
            Set your identity for shared challenges.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-stone-600">
            Your display name is used for local progress and peer challenge results. Accounts can come later; this keeps the first lab lightweight.
          </p>
        </div>

        <div className="surface-card p-7 sm:p-9">
          <p className="meta-type mb-8 text-[10px] text-stone-500">Your profile</p>
          <label htmlFor="display-name" className="mb-2 block text-sm font-semibold text-stone-800">
            What should we call you?
          </label>
          <input
            id="display-name"
            type="text"
            value={displayName}
            onChange={(event) => {
              setDisplayName(event.target.value);
              setError(null);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                continueToSetup();
              }
            }}
            placeholder="Enter your display name"
            className="field-control w-full px-4 py-3.5 text-stone-900 placeholder:text-stone-400"
            autoFocus
          />
          {error && <p className="mt-2 text-sm text-red-700">{error}</p>}

          <button
            type="button"
            onClick={continueToSetup}
            className="accent-button group mt-6 flex w-full items-center justify-between px-5 py-3.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-orange-500/20"
          >
            Continue to setup
            <span className="text-lg transition-transform group-hover:translate-x-1" aria-hidden="true">
              {'->'}
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}
