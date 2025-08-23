import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import LandingImage from '../../assets/landing.jpg';

export const VendorLandingPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there are OAuth tokens in the URL hash (fallback for misconfigured Supabase redirect)
    if (window.location.hash.includes('access_token')) {
      // Redirect to the proper auth callback page to handle the tokens
      navigate('/auth/callback' + window.location.hash);
    }
  }, [navigate]);

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
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${LandingImage})`
              }}
            >
              <div className="absolute inset-0 bg-black/55" />
            </div>

            {/* Content */}
            <div className="flex h-full items-center justify-center px-4 sm:px-6 lg:px-8">
              <div className="w-full max-w-4xl text-center">
                <h1 className="mb-8 text-3xl leading-tight font-semibold text-white drop-shadow-lg sm:text-4xl md:text-5xl lg:text-6xl">
                  Our Mission: To Unlock the Real India, One Experience at a Time
                </h1>
                
                <Link 
                  to="/login"
                  className="inline-block bg-white text-blue-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg mb-12"
                >
                  Launch Dashboard
                </Link>
                
                <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed relative z-50">
                  We believe that the greatest stories aren't just seen; they're lived. In a country as vibrant and diverse as India, countless adventures are waiting just beyond our daily routines—a hidden waterfall, a local artisan's workshop, a trail that leads to a breathtaking sunrise.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Partner Section - Modern Unique Design */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen flex items-center">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-orange-400/10 to-red-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            {/* Header Section */}
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8">
                Why partner with{' '}
Trip Pe Chalo?
              </h2>
              <div className="max-w-4xl mx-auto">
                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                  Whether you're a storyteller, trek leader, cafe owner, or hobby host — Trip Pe Chalo helps you turn your passion into income.
                </p>
              </div>
            </div>

            {/* Unique Floating Points Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Points Side */}
              <div className="space-y-8">
                {/* Point 1 */}
                <div className="group relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                  <div className="relative bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-700/80 transition-all duration-500">
                    <div className="flex items-start space-x-6">
                      <div className="text-6xl font-black bg-gradient-to-br from-blue-400 to-purple-500 bg-clip-text text-transparent">01</div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-4">Reach the Right Audience</h3>
                        <p className="text-gray-300 leading-relaxed">Get discovered by travelers seeking hidden gems and local experiences in your city or village.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Point 2 */}
                <div className="group relative lg:ml-16">
                  <div className="absolute -inset-2 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                  <div className="relative bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-700/80 transition-all duration-500">
                    <div className="flex items-start space-x-6">
                      <div className="text-6xl font-black bg-gradient-to-br from-green-400 to-teal-500 bg-clip-text text-transparent">02</div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-4">Create Lovable Experiences</h3>
                        <p className="text-gray-300 leading-relaxed">Design authentic, memorable experiences that travelers will cherish and recommend to others.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Point 3 */}
                <div className="group relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                  <div className="relative bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-700/80 transition-all duration-500">
                    <div className="flex items-start space-x-6">
                      <div className="text-6xl font-black bg-gradient-to-br from-orange-400 to-red-500 bg-clip-text text-transparent">03</div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-4">Earn More, Faster</h3>
                        <p className="text-gray-300 leading-relaxed">Transparent bookings, direct payments, and local support to help you grow confidently.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Point 4 */}
                <div className="group relative lg:ml-16">
                  <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                  <div className="relative bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-700/80 transition-all duration-500">
                    <div className="flex items-start space-x-6">
                      <div className="text-6xl font-black bg-gradient-to-br from-purple-400 to-pink-500 bg-clip-text text-transparent">04</div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-4">Built-In Vendor Growth Tools (SaaS)</h3>
                        <p className="text-gray-300 leading-relaxed">Think of us as your mini CRM — without the complexity. We don't just list your experience — we help you grow it.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Side */}
              <div className="relative lg:order-first">
                <div className="relative h-[600px] rounded-3xl overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600">
                  {/* Placeholder for host image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-transparent to-purple-500/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h4 className="text-2xl font-bold text-white mb-2">Real Host Stories</h4>
                      <p className="text-gray-300">Imagine Yourself Here with a Big Smile!</p>
                    </div>
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute top-8 right-8 bg-white/10 backdrop-blur-sm rounded-full p-4">
                    <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">✓</span>
                    </div>
                  </div>
                  <div className="absolute bottom-8 left-8 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                    <div className="text-white text-sm">
                      <div className="font-semibold">New Booking!</div>
                      <div className="text-gray-300">₹2,400 earned</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What Kind of Experiences Section */}
        <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-20 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                What Kind of Experiences Can You{' '}
Host?
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Whether you run a trekking trail, host a stargazing circle, or organize folk jam sessions — Trip Pe Chalo is for you.
              </p>
            </div>

            {/* Experience Categories Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20">
              {[
                { 
                  name: "Treks & Nature Walks", 
                  icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2L3 7v11a2 2 0 002 2h4v-6h2v6h4a2 2 0 002-2V7l-7-5z"/></svg>, 
                  color: "from-green-400 to-emerald-500" 
                },
                { 
                  name: "Eco-Retreats", 
                  icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/></svg>, 
                  color: "from-emerald-400 to-green-500" 
                },
                { 
                  name: "Cultural Events", 
                  icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4z" clipRule="evenodd"/></svg>, 
                  color: "from-purple-400 to-pink-500" 
                },
                { 
                  name: "Gigs & Indie Shows", 
                  icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/></svg>, 
                  color: "from-orange-400 to-red-500" 
                },
                { 
                  name: "Pottery, Art, or Music Workshops", 
                  icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zM3 15a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-1zm7-13a1 1 0 011 1v9a1 1 0 11-2 0V3a1 1 0 011-1zm3 0a1 1 0 011 1v6a1 1 0 11-2 0V3a1 1 0 011-1zm3 0a1 1 0 011 1v9a1 1 0 11-2 0V3a1 1 0 011-1z" clipRule="evenodd"/></svg>, 
                  color: "from-blue-400 to-cyan-500" 
                },
                { 
                  name: "Pop-up Festivals", 
                  icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd"/></svg>, 
                  color: "from-pink-400 to-purple-500" 
                },
                { 
                  name: "Local Storytelling Sessions", 
                  icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/></svg>, 
                  color: "from-yellow-400 to-orange-500" 
                },
                { 
                  name: "Wellness & Spiritual Circles", 
                  icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd"/></svg>, 
                  color: "from-indigo-400 to-purple-500" 
                }
              ].map((experience, index) => (
                <div key={index} className="group relative">
                  <div className="relative bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center hover:bg-slate-700/80 transition-all duration-500 h-full">
                    <div className={`text-white mb-4 flex justify-center`}>
                      {experience.icon}
                    </div>
                    <h3 className="text-sm md:text-base font-semibold text-white leading-tight">{experience.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to Get Started Section */}
        <section className="bg-gradient-to-br from-gray-50 via-white to-gray-100 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                How to Get{' '}
Started?
              </h2>
            </div>

            {/* Steps */}
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
                {/* Step 1 */}
                <div className="group relative">
                  <div className="relative bg-white/90 backdrop-blur-sm border border-gray-200 rounded-3xl p-10 text-center hover:bg-white transition-all duration-500 shadow-lg hover:shadow-xl min-h-[320px] flex flex-col">
                    <h2 className="text-3xl font-black text-orange-600 mb-8">STEP 1</h2>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Register as a Partner</h3>
                    <p className="text-gray-600 leading-relaxed text-lg flex-1">Sign up with your name, contact, and type of activity.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="group relative">
                  <div className="relative bg-white/90 backdrop-blur-sm border border-gray-200 rounded-3xl p-10 text-center hover:bg-white transition-all duration-500 shadow-lg hover:shadow-xl min-h-[320px] flex flex-col">
                    <h2 className="text-3xl font-black text-orange-600 mb-8">STEP 2</h2>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Submit Your Business Info</h3>
                    <p className="text-gray-600 leading-relaxed text-lg flex-1">Add your legal details, activity images, dates, and pricing.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="group relative">
                  <div className="relative bg-white/90 backdrop-blur-sm border border-gray-200 rounded-3xl p-10 text-center hover:bg-white transition-all duration-500 shadow-lg hover:shadow-xl min-h-[320px] flex flex-col">
                    <h2 className="text-3xl font-black text-orange-600 mb-8">STEP 3</h2>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Go Live!</h3>
                    <p className="text-gray-600 leading-relaxed text-lg flex-1">Once approved, your experience will be discoverable by users on Trip Pe Chalo.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* CTA Button */}
            <div className="text-center mt-16">
              <Link 
                to="/dashboard"
                className="inline-block bg-gradient-to-r from-orange-500 to-red-600 text-white px-12 py-4 rounded-full text-xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Start Your Journey
              </Link>
            </div>

          </div>
        </section>
      </main>

    </div>
  );
};