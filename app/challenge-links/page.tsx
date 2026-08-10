import type { Metadata } from 'next';
import { MarketingInfoPage } from '@/src/components/marketing/MarketingInfoPage';

export const metadata: Metadata = {
  title: 'Challenge Links',
  description: 'How Byte Lab shareable challenge links work.',
};

export default function ChallengeLinksPage() {
  return (
    <MarketingInfoPage
      eyebrow="Challenge links"
      title="Send the same lab to another developer."
      intro="Challenge links make practice comparable: one generated set, one short URL, multiple attempts."
      cta={{ label: 'Create a challenge', href: '/' }}
      sections={[
        {
          title: 'Short links',
          copy: 'Each shared challenge uses a compact code instead of stuffing the full quiz into the browser URL.',
        },
        {
          title: 'Same prompt set',
          copy: 'Everyone who opens the link gets the same questions, choices, and explanations, making comparison fair.',
        },
        {
          title: 'Attempt tracking',
          copy: 'Scores and completion time can be saved against the challenge to create a lightweight leaderboard.',
        },
        {
          title: 'Low friction',
          copy: 'The current flow supports sharing without forcing account creation before the first useful action.',
        },
      ]}
    />
  );
}
