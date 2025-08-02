import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  GlobeAltIcon,
  HomeIcon,
  RectangleStackIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

const Navbar = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { language, changeLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  
  const profileMenuRef = useRef(null);
  const languageMenuRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsProfileMenuOpen(false);
  };

  const navLinks = [
    { name: t('nav.home'), href: '/', icon: HomeIcon },
    { name: t('nav.grains'), href: '/grains', icon: RectangleStackIcon }
  ];

  const userMenuItems = [
    { name: t('nav.profile'), href: '/profile', icon: UserIcon },
    { name: t('nav.settings'), href: '/settings', icon: Cog6ToothIcon }
  ];

  const roleBasedNavigation = {
    farmer: [
      { name: t('nav.dashboard'), href: '/farmer/dashboard', icon: ChartBarIcon },
      { name: t('nav.myListings'), href: '/farmer/listings' },
      { name: t('nav.addGrain'), href: '/farmer/add-grain' },
      { name: t('nav.orders'), href: '/farmer/orders' }
    ],
    buyer: [
      { name: t('nav.dashboard'), href: '/buyer/dashboard', icon: ChartBarIcon },
      { name: t('nav.myOrders'), href: '/buyer/orders' }
    ],
    admin: [
      { name: t('nav.adminDashboard'), href: '/admin/dashboard', icon: ChartBarIcon },
      { name: t('nav.manageUsers'), href: '/admin/users' },
      { name: t('nav.manageGrains'), href: '/admin/grains' },
      { name: t('nav.analytics'), href: '/admin/analytics' }
    ]
  };

  const isActiveLink = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="bg-primary-600 text-white p-2 rounded-lg">
                <RectangleStackIcon className="h-6 w-6" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">
                {t('app.name')}
              </span>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`${
                    isActiveLink(link.href)
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Role-based navigation */}
              {user && roleBasedNavigation[user.role] && (
                <div className="flex space-x-8">
                  {roleBasedNavigation[user.role].map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className={`${
                        isActiveLink(link.href)
                          ? 'border-primary-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right side - Language switcher, User menu, Mobile menu button */}
          <div className="flex items-center space-x-4">
            {/* Language switcher */}
            <div className="relative" ref={languageMenuRef}>
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <GlobeAltIcon className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium uppercase">
                  {language}
                </span>
                <ChevronDownIcon className="h-4 w-4 ml-1" />
              </button>

              <AnimatePresence>
                {isLanguageMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.1 }}
                    className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
                  >
                    <div className="py-1">
                      <button
                        onClick={() => {
                          changeLanguage('en');
                          setIsLanguageMenuOpen(false);
                        }}
                        className={`${
                          language === 'en' ? 'bg-gray-100' : ''
                        } block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => {
                          changeLanguage('hi');
                          setIsLanguageMenuOpen(false);
                        }}
                        className={`${
                          language === 'hi' ? 'bg-gray-100' : ''
                        } block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200`}
                      >
                        हिंदी
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User menu */}
            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <div className="bg-primary-600 text-white h-8 w-8 rounded-full flex items-center justify-center">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="ml-2 text-gray-700 font-medium hidden md:block">
                    {user.name}
                  </span>
                  <ChevronDownIcon className="ml-1 h-4 w-4 text-gray-500 hidden md:block" />
                </button>

                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.1 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
                    >
                      <div className="py-1">
                        <div className="px-4 py-2 border-b">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800 mt-1">
                            {t(`roles.${user.role}`)}
                          </span>
                        </div>
                        
                        {userMenuItems.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                          >
                            <item.icon className="h-4 w-4 mr-2" />
                            {item.name}
                          </Link>
                        ))}
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                          {t('auth.logout')}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors duration-200"
                >
                  {t('auth.loginBtn')}
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {t('auth.registerBtn')}
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors duration-200"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`${
                    isActiveLink(link.href)
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200`}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Role-based mobile navigation */}
              {user && roleBasedNavigation[user.role] && (
                <>
                  <div className="border-t border-gray-200 pt-2">
                    {roleBasedNavigation[user.role].map((link) => (
                      <Link
                        key={link.name}
                        to={link.href}
                        className={`${
                          isActiveLink(link.href)
                            ? 'bg-primary-50 border-primary-500 text-primary-700'
                            : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                        } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </>
              )}
              
              {/* Mobile auth section */}
              <div className="border-t border-gray-200 pt-4 pb-3">
                {user ? (
                  <>
                    <div className="flex items-center px-4 mb-3">
                      <div className="bg-primary-600 text-white h-10 w-10 rounded-full flex items-center justify-center">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={user.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium text-gray-800">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                      >
                        {item.name}
                      </Link>
                    ))}
                    
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                    >
                      {t('auth.logout')}
                    </button>
                  </>
                ) : (
                  <div className="space-y-1">
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                    >
                      {t('auth.loginBtn')}
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                    >
                      {t('auth.registerBtn')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
