import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Search, 
  Bell, 
  Settings, 
  LogOut, 
  Menu,
  Heart,
  BookOpen,
  Award,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../store/auth';
import { cn } from '../../utils';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowUserMenu(false);
  };

  const mockNotificationCount = 3;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden"
              aria-label="Toggle mobile menu"
              aria-expanded={showMobileMenu ? "true" : "false"}
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-br from-medical-500 to-primary-600 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900">
                  MedAR Learn
                </span>
                <span className="text-xs text-gray-500 hidden sm:block">
                  Healthcare AR Education
                </span>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search courses, lessons..."
                aria-label="Search courses and lessons"
              />
            </div>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Quick Stats for Students */}
                {user.role === 'student' && (
                  <div className="hidden lg:flex items-center space-x-4 mr-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <BookOpen className="h-4 w-4" aria-hidden="true" />
                      <span>{user.enrolledCourses.length} Courses</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Award className="h-4 w-4" aria-hidden="true" />
                      <span>{user.achievements.length} Achievements</span>
                    </div>
                  </div>
                )}

                {/* Notifications */}
                <button 
                  className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label={`Notifications ${mockNotificationCount > 0 ? `(${mockNotificationCount} unread)` : ''}`}
                >
                  <Bell className="h-6 w-6" />
                  {mockNotificationCount > 0 && (
                    <span 
                      className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                      aria-hidden="true"
                    >
                      {mockNotificationCount}
                    </span>
                  )}
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="User account menu"
                    aria-expanded={showUserMenu ? "true" : "false"}
                    aria-haspopup="true"
                  >
                    <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-medical-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium text-gray-700">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {user.role}
                      </div>
                    </div>
                    <ChevronDown 
                      className={cn(
                        "h-4 w-4 text-gray-400 transition-transform hidden md:block",
                        showUserMenu && "transform rotate-180"
                      )}
                      aria-hidden="true"
                    />
                  </button>

                  {showUserMenu && (
                    <div 
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                        role="menuitem"
                      >
                        <User className="h-4 w-4 mr-3" aria-hidden="true" />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                        role="menuitem"
                      >
                        <Settings className="h-4 w-4 mr-3" aria-hidden="true" />
                        Settings
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                        role="menuitem"
                      >
                        <LogOut className="h-4 w-4 mr-3" aria-hidden="true" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-primary-600 to-medical-500 hover:from-primary-700 hover:to-medical-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 shadow-sm"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            <div className="mb-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Search courses, lessons..."
                  aria-label="Search courses and lessons (mobile)"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};