import { useTheme } from '../context/ThemeContext';

const LABELS = { light: 'Light theme', dark: 'Dark theme', system: 'System theme' };
const NEXT   = { light: 'dark', dark: 'system', system: 'light' };

function Icon({ mode }) {
  const common = { className: 'w-[18px] h-[18px]', fill: 'none', stroke: 'currentColor', strokeWidth: 2, viewBox: '0 0 24 24', 'aria-hidden': true };
  if (mode === 'light') return (
    <svg {...common}><circle cx="12" cy="12" r="4" /><path strokeLinecap="round" d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4l1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
  );
  if (mode === 'dark') return (
    <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" /></svg>
  );
  return (
    <svg {...common}><rect x="3" y="4" width="18" height="12" rx="2" /><path strokeLinecap="round" d="M8 20h8M12 16v4" /></svg>
  );
}

/** Cycles light → dark → system. */
export default function ThemeToggle({ className = '' }) {
  const { preference, cycle } = useTheme();
  return (
    <button
      type="button"
      onClick={cycle}
      title={`${LABELS[preference]} (click for ${LABELS[NEXT[preference]].toLowerCase()})`}
      aria-label={`${LABELS[preference]}. Switch to ${LABELS[NEXT[preference]].toLowerCase()}`}
      className={`w-9 h-9 rounded-xl border-[1.5px] border-line bg-surface text-ink flex items-center justify-center
        hover:-rotate-12 hover:border-muted/40 transition-all duration-200 ${className}`}
    >
      <Icon mode={preference} />
    </button>
  );
}
