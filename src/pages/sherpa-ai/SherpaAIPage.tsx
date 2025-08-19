import React from 'react';
import { Bot } from 'lucide-react';
import { ComingSoonPage } from '../coming-soon/ComingSoonPage';

export const SherpaAIPage: React.FC = () => {
  const features = [
    'AI-powered business insights',
    'Automated customer support',
    'Dynamic pricing suggestions',
    'Content generation for listings',
    'Personalized marketing campaigns',
    'Predictive booking analytics',
    'Smart inventory management',
    'Automated email responses',
    'Performance optimization tips',
    '24/7 AI assistant chat'
  ];

  return (
    <ComingSoonPage
      title="Sherpa AI"
      subtitle="AI Assistance"
      description="Your intelligent business assistant powered by advanced AI. Get personalized insights, automate routine tasks, and make data-driven decisions to grow your business faster."
      icon={<Bot size={32} className="text-white" />}
      features={features}
    />
  );
};