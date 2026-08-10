'use client';

import Link from 'next/link';
import type { LabSession } from '@/src/utils/lab';

type Props = {
  progress?: LabSession[];
  onStart: () => void;
};

const practiceFormats = [
  {
    title: 'System design',
    copy: 'Work through tradeoffs, constraints, failure modes, and operational costs before choosing an answer.',
  },
  {
    title: 'Debugging',
    copy: 'Read broken code like a production incident: isolate the cause, reject noise, explain the fix.',
  },
  {
    title: 'Code review',
    copy: 'Practice spotting maintainability, correctness, security, and readability issues in real diffs.',
  },
  {
    title: 'Testing instincts',
    copy: 'Choose the test that protects behavior, not the one that merely improves coverage numbers.',
  },
  {
    title: 'Programming reasoning',
    copy: 'Sharpen language semantics, runtime behavior, edge cases, and mental execution of code.',
  },
  {
    title: 'Refactoring',
    copy: 'Improve structure while preserving behavior, naming the risk and the safest migration path.',
  },
];

const productPrinciples = [
  {
    title: 'Ten-minute labs',
    copy: 'Short sessions that fit into a real engineering day.',
  },
  {
    title: 'Peer challenges',
    copy: 'Share the same challenge link and compare results.',
  },
  {
    title: 'Judgment-first answers',
    copy: 'Explanations focus on reasoning, not trivia.',
  },
  {
    title: 'Production formats',
    copy: 'Practice debugging, review, testing, and design tradeoffs.',
  },
];

const footerLinks = [
  { label: 'Product', href: '/product' },
  { label: 'Roadmap', href: '/roadmap' },
  { label: 'Challenge links', href: '/challenge-links' },
  { label: 'Teams', href: '/teams' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Contact', href: '/contact' },
];

export function LandingPage({ onStart }: Props) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 overflow-hidden duration-700">
      <section className="mx-auto max-w-5xl px-0 text-center">
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2 sm:mb-7 sm:gap-3">
          <p className="meta-type border border-orange-300 bg-orange-50 px-3 py-2 text-[10px] text-orange-800">
            Dev judgment lab
          </p>
          <p className="meta-type border border-stone-300 bg-stone-100 px-3 py-2 text-[10px] text-stone-600">
            Shareable practice
          </p>
        </div>

        <h1 className="display-type mx-auto max-w-5xl text-[3.5rem] leading-[0.9] text-stone-950 min-[390px]:text-6xl sm:text-7xl lg:text-8xl">
          Build sharper engineering instincts.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-stone-600 sm:mt-7 sm:text-lg sm:leading-8">
          Byte Lab trains debugging, review judgment, system tradeoffs, testing instincts, and code reasoning in focused ten-minute labs.
        </p>

        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-9 sm:flex-row sm:items-center">
          <button
            type="button"
            className="accent-button group flex w-full items-center justify-between px-5 py-3.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-orange-500/20 sm:w-52"
            onClick={onStart}
          >
            Start a lab
            <span className="text-lg transition-transform group-hover:translate-x-1" aria-hidden="true">
              {'->'}
            </span>
          </button>
          <div className="w-full border border-stone-300 bg-stone-100 px-5 py-3 text-center text-sm font-semibold text-stone-700 sm:w-auto">
            No signup required
          </div>
        </div>
      </section>

      <section className="mt-12 sm:mt-16">
        <div className="surface-card mx-auto max-w-6xl overflow-hidden p-2 shadow-2xl shadow-stone-900/10 sm:p-3">
          <div className="border border-stone-300 bg-stone-950">
            <div className="flex min-w-0 items-center justify-between gap-3 border-b border-stone-800 bg-stone-900 px-3 py-3 sm:px-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </div>
              <p className="meta-type min-w-0 truncate text-[9px] text-stone-500 sm:text-[10px]">byte-lab.local / challenge</p>
              <p className="meta-type hidden text-[10px] text-orange-300 sm:block">System design</p>
            </div>

            <div className="grid bg-stone-100 lg:min-h-[30rem] lg:grid-cols-[14rem_minmax(0,1fr)_14rem]">
              <aside className="hidden border-r border-stone-300 bg-stone-50 p-5 lg:block">
                <p className="meta-type text-[10px] text-stone-500">Lab brief</p>
                <div className="mt-5 space-y-3 text-sm">
                  <div className="border border-orange-400 bg-orange-50 p-3 font-semibold text-orange-900">
                    Queues
                  </div>
                  <div className="border border-stone-300 bg-white p-3 text-stone-700">
                    Idempotency
                  </div>
                  <div className="border border-stone-300 bg-white p-3 text-stone-700">
                    Durability
                  </div>
                </div>
                <div className="mt-8 border-t border-stone-300 pt-5">
                  <p className="meta-type text-[10px] text-stone-500">Mode</p>
                  <p className="mt-2 text-lg font-semibold text-stone-950">Peer challenge</p>
                </div>
              </aside>

              <main className="min-w-0 p-4 sm:p-7">
                <div className="flex flex-col gap-3 border-b border-stone-300 pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="meta-type text-[9px] text-orange-700 sm:text-[10px]">Question 01 of 05</p>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-stone-950 sm:text-2xl">
                      Preserve writes during traffic spikes.
                    </h3>
                  </div>
                  <p className="meta-type text-[9px] text-stone-500 sm:text-[10px]">04:28 elapsed</p>
                </div>

                <div className="mt-5 overflow-hidden border border-stone-300 bg-stone-950 p-4 font-mono text-[11px] leading-6 text-stone-100 sm:p-5 sm:text-xs">
                  <p className="text-orange-300">system-design / queues</p>
                  <p className="mt-4 text-stone-200">Traffic spikes overwhelm synchronous writes.</p>
                  <p className="text-stone-400">Choose the design that preserves durability without blocking requests.</p>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="border border-stone-300 bg-white px-3 py-3 text-sm leading-6 text-stone-700 sm:px-4 sm:py-4">
                    Add retries in the request path.
                  </div>
                  <div className="border border-orange-500 bg-orange-50 px-3 py-3 text-sm font-semibold leading-6 text-orange-900 shadow-sm shadow-orange-900/10 sm:px-4 sm:py-4">
                    Queue writes with idempotent workers.
                  </div>
                  <div className="border border-stone-300 bg-white px-3 py-3 text-sm leading-6 text-stone-700 sm:px-4 sm:py-4">
                    Cache every write response.
                  </div>
                  <div className="border border-stone-300 bg-white px-3 py-3 text-sm leading-6 text-stone-700 sm:px-4 sm:py-4">
                    Move writes to the client.
                  </div>
                </div>

                <div className="mt-5 border border-stone-300 bg-white p-4">
                  <p className="text-sm font-semibold text-stone-950">Reasoning check</p>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    The answer should account for durability, retries, idempotency, and worker recovery.
                  </p>
                </div>
              </main>

              <aside className="border-t border-stone-300 bg-stone-50 p-4 sm:p-5 lg:border-l lg:border-t-0">
                <p className="meta-type text-[10px] text-stone-500">Session</p>
                <div className="mt-5 grid grid-cols-1 gap-3 min-[420px]:grid-cols-3 lg:grid-cols-1">
                  <div className="border border-stone-300 bg-white p-3">
                    <p className="meta-type text-[10px] text-stone-500">Score</p>
                    <p className="mt-2 text-xl font-semibold text-stone-950 sm:text-2xl">4/5</p>
                  </div>
                  <div className="border border-stone-300 bg-white p-3">
                    <p className="meta-type text-[10px] text-stone-500">Time</p>
                    <p className="mt-2 text-xl font-semibold text-stone-950 sm:text-2xl">6m</p>
                  </div>
                  <div className="border border-stone-300 bg-white p-3">
                    <p className="meta-type text-[10px] text-stone-500">Rank</p>
                    <p className="mt-2 text-xl font-semibold text-stone-950 sm:text-2xl">#2</p>
                  </div>
                </div>
                <button className="mt-5 w-full border border-orange-700 bg-orange-700 px-4 py-3 text-sm font-semibold text-white">
                  Share challenge
                </button>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 border-y border-stone-300 py-8 sm:mt-16 sm:py-10">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="meta-type text-[10px] text-orange-700">Why it works</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
              Built for repeatable practice.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-stone-600">
            Each lab is small enough to finish, specific enough to discuss, and consistent enough to improve over time.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {productPrinciples.map((principle, index) => (
            <article key={principle.title} className="border border-stone-300 bg-stone-50/80 p-5 transition-colors hover:border-stone-500 hover:bg-white">
              <p className="meta-type text-[10px] text-orange-700">0{index + 1}</p>
              <h3 className="mt-5 text-base font-semibold text-stone-950">{principle.title}</h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">{principle.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-7 sm:mt-14 lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start">
        <div>
          <p className="meta-type mb-3 text-[10px] text-orange-700">Practice system</p>
          <h2 className="display-type text-4xl leading-none text-stone-950 sm:text-5xl">
            Practice real engineering work.
          </h2>
          <p className="mt-5 text-sm leading-6 text-stone-600">
            Pick a format, run a short lab, and share the same challenge with another developer for comparison.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {practiceFormats.map((format) => (
            <article key={format.title} className="border border-stone-300 bg-stone-50/70 p-4 transition-colors hover:border-stone-500 hover:bg-stone-100">
              <h3 className="text-sm font-semibold text-stone-950">{format.title}</h3>
              <p className="mt-3 text-xs leading-5 text-stone-600">{format.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-6 sm:mt-16 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="border border-stone-300 bg-stone-950 p-6 text-stone-50 sm:p-8">
          <p className="meta-type mb-5 text-[10px] text-orange-300">For teams and serious learners</p>
          <h2 className="display-type max-w-2xl text-4xl leading-none sm:text-5xl">
            Turn practice into shared engineering vocabulary.
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-stone-300">
            A good lab gives people a concrete artifact to discuss: the prompt, the selected answer, the missed constraint, and the explanation. That makes it useful for onboarding, mentoring, hiring prep, and weekly sharpening rituals.
          </p>
        </div>
        <div className="border border-stone-300 bg-stone-50 p-6 sm:p-8">
          <p className="meta-type mb-5 text-[10px] text-stone-500">Current product loop</p>
          <ol className="space-y-4 text-sm text-stone-700">
            <li className="flex gap-3">
              <span className="font-mono text-xs text-orange-700">01</span>
              <span>Generate a focused lab from a format, language, difficulty, and concept.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-mono text-xs text-orange-700">02</span>
              <span>Complete the challenge with score and time captured.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-mono text-xs text-orange-700">03</span>
              <span>Share a short challenge link so another developer can take the same set.</span>
            </li>
          </ol>
        </div>
      </section>

      <footer className="mt-12 border-t border-stone-300 py-8 sm:mt-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <div className="flex items-baseline gap-2 text-stone-900">
              <span className="text-lg font-black tracking-[-0.08em]">BYTE</span>
              <span className="text-stone-400">/</span>
              <span className="meta-type text-[10px] text-stone-500">LAB</span>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-6 text-stone-600">
              Developer practice for reasoning, review, debugging, testing, and architecture decisions. Built with a bias for clarity, repeatable challenges, and useful peer comparison.
            </p>
            <p className="meta-type mt-6 text-[10px] text-stone-500">
              Independent practice workspace / 2026
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-stone-700 lg:justify-end" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-orange-700">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
