import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';

export const VendorLandingPage: React.FC = () => {
  const [activePoint, setActivePoint] = useState(0);
  
  const points = [
    {
      number: "1",
      title: "Reach the Right Audience",
      description: "Get discovered by travelers seeking hidden gems and local experiences in your city or village."
    },
    {
      number: "2", 
      title: "Create Lovable Experiences",
      description: "Design authentic, memorable experiences that travelers will cherish and recommend to others."
    },
    {
      number: "3",
      title: "Earn More, Faster", 
      description: "Transparent bookings, direct payments, and local support to help you grow confidently."
    },
    {
      number: "4",
      title: "Built-In Vendor Growth Tools (SaaS)",
      description: "Think of us as your mini CRM, without the complexity. We don't just list your experience but rather we help you grow it."
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const pointsSection = document.getElementById('points-section');
      
      if (pointsSection) {
        const sectionTop = pointsSection.offsetTop;
        const sectionHeight = pointsSection.offsetHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight - windowHeight) {
          const progress = (scrollY - sectionTop) / (sectionHeight - windowHeight);
          const pointIndex = Math.floor(progress * points.length);
          setActivePoint(Math.min(pointIndex, points.length - 1));
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [points.length]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative h-[94vh] w-full overflow-visible md:p-4 md:bg-[#f2f2f2]">
          {/* Container - only on desktop */}
          <div className="relative h-full w-full md:rounded-[15px] md:overflow-hidden">
            {/* Background with overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800"
            >
              <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Content */}
            <div className="flex h-full items-center justify-center px-4 sm:px-6 lg:px-8">
              <div className="w-full max-w-4xl text-center">
                <h1 className="mb-8 text-3xl leading-tight font-semibold text-white drop-shadow-lg sm:text-4xl md:text-5xl lg:text-6xl">
                  Step in, showcase, and build your vendor journey with Trip Pe Chalo
                </h1>
                
                <Link 
                  to="/login"
                  className="inline-block bg-white text-blue-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Launch Dashboard
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Partner Section with Scrolling Points */}
        <section id="points-section" className="bg-[#1e1e1e] relative">
          {/* Desktop Scrolling Points */}
          <div className="h-[300vh] relative hidden md:block">
            <div className="sticky top-0 h-screen flex flex-col justify-start pt-20 overflow-hidden">
              <div className="w-full">
                <div className="max-w-7xl mx-auto pl-2 pr-4 sm:pl-4 sm:pr-6 lg:pl-6 lg:pr-8 mb-0">
                  <h2 className="text-left font-bold text-white mb-0" style={{ fontSize: '70px' }}>
                    Why partner with <span className="text-[#fd5700]">TripPeChalo?</span>
                  </h2>
                </div>
                <div className="max-w-7xl mx-auto pl-2 pr-4 sm:pl-4 sm:pr-6 lg:pl-6 lg:pr-8">
                  <div 
                    className="flex transition-transform duration-700 ease-out"
                    style={{
                      transform: `translateX(-${activePoint * 75}vw)`,
                      width: `${(points.length - 1) * 75 + 100}vw`
                    }}
                  >
                    {points.map((point, index) => (
                      <div
                        key={index}
                        className={`flex-shrink-0 flex items-center justify-start transition-all duration-700 ${
                          index === points.length - 1 ? 'w-screen' : 'w-[75vw]'
                        }`}
                      >
                        <div className="w-full">
                          <div className="flex items-start space-x-6">
                            <div className={`text-8xl font-bold transition-colors duration-500 ${
                              index === activePoint ? 'text-[#fd5700]' : 'text-gray-600'
                            }`}>
                              {point.number}
                            </div>
                            <div className="flex-1">
                              <h3 className={`text-3xl font-bold mb-4 transition-colors duration-500 ${
                                index === activePoint ? 'text-white' : 'text-gray-500'
                              }`}>
                                {point.title}
                              </h3>
                              <p className={`text-xl leading-relaxed max-w-2xl transition-colors duration-500 ${
                                index === activePoint ? 'text-gray-200' : 'text-gray-600'
                              }`}>
                                {point.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Simple Horizontal Scroll */}
          <div className="md:hidden py-10">
            <div className="px-4 mb-8">
              <h2 className="text-left font-bold text-white text-3xl">
                Why partner with <span className="text-[#fd5700]">TripPeChalo?</span>
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <div className="flex space-x-6 px-4 pb-4" style={{ width: 'max-content' }}>
                {points.map((point, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-80 p-6"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-5xl font-bold text-[#fd5700] flex-shrink-0">
                        {point.number}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-3 text-white">
                          {point.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-300">
                          {point.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-600 rounded"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Feature One</h3>
                <p className="text-gray-600">Description of the first feature</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-600 rounded"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Feature Two</h3>
                <p className="text-gray-600">Description of the second feature</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-600 rounded"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Feature Three</h3>
                <p className="text-gray-600">Description of the third feature</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-100 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of vendors already using our platform
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700">
              Start Your Journey
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img 
                src="/src/assets/LogoImage.jpg" 
                alt="Logo" 
                className="h-8 w-8 rounded-full"
              />
              <span className="ml-3 text-gray-600">© 2024 Mounterra</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-blue-600">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">Terms</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};