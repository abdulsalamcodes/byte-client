import type { Metadata } from 'next';
import { MarketingInfoPage } from '@/src/components/marketing/MarketingInfoPage';

export const metadata: Metadata = {
  title: 'Roadmap',
  description: 'The Byte Lab product roadmap for practice, teams, and challenge workflows.',
};

export default function RoadmapPage() {
  return (
    <MarketingInfoPage
      eyebrow="Roadmap"
      title="From solo labs to team practice systems."
      intro="The roadmap keeps the product simple now while moving toward durable accounts, stronger content quality, and team workflows."
      sections={[
        {
          title: 'Phase 1: Core practice',
          copy: 'Generate focused labs, take assessments, review explanations, track local results, and share short challenge links.',
        },
        {
          title: 'Phase 2: Challenge network',
          copy: 'Improve attempt history, leaderboard views, challenge recovery, and reusable links for peer practice.',
        },
        {
          title: 'Phase 3: Accounts and persistence',
          copy: 'Add authentication, durable profiles, saved labs, and cross-device history without blocking anonymous first use.',
        },
        {
          title: 'Phase 4: Teams',
          copy: 'Introduce team spaces, curated tracks, cohorts, admin reporting, and shared practice programs.',
        },
      ]}
    />
  );
}
