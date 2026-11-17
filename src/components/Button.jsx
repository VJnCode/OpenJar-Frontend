const VARIANTS = {
  primary:   'bg-brand text-white hover:bg-brand-dark shadow-lg shadow-brand/25',
  secondary: 'bg-surface text-ink border-[1.5px] border-line hover:border-muted/40 shadow-sm',
  danger:    'bg-danger-soft text-danger border-[1.5px] border-danger/25 hover:border-danger/50',
  ghost:     'bg-transparent text-muted hover:text-ink hover:bg-field',
  outline:   'bg-transparent text-brand border-[1.5px] border-brand hover:bg-brand hover:text-white',
};

export default function Button({ children, variant = 'primary', loading = false, className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold ' +
    'transition-all duration-200 active:scale-[0.98] disabled:opacity-45 disabled:cursor-not-allowed select-none whitespace-nowrap';

  return (
    <button
      className={`${base} ${VARIANTS[variant] ?? VARIANTS.primary} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <span className="w-3.5 h-3.5 shrink-0 rounded-full border-2 border-current/30 border-t-current animate-spin" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}
