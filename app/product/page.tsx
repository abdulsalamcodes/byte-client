import type { Metadata } from 'next';
import { MarketingInfoPage } from '@/src/components/marketing/MarketingInfoPage';

export const metadata: Metadata = {
  title: 'Product',
  description: 'How Byte Lab helps developers practice real engineering judgment.',
};

export default function ProductPage() {
  return (
    <MarketingInfoPage
      eyebrow="Product"
      title="A practice lab for developer judgment."
      intro="Byte Lab turns engineering fundamentals into focused sessions developers can finish, review, and share."
      cta={{ label: 'Start a lab', href: '/' }}
      sections={[
        {
          title: 'Focused labs',
          copy: 'Choose a language, difficulty, concept, and format, then work through a short set designed around one clear skill.',
        },
        {
          title: 'Reasoning-first feedback',
          copy: 'Answers are structured to explain the why: constraints, tradeoffs, edge cases, and the risks behind each option.',
        },
        {
          title: 'Shareable challenges',
          copy: 'Generate a compact challenge link so another developer can take the exact same set and compare performance.',
        },
        {
          title: 'Progress signal',
          copy: 'Score and completion time make improvement visible without turning practice into noisy gamification.',
        },
      ]}
    />
  );
}
