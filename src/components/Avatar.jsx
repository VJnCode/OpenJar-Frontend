// Deterministic warm colour per user so the same chef always looks the same.
const PALETTE = ['#C8472B', '#d97706', '#65a30d', '#0d9488', '#7c3aed', '#db2777', '#2563eb', '#ea580c'];

function colourFor(seed = '') {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

const SIZES = { xs: 'w-6 h-6 text-[10px]', sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-xl' };

export default function Avatar({ name, seed, size = 'sm', className = '' }) {
  const initial = (name || '?').trim()[0]?.toUpperCase() || '?';
  return (
    <span
      aria-hidden="true"
      className={`${SIZES[size]} rounded-full inline-flex items-center justify-center font-bold text-white flex-shrink-0 ${className}`}
      style={{ backgroundColor: name ? colourFor(seed || name) : 'var(--oj-line)' }}
    >
      {name ? initial : ''}
    </span>
  );
}
