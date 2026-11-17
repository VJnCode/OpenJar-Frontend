import { useId } from 'react';

/** Field styled like the sign-in page: label above, soft filled box, brand focus ring. */
export default function InputField({ label, error, hint, icon, className = '', textarea = false, rows = 3, id, ...props }) {
  const autoId = useId();
  const fieldId = id || autoId;
  const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined;

  const inputCls = `w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 py-3 rounded-xl border-[1.5px] bg-field text-ink text-[15px]
    placeholder:text-muted/60 outline-none transition-all duration-200
    focus:bg-surface focus:border-brand focus:ring-4 focus:ring-brand/15
    ${error ? 'border-danger/60' : 'border-line'} ${className}`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={fieldId} className="text-[13px] font-semibold text-ink">{label}</label>}
      <div className="relative group">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand transition-colors pointer-events-none">
            {icon}
          </span>
        )}
        {textarea
          ? <textarea id={fieldId} className={`${inputCls} resize-none`} rows={rows} aria-invalid={!!error} aria-describedby={describedBy} {...props} />
          : <input id={fieldId} className={inputCls} aria-invalid={!!error} aria-describedby={describedBy} {...props} />}
      </div>
      {error && <p id={`${fieldId}-error`} className="text-xs text-danger">{error}</p>}
      {!error && hint && <p id={`${fieldId}-hint`} className="text-xs text-muted">{hint}</p>}
    </div>
  );
}
