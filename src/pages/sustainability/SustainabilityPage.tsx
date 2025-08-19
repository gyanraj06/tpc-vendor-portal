import React from 'react';
import { Leaf } from 'lucide-react';
import { ComingSoonPage } from '../coming-soon/ComingSoonPage';

export const SustainabilityPage: React.FC = () => {
  const features = [
    'Carbon footprint tracking',
    'Eco-friendly event certification',
    'Sustainable vendor directory',
    'Green business practices guide',
    'Environmental impact reports',
    'Waste reduction tracking',
    'Energy efficiency monitoring',
    'Sustainability badges',
    'Eco-partner network',
    'Green marketing tools'
  ];

  return (
    <ComingSoonPage
      title="Sustainability"
      subtitle="Eco Tracking"
      description="Track and improve your environmental impact. Monitor your carbon footprint, adopt sustainable practices, and showcase your commitment to eco-friendly business operations."
      icon={<Leaf size={32} className="text-white" />}
      features={features}
    />
  );
};