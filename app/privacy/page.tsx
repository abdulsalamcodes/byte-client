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
      intro="Byte Lab keeps practice data clear: what your account stores, what stays local, and what is saved for challenge participation."
      sections={[
        {
          title: 'Your account',
          copy: 'An account stores your email, your display name, and a salted hash of your password. Your password itself is never stored.',
        },
        {
          title: 'Local progress',
          copy: 'Solo practice results are stored locally in the browser. Your sign-in token is also kept in the browser until you sign out.',
        },
        {
          title: 'Shared challenges',
          copy: 'Challenge links store the generated question set, its configuration, and who created it so other developers can open the same lab. Answers stay on the server until a submission is graded.',
        },
        {
          title: 'Attempt data',
          copy: 'When you submit a shared challenge, your answers, score, and completion time are saved with your account. Leaderboards show your display name, score, and time, never your answers.',
        },
      ]}
    />
  );
}
