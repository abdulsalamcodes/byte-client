import type { Metadata } from 'next';
import { MarketingInfoPage } from '@/src/components/marketing/MarketingInfoPage';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Byte Lab for feedback, team use, and product questions.',
};

export default function ContactPage() {
  return (
    <MarketingInfoPage
      eyebrow="Contact"
      title="Talk to us about better developer practice."
      intro="Use this page as the product contact surface for feedback, team interest, partnerships, and roadmap input."
      sections={[
        {
          title: 'Product feedback',
          copy: 'Share where the labs feel useful, weak, too easy, too noisy, or not representative of real engineering work.',
        },
        {
          title: 'Team use',
          copy: 'Discuss onboarding, mentoring, cohort practice, and lightweight reporting needs for engineering teams.',
        },
        {
          title: 'Content quality',
          copy: 'Report bad questions, ambiguous answers, missing context, or explanations that do not meet the bar.',
        },
        {
          title: 'Email',
          copy: 'Contact channel: hello@byte-lab.dev. Replace this address with the production support inbox before launch.',
        },
      ]}
    />
  );
}
