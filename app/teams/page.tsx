import type { Metadata } from 'next';
import { MarketingInfoPage } from '@/src/components/marketing/MarketingInfoPage';

export const metadata: Metadata = {
  title: 'Teams',
  description: 'Byte Lab for engineering teams, mentoring, onboarding, and practice programs.',
};

export default function TeamsPage() {
  return (
    <MarketingInfoPage
      eyebrow="Teams"
      title="Build a shared language for engineering judgment."
      intro="Byte Lab can support onboarding, mentoring, internal learning, and recurring practice rituals for engineering teams."
      sections={[
        {
          title: 'Onboarding',
          copy: 'Give new engineers focused labs that reveal how your team thinks about tradeoffs, debugging, and reviews.',
        },
        {
          title: 'Mentoring',
          copy: 'Use challenge results as a concrete artifact for coaching conversations instead of abstract feedback.',
        },
        {
          title: 'Practice cohorts',
          copy: 'Run weekly sessions around specific skills like system design, tests, code review, or incident reasoning.',
        },
        {
          title: 'Future reporting',
          copy: 'Team dashboards can show participation, progress, and common weak spots once accounts are introduced.',
        },
      ]}
    />
  );
}
