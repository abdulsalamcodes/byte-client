'use client';

import React from 'react';
import { AuthScreen } from '@/src/components/AuthScreen';
import { useAuth } from '@/src/components/AuthProvider';
import { LandingPage } from '@/src/components/LandingPage';
import { QuizForm } from '@/src/components/QuizForm';
import { QuizList } from '@/src/components/QuizList';
import type { ChallengeConfig, ChallengeVisibility, LeaderboardEntry, QuizQuestion } from '@/src/types/quiz';
import type { QuizFormValues } from '@/src/schemas/quizForm';
import {
  buildChallengeUrl,
  clearChallengeFromLocation,
  getDailyLabKey,
  readChallengeCodeFromLocation,
  readLabSessions,
  saveLabSession,
  scoreAnswers,
  toChallengeConfig,
  withGradedAnswers,
  type LabSession,
} from '@/src/utils/lab';
import {
  createChallenge,
  fetchChallenge,
  fetchLeaderboard,
  isUnauthorized,
  setChallengeVisibility,
  submitAttempt,
} from '@/src/utils/api';

type HomeScreen = 'landing' | 'auth' | 'setup';

type ActiveChallenge = {
  code: string;
  isPublic: boolean;
  creatorId: string;
};

type AttemptStatus = 'idle' | 'saving' | 'ranked' | 'creator' | 'repeat' | 'error';

const attemptStatusCopy: Record<Exclude<AttemptStatus, 'idle'>, string> = {
  saving: 'Submitting your attempt...',
  ranked: 'Your attempt is on the leaderboard.',
  creator: 'Creator attempts are not ranked.',
  repeat: 'Only your first attempt is ranked.',
  error: 'Attempt could not be submitted.',
};

