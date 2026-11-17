import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'oj-theme';
const media = () => window.matchMedia('(prefers-color-scheme: dark)');

function readPreference() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'light' || v === 'dark' ? v : 'system';
  } catch {
    return 'system';
  }
}

/** Light / dark / system theme, persisted per browser and applied as a class on <html>. */
export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(readPreference);
  const [systemDark, setSystemDark] = useState(() => media().matches);

  // Follow OS changes while in "system" mode.
  useEffect(() => {
    const mq = media();
    const onChange = (e) => setSystemDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const resolved = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolved === 'dark');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolved === 'dark' ? '#141110' : '#fffdfb');
  }, [resolved]);

  const choose = useCallback((next) => {
    setPreference(next);
    try {
      if (next === 'system') localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next);
    } catch { /* storage unavailable: theme still applies for this visit */ }
  }, []);

  /** light -> dark -> system -> light */
  const cycle = useCallback(() => {
    choose(preference === 'light' ? 'dark' : preference === 'dark' ? 'system' : 'light');
  }, [preference, choose]);

  const value = useMemo(() => ({ preference, resolved, choose, cycle }), [preference, resolved, choose, cycle]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);
