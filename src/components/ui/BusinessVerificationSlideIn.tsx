import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, AlertCircle, Building2, CheckCircle, ArrowRight } from 'lucide-react';

interface BusinessVerificationSlideInProps {
  isOpen: boolean;
  onClose: () => void;
  vendorName?: string;
}

export const BusinessVerificationSlideIn: React.FC<BusinessVerificationSlideInProps> = ({
  isOpen,
  onClose,
  vendorName
}) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 100);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleCompleteNow = () => {
    navigate('/edit-profile?section=business');
    onClose();
  };

  const handleRemindLater = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isVisible ? 'bg-opacity-20' : 'bg-opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Slide-in Panel */}
      <div 
        className={`fixed left-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Action Required</h3>
                <p className="text-amber-100 text-sm">Complete business verification</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-amber-100 text-sm">
              👋 Welcome back, {vendorName || 'Vendor'}! To start creating experiences, please complete your business verification.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              Business Details Required
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Complete your business profile to unlock experience creation and start earning with Mounterra.
            </p>
          </div>

          {/* Requirements */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h5 className="text-sm font-medium text-gray-900 mb-3">What you'll need:</h5>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <span className="font-medium">Business Information</span>
                  <p className="text-gray-500">Name, type, registration details</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <span className="font-medium">Contact Details</span>
                  <p className="text-gray-500">Authorized person & contact info</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <span className="font-medium">Bank Account</span>
                  <p className="text-gray-500">Payment & settlement details</p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-green-50 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">After completion:</span>
            </div>
            <div className="text-sm text-green-700 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-1 h-1 bg-green-600 rounded-full"></div>
                <span>Create unlimited experiences</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1 h-1 bg-green-600 rounded-full"></div>
                <span>Receive bookings & payments</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1 h-1 bg-green-600 rounded-full"></div>
                <span>Verified business badge</span>
              </div>
            </div>
          </div>

          {/* Estimated Time */}
          <div className="bg-blue-50 rounded-lg p-3 mb-6">
            <p className="text-blue-800 text-sm text-center">
              ⏱️ <strong>5-10 minutes</strong> to complete • Verification within 1-2 business days
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="space-y-3">
            <button
              onClick={handleCompleteNow}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              <span>Complete Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleRemindLater}
              className="w-full text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors text-sm"
            >
              Remind me later
            </button>
          </div>
          
          <p className="text-xs text-gray-500 text-center mt-3">
            This notification will only appear once per session
          </p>
        </div>
      </div>
    </>
  );
};