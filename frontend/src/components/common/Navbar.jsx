import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
    logout();
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-white p-1.5 rounded-full shadow-md group-hover:shadow-lg transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-14a3 3 0 00-3 3v2H7a1 1 0 000 2h1v1a1 1 0 01-1 1 1 1 0 100 2h6a1 1 0 100-2H9.83c.11-.313.17-.65.17-1v-1h1a1 1 0 100-2h-1V7a1 1 0 112 0 1 1 0 102 0 3 3 0 00-3-3z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-white">Acme</span>
              <span className="text-blue-200">Health</span>
            </span>
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                <div className="flex space-x-1 mr-4">
                  <Link
                    to="/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive('/dashboard')
                        ? 'text-white border-b-2 border-white'
                        : 'text-blue-100 hover:text-white hover:border-b-2 hover:border-blue-300'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/weight"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive('/weight')
                        ? 'text-white border-b-2 border-white'
                        : 'text-blue-100 hover:text-white hover:border-b-2 hover:border-blue-300'
                    }`}
                  >
                    Weight
                  </Link>
                  <Link
                    to="/medications"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive('/medications')
                        ? 'text-white border-b-2 border-white'
                        : 'text-blue-100 hover:text-white hover:border-b-2 hover:border-blue-300'
                    }`}
                  >
                    Medications
                  </Link>
                
                </div>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleProfileMenu}
                    className="flex items-center focus:outline-none"
                  >
                    <div>
                      {user?.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user?.name || 'User'}
                          className="h-9 w-9 rounded-full object-cover border-2 border-blue-300 hover:border-white transition-colors duration-200"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white border-2 border-blue-300 hover:border-white transition-colors duration-200">
                          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Dropdown menu */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5 transform origin-top-right transition-all duration-200 ease-out">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Your Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-white text-blue-700 hover:bg-blue-50 transition-colors duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-800 shadow-inner">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <>
                <div className="flex justify-center px-3 py-2 border-b border-blue-700">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user?.name || 'User'}
                      className="h-10 w-10 rounded-full object-cover border-2 border-blue-300"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white border-2 border-blue-300">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/dashboard')
                      ? 'text-white border-l-4 border-white pl-2'
                      : 'text-blue-100 hover:text-white hover:border-l-4 hover:border-blue-300 hover:pl-2'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/weight"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/weight')
                      ? 'text-white border-l-4 border-white pl-2'
                      : 'text-blue-100 hover:text-white hover:border-l-4 hover:border-blue-300 hover:pl-2'
                  }`}
                >
                  Weight
                </Link>
                <Link
                  to="/medications"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/medications')
                      ? 'text-white border-l-4 border-white pl-2'
                      : 'text-blue-100 hover:text-white hover:border-l-4 hover:border-blue-300 hover:pl-2'
                  }`}
                >
                  Medications
                </Link>
               
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/profile')
                      ? 'text-white border-l-4 border-white pl-2'
                      : 'text-blue-100 hover:text-white hover:border-l-4 hover:border-blue-300 hover:pl-2'
                  }`}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-300 hover:bg-blue-700 hover:text-red-200"
                >
                  Sign out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 p-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-md text-center text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-md text-center text-sm font-medium bg-white text-blue-700 hover:bg-blue-50 transition-colors duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
