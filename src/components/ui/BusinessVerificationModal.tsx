import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, AlertCircle, FileText, CheckCircle } from 'lucide-react';

interface BusinessVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: 'dashboard' | 'experience_form';
}

export const BusinessVerificationModal: React.FC<BusinessVerificationModalProps> = ({
  isOpen,
  onClose,
  type = 'dashboard'
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleFillDetails = () => {
    navigate('/edit-profile?section=business');
    onClose();
  };

  const isDashboardType = type === 'dashboard';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Business Verification Required
              </h3>
              <p className="text-sm text-gray-600">Complete your business profile</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              {isDashboardType 
                ? 'Complete Your Business Profile' 
                : 'Business Details Required'
              }
            </h4>
            <p className="text-gray-600 leading-relaxed">
              {isDashboardType
                ? 'To start listing experiences on our platform, you need to complete your business verification details first.'
                : 'You must complete your business verification details before creating experiences. This helps us verify and approve your listings.'
              }
            </p>
          </div>

          {/* Requirements List */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h5 className="text-sm font-medium text-gray-900 mb-3">Required Details:</h5>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                <span>Business registration information</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                <span>Authorized contact person details</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                <span>Bank account information</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                <span>Identity verification documents</span>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-green-50 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">After Verification:</span>
            </div>
            <div className="text-sm text-green-700 space-y-1">
              <div>• List unlimited experiences</div>
              <div>• Access to advanced analytics</div>
              <div>• Priority customer support</div>
              <div>• Verified badge on your profile</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              {isDashboardType ? 'Remind Later' : 'Cancel'}
            </button>
            <button
              onClick={handleFillDetails}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Complete Now
            </button>
          </div>

          {/* Note */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Verification usually takes 1-2 business days after submission
          </p>
        </div>
      </div>
    </div>
  );
};