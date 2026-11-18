import { useTheme } from '../context/ThemeContext';

/**
 * Brand logo.
 *  - variant="mark" (default): jar icon + "OpenJar" wordmark text, works on any background.
 *  - variant="full": the illustrated logo with tagline; switches to a lighter version in dark mode.
 * `tone="light"` forces white text for use on photos / dark panels.
 */
export default function Logo({ variant = 'mark', size = 36, tone, className = '', showText = true }) {
  const { resolved } = useTheme();

  if (variant === 'full') {
    const src = resolved === 'dark' ? '/logo-full-dark.png' : '/logo-full.png';
    return <img src={src} alt="OpenJar · Connect with pro chefs" width={size * 1.08} height={size}
      style={{ height: size, width: 'auto' }} className={`select-none ${className}`} draggable="false" />;
  }

  const textColour = tone === 'light' ? 'text-white' : 'text-ink';
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img src="/logo-mark.png" alt={showText ? '' : 'OpenJar'} width={size} height={size}
        className={`select-none flex-shrink-0 ${tone === 'light' ? 'drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]' : ''}`}
        style={{ width: size, height: size }} draggable="false" />
      {showText && (
        <span className={`font-display font-bold tracking-tight ${textColour}`} style={{ fontSize: Math.round(size * 0.58) }}>
          Open<span className="text-brand">Jar</span>
        </span>
      )}
    </span>
  );
}
