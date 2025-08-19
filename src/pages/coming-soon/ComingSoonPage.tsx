import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ComingSoonPageProps {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  features?: string[];
}

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({
  title,
  subtitle,
  description,
  icon,
  features = [],

}) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto">

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-brand-blue-500 to-brand-blue-600 px-8 py-12 text-center text-white">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            {icon}
          </div>
          <h1 className="text-3xl font-bold mb-3">{title}</h1>
          <p className="text-xl text-brand-blue-100">{subtitle}</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-semibold mb-4">
              🚧 Coming Soon
            </div>
            <p className="text-brand-dark-700 text-lg">{description}</p>
          </div>

          {/* Features Preview */}
          {features.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-brand-dark-900 mb-4">What's Coming</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-brand-blue-600 rounded-full"></div>
                    <span className="text-brand-dark-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="text-center">
            <div className="bg-brand-blue-50 border border-brand-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-brand-blue-900 mb-2">Stay Updated</h3>
              <p className="text-brand-blue-700 mb-4">
                We're working hard to bring you this feature. In the meantime, explore other parts of your vendor portal.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-brand-blue-600 hover:bg-brand-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};