import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthService } from '../../services/authService';

export const AuthPage: React.FC = () => {
  const location = useLocation();
  const [isLoginMode, setIsLoginMode] = useState(location.pathname !== '/signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Check for remembered email on component mount
  React.useEffect(() => {
    const remembered = localStorage.getItem('rememberMe');
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    
    if (remembered === 'true' && rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError('');
    setSuccess('');
  };

  const switchMode = () => {
    setIsLoginMode(!isLoginMode);
    resetForm();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const vendor = await AuthService.loginVendor({ email, password });
      
      if (vendor) {
        localStorage.setItem('vendorId', vendor.id);
        localStorage.setItem('vendorEmail', vendor.email);
        
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('rememberedEmail');
        }
        
        if (vendor.isFirstLogin) {
          navigate('/profile-setup');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError('Invalid email or password. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const vendor = await AuthService.registerVendor({ email, password, confirmPassword });
      
      if (vendor) {
        setSuccess('Account created successfully! Switching to login...');
        setTimeout(() => {
          setIsLoginMode(true);
          setSuccess('');
          setPassword('');
          setConfirmPassword('');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error('Sign up error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await AuthService.signInWithGoogle();
      if (!result.success) {
        setError(result.error || 'Google sign in failed');
      }
    } catch (err) {
      setError('Failed to sign in with Google');
      console.error('Google SSO error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-green-50/30">
      {/* Background decorative elements - only show on desktop */}
      <div className="absolute inset-0 overflow-hidden hidden lg:block">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-green-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-green-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Mobile Layout - Normal behavior */}
      <div className="lg:hidden min-h-screen">
        {/* Mobile Header */}
        <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-700 text-white p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-10 w-10 bg-[url('/assets/LogoImage.jpg')] bg-contain bg-no-repeat"></div>
            <div className="-ml-2 h-10 w-40 bg-[url('/assets/LogoWritten.jpg')] bg-contain bg-no-repeat"></div>
          </div>
          <h1 className="text-xl font-bold">
            {isLoginMode ? 'Welcome Back' : 'Join TrippeChalo'}
          </h1>
          <p className="text-white/90 text-sm">
            {isLoginMode ? 'Sign in to your account' : 'Create your vendor account'}
          </p>
        </div>

        {/* Mobile Form */}
        <div className="p-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4">
                {success}
              </div>
            )}

            <form onSubmit={isLoginMode ? handleLogin : handleSignUp} className="space-y-4">
              <div>
                <label htmlFor="mobile-email" className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-dark-400" size={20} />
                  <input
                    id="mobile-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 ${
                      isLoginMode 
                        ? 'focus:ring-brand-blue-500' 
                        : 'focus:ring-brand-green-500'
                    } focus:border-transparent transition-all duration-200`}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="mobile-password" className="block text-sm font-medium text-brand-dark-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-dark-400" size={20} />
                  <input
                    id="mobile-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 ${
                      isLoginMode 
                        ? 'focus:ring-brand-blue-500' 
                        : 'focus:ring-brand-green-500'
                    } focus:border-transparent transition-all duration-200`}
                    placeholder={isLoginMode ? "Enter your password" : "Create a password"}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-dark-400 hover:text-brand-dark-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {!isLoginMode && (
                <div>
                  <label htmlFor="mobile-confirmPassword" className="block text-sm font-medium text-brand-dark-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-dark-400" size={20} />
                    <input
                      id="mobile-confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-dark-400 hover:text-brand-dark-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              )}

              {isLoginMode && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-brand-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-blue-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-brand-dark-600">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-brand-blue-600 hover:text-brand-blue-500 font-medium">
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full ${
                  isLoginMode 
                    ? 'bg-brand-blue-600 hover:bg-brand-blue-700 disabled:bg-brand-blue-400' 
                    : 'bg-brand-green-600 hover:bg-brand-green-700 disabled:bg-brand-green-400'
                } disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none`}
              >
                {isLoading 
                  ? (isLoginMode ? 'Signing In...' : 'Creating Account...') 
                  : (isLoginMode ? 'Sign In' : 'Create Account')
                }
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-brand-dark-500">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="mt-4 w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-brand-dark-600">
                {isLoginMode ? "Don't have an account?" : "Already have an account?"}{' '}
                <button
                  onClick={switchMode}
                  className={`${
                    isLoginMode 
                      ? 'text-brand-blue-600 hover:text-brand-blue-500' 
                      : 'text-brand-green-600 hover:text-brand-green-500'
                  } font-medium transition-colors`}
                >
                  {isLoginMode ? 'Sign up here' : 'Sign in here'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Sliding Animation */}
      <div className="hidden lg:flex items-center justify-center min-h-screen p-2 lg:p-4">
        <div className="relative z-10 w-full max-w-5xl h-[90vh] max-h-[600px] bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        
        {/* Info Panel */}
        <div className={`absolute top-0 w-1/2 h-full transition-all duration-700 ease-in-out ${
          isLoginMode 
            ? 'left-0 bg-gradient-to-br from-brand-blue-600 to-brand-blue-700' 
            : 'left-1/2 bg-gradient-to-br from-brand-green-600 to-brand-green-700'
        }`}>
          <div className="p-4 lg:p-6 xl:p-8 flex flex-col justify-center h-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="relative z-10 max-w-xs lg:max-w-sm mx-auto">
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 bg-[url('/assets/LogoImage.jpg')] bg-contain bg-no-repeat"></div>
                <div className="-ml-2 h-8 w-32 bg-[url('/assets/LogoWritten.jpg')] bg-contain bg-no-repeat"></div>
              </div>
              
              <h1 className="text-lg lg:text-xl xl:text-2xl font-bold text-white mb-3">
                {isLoginMode ? 'Welcome to TrippeChalo Vendor Portal' : 'Join TrippeChalo Vendor Portal'}
              </h1>
              
              <p className="text-white/90 text-xs lg:text-sm mb-4 leading-relaxed">
                {isLoginMode 
                  ? 'Join thousands of vendors who are already growing their business with TrippeChalo. Connect with travelers and showcase your unique services to the world.'
                  : 'Start your journey with us today. Create your vendor account and begin showcasing your unique services to travelers worldwide.'
                }
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-0.5 text-xs lg:text-sm">
                      {isLoginMode ? 'Easy Setup' : 'Quick Registration'}
                    </h3>
                    <p className="text-white/80 text-xs">
                      {isLoginMode 
                        ? 'Get your business listed in minutes with our streamlined onboarding process.'
                        : 'Create your account in just a few simple steps.'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-0.5 text-xs lg:text-sm">
                      {isLoginMode ? 'Reach More Customers' : 'Instant Access'}
                    </h3>
                    <p className="text-white/80 text-xs">
                      {isLoginMode 
                        ? 'Connect with travelers looking for authentic local experiences.'
                        : 'Get immediate access to your vendor dashboard.'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-0.5 text-xs lg:text-sm">
                      {isLoginMode ? 'Secure Platform' : 'Global Reach'}
                    </h3>
                    <p className="text-white/80 text-xs">
                      {isLoginMode 
                        ? 'Your data and transactions are protected with enterprise-grade security.'
                        : 'Connect with customers from around the world.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Panel */}
        <div className={`absolute top-0 w-1/2 h-full transition-all duration-700 ease-in-out ${
          isLoginMode ? 'right-0' : 'right-1/2'
        }`}>
          <div className="p-4 lg:p-6 xl:p-8 flex items-center justify-center h-full overflow-y-auto">
            <div className="w-full max-w-xs lg:max-w-sm mx-auto">
              <div className="text-center mb-4">
                <h2 className="text-xl lg:text-2xl font-bold text-brand-dark-900 mb-1">
                  {isLoginMode ? 'Sign In' : 'Create Account'}
                </h2>
                <p className="text-brand-dark-600 text-xs lg:text-sm">
                  {isLoginMode ? 'Access your vendor dashboard' : 'Join our vendor community'}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4">
                  {success}
                </div>
              )}

              <form onSubmit={isLoginMode ? handleLogin : handleSignUp} className="space-y-3">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-brand-dark-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-dark-400" size={20} />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-12 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 ${
                        isLoginMode 
                          ? 'focus:ring-brand-blue-500' 
                          : 'focus:ring-brand-green-500'
                      } focus:border-transparent transition-all duration-200`}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-brand-dark-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-dark-400" size={20} />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-12 pr-12 py-2 border border-gray-300 rounded-xl focus:ring-2 ${
                        isLoginMode 
                          ? 'focus:ring-brand-blue-500' 
                          : 'focus:ring-brand-green-500'
                      } focus:border-transparent transition-all duration-200`}
                      placeholder={isLoginMode ? "Enter your password" : "Create a password"}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-dark-400 hover:text-brand-dark-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {!isLoginMode && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-brand-dark-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-dark-400" size={20} />
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="Confirm your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-dark-400 hover:text-brand-dark-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                )}

                {isLoginMode && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-brand-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-blue-500 focus:ring-2"
                      />
                      <span className="ml-2 text-sm text-brand-dark-600">Remember me</span>
                    </label>
                    <a href="#" className="text-sm text-brand-blue-600 hover:text-brand-blue-500 font-medium">
                      Forgot password?
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full ${
                    isLoginMode 
                      ? 'bg-brand-blue-600 hover:bg-brand-blue-700 disabled:bg-brand-blue-400' 
                      : 'bg-brand-green-600 hover:bg-brand-green-700 disabled:bg-brand-green-400'
                  } disabled:cursor-not-allowed text-white font-semibold py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none`}
                >
                  {isLoading 
                    ? (isLoginMode ? 'Signing In...' : 'Creating Account...') 
                    : (isLoginMode ? 'Sign In' : 'Create Account')
                  }
                </button>
              </form>

              <div className="mt-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-brand-dark-500">Or continue with</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="mt-2 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
              </div>

              <div className="mt-3 text-center">
                <p className="text-brand-dark-600">
                  {isLoginMode ? "Don't have an account?" : "Already have an account?"}{' '}
                  <button
                    onClick={switchMode}
                    className={`${
                      isLoginMode 
                        ? 'text-brand-blue-600 hover:text-brand-blue-500' 
                        : 'text-brand-green-600 hover:text-brand-green-500'
                    } font-medium transition-colors`}
                  >
                    {isLoginMode ? 'Sign up here' : 'Sign in here'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};