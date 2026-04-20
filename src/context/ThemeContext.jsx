import { createContext, useContext, useState, useEffect } from 'react';
import { lightTokens, darkTokens } from '../theme/tokens';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('insafchain_theme');
    return saved === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('insafchain_theme', dark ? 'dark' : 'light');
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  const toggleTheme = () => setDark((prev) => !prev);

  // Current palette — available in JS for any component that needs
  // token values in inline styles or conditional logic
  const tokens = dark ? darkTokens : lightTokens;

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme, tokens }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