export default function Home() {
  const auth = useAuth();
  const [questions, setQuestions] = React.useState<QuizQuestion[] | null>(null);
  const [config, setConfig] = React.useState<ChallengeConfig | null>(null);
  const [enableTaking, setEnableTaking] = React.useState(true);
  const [showResults, setShowResults] = React.useState(false);
  const [isSharedChallenge, setIsSharedChallenge] = React.useState(false);
  const [shareState, setShareState] = React.useState<'idle' | 'creating' | 'copied' | 'shared' | 'error'>('idle');
  const [publishState, setPublishState] = React.useState<'idle' | 'publishing' | 'error'>('idle');
  const [shareUrl, setShareUrl] = React.useState('');
  const [challenge, setChallenge] = React.useState<ActiveChallenge | null>(null);
  const [leaderboard, setLeaderboard] = React.useState<LeaderboardEntry[]>([]);
  const [attemptStatus, setAttemptStatus] = React.useState<AttemptStatus>('idle');
  const [progress, setProgress] = React.useState<LabSession[]>([]);
  const [loadingChallenge, setLoadingChallenge] = React.useState(false);
  const [challengeError, setChallengeError] = React.useState<string | null>(null);
  const [screen, setScreen] = React.useState<HomeScreen>('landing');
  // Shown over a shared challenge when a signed-out visitor wants to take it.
  const [authPromptOpen, setAuthPromptOpen] = React.useState(false);

  const isSignedIn = auth.status === 'signedIn';
  const isOwner = Boolean(challenge && auth.user && challenge.creatorId === auth.user.id);
  const answersKnown = Boolean(questions?.every((question) => question.answer !== undefined));
  const canPublish = isSignedIn && (!challenge || isOwner);

  const loadLeaderboard = React.useCallback((code: string) => {
    fetchLeaderboard(code)
      .then(setLeaderboard)
      .catch(() => setLeaderboard([]));
  }, []);

  React.useEffect(() => {
    setProgress(readLabSessions());

    const code = readChallengeCodeFromLocation();
    if (!code) return;

    let cancelled = false;
    setLoadingChallenge(true);
    setChallengeError(null);

    fetchChallenge(code)
      .then((view) => {
        if (cancelled) return;
        setQuestions(view.questions);
        setConfig(view.config);
        setChallenge({ code: view.code, isPublic: view.is_public, creatorId: view.creator_id });
        setShowResults(true);
        setIsSharedChallenge(true);
        loadLeaderboard(view.code);
      })
      .catch((err) => {
        if (cancelled) return;
        setChallengeError(err instanceof Error && err.message ? err.message : 'Challenge link was not found.');
      })
      .finally(() => {
        if (!cancelled) setLoadingChallenge(false);
      });

    return () => {
      cancelled = true;
    };
  }, [loadLeaderboard]);

  const handleUnauthorized = (err: unknown) => {
    if (isUnauthorized(err)) auth.signOut();
  };

  const handleQuestionsGenerated = (qs: QuizQuestion[], values: QuizFormValues) => {
    setQuestions(qs);
    setConfig(toChallengeConfig(values));
    setShowResults(true);
    setEnableTaking(true);
    setIsSharedChallenge(false);
    setChallenge(null);
    setShareUrl('');
    setLeaderboard([]);
    setAttemptStatus('idle');
    setPublishState('idle');
  };

  const handleStartLab = () => {
    setScreen(isSignedIn ? 'setup' : 'auth');
  };

  const handleAuthenticated = () => {
    if (authPromptOpen) {
      setAuthPromptOpen(false);
      return;
    }
    setScreen('setup');
  };

  const handleSignOut = () => {
    auth.signOut();
    if (!showResults) setScreen('landing');
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
    setChallenge(null);
    setLeaderboard([]);
    setAttemptStatus('idle');
    setPublishState('idle');
    setChallengeError(null);
    setAuthPromptOpen(false);
    setScreen(isSignedIn ? 'setup' : 'landing');
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

  // Snapshots the current solo lab as a challenge. The server returns the existing
  // code when this quiz was already shared, so repeated calls reuse one identity.
  const createChallengeFromLab = async (isPublic: boolean): Promise<ChallengeVisibility> => {
    if (auth.status !== 'signedIn' || !questions || !config) {
      throw new Error('Sign in to share this lab.');
    }
    const created = await createChallenge(auth.token, { questions, config, is_public: isPublic });
    setChallenge({ code: created.code, isPublic: created.is_public, creatorId: auth.user.id });
    loadLeaderboard(created.code);
    return created;
  };

  const handleShareChallenge = async () => {
    if (!questions || !config || shareState === 'creating') return;
    setShareState('creating');

    try {
      const code = challenge?.code ?? (await createChallengeFromLab(false)).code;
      const url = buildChallengeUrl(code);
      setShareUrl(url);

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
    } catch (err) {
      handleUnauthorized(err);
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

  const handlePublishChallenge = async () => {
    if (auth.status !== 'signedIn' || challenge?.isPublic || publishState === 'publishing') return;
    setPublishState('publishing');

    try {
      let published: ChallengeVisibility;
      if (challenge) {
        published = await setChallengeVisibility(auth.token, challenge.code, true);
        setChallenge({ ...challenge, isPublic: published.is_public });
      } else {
        published = await createChallengeFromLab(true);
      }
      const url = buildChallengeUrl(published.code);
      setShareUrl(url);
      setPublishState('idle');

      try {
        await copyChallengeUrl(url);
        setShareState('copied');
      } catch {
        setShareState('idle');
      }
    } catch (err) {
      handleUnauthorized(err);
      setPublishState('error');
    }
  };

  const gradeChallengeAttempt = async (
    code: string,
    answers: Record<number, string>,
    durationSeconds: number
  ) => {
    if (auth.status !== 'signedIn') {
      setAuthPromptOpen(true);
      throw new Error('Sign in to submit this challenge.');
    }

    setAttemptStatus('saving');
    try {
      const result = await submitAttempt(auth.token, code, {
        answers: Object.fromEntries(Object.entries(answers).map(([index, answer]) => [String(index), answer])),
        duration_seconds: durationSeconds,
      });
      setQuestions((current) => (current ? withGradedAnswers(current, result.results) : current));
      setAttemptStatus(result.ranked ? 'ranked' : (result.unranked_reason ?? 'error'));
      if (result.ranked) loadLeaderboard(code);
      return result.score;
    } catch (err) {
      setAttemptStatus('error');
      if (isUnauthorized(err)) {
        auth.signOut();
        throw new Error('Your session expired. Sign in again to submit.');
      }
      throw err;
    }
  };

  const handleSubmitAnswers = async (answers: Record<number, string>, durationSeconds: number) => {
    if (!questions || !config) throw new Error('There is no active lab to submit.');

    const score = challenge
      ? await gradeChallengeAttempt(challenge.code, answers, durationSeconds)
      : scoreAnswers(questions, answers);

    const session: LabSession = {
      id: crypto.randomUUID(),
      completedAt: new Date().toISOString(),
      score,
      total: questions.length,
      config: {
        lang: config.lang,
        difficulty: config.difficulty,
        num_questions: config.num_questions,
        lab_format: config.lab_format,
      },
    };
    saveLabSession(session);
    setProgress((current) => [session, ...current].slice(0, 30));
    return score;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return minutes > 0 ? minutes + 'm ' + remaining + 's' : remaining + 's';
  };

  const bestAttempt = leaderboard[0];
  const fastestCleanAttempt = leaderboard
    .filter((attempt) => attempt.score === attempt.total)
    .sort((a, b) => a.duration_seconds - b.duration_seconds)[0];

  const headerLabel = showResults
    ? '02 / PRACTICE'
    : screen === 'landing'
      ? 'BYTE LAB / HOME'
      : screen === 'auth'
        ? 'ACCOUNT / 01'
        : 'DAILY LAB / ' + getDailyLabKey();

  const renderEntryScreens = () => {
    if (screen === 'landing') {
      return <LandingPage progress={progress} onStart={handleStartLab} />;
    }
    if (auth.status === 'loading') {
      return (
        <div className="surface-card p-7 text-sm font-semibold text-stone-700">
          Checking your session...
        </div>
      );
    }
    if (screen === 'auth' || !isSignedIn) {
      return (
        <AuthScreen
          eyebrow="Start / 01"
          title="Create your Byte Lab account."
          intro="Your account keeps your name on challenge leaderboards and lets you generate, share, and publish labs."
          onBack={() => setScreen('landing')}
          onAuthenticated={handleAuthenticated}
        />
      );
    }
    return <QuizForm onBack={() => setScreen('landing')} onQuestions={handleQuestionsGenerated} />;
  };

  return (
    <div className="app-shell min-h-screen">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 lg:px-10 lg:py-9">
        <header className="mb-16 flex items-center justify-between gap-4 border-b border-stone-300 pb-5">
          <div className="flex items-baseline gap-2 text-stone-900">
            <span className="text-lg font-black tracking-[-0.08em]">BYTE</span>
            <span className="text-stone-400">/</span>
            <span className="meta-type text-[10px] text-stone-500">LAB</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="meta-type hidden text-[10px] text-stone-500 sm:block">{headerLabel}</div>
            {auth.status === 'signedIn' && (
              <div className="flex items-center gap-3 border-l border-stone-300 pl-4">
                <span className="max-w-32 truncate text-xs font-semibold text-stone-800">
                  {auth.user.display_name}
                </span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="border border-stone-300 px-2.5 py-1.5 text-xs font-semibold text-stone-700 transition-colors hover:border-stone-900 hover:bg-stone-900 hover:text-stone-50 focus:outline-none focus:ring-4 focus:ring-orange-500/20"
                >
                  Sign out
                </button>
              </div>
            )}
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
        ) : authPromptOpen ? (
          <AuthScreen
            eyebrow="Shared challenge"
            title="Sign in to take this challenge."
            intro="Your answers are checked by Byte Lab and your first attempt is ranked on the challenge leaderboard."
            onBack={() => setAuthPromptOpen(false)}
            onAuthenticated={handleAuthenticated}
          />
        ) : !showResults ? (
          renderEntryScreens()
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
                  {challenge
                    ? 'Answers are checked when you submit. Your first attempt is ranked on the leaderboard.'
                    : 'Work through each prompt at your own pace. Your result is saved locally when you submit the set.'}
                </p>
              </div>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <button
                  onClick={handleShareChallenge}
                  className="border border-orange-600 px-5 py-3 text-sm font-semibold text-orange-800 transition-colors hover:bg-orange-600 hover:text-white"
                >
                  {shareState === 'creating' ? 'Creating link' : shareState === 'copied' ? 'Link copied' : shareState === 'shared' ? 'Shared' : shareState === 'error' ? 'Copy failed' : 'Share challenge'}
                </button>
                {canPublish && (
                  <button
                    onClick={handlePublishChallenge}
                    disabled={publishState === 'publishing' || challenge?.isPublic}
                    className="border border-stone-900 bg-stone-900 px-5 py-3 text-sm font-semibold text-stone-50 transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {challenge?.isPublic ? 'Published publicly' : publishState === 'publishing' ? 'Publishing' : publishState === 'error' ? 'Publish failed' : 'Publish publicly'}
                  </button>
                )}
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
                {answersKnown ? (
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
                ) : (
                  <p className="self-start border border-stone-300 bg-stone-100 px-3 py-2 text-xs font-semibold text-stone-600">
                    Answers unlock after you submit
                  </p>
                )}
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

            {challenge && (
              <div className="surface-card mb-8 p-5 sm:p-6">
                <div className="flex flex-col gap-5 border-b border-stone-300 pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="meta-type mb-2 text-[10px] text-stone-500">Challenge results</p>
                    <h2 className="text-xl font-semibold tracking-tight text-stone-950">Leaderboard</h2>
                  </div>
                  <p className="text-sm text-stone-600" aria-live="polite">
                    {attemptStatus === 'idle'
                      ? leaderboard.length + ' ranked attempts'
                      : attemptStatusCopy[attemptStatus]}
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
                    <p className="mt-1 text-lg font-semibold text-stone-950">{challenge.code}</p>
                  </div>
                </div>

                {leaderboard.length > 0 ? (
                  <ol className="divide-y divide-stone-300">
                    {leaderboard.slice(0, 8).map((entry, index) => (
                      <li key={entry.id} className="grid gap-3 py-4 text-sm sm:grid-cols-[3rem_minmax(0,1fr)_auto_auto] sm:items-center">
                        <span className="meta-type text-[10px] text-stone-500">#{index + 1}</span>
                        <span className="font-semibold text-stone-900">
                          {entry.display_name}
                          {entry.user_id === auth.user?.id && (
                            <span className="meta-type ml-2 border border-orange-300 bg-orange-50 px-1.5 py-0.5 text-[9px] text-orange-800">
                              You
                            </span>
                          )}
                        </span>
                        <span className="text-stone-700">{entry.score}/{entry.total}</span>
                        <span className="text-stone-500">{formatDuration(entry.duration_seconds)}</span>
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

            {questions && isSharedChallenge && !isSignedIn ? (
              <div className="surface-card p-6 sm:p-8">
                <p className="meta-type mb-2 text-[10px] text-stone-500">Take part</p>
                <h2 className="text-xl font-semibold tracking-tight text-stone-950">
                  {auth.status === 'loading' ? 'Checking your session...' : 'Sign in to take this challenge'}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">
                  {questions.length} questions. The timer starts when you open the questions after signing in.
                </p>
                {auth.status === 'signedOut' && (
                  <button
                    type="button"
                    onClick={() => setAuthPromptOpen(true)}
                    className="accent-button group mt-6 inline-flex min-w-48 items-center justify-between gap-6 px-5 py-3.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-orange-500/20"
                  >
                    Sign in to start
                    <span className="text-lg transition-transform group-hover:translate-x-1" aria-hidden="true">
                      {'->'}
                    </span>
                  </button>
                )}
              </div>
            ) : (
              questions && (
                <QuizList
                  questions={questions}
                  enableTaking={enableTaking}
                  handleGenerateNew={handleGenerateNew}
                  onSubmit={handleSubmitAnswers}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
