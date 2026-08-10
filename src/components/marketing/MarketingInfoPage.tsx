import Link from 'next/link';

type Section = {
  title: string;
  copy: string;
};

type Props = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Section[];
  cta?: {
    label: string;
    href: string;
  };
};

export function MarketingInfoPage({ eyebrow, title, intro, sections, cta }: Props) {
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

        <section className="border-b border-stone-300 pb-12">
          <p className="meta-type text-[10px] text-orange-700">{eyebrow}</p>
          <h1 className="display-type mt-5 max-w-4xl text-5xl leading-[0.92] text-stone-950 sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg sm:leading-8">
            {intro}
          </p>
          {cta && (
            <Link
              href={cta.href}
              className="accent-button mt-8 inline-flex min-w-48 items-center justify-between px-5 py-3.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-orange-500/20"
            >
              {cta.label}
              <span aria-hidden="true">{'->'}</span>
            </Link>
          )}
        </section>

        <section className="grid gap-4 py-10 sm:grid-cols-2">
          {sections.map((section) => (
            <article key={section.title} className="border border-stone-300 bg-stone-50/80 p-5 sm:p-6">
              <h2 className="text-lg font-semibold tracking-tight text-stone-950">{section.title}</h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">{section.copy}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
