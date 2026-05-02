export default function Button({ children, variant = 'primary', loading = false, className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed select-none whitespace-nowrap';

  const variants = {
    primary:   'bg-[#C8472B] text-white hover:bg-[#b03d24] active:scale-[0.98] shadow-sm',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98]',
    danger:    'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 active:scale-[0.98]',
    ghost:     'bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100 active:scale-[0.98]',
    outline:   'bg-transparent text-[#C8472B] border border-[#C8472B] hover:bg-[#C8472B] hover:text-white active:scale-[0.98]',
  };

  return (
    <button
      className={`${base} ${variants[variant] ?? variants.primary} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <svg className="w-3.5 h-3.5 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
