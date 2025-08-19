import React from 'react';
import { Share2 } from 'lucide-react';
import { ComingSoonPage } from '../coming-soon/ComingSoonPage';

export const SocialConnectPage: React.FC = () => {
  const features = [
    'Connect multiple social accounts',
    'Schedule posts across platforms',
    'Auto-share new events',
    'Social media analytics',
    'Engagement tracking',
    'Customer review management',
    'Hashtag optimization',
    'Content calendar',
    'Influencer collaboration tools',
    'Social media advertising integration'
  ];

  return (
    <ComingSoonPage
      title="Social Connect"
      subtitle="Social Media Hub"
      description="Manage all your social media presence from one place. Connect your Facebook, Instagram, Twitter, and LinkedIn accounts to automatically promote your events and engage with customers."
      icon={<Share2 size={32} className="text-white" />}
      features={features}
    />
  );
};