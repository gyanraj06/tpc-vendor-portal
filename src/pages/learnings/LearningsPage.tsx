import React from 'react';
import { BookOpen } from 'lucide-react';
import { ComingSoonPage } from '../coming-soon/ComingSoonPage';

export const LearningsPage: React.FC = () => {
  const features = [
    'Interactive business courses',
    'Industry certification programs',
    'Skill development workshops',
    'Expert-led webinars',
    'Achievement badges system',
    'Progress tracking dashboard',
    'Peer-to-peer learning community',
    'Mentorship programs',
    'Industry best practices library',
    'Personalized learning paths'
  ];

  return (
    <ComingSoonPage
      title="Learnings"
      subtitle="Courses and Badges"
      description="Enhance your business skills with our comprehensive learning platform. Access courses, earn certifications, and connect with industry experts to take your venture to the next level."
      icon={<BookOpen size={32} className="text-white" />}
      features={features}
    />
  );
};