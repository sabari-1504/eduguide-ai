import React from 'react';
import { GraduationCap, Menu, X, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { User } from 'firebase/auth';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  user?: User | null;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  activeSection, 
  setActiveSection, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen,
  user,
  onLogout
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  // Show back if we aren't on the public about/home section OR if the URL isn't '/'
  const showBack = (location.pathname !== '/') || (activeSection !== 'home' && activeSection !== 'about');

  const handleBackClick = () => {
    try {
      const hasReferrerSameOrigin = typeof document !== 'undefined' && document.referrer &&
        new URL(document.referrer).origin === window.location.origin;
      if (hasReferrerSameOrigin) {
        window.history.back();
        return;
      }
      if (typeof window !== 'undefined' && window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/');
      }
    } catch {
      navigate('/');
    }
  };
  const navItems = [
    { id: 'home', label: 'Home', to: '/' },
    { id: 'chat', label: 'AI Chat', to: '/chat' }
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full backdrop-blur-md z-50"
      style={{
        backgroundColor: 'hsl(var(--background) / 0.8)',
        borderBottom: '1px solid hsl(var(--background) / 0.2)'
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Back + Logo */}
          <motion.div 
            className="flex items-center space-x-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showBack && (
              <button
                onClick={handleBackClick}
                className="mr-2 p-2 rounded-md"
                style={{ color: 'hsl(var(--foreground))' }}
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <Link
              to="/"
              className="flex items-center space-x-2"
              onClick={(e) => { e.preventDefault(); window.location.assign('/'); }}
            >
              <div className="p-2 rounded-lg"
                   style={{ background: 'linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)' }}>
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent"
                    style={{ backgroundImage: 'linear-gradient(90deg, hsl(var(--secondary)) 0%, hsl(var(--primary)) 100%)' }}>
                EduGuide AI
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  window.location.pathname === item.to
                    ? 'text-white'
                    : ''
                }`}
                style={
                  window.location.pathname === item.to
                    ? { backgroundColor: 'hsl(var(--primary) / 0.2)', color: 'hsl(var(--foreground))' }
                    : { color: 'hsl(var(--foreground))' }
                }
                onClick={(e) => {
                  if (item.id === 'home') {
                    e.preventDefault();
                    window.location.assign('/');
                  }
                }}
              >
                {item.label}
              </Link>
            ))}
            {user && (
              <>
                <Link
                  to="/edit-profile"
                  className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  style={{ backgroundColor: 'hsl(var(--secondary) / 0.25)', color: 'hsl(var(--foreground))' }}
                >
                  Edit Profile
                </Link>
              <div className="flex items-center gap-2 ml-6">
                <span className="text-sm" style={{ color: 'hsl(var(--foreground))' }}>{(user as any).displayName || user.email}</span>
                <button
                  onClick={onLogout}
                  className="text-white px-3 py-1 rounded text-sm"
                  style={{ backgroundColor: '#b91c1c' }}
                >
                  Logout
                </button>
              </div>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md"
              style={{ color: 'hsl(var(--foreground))' }}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden"
          style={{ backgroundColor: 'hsl(var(--background))', borderBottom: '1px solid hsl(var(--background) / 0.2)' }}
        >
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.to}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                style={
                  window.location.pathname === item.to
                    ? { backgroundColor: 'hsl(var(--primary) / 0.2)', color: 'hsl(var(--foreground))' }
                    : { color: 'hsl(var(--foreground))' }
                }
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  if (item.id === 'home') {
                    e.preventDefault();
                    window.location.assign('/');
                  }
                }}
              >
                {item.label}
              </Link>
            ))}
            {user && (
              <>
                <Link
                  to="/edit-profile"
                  className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors mt-2"
                  style={{ backgroundColor: 'hsl(var(--secondary) / 0.25)', color: 'hsl(var(--foreground))' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Edit Profile
                </Link>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-sm" style={{ color: 'hsl(var(--foreground))' }}>{(user as any).displayName || user.email}</span>
                <button
                  onClick={onLogout}
                  className="text-white px-3 py-1 rounded text-sm"
                  style={{ backgroundColor: '#b91c1c' }}
                >
                  Logout
                </button>
              </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;