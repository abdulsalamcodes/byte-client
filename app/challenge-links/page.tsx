import type { Metadata } from 'next';
import Link from 'next/link';
import { ChallengeDirectory } from '@/src/components/ChallengeDirectory';

export const metadata: Metadata = {
  title: 'Challenge Links',
  description: 'Join public Byte Lab challenge links shared by creators.',
};

export default function ChallengeLinksPage() {
  return (
    <main className="app-shell min-h-screen">
      <div className="mx-auto max-w-5xl px-5 py-6 sm:px-8 lg:px-10 lg:py-9">
        <header className="mb-14 flex items-center justify-between border-b border-stone-300 pb-5">
          <Link href="/" className="flex items-baseline gap-2 text-stone-900">
            <span className="text-lg font-black tracking-[-0.08em]">BYTE</span>
            <span className="text-stone-400">/</span>
            <span className="meta-type text-[10px] text-stone-500">LAB</span>
          </Link>
          <Link href="/" className="meta-type text-[10px] text-stone-500 transition-colors hover:text-orange-700">
            Home
          </Link>
        </header>

        <section className="mb-10 border-b border-stone-300 pb-10">
          <p className="meta-type text-[10px] text-orange-700">Public challenges</p>
          <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <h1 className="display-type max-w-4xl text-5xl leading-[0.92] text-stone-950 sm:text-6xl lg:text-7xl">
                Join a challenge from the community.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg sm:leading-8">
                Public challenge links are labs creators chose to publish so anyone can take the same set and compare results.
              </p>
            </div>
            <Link href="/" className="accent-button inline-flex min-w-48 items-center justify-between px-5 py-3.5 text-sm font-semibold">
              Create a lab
              <span aria-hidden="true">{'->'}</span>
            </Link>
          </div>
        </section>

        <ChallengeDirectory />
      </div>
    </main>
  );
}
