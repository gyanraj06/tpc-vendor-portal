import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthService } from '../../services/authService';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const vendor = await AuthService.loginVendor({ email, password });
      
      if (vendor) {
        // Handle remember me functionality
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('rememberedEmail');
        }
        
        // Check if first-time login
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

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await AuthService.signInWithGoogle();
      if (!result.success) {
        setError(result.error || 'Google sign in failed');
      }
      // If successful, user will be redirected by Supabase
    } catch (err) {
      setError('Failed to sign in with Google');
      console.error('Google SSO error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue-50 to-brand-green-50 flex">
      {/* Left Side - Details */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-blue-600 p-16 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue-600/20 to-brand-green-600/20"></div>
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center mb-12">
            <div className="h-12 w-12 bg-[url('/src/assets/LogoImage.jpg')] bg-contain bg-no-repeat"></div>
            <div className="-ml-2 h-12 w-48 bg-[url('/src/assets/LogoWritten.jpg')] bg-contain bg-no-repeat"></div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-6">
            Welcome to TrippeChalo Vendor Portal
          </h1>
          
          <p className="text-white/90 text-lg mb-8 leading-relaxed">
            Join thousands of vendors who are already growing their business with TrippeChalo. 
            Connect with travelers and showcase your unique services to the world.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Easy Setup</h3>
                <p className="text-white/80">Get your business listed in minutes with our streamlined onboarding process.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Reach More Customers</h3>
                <p className="text-white/80">Connect with travelers looking for authentic local experiences.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Secure Platform</h3>
                <p className="text-white/80">Your data and transactions are protected with enterprise-grade security.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-brand-dark-900 mb-2">Sign In</h2>
              <p className="text-brand-dark-600">Access your vendor dashboard</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
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
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent transition-all duration-200"
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
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-blue-600 hover:bg-brand-blue-700 disabled:bg-brand-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
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

            <div className="mt-8 text-center">
              <p className="text-brand-dark-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-brand-blue-600 hover:text-brand-blue-500 font-medium">
                  Sign up here
                </Link>
              </p>
            </div>

            {/* <div className="mt-6 text-center">
              <p className="text-xs text-brand-dark-500">
                By signing in, you agree to our{' '}
                <a href="#" className="text-brand-blue-600 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-brand-blue-600 hover:underline">Privacy Policy</a>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};