# Theme System Documentation

## Overview

The Kisaan app now features a comprehensive dark/light theme system that replaces the previous language switcher functionality. The theme system provides a smooth user experience with automatic persistence and system preference detection.

## Features

- ✅ **Dark/Light Mode Toggle**: Easy switching between themes
- ✅ **Automatic Persistence**: Theme preference saved in localStorage
- ✅ **System Preference Detection**: Respects user's OS theme preference
- ✅ **Smooth Transitions**: All elements transition smoothly between themes
- ✅ **CSS Variables**: Centralized color management
- ✅ **Tailwind Integration**: Full Tailwind CSS dark mode support

## Usage

### 1. Using the Theme Context

```javascript
import { useTheme } from '../contexts/ThemeContext';

const MyComponent = () => {
  const { isDarkMode, toggleTheme, theme } = useTheme();
  
  return (
    <div className={`${isDarkMode ? 'dark' : ''} transition-colors`}>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>
        Switch to {isDarkMode ? 'light' : 'dark'} mode
      </button>
    </div>
  );
};
```

### 2. Theme Toggle Component

The `ThemeToggle` component is already integrated into the navbar:

```javascript
import ThemeToggle from '../components/common/ThemeToggle';

// Use anywhere in your app
<ThemeToggle />
```

### 3. Theme-Aware Styling

#### Using Tailwind Classes
```javascript
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  <h1 className="text-gray-800 dark:text-gray-100">Title</h1>
  <p className="text-gray-600 dark:text-gray-300">Description</p>
</div>
```

#### Using CSS Variables
```css
.my-component {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border-color: var(--border-color);
}
```

## Available CSS Variables

### Light Theme
- `--bg-primary`: #ffffff (main background)
- `--bg-secondary`: #f8fafc (secondary background)
- `--bg-tertiary`: #f1f5f9 (tertiary background)
- `--text-primary`: #1e293b (main text)
- `--text-secondary`: #64748b (secondary text)
- `--text-muted`: #94a3b8 (muted text)
- `--border-color`: #e2e8f0 (borders)
- `--accent-color`: #10b981 (accent/primary)
- `--hover-bg`: rgba(0, 0, 0, 0.05) (hover states)

### Dark Theme
- `--bg-primary`: #0f172a (main background)
- `--bg-secondary`: #1e293b (secondary background)
- `--bg-tertiary`: #334155 (tertiary background)
- `--text-primary`: #f1f5f9 (main text)
- `--text-secondary`: #cbd5e1 (secondary text)
- `--text-muted`: #94a3b8 (muted text)
- `--border-color`: #475569 (borders)
- `--accent-color`: #10b981 (accent/primary)
- `--hover-bg`: rgba(255, 255, 255, 0.05) (hover states)

## Component Examples

### 1. Card Component
```javascript
const Card = ({ children }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
    {children}
  </div>
);
```

### 2. Button Components
```javascript
// Primary Button
<button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded transition-colors">
  Primary Action
</button>

// Secondary Button
<button className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 px-4 py-2 rounded transition-colors">
  Secondary Action
</button>
```

### 3. Input Components
```javascript
<input 
  type="text"
  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
  placeholder="Enter text..."
/>
```

## Migration from Language Switcher

The following changes were made:

1. **Removed**: `LanguageContext` and `useLanguage` hook
2. **Added**: `ThemeContext` and `useTheme` hook
3. **Replaced**: Language switcher in navbar with theme toggle
4. **Updated**: All components to support theme-aware styling
5. **Enhanced**: Tailwind config with dark mode support

## Best Practices

1. **Always wrap components** with the `dark` class when using `isDarkMode`:
   ```javascript
   <div className={`${isDarkMode ? 'dark' : ''} ...other-classes`}>
   ```

2. **Use CSS variables** for custom components:
   ```css
   .custom-component {
     background: var(--bg-secondary);
     color: var(--text-primary);
   }
   ```

3. **Add transitions** for smooth theme switching:
   ```javascript
   <div className="transition-colors duration-200">
   ```

4. **Test both themes** during development to ensure all elements are properly styled.

## File Structure

```
src/
├── contexts/
│   └── ThemeContext.js          # Theme context and provider
├── components/
│   └── common/
│       ├── ThemeToggle.js       # Theme toggle component
│       └── ExampleThemedComponent.js  # Example implementation
├── styles/
│   └── theme.css               # Theme CSS variables and utilities
└── pages/
    └── [various pages]         # Updated with theme support
```

## Browser Support

- All modern browsers that support CSS custom properties
- Automatic fallback to light mode for older browsers
- Respects `prefers-color-scheme` media query

## Troubleshooting

### Theme not persisting
- Check if localStorage is available and working
- Ensure ThemeProvider wraps your app correctly

### Styles not updating
- Verify that components include the `dark` class when `isDarkMode` is true
- Check that CSS variables are properly defined in theme.css

### Tailwind dark mode not working
- Ensure `darkMode: 'class'` is set in tailwind.config.js
- Verify that the `dark` class is applied to parent elements
