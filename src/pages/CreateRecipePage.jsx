import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createRecipe, getRecipe, updateRecipe, splitIngredients, splitSteps } from '../services/recipeService';
import Button from '../components/Button';
import InputField from '../components/InputField';
import Spinner from '../components/Spinner';
import RecipePreview from '../components/RecipePreview';
import { useToast } from '../context/ToastContext';
import usePageTitle from '../hooks/usePageTitle';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Vegan', 'Snacks', 'Drinks'];
const HTTP_URL = /^https?:\/\/[^\s"'<>]+$/i;

/** Mirrors the server-side rules so users get instant feedback. */
function validateBasics(form) {
  const name = form.recipeName.trim();
  if (name.length < 2 || name.length > 100) return 'Recipe name must be 2–100 characters.';
  if (!form.category) return 'Pick a category.';
  const prep = Number(form.prepTime || 0);
  if (!Number.isInteger(prep) || prep < 0 || prep > 1440) return 'Prep time must be between 0 and 1440 minutes.';
  if (form.recipeImageUrl && !HTTP_URL.test(form.recipeImageUrl.trim())) return 'Image URL must start with http:// or https://';
  return '';
}

export default function CreateRecipePage() {
  const { id } = useParams();          // present => edit mode
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const toast = useToast();
  usePageTitle(isEdit ? 'Edit recipe' : 'Share a recipe');
  const navigate = useNavigate();

  const [form, setForm]           = useState({ recipeName: '', category: '', prepTime: '', recipeImageUrl: '' });
  const [ingredients, setIngredients] = useState(['', '', '']);
  const [steps, setSteps]         = useState(['', '']);
  const [loading, setLoading]     = useState(false);
  const [loadingRecipe, setLoadingRecipe] = useState(isEdit);
  const [error, setError]         = useState('');
  const [step, setStep]           = useState(1); // multi-step: 1=basics, 2=ingredients, 3=instructions

  useEffect(() => {
    if (!isEdit) return;
    getRecipe(id)
      .then(r => {
        if (String(r.userId) !== String(user?.userId)) {
          navigate(`/recipe/${id}`, { replace: true });
          return;
        }
        setForm({
          recipeName: r.recipeName || '',
          category: r.category || '',
          prepTime: r.prepTime ? String(r.prepTime) : '',
          recipeImageUrl: r.recipeImageUrl || '',
        });
        const ings = splitIngredients(r.ingredients || '');
        const sts  = splitSteps(r.recipeInstructions || '');
        setIngredients(ings.length ? ings : ['']);
        setSteps(sts.length ? sts : ['']);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoadingRecipe(false));
  }, [id, isEdit, user?.userId, navigate]);

  const updateList = (setter, idx, val) => setter(prev => prev.map((x, i) => i === idx ? val : x));
  const addItem    = (setter) => setter(prev => [...prev, '']);
  const removeItem = (setter, idx) => setter(prev => prev.filter((_, i) => i !== idx));

  const goTo = (target) => {
    if (target > 1) {
      const basicsError = validateBasics(form);
      if (basicsError) { setError(basicsError); setStep(1); return; }
    }
    if (target > 2 && !ingredients.some(s => s.trim())) {
      setError('Add at least one ingredient.'); setStep(2); return;
    }
    setError('');
    setStep(target);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const basicsError = validateBasics(form);
    const cleanIngredients = ingredients.map(s => s.trim()).filter(Boolean);
    const cleanSteps = steps.map(s => s.trim()).filter(Boolean);
    if (basicsError) { setError(basicsError); setStep(1); return; }
    if (!cleanIngredients.length) { setError('Add at least one ingredient.'); setStep(2); return; }
    if (!cleanSteps.length) { setError('Add at least one instruction.'); return; }

    setError(''); setLoading(true);
    const payload = {
      recipeName:         form.recipeName.trim(),
      category:           form.category,
      prepTime:           parseInt(form.prepTime, 10) || 0,
      recipeImageUrl:     form.recipeImageUrl.trim(),
      ingredients:        cleanIngredients.join('\n'),   // one per line, so commas inside an ingredient survive
      recipeInstructions: cleanSteps.join('\n'),
    };
    try {
      const saved = isEdit ? await updateRecipe(id, payload) : await createRecipe(payload);
      toast.success(isEdit ? 'Recipe updated' : 'Your recipe is live! 🎉');
      navigate(`/recipe/${saved?.recipeId ?? id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const STEPS = ['Basics', 'Ingredients', 'Instructions'];

  if (loadingRecipe) return <Spinner />;

  return (
    <div className="flex-1 bg-canvas min-h-screen">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-14 grid lg:grid-cols-[minmax(0,1fr)_340px] gap-12 items-start">
      <div className="max-w-2xl w-full animate-fade-up">

        {/* Top label */}
        <p className="text-xs font-semibold text-muted tracking-widest uppercase mb-2">{isEdit ? 'Edit Recipe' : 'New Recipe'}</p>
        <h1 className="font-display text-4xl font-bold text-ink mb-10">{isEdit ? 'Update your dish' : 'Share your dish'}</h1>

        {error && step !== 3 && (
          <p role="alert" className="text-sm text-danger border-l-2 border-danger/40 pl-3 mb-8">{error}</p>
        )}

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-12">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <button
                type="button"
                onClick={() => goTo(i + 1)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors duration-200 ${
                  step === i + 1 ? 'text-ink' : step > i + 1 ? 'text-muted' : 'text-muted/70'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                  step === i + 1 ? 'bg-brand text-white' :
                  step > i + 1  ? 'bg-line text-muted' :
                                   'border border-line text-muted/70'
                }`}>
                  {step > i + 1 ? '✓' : i + 1}
                </span>
                {s}
              </button>
              {i < STEPS.length - 1 && (
                <div className={`w-12 h-px mx-3 transition-colors duration-200 ${step > i + 1 ? 'bg-brand/50' : 'bg-line'}`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>

          {/* ── STEP 1: BASICS ── */}
          {step === 1 && (
            <div className="flex flex-col gap-10 animate-fade-in">
              <InputField
                label="Recipe Name"
                placeholder="e.g. Creamy Tuscan Pasta"
                value={form.recipeName}
                onChange={e => setForm(f => ({ ...f, recipeName: e.target.value }))}
                maxLength={100}
                required
              />

              {/* Category selector */}
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-muted tracking-widest uppercase">Category</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, category: c }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-150 ${
                        form.category === c
                          ? 'bg-brand text-white border-brand'
                          : 'bg-surface text-muted border-line hover:border-muted/50 hover:text-ink'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-10">
                <InputField
                  label="Prep Time (min)"
                  type="number"
                  min={0}
                  max={1440}
                  placeholder="30"
                  value={form.prepTime}
                  onChange={e => setForm(f => ({ ...f, prepTime: e.target.value }))}
                />
                <InputField
                  label="Image URL"
                  type="url"
                  placeholder="https://..."
                  maxLength={1000}
                  value={form.recipeImageUrl}
                  onChange={e => setForm(f => ({ ...f, recipeImageUrl: e.target.value }))}
                />
              </div>

              {/* Image preview */}
              {form.recipeImageUrl && (
                <div className="rounded-2xl overflow-hidden aspect-video bg-field">
                  <img src={form.recipeImageUrl} alt="preview" referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={e => { e.currentTarget.style.display = 'none'; }} />
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button type="button" onClick={() => goTo(2)} disabled={!form.recipeName.trim()}>
                  Continue →
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 2: INGREDIENTS ── */}
          {step === 2 && (
            <div className="flex flex-col gap-8 animate-fade-in">
              <div>
                <p className="text-xs font-semibold text-muted tracking-widest uppercase mb-1">Ingredients</p>
                <p className="text-sm text-muted">One ingredient per row.</p>
              </div>

              <div className="flex flex-col gap-0 divide-y divide-line">
                {ingredients.map((ing, i) => (
                  <div key={i} className="flex items-center gap-4 py-1 group">
                    <span className="text-xs text-muted/70 w-5 text-right flex-shrink-0 font-mono">{i + 1}</span>
                    <input
                      value={ing}
                      onChange={e => updateList(setIngredients, i, e.target.value)}
                      placeholder={`e.g. 2 cups flour`}
                      className="flex-1 py-3 bg-transparent text-sm text-ink placeholder:text-muted/60 focus:outline-none"
                    />
                    {ingredients.length > 1 && (
                      <button type="button" onClick={() => removeItem(setIngredients, i)}
                        className="opacity-0 group-hover:opacity-100 text-muted/70 hover:text-danger transition-all text-lg leading-none">
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button type="button" onClick={() => addItem(setIngredients)}
                className="flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors w-fit">
                <span className="w-5 h-5 rounded-full border border-line flex items-center justify-center text-xs hover:border-brand transition-colors">+</span>
                Add ingredient
              </button>

              <div className="flex justify-between pt-4 border-t border-line">
                <Button type="button" variant="ghost" onClick={() => setStep(1)}>← Back</Button>
                <Button type="button" onClick={() => goTo(3)}>Continue →</Button>
              </div>
            </div>
          )}

          {/* ── STEP 3: INSTRUCTIONS ── */}
          {step === 3 && (
            <div className="flex flex-col gap-8 animate-fade-in">
              <div>
                <p className="text-xs font-semibold text-muted tracking-widest uppercase mb-1">Instructions</p>
                <p className="text-sm text-muted">Walk through each step clearly.</p>
              </div>

              <div className="flex flex-col gap-6">
                {steps.map((s, i) => (
                  <div key={i} className="flex gap-5 group">
                    <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-3">
                      <span className="w-7 h-7 rounded-full bg-field text-muted text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      {i < steps.length - 1 && <div className="w-px flex-1 bg-field min-h-[20px]" />}
                    </div>
                    <div className="flex-1 pb-2">
                      <textarea
                        value={s}
                        onChange={e => updateList(setSteps, i, e.target.value)}
                        placeholder={`Describe step ${i + 1}...`}
                        rows={2}
                        className="w-full py-2.5 bg-transparent border-b border-line focus:border-brand text-sm text-ink placeholder:text-muted/60 focus:outline-none transition-colors duration-200 resize-none"
                      />
                    </div>
                    {steps.length > 1 && (
                      <button type="button" onClick={() => removeItem(setSteps, i)}
                        className="opacity-0 group-hover:opacity-100 text-muted/70 hover:text-danger transition-all text-lg leading-none pt-3">
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button type="button" onClick={() => addItem(setSteps)}
                className="flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors w-fit">
                <span className="w-5 h-5 rounded-full border border-line flex items-center justify-center text-xs hover:border-brand transition-colors">+</span>
                Add step
              </button>

              {error && (
                <p className="text-sm text-danger border-l-2 border-danger/40 pl-3">{error}</p>
              )}

              <div className="flex justify-between pt-4 border-t border-line">
                <Button type="button" variant="ghost" onClick={() => setStep(2)}>← Back</Button>
                <Button type="submit" loading={loading}>
                  {isEdit ? 'Save Changes' : 'Publish Recipe'}
                </Button>
              </div>
            </div>
          )}

        </form>
      </div>

      {/* Live preview (desktop): exactly how the card will look on the home page */}
      <aside className="hidden lg:block sticky top-28 animate-fade-in" aria-label="Preview">
        <RecipePreview
          form={form}
          ingredients={ingredients}
          steps={steps}
          user={user}
        />
      </aside>
      </div>
    </div>
  );
}
