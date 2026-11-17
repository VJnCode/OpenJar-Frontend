import Avatar from './Avatar';

const HTTP_URL = /^https?:\/\/[^\s"'<>]+$/i;
const FALLBACK = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=70';

/** Live card preview for the create/edit page, plus a small "readiness" checklist. */
export default function RecipePreview({ form, ingredients, steps, user }) {
  const name = form.recipeName.trim();
  const image = HTTP_URL.test(form.recipeImageUrl.trim()) ? form.recipeImageUrl.trim() : FALLBACK;
  const prep = parseInt(form.prepTime, 10) || 0;
  const ingCount = ingredients.filter(s => s.trim()).length;
  const stepCount = steps.filter(s => s.trim()).length;

  const checks = [
    { ok: name.length >= 2, label: 'A tasty name' },
    { ok: Boolean(form.category), label: 'A category' },
    { ok: ingCount > 0, label: `Ingredients (${ingCount})` },
    { ok: stepCount > 0, label: `Steps (${stepCount})` },
    { ok: HTTP_URL.test(form.recipeImageUrl.trim()), label: 'A photo (optional)', optional: true },
  ];
  const required = checks.filter(c => !c.optional);
  const ready = required.filter(c => c.ok).length;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-xs font-bold text-brand tracking-[0.14em] uppercase">Live preview</p>

      <div className="bg-surface rounded-3xl border border-line p-2.5 shadow-card">
        <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-field">
          <img src={image} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover"
            onError={e => { e.currentTarget.src = FALLBACK; }} />
          {form.category && (
            <span className="absolute top-3 left-3 px-3 py-1 bg-white/95 text-stone-800 text-xs font-semibold rounded-full shadow-sm">
              {form.category}
            </span>
          )}
          {prep > 0 && (
            <span className="absolute top-3 right-3 px-2.5 py-1 bg-brand text-white text-xs font-bold rounded-lg">{prep}m</span>
          )}
        </div>
        <div className="pt-3.5 pb-1.5 px-2">
          <h3 className={`font-display text-base font-semibold leading-snug line-clamp-2 mb-2 ${name ? 'text-ink' : 'text-muted/60 italic'}`}>
            {name || 'Your recipe name'}
          </h3>
          <div className="flex items-center gap-2">
            <Avatar name={user?.userName} seed={user?.userId} size="xs" />
            <span className="text-muted text-xs truncate">{user?.userName}</span>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-line p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-ink">Ready to publish</p>
          <span className="text-xs font-semibold text-muted tabular-nums">{ready}/{required.length}</span>
        </div>
        <div className="h-1.5 rounded-full bg-line overflow-hidden mb-3">
          <div className="h-full bg-brand rounded-full transition-all duration-500" style={{ width: `${(ready / required.length) * 100}%` }} />
        </div>
        <ul className="flex flex-col gap-1.5">
          {checks.map(c => (
            <li key={c.label} className={`flex items-center gap-2 text-sm ${c.ok ? 'text-ink' : 'text-muted'}`}>
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${c.ok ? 'bg-success text-white dark:text-[#141110]' : 'border border-line'}`}>
                {c.ok ? '✓' : ''}
              </span>
              {c.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
