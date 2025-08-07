import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building, Calendar, Tag, FileText, Send, Shield } from 'lucide-react';

export const RecurringEventsVerificationPage: React.FC = () => {
  const [companyName, setCompanyName] = useState('');
  const [eventName, setEventName] = useState('');
  const [category, setCategory] = useState<'event' | 'experience' | ''>('');
  const [businessBio, setBusinessBio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-brand-blue-50 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-brand-dark-900 mb-4">Application Submitted!</h2>
          <p className="text-brand-dark-600 mb-6">
            Thank you for your application. We will review your details and contact you within 1 business day.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-brand-dark-600 hover:text-brand-blue-600 transition-colors mr-4"
              >
                <ArrowLeft size={20} />
              </button>
              
              <div className="flex items-center">
                <div className="h-8 w-8 bg-[url('/src/assets/blueicon.png')] bg-contain bg-no-repeat"></div>
                <div className="h-8 w-32 bg-[url('/src/assets/bluetext.png')] bg-contain bg-no-repeat"></div>
              </div>
            </div>

            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-lg font-semibold text-brand-dark-900">Recurring Events Verification</h1>
            </div>

            <div></div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-brand-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Shield size={40} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Recurring Events Verification
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              To create recurring events and experiences, we need to verify your business credentials to ensure quality and safety for all participants.
            </p>
            <div className="inline-flex items-center bg-white/20 rounded-full px-6 py-3">
              <Shield size={20} className="mr-2" />
              <span className="font-semibold">Quick 1-Day Verification Process</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-dark-900 mb-4">Quick Verification Form</h2>
            <p className="text-xl text-brand-dark-600 max-w-2xl mx-auto">
              Fill out the form below and we will contact you within 1 business day to complete your verification.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="p-8">
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Company Name *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-dark-400" size={20} />
                  <input
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your company name"
                    required
                  />
                </div>
              </div>

              {/* Event Name */}
              <div>
                <label htmlFor="eventName" className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Event/Experience Name *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-dark-400" size={20} />
                  <input
                    id="eventName"
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Adventure Go-Karting, Trampoline Park Experience"
                    required
                  />
                </div>
              </div>

              {/* Category Selection */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-dark-700 mb-3">
                  How would you categorize this? *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setCategory('event')}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      category === 'event'
                        ? 'border-brand-blue-500 bg-brand-blue-50'
                        : 'border-gray-200 hover:border-brand-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Tag className={`${category === 'event' ? 'text-orange-600' : 'text-gray-400'}`} size={20} />
                      <div>
                        <h4 className="font-medium text-brand-dark-900">Event</h4>
                        <p className="text-xs text-brand-dark-600">Organized activities with schedules</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategory('experience')}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      category === 'experience'
                        ? 'border-brand-blue-500 bg-brand-blue-50'
                        : 'border-gray-200 hover:border-brand-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Tag className={`${category === 'experience' ? 'text-orange-600' : 'text-gray-400'}`} size={20} />
                      <div>
                        <h4 className="font-medium text-brand-dark-900">Experience</h4>
                        <p className="text-xs text-brand-dark-600">Ongoing activities anytime</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Business Bio */}
              <div className="md:col-span-2">
                <label htmlFor="businessBio" className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Business Bio *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-brand-dark-400" size={20} />
                  <textarea
                    id="businessBio"
                    value={businessBio}
                    onChange={(e) => setBusinessBio(e.target.value)}
                    rows={4}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Tell us about your business, experience in organizing events/experiences, safety measures, and unique offerings..."
                    required
                  />
                </div>
                <p className="text-xs text-brand-dark-500 mt-1">
                  Minimum 50 characters. Include safety measures, experience, and unique offerings.
                </p>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || !companyName || !eventName || !category || businessBio.length < 50}
                  className="w-full flex items-center justify-center space-x-2 bg-brand-blue-600 hover:bg-brand-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
                >
                  <Send size={18} />
                  <span>{isSubmitting ? 'Submitting Application...' : 'Submit for Verification'}</span>
                </button>
              </div>
              </form>
            </div>
          </div>
        </div>
      </div>

     
    </div>
  );
};