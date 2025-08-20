import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const ThemeToggle = ({ className = '' }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${className}`}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} theme`}
    >
      <div className="relative w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors duration-200">
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 flex items-center justify-center ${
            isDarkMode ? 'translate-x-6' : 'translate-x-0'
          }`}
        >
          {isDarkMode ? (
            <MoonIcon className="h-3 w-3 text-gray-700" />
          ) : (
            <SunIcon className="h-3 w-3 text-amber-500" />
          )}
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;
