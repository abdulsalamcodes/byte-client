'use client';

import React from 'react';
import { LandingPage } from '@/src/components/LandingPage';
import { OnboardingScreen } from '@/src/components/OnboardingScreen';
import { QuizForm } from '@/src/components/QuizForm';
import { QuizList } from '@/src/components/QuizList';
import type { ChallengeAttempt, QuizQuestion } from '@/src/types/quiz';
import type { QuizFormValues } from '@/src/schemas/quizForm';
import {
  buildChallengeUrl,
  clearChallengeFromLocation,
  getDailyLabKey,
  readChallengeCodeFromLocation,
  readLabSessions,
  saveLabSession,
  type LabChallenge,
  type LabSession,
} from '@/src/utils/lab';
import { API_BASE_URL } from '@/src/utils/api';

type HomeScreen = 'landing' | 'onboarding' | 'setup';

export default function Home() {
  const [questions, setQuestions] = React.useState<QuizQuestion[] | null>(null);
  const [config, setConfig] = React.useState<QuizFormValues | null>(null);
  const [enableTaking, setEnableTaking] = React.useState(true);
  const [showResults, setShowResults] = React.useState(false);
  const [isSharedChallenge, setIsSharedChallenge] = React.useState(false);
  const [shareState, setShareState] = React.useState<'idle' | 'creating' | 'copied' | 'shared' | 'error'>('idle');
  const [shareUrl, setShareUrl] = React.useState('');
  const [challengeCode, setChallengeCode] = React.useState<string | null>(null);
  const [attempts, setAttempts] = React.useState<ChallengeAttempt[]>([]);
  const [attemptState, setAttemptState] = React.useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [progress, setProgress] = React.useState<LabSession[]>([]);
  const [loadingChallenge, setLoadingChallenge] = React.useState(false);
  const [challengeError, setChallengeError] = React.useState<string | null>(null);
  const [screen, setScreen] = React.useState<HomeScreen>('landing');
  const [displayName, setDisplayName] = React.useState('');


  const loadAttempts = React.useCallback((code: string) => {
    fetch(API_BASE_URL + '/quiz/challenges/' + code + '/attempts')
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text().catch(() => ''));
        return res.json() as Promise<ChallengeAttempt[]>;
      })
      .then(setAttempts)
      .catch(() => setAttempts([]));
  }, []);

  React.useEffect(() => {
    setProgress(readLabSessions());
    setDisplayName(window.localStorage.getItem('displayName') || '');

    const code = readChallengeCodeFromLocation();
    if (!code) return;
    setChallengeCode(code);

    let cancelled = false;
    setLoadingChallenge(true);
    setChallengeError(null);

    fetch(API_BASE_URL + '/quiz/challenges/' + code)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(text || 'Challenge link was not found.');
        }
        return res.json() as Promise<LabChallenge>;
      })
      .then((challenge) => {
        if (cancelled) return;
        setQuestions(challenge.questions);
        setConfig({ ...challenge.config, focus: challenge.config.focus ?? '' });
        setShowResults(true);
        setIsSharedChallenge(true);
        loadAttempts(code);
      })
      .catch((err) => {
        if (cancelled) return;
        setChallengeError(err instanceof Error ? err.message : 'Challenge link was not found.');
      })
      .finally(() => {
        if (!cancelled) setLoadingChallenge(false);
      });

    return () => {
      cancelled = true;
    };
  }, [loadAttempts]);

  const handleQuestionsGenerated = (qs: QuizQuestion[], cfg: QuizFormValues) => {
    setQuestions(qs);
    setConfig(cfg);
    setShowResults(true);
    setIsSharedChallenge(false);
    setChallengeCode(null);
    setAttempts([]);
    setAttemptState('idle');
  };

  const handleStartLab = () => {
    setScreen(displayName ? 'setup' : 'onboarding');
  };

  const handleOnboardingComplete = (name: string) => {
    setDisplayName(name);
    setScreen('setup');
  };

  const handleGenerateNew = () => {
    clearChallengeFromLocation();
    setQuestions(null);
    setConfig(null);
    setShowResults(false);
    setEnableTaking(true);
    setIsSharedChallenge(false);
    setShareState('idle');
    setShareUrl('');
    setChallengeCode(null);
    setAttempts([]);
    setAttemptState('idle');
    setChallengeError(null);
    setScreen(displayName ? 'setup' : 'landing');
  };

  const copyChallengeUrl = async (url: string) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return;
    }

    const input = document.createElement('textarea');
    input.value = url;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    const copied = document.execCommand('copy');
    input.remove();
    if (!copied) throw new Error('Clipboard unavailable');
  };

  const handleShareChallenge = async () => {
    if (!questions || !config || shareState === 'creating') return;
    setShareState('creating');

    try {
      let url = shareUrl;

      // Reuse the existing challenge identity instead of creating another record.
      if (!url && challengeCode) {
        url = buildChallengeUrl(challengeCode);
        setShareUrl(url);
      }

      if (!url) {
        const res = await fetch(API_BASE_URL + '/quiz/challenges', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questions, config }),
        });

        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(text || 'Unable to create challenge link.');
        }

        const data = (await res.json()) as { code: string };
        url = buildChallengeUrl(data.code);
        setShareUrl(url);
        setChallengeCode(data.code);
        loadAttempts(data.code);
      }

      let copied = false;
      try {
        await copyChallengeUrl(url);
        copied = true;
        setShareState('copied');
      } catch {
        setShareState('error');
      }

      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Byte Lab challenge',
            text: 'Try this coding practice challenge.',
            url,
          });
          setShareState('shared');
        } catch {
          if (copied) setShareState('copied');
        }
      }

      window.setTimeout(() => setShareState('idle'), 2400);
    } catch {
      setShareState('error');
    }
  };

  const handleCopyVisibleLink = async () => {
    if (!shareUrl) return;
    try {
      await copyChallengeUrl(shareUrl);
      setShareState('copied');
      window.setTimeout(() => setShareState('idle'), 1800);
    } catch {
      setShareState('error');
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return minutes > 0 ? minutes + 'm ' + remaining + 's' : remaining + 's';
  };

  const bestAttempt = attempts[0];
  const fastestCleanAttempt = attempts
    .filter((attempt) => attempt.score === attempt.total)
    .sort((a, b) => a.duration_seconds - b.duration_seconds)[0];

  const handleComplete = async (
    score: number,
    total: number,
    durationSeconds: number,
    answers: Record<number, string>
  ) => {
    if (!config) return;
    const session: LabSession = {
      id: crypto.randomUUID(),
      completedAt: new Date().toISOString(),
      score,
      total,
      config: {
        lang: config.lang,
        difficulty: config.difficulty,
        num_questions: config.num_questions,
        lab_format: config.lab_format,
      },
    };
    saveLabSession(session);
    setProgress((current) => [session, ...current].slice(0, 30));

    if (!challengeCode) return;

    setAttemptState('saving');
    try {
      const res = await fetch(API_BASE_URL + '/quiz/challenges/' + challengeCode + '/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: config.displayName || 'Anonymous',
          score,
          total,
          duration_seconds: durationSeconds,
          answers: Object.fromEntries(
            Object.entries(answers).map(([index, answer]) => [String(index), answer])
          ),
        }),
      });

      if (!res.ok) throw new Error(await res.text().catch(() => ''));
      const attempt = (await res.json()) as ChallengeAttempt;
      setAttempts((current) =>
        [attempt, ...current]
          .sort((a, b) => b.score - a.score || a.duration_seconds - b.duration_seconds || a.completed_at - b.completed_at)
          .slice(0, 50)
      );
      setAttemptState('saved');
    } catch {
      setAttemptState('error');
    }
  };

  return (
    <div className="app-shell min-h-screen">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 lg:px-10 lg:py-9">
        <header className="mb-16 flex items-center justify-between border-b border-stone-300 pb-5">
          <div className="flex items-baseline gap-2 text-stone-900">
            <span className="text-lg font-black tracking-[-0.08em]">BYTE</span>
            <span className="text-stone-400">/</span>
            <span className="meta-type text-[10px] text-stone-500">LAB</span>
          </div>
          <div className="meta-type text-[10px] text-stone-500">
            {showResults
              ? '02 / PRACTICE'
              : screen === 'landing'
                ? 'BYTE LAB / HOME'
                : screen === 'onboarding'
                  ? 'START / 01'
                  : 'DAILY LAB / ' + getDailyLabKey()}
          </div>
        </header>

        {challengeError && (
          <div className="mb-8 border border-red-300 bg-red-50 p-5 text-sm text-red-800">
            {challengeError}
          </div>
        )}

        {loadingChallenge ? (
          <div className="surface-card p-7 text-sm font-semibold text-stone-700">
            Opening challenge...
          </div>
        ) : !showResults ? (
          <>
            {screen === 'landing' && (
              <LandingPage progress={progress} onStart={handleStartLab} />
            )}
            {screen === 'onboarding' && (
              <OnboardingScreen
                initialName={displayName}
                onBack={() => setScreen('landing')}
                onComplete={handleOnboardingComplete}
              />
            )}
            {screen === 'setup' && (
              <QuizForm
                displayName={displayName}
                onBack={() => setScreen('onboarding')}
                onQuestions={handleQuestionsGenerated}
              />
            )}
          </>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <section className="mb-10 flex flex-col gap-8 border-b border-stone-300 pb-10 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="meta-type mb-4 text-[10px] text-orange-700">
                  {isSharedChallenge ? 'Shared challenge' : 'Practice session'} / {config?.lang ?? 'Coding'}
                </p>
                <h1 className="display-type max-w-2xl text-5xl leading-[0.95] text-stone-950 sm:text-6xl">
                  Make the next question count.
                </h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-stone-600">
                  Work through each prompt at your own pace. Your result is saved
                  locally when you submit the set.
                </p>
              </div>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <button
                  onClick={handleShareChallenge}
                  className="border border-orange-600 px-5 py-3 text-sm font-semibold text-orange-800 transition-colors hover:bg-orange-600 hover:text-white"
                >
                  {shareState === 'creating' ? 'Creating link' : shareState === 'copied' ? 'Link copied' : shareState === 'shared' ? 'Shared' : shareState === 'error' ? 'Copy failed' : 'Share challenge'}
                </button>
                <button
                  onClick={handleGenerateNew}
                  className="flex items-center justify-center gap-2 border border-stone-400 bg-transparent px-5 py-3 text-sm font-semibold text-stone-800 transition-colors hover:border-stone-900 hover:bg-stone-900 hover:text-stone-50"
                >
                  New lab
                  <span aria-hidden="true">+</span>
                </button>
              </div>
            </section>

            {shareUrl && (
              <div className="mb-8 border border-orange-300 bg-orange-50 p-5 sm:p-6">
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                  <p className="meta-type text-[10px] text-orange-800 sm:col-span-2">Challenge link ready</p>
                  <div className="min-w-0">
                    <label htmlFor="challenge-link" className="sr-only">Shareable challenge link</label>
                    <input
                      id="challenge-link"
                      readOnly
                      value={shareUrl}
                      onFocus={(event) => event.currentTarget.select()}
                      className="h-12 w-full border border-orange-300 bg-white px-3 text-xs text-stone-700 outline-none focus:border-orange-600"
                    />
                    <p className="mt-2 text-xs text-stone-600">
                      Send this link to another developer. It opens the same challenge.
                    </p>
                  </div>
                  <button
                    onClick={handleCopyVisibleLink}
                    className="h-12 shrink-0 border border-orange-700 bg-orange-700 px-5 text-sm font-semibold text-white hover:bg-orange-800"
                  >
                    Copy link
                  </button>
                </div>
              </div>
            )}

            <div className="surface-card mb-8 p-5 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="meta-type mb-2 text-[10px] text-stone-500">Practice mode</p>
                  <h2 className="text-xl font-semibold tracking-tight text-stone-950">
                    {enableTaking ? 'Take the assessment' : 'Review answers'}
                  </h2>
                  <p className="mt-1 text-sm text-stone-600">
                    {enableTaking
                      ? 'Choose one answer per question, then submit when ready.'
                      : 'Correct answers and explanations are marked for reference.'}
                  </p>
                </div>
                <label className="flex cursor-pointer items-center gap-3 self-start border border-stone-300 bg-stone-100 px-3 py-2">
                  <span className="text-xs font-semibold text-stone-700">{enableTaking ? 'Taking' : 'Review'}</span>
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
                    <p className="mt-1 text-xl font-semibold text-stone-950">{questions.length}</p>
                  </div>
                  <div className="border-l border-stone-300 pl-4">
                    <p className="meta-type text-[10px] text-stone-500">Focus</p>
                    <p className="mt-1 truncate text-xl font-semibold text-stone-950">{config?.focus || 'Mixed'}</p>
                  </div>
                  <div className="border-l border-stone-300 pl-4">
                    <p className="meta-type text-[10px] text-stone-500">Format</p>
                    <p className="mt-1 text-xl font-semibold text-stone-950">Practice</p>
                  </div>
                </div>
              )}
            </div>

            {challengeCode && (
              <div className="surface-card mb-8 p-5 sm:p-6">
                <div className="flex flex-col gap-5 border-b border-stone-300 pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="meta-type mb-2 text-[10px] text-stone-500">Challenge results</p>
                    <h2 className="text-xl font-semibold tracking-tight text-stone-950">Leaderboard</h2>
                  </div>
                  <p className="text-sm text-stone-600">
                    {attemptState === 'saving'
                      ? 'Saving your attempt...'
                      : attemptState === 'saved'
                        ? 'Attempt saved.'
                        : attemptState === 'error'
                          ? 'Attempt could not be saved.'
                          : attempts.length + ' attempts'}
                  </p>
                </div>

                <div className="grid gap-4 border-b border-stone-300 py-5 sm:grid-cols-3">
                  <div>
                    <p className="meta-type text-[10px] text-stone-500">Best score</p>
                    <p className="mt-1 text-lg font-semibold text-stone-950">
                      {bestAttempt ? bestAttempt.score + '/' + bestAttempt.total : '-'}
                    </p>
                  </div>
                  <div className="sm:border-l sm:border-stone-300 sm:pl-4">
                    <p className="meta-type text-[10px] text-stone-500">Fastest clean</p>
                    <p className="mt-1 text-lg font-semibold text-stone-950">
                      {fastestCleanAttempt ? formatDuration(fastestCleanAttempt.duration_seconds) : '-'}
                    </p>
                  </div>
                  <div className="sm:border-l sm:border-stone-300 sm:pl-4">
                    <p className="meta-type text-[10px] text-stone-500">Challenge code</p>
                    <p className="mt-1 text-lg font-semibold text-stone-950">{challengeCode}</p>
                  </div>
                </div>

                {attempts.length > 0 ? (
                  <ol className="divide-y divide-stone-300">
                    {attempts.slice(0, 8).map((attempt, index) => (
                      <li key={attempt.id} className="grid gap-3 py-4 text-sm sm:grid-cols-[3rem_minmax(0,1fr)_auto_auto] sm:items-center">
                        <span className="meta-type text-[10px] text-stone-500">#{index + 1}</span>
                        <span className="font-semibold text-stone-900">{attempt.display_name}</span>
                        <span className="text-stone-700">{attempt.score}/{attempt.total}</span>
                        <span className="text-stone-500">{formatDuration(attempt.duration_seconds)}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="pt-5 text-sm text-stone-600">
                    Complete this challenge to create the first benchmark.
                  </p>
                )}
              </div>
            )}

            {questions && (
              <QuizList
                questions={questions}
                enableTaking={enableTaking}
                handleGenerateNew={handleGenerateNew}
                onComplete={handleComplete}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
