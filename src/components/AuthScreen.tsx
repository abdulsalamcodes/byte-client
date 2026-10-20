'use client';

import React from 'react';
import { useForm, type FieldError, type UseFormRegisterReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/src/components/AuthProvider';
import {
  signInSchema,
  signUpSchema,
  type SignInValues,
  type SignUpValues,
} from '@/src/schemas/auth';

type Mode = 'signIn' | 'signUp';

type Props = {
  eyebrow: string;
  title: string;
  intro: string;
  onBack: () => void;
  onAuthenticated: () => void;
};

export function AuthScreen({ eyebrow, title, intro, onBack, onAuthenticated }: Props) {
  const [mode, setMode] = React.useState<Mode>('signUp');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <button
        type="button"
        onClick={onBack}
        className="mb-8 group flex h-10 w-10 items-center justify-center border border-stone-400 bg-transparent transition-colors hover:border-stone-900 hover:bg-stone-900 hover:text-stone-50"
        aria-label="Go back"
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
          <p className="meta-type mb-5 text-[10px] text-orange-700">{eyebrow}</p>
          <h1 className="display-type max-w-3xl text-6xl leading-[0.9] text-stone-950 sm:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-stone-600">{intro}</p>
        </div>

        <div className="surface-card p-7 sm:p-9">
          <div className="mb-8 grid grid-cols-2 border border-stone-300" role="tablist" aria-label="Account">
            {(['signUp', 'signIn'] as const).map((option) => (
              <button
                key={option}
                type="button"
                role="tab"
                aria-selected={mode === option}
                onClick={() => setMode(option)}
                className={`px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-4 focus:ring-orange-500/20 ${
                  mode === option ? 'bg-stone-900 text-stone-50' : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                {option === 'signUp' ? 'Create account' : 'Sign in'}
              </button>
            ))}
          </div>

          {mode === 'signUp' ? (
            <SignUpForm onAuthenticated={onAuthenticated} />
          ) : (
            <SignInForm onAuthenticated={onAuthenticated} />
          )}
        </div>
      </section>
    </div>
  );
}

function SignInForm({ onAuthenticated }: { onAuthenticated: () => void }) {
  const { signIn } = useAuth();
  const form = useForm<SignInValues>({ resolver: zodResolver(signInSchema) });
  const [error, setError] = React.useState<string | null>(null);

  const submit = form.handleSubmit(async ({ email, password }) => {
    setError(null);
    try {
      await signIn(email, password);
      onAuthenticated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    }
  });

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <Field
        id="sign-in-email"
        label="Email"
        type="email"
        autoComplete="email"
        registration={form.register('email')}
        error={form.formState.errors.email}
      />
      <Field
        id="sign-in-password"
        label="Password"
        type="password"
        autoComplete="current-password"
        registration={form.register('password')}
        error={form.formState.errors.password}
      />
      <FormError message={error} />
      <SubmitButton pending={form.formState.isSubmitting} idleLabel="Sign in" pendingLabel="Signing in" />
    </form>
  );
}

function SignUpForm({ onAuthenticated }: { onAuthenticated: () => void }) {
  const { signUp } = useAuth();
  const form = useForm<SignUpValues>({ resolver: zodResolver(signUpSchema) });
  const [error, setError] = React.useState<string | null>(null);

  const submit = form.handleSubmit(async (values) => {
    setError(null);
    try {
      await signUp(values);
      onAuthenticated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Account could not be created');
    }
  });

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <Field
        id="sign-up-name"
        label="Display name"
        hint="Shown on challenge leaderboards."
        autoComplete="nickname"
        registration={form.register('display_name')}
        error={form.formState.errors.display_name}
      />
      <Field
        id="sign-up-email"
        label="Email"
        type="email"
        autoComplete="email"
        registration={form.register('email')}
        error={form.formState.errors.email}
      />
      <Field
        id="sign-up-password"
        label="Password"
        type="password"
        hint="At least 8 characters."
        autoComplete="new-password"
        registration={form.register('password')}
        error={form.formState.errors.password}
      />
      <FormError message={error} />
      <SubmitButton pending={form.formState.isSubmitting} idleLabel="Create account" pendingLabel="Creating account" />
    </form>
  );
}

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  type?: 'text' | 'email' | 'password';
  autoComplete: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
};

function Field({ id, label, hint, type = 'text', autoComplete, registration, error }: FieldProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-stone-800">
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className="field-control w-full px-4 py-3.5 text-stone-900 placeholder:text-stone-400"
        {...registration}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-700">
          {error.message}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-stone-500">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
      {message}
    </p>
  );
}

function SubmitButton({ pending, idleLabel, pendingLabel }: { pending: boolean; idleLabel: string; pendingLabel: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="accent-button group flex w-full items-center justify-between px-5 py-3.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-orange-500/20 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? pendingLabel + '...' : idleLabel}
      <span className="text-lg transition-transform group-hover:translate-x-1" aria-hidden="true">
        {'->'}
      </span>
    </button>
  );
}
