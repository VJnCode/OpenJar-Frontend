import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const ToastContext = createContext(null);

const STYLES = {
  success: { icon: '✓', ring: 'bg-success-soft text-success' },
  error:   { icon: '!', ring: 'bg-danger-soft text-danger' },
  info:    { icon: 'i', ring: 'bg-brand-soft text-brand' },
};

/** Small, accessible toast notifications (bottom-right on desktop, bottom on phones). */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id) => setToasts(list => list.filter(t => t.id !== id)), []);

  const show = useCallback((message, type = 'success', ms = 3200) => {
    const id = nextId.current++;
    setToasts(list => [...list.slice(-3), { id, message, type }]);   // keep at most 4 on screen
    setTimeout(() => dismiss(id), ms);
  }, [dismiss]);

  const api = useMemo(() => ({
    success: (m) => show(m, 'success'),
    error:   (m) => show(m, 'error', 5000),
    info:    (m) => show(m, 'info'),
  }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div aria-live="polite" aria-atomic="false"
        className="fixed z-[100] bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:bottom-6 flex flex-col gap-2.5 sm:w-[360px] pointer-events-none">
        {toasts.map(t => {
          const s = STYLES[t.type] || STYLES.info;
          return (
            <div key={t.id} role={t.type === 'error' ? 'alert' : 'status'}
              className="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-2xl bg-surface border border-line shadow-card animate-slide-down">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${s.ring}`}>{s.icon}</span>
              <p className="flex-1 text-sm text-ink leading-snug pt-0.5">{t.message}</p>
              <button onClick={() => dismiss(t.id)} aria-label="Dismiss notification"
                className="text-muted hover:text-ink text-lg leading-none -mt-0.5">×</button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext);
