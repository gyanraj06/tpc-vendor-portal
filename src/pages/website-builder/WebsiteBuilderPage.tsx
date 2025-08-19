import React from 'react';
import { Globe } from 'lucide-react';
import { ComingSoonPage } from '../coming-soon/ComingSoonPage';

export const WebsiteBuilderPage: React.FC = () => {
  const features = [
    'Drag-and-drop website builder',
    'Professional templates',
    'Custom domain support',
    'Mobile-responsive designs',
    'SEO optimization tools',
    'Integrated booking system',
    'Photo gallery management',
    'Contact form builder',
    'Social media integration',
    'Analytics dashboard'
  ];

  return (
    <ComingSoonPage
      title="Website Builder"
      subtitle="Create your site"
      description="Build a stunning professional website for your business with our easy-to-use drag-and-drop builder. No coding required - just pick a template and customize it to match your brand."
      icon={<Globe size={32} className="text-white" />}
      features={features}
    />
  );
};