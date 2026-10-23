import type { Metadata } from 'next';
import { MarketingInfoPage } from '@/src/components/marketing/MarketingInfoPage';

export const metadata: Metadata = {
  title: 'Roadmap',
  description: 'The Byte roadmap: verified labs, boss fights, progression, and duels for developers.',
};

export default function RoadmapPage() {
  return (
    <MarketingInfoPage
      eyebrow="Roadmap"
      title="From practice labs to a game for developers."
      intro="Byte is becoming a game: boss fights built from realistic bugs, progression that tracks real skill, and competition that stays fair because the server grades everything."
      sections={[
        {
          title: 'Now: Verified labs and challenges',
          copy: 'Accounts, seven practice formats, AI-generated questions checked by an independent solver, shareable challenges, and server-graded leaderboards.',
        },
        {
          title: 'Next: Boss fights',
          copy: 'Production incidents told in stages: read the logs, find the root cause, pick the fix, prevent the repeat. Wrong moves cost HP, hints cost more, and every stage ends with an explanation.',
        },
        {
          title: 'Then: Progression',
          copy: 'XP, levels, badges, and a rematch queue built from the fights you lost, so coming back means getting better.',
        },
        {
          title: 'Later: Daily bosses and duels',
          copy: 'A shared daily boss with seasonal rankings, then head-to-head duels against other developers.',
        },
        {
          title: 'Future: Your code',
          copy: 'Bosses built from your own snippets, failing tests, and pull requests, private by default.',
        },
      ]}
    />
  );
}
