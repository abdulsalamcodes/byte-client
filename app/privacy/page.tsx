import type { Metadata } from 'next';
import { MarketingInfoPage } from '@/src/components/marketing/MarketingInfoPage';

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'Byte Lab privacy principles for practice data and challenge sharing.',
};

export default function PrivacyPage() {
  return (
    <MarketingInfoPage
      eyebrow="Privacy"
      title="Privacy should stay simple and explicit."
      intro="Byte Lab keeps practice data clear: what stays local, what is shared, and what is saved for challenge participation."
      sections={[
        {
          title: 'Local progress',
          copy: 'Solo progress is stored locally in the browser unless a challenge attempt is submitted.',
        },
        {
          title: 'Shared challenges',
          copy: 'Challenge links store the generated question set and configuration so other developers can open the same lab.',
        },
        {
          title: 'Attempt data',
          copy: 'When submitting a shared challenge, the display name, score, answers, and completion time may be saved for the leaderboard.',
        },
        {
          title: 'Long-term direction',
          copy: 'Account and team features include clear controls for data visibility, retention, deletion, and team access.',
        },
      ]}
    />
  );
}
