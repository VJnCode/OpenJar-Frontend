export default function InputField({ label, error, className = '', textarea = false, rows = 3, ...props }) {
  const inputCls = `w-full px-0 py-3 bg-transparent border-0 border-b border-gray-200 text-gray-900 text-sm placeholder-gray-300
    focus:outline-none focus:border-gray-900 transition-colors duration-200
    ${error ? 'border-red-400 focus:border-red-500' : ''} ${className}`;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-semibold text-gray-400 tracking-widest uppercase">{label}</label>
      )}
      {textarea
        ? <textarea className={`${inputCls} resize-none`} rows={rows} {...props} />
        : <input className={inputCls} {...props} />
      }
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}
