import { useState } from 'react';
import { Heart, Menu, X, Moon, Sun, User, LogOut, Settings, BookMarked } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import AuthModal from '../auth/AuthModal';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Header = ({ onNavigate, currentPage }: HeaderProps) => {
  const { user, profile, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleSignOut = async () => {
    await signOut();
    setProfileMenuOpen(false);
    onNavigate('home');
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <button
                onClick={() => onNavigate('home')}
                className="flex items-center space-x-2 group"
              >
                <Heart className="w-7 h-7 text-rose-500 fill-rose-500 group-hover:scale-110 transition-transform" />
                <span className="text-xl font-bold bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
                  CONNECTLY
                </span>
              </button>

              <nav className="hidden md:flex items-center space-x-6">
                <button
                  onClick={() => onNavigate('home')}
                  className={`text-sm font-medium transition-colors ${
                    currentPage === 'home'
                      ? 'text-rose-500'
                      : 'text-gray-700 dark:text-gray-300 hover:text-rose-500'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => onNavigate('explore')}
                  className={`text-sm font-medium transition-colors ${
                    currentPage === 'explore'
                      ? 'text-rose-500'
                      : 'text-gray-700 dark:text-gray-300 hover:text-rose-500'
                  }`}
                >
                  Explore
                </button>
                {profile?.role === 'host' && (
                  <button
                    onClick={() => onNavigate('host-dashboard')}
                    className={`text-sm font-medium transition-colors ${
                      currentPage === 'host-dashboard'
                        ? 'text-rose-500'
                        : 'text-gray-700 dark:text-gray-300 hover:text-rose-500'
                    }`}
                  >
                    Host Dashboard
                  </button>
                )}
                {profile?.role === 'admin' && (
                  <button
                    onClick={() => onNavigate('admin-dashboard')}
                    className={`text-sm font-medium transition-colors ${
                      currentPage === 'admin-dashboard'
                        ? 'text-rose-500'
                        : 'text-gray-700 dark:text-gray-300 hover:text-rose-500'
                    }`}
                  >
                    Admin
                  </button>
                )}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                )}
              </button>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:shadow-lg transition-all"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline text-sm font-medium">
                      {profile?.full_name || 'User'}
                    </span>
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <button
                        onClick={() => {
                          onNavigate('dashboard');
                          setProfileMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                      >
                        <BookMarked className="w-4 h-4" />
                        <span>My Dashboard</span>
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('settings');
                          setProfileMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-3">
                  <button
                    onClick={() => handleAuthClick('signin')}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-rose-500 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleAuthClick('signup')}
                    className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-orange-500 rounded-full hover:shadow-lg transition-all"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 animate-in slide-in-from-top duration-200">
            <nav className="px-4 py-4 space-y-2">
              <button
                onClick={() => {
                  onNavigate('home');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => {
                  onNavigate('explore');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Explore
              </button>
              {!user && (
                <>
                  <button
                    onClick={() => {
                      handleAuthClick('signin');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      handleAuthClick('signup');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-orange-500 rounded-lg"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSwitchMode={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
        />
      )}
    </>
  );
};

export default Header;
