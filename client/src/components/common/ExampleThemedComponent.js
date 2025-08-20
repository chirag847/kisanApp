import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

// Example component showing how to use theme in other components
const ExampleThemedComponent = () => {
  const { isDarkMode, theme } = useTheme();

  return (
    <div className={`${isDarkMode ? 'dark' : ''} p-6`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors duration-200">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Theme Example Component
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Current theme: <span className="font-semibold">{theme}</span>
        </p>
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-sm text-gray-700 dark:text-gray-200">
              This component automatically adapts to the current theme.
            </p>
          </div>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded transition-colors">
            Primary Button
          </button>
          <button className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 px-4 py-2 rounded transition-colors">
            Secondary Button
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExampleThemedComponent;
