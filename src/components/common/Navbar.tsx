import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isLandingPage = location.pathname === '/';

  // Check if user is logged in (you can replace this with your auth logic)
  const isLoggedIn = localStorage.getItem('supabase.auth.token') !== null;

  const handleDashboardClick = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  // Navigation data
  const allNavLinks = [
    { path: '/', label: 'HOME' },
  ];

  // Filter navigation links based on current page
  const navLinks = isLandingPage 
    ? allNavLinks.filter(link => link.path !== '/')
    : allNavLinks;

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLandingPage]);

  useEffect(() => {
    if (!isOpen) return;

    const closeMenu = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('nav')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, [isOpen]);

  // Glass morphism - always dark
  const glassClasses = 'bg-gradient-to-r from-black/60 to-gray-800/60 backdrop-blur-md';

  return (
    <nav
      className={`font-sans fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'md:py-2 md:px-4' : 'md:py-7 md:px-4'
      }`}
    >
      {/* Desktop Header */}
      <div
        className={`mx-auto max-w-7xl rounded-full px-6 py-4 ${glassClasses} shadow-[0_4px_25px_rgba(0,0,0,0.25)] hidden md:block`}
      >
        <div className="flex items-center justify-between">
          {/* Left Section - Navigation Links */}
          <div className="flex items-center space-x-8">
            {navLinks.filter(link => link.path !== '/').map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className="text-sm text-white transition-colors duration-200 hover:text-gray-300 lg:text-base font-medium"
              >
                {label}
              </Link>
            ))}
            
            {/* Dashboard Button */}
            <button 
              onClick={handleDashboardClick}
              className="text-sm text-white transition-colors duration-200 hover:text-gray-300 lg:text-base font-medium"
            >
              Dashboard
            </button>
          </div>

          {/* Center Section - Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" className="flex items-center">
              <img 
                src="/assets/LogoImage.jpg" 
                alt="Logo" 
                className="h-8 w-8 rounded-full object-contain"
              />
              <img 
                src="/assets/LogoWritten.jpg" 
                alt="Mounterra" 
                className="h-8 ml-1"
              />
            </Link>
          </div>

          {/* Right Section - Auth Buttons */}
          <div className="flex items-center space-x-4">
            {/* Sign In Button */}
            <Link 
              to="/login"
              className="bg-[#1E63EF] hover:bg-[#1750CC] text-white font-semibold px-4 py-1.5 text-sm rounded-full transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className={`${glassClasses} py-3 md:hidden w-full`}>
        <div className="flex items-center justify-between px-4">
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/assets/LogoImage.jpg" 
              alt="Logo" 
              className="h-8 w-8 rounded-full object-contain"
            />
            <img 
              src="/assets/LogoWritten.jpg" 
              alt="Mounterra" 
              className="h-8 ml-1"
            />
          </Link>

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-1">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-[#1E63EF] hover:bg-[#1750CC] text-white font-bold px-3.5 py-0.5 text-2xl rounded-full transition-all duration-200 transform hover:scale-105"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? '✕' : '+'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Slide from Right */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[80vw] md:hidden ${glassClasses} transform shadow-xl transition-all duration-300 z-50 ${
          isOpen
            ? 'translate-x-0'
            : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Close Button */}
          <div className="flex justify-end mb-8">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-4 mb-8">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className="block text-lg text-white transition-colors hover:text-gray-300 py-2"
              >
                {label}
              </Link>
            ))}
            
            {/* Mobile Dashboard Button */}
            <button 
              onClick={() => {
                handleDashboardClick();
                setIsOpen(false);
              }}
              className="block text-lg text-white transition-colors hover:text-gray-300 py-2 text-left"
            >
              Dashboard
            </button>
          </nav>

          {/* Sign In Button */}
          <Link 
            to="/login"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center bg-[#1E63EF] hover:bg-[#1750CC] text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 mb-6"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;