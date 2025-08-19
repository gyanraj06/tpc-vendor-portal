import React from 'react';
import { HelpCircle, Play, BookOpen, Users, Calendar, Globe, TrendingUp } from 'lucide-react';

export const QuickGuidePage: React.FC = () => {
  const guides = [
    {
      icon: <Play size={24} className="text-white" />,
      title: 'Getting Started',
      description: 'Learn the basics of setting up your vendor profile and creating your first listing',
      steps: [
        'Complete your vendor profile',
        'Upload business documents',
        'Create your first event or service listing',
        'Set up pricing and availability'
      ],
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Calendar size={24} className="text-white" />,
      title: 'Managing Events',
      description: 'Master event creation, editing, and managing bookings effectively',
      steps: [
        'Create different types of events',
        'Set up tiered pricing strategies',
        'Manage participant limits',
        'Handle booking modifications'
      ],
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <Users size={24} className="text-white" />,
      title: 'Customer Management',
      description: 'Build strong relationships with your customers and handle reservations',
      steps: [
        'View and manage bookings',
        'Communicate with customers',
        'Handle refunds and cancellations',
        'Collect and respond to reviews'
      ],
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <Globe size={24} className="text-white" />,
      title: 'Online Presence',
      description: 'Boost your visibility and reach more customers through digital channels',
      steps: [
        'Optimize your listing descriptions',
        'Use high-quality images',
        'Leverage social media integration',
        'Create your business website'
      ],
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: <TrendingUp size={24} className="text-white" />,
      title: 'Growing Your Business',
      description: 'Advanced strategies to scale your operations and increase revenue',
      steps: [
        'Analyze performance metrics',
        'Implement dynamic pricing',
        'Expand to new locations',
        'Build loyalty programs'
      ],
      color: 'from-pink-500 to-pink-600'
    }
  ];

  const videoTutorials = [
    { title: 'Platform Overview', duration: '3:42', thumbnail: '/assets/tutorial-1.jpg' },
    { title: 'Creating Your First Event', duration: '5:18', thumbnail: '/assets/tutorial-2.jpg' },
    { title: 'Pricing Strategies', duration: '4:26', thumbnail: '/assets/tutorial-3.jpg' },
    { title: 'Customer Communication', duration: '6:14', thumbnail: '/assets/tutorial-4.jpg' }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
            <HelpCircle size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-brand-dark-900">Quick Guide</h1>
            <p className="text-brand-dark-600">Learn the platform</p>
          </div>
        </div>
        <p className="text-brand-dark-700">
          Welcome to your comprehensive guide! Here you'll find everything you need to master the Mounterra Vendor Portal 
          and make the most of our platform's powerful features.
        </p>
      </div>

      {/* How-to Guides */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-brand-dark-900 mb-6">Step-by-Step Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
              <div className={`bg-gradient-to-br ${guide.color} p-6 text-white`}>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  {guide.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{guide.title}</h3>
                <p className="text-white/90 text-sm">{guide.description}</p>
              </div>
              <div className="p-6">
                <h4 className="font-semibold text-brand-dark-900 mb-3">Key Steps:</h4>
                <ul className="space-y-2">
                  {guide.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start space-x-2">
                      <span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 mt-0.5 flex-shrink-0">
                        {stepIndex + 1}
                      </span>
                      <span className="text-sm text-brand-dark-600">{step}</span>
                    </li>
                  ))}
                </ul>
                <button className="mt-4 w-full bg-gray-50 hover:bg-gray-100 text-brand-dark-700 py-2 rounded-lg transition-colors text-sm font-medium">
                  Start Guide
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Tutorials */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-brand-dark-900 mb-6">Video Tutorials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videoTutorials.map((video, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-black/20 rounded-full flex items-center justify-center group-hover:bg-black/30 transition-colors">
                    <Play size={24} className="text-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  {video.duration}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-brand-dark-900 group-hover:text-brand-blue-600 transition-colors">
                  {video.title}
                </h3>
                <p className="text-sm text-brand-dark-500 mt-1">Duration: {video.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-brand-dark-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              question: "How do I create my first event listing?",
              answer: "Navigate to the Products section from the sidebar, then click 'Create New' to start building your first event listing with our step-by-step wizard."
            },
            {
              question: "What are the different pricing models available?",
              answer: "You can choose between fixed pricing for simple events or tiered pricing for complex offerings with different service levels or early bird discounts."
            },
            {
              question: "How do I manage customer bookings?",
              answer: "Use the Bookings section to view all customer reservations, process payments, handle modifications, and communicate with your customers."
            },
            {
              question: "Can I integrate with my existing website?",
              answer: "Yes! Our Website Builder tool allows you to create a custom site or integrate booking widgets into your existing website."
            }
          ].map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-brand-dark-900 mb-2">{faq.question}</h3>
              <p className="text-brand-dark-600 text-sm">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Help Contact */}
      <div className="mt-8 bg-gradient-to-br from-brand-blue-50 to-brand-blue-100 rounded-xl p-6 text-center">
        <BookOpen size={32} className="text-brand-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-brand-blue-900 mb-2">Need More Help?</h3>
        <p className="text-brand-blue-700 mb-4">
          Can't find what you're looking for? Our support team is here to help you succeed.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="bg-brand-blue-600 hover:bg-brand-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
            Contact Support
          </button>
          <button className="bg-white hover:bg-gray-50 text-brand-blue-600 border border-brand-blue-300 px-6 py-2 rounded-lg transition-colors">
            Schedule Demo
          </button>
        </div>
      </div>
    </div>
  );
};