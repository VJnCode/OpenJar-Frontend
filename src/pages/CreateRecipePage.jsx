import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createRecipe } from '../services/recipeService';
import Button from '../components/Button';
import InputField from '../components/InputField';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Vegan', 'Snacks', 'Drinks'];

export default function CreateRecipePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]           = useState({ recipeName: '', category: '', prepTime: '', recipeImageUrl: '' });
  const [ingredients, setIngredients] = useState(['', '', '']);
  const [steps, setSteps]         = useState(['', '']);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [step, setStep]           = useState(1); // multi-step: 1=basics, 2=ingredients, 3=instructions

  if (!user) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 bg-white">
      <p className="font-display text-2xl text-gray-900">Sign in to share a recipe</p>
      <Button onClick={() => navigate('/login')}>Sign In</Button>
    </div>
  );

  const updateList = (setter, idx, val) => setter(prev => prev.map((x, i) => i === idx ? val : x));
  const addItem    = (setter) => setter(prev => [...prev, '']);
  const removeItem = (setter, idx) => setter(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await createRecipe(user.userId, {
        recipeName:         form.recipeName,
        category:           form.category,
        prepTime:           parseInt(form.prepTime) || 0,
        recipeImageUrl:     form.recipeImageUrl,
        ingredients:        ingredients.filter(Boolean).join(', '),
        recipeInstructions: steps.filter(Boolean).join('\n'),
      });
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const STEPS = ['Basics', 'Ingredients', 'Instructions'];

  return (
    <div className="flex-1 bg-white min-h-screen">
      <div className="max-w-2xl mx-auto px-6 sm:px-8 py-14 animate-fade-up">

        {/* Top label */}
        <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-2">New Recipe</p>
        <h1 className="font-display text-4xl font-bold text-gray-900 mb-10">Share your dish</h1>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-12">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <button
                type="button"
                onClick={() => setStep(i + 1)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors duration-200 ${
                  step === i + 1 ? 'text-gray-900' : step > i + 1 ? 'text-gray-400' : 'text-gray-300'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                  step === i + 1 ? 'bg-[#C8472B] text-white' :
                  step > i + 1  ? 'bg-gray-200 text-gray-500' :
                                   'border border-gray-200 text-gray-300'
                }`}>
                  {step > i + 1 ? '✓' : i + 1}
                </span>
                {s}
              </button>
              {i < STEPS.length - 1 && (
                <div className={`w-12 h-px mx-3 transition-colors duration-200 ${step > i + 1 ? 'bg-gray-300' : 'bg-gray-100'}`} />
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
                required
              />

              {/* Category selector */}
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Category</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, category: c }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-150 ${
                        form.category === c
                          ? 'bg-[#C8472B] text-white border-[#C8472B]'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700'
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
                  placeholder="30"
                  value={form.prepTime}
                  onChange={e => setForm(f => ({ ...f, prepTime: e.target.value }))}
                />
                <InputField
                  label="Image URL"
                  type="url"
                  placeholder="https://..."
                  value={form.recipeImageUrl}
                  onChange={e => setForm(f => ({ ...f, recipeImageUrl: e.target.value }))}
                />
              </div>

              {/* Image preview */}
              {form.recipeImageUrl && (
                <div className="rounded-2xl overflow-hidden aspect-video bg-gray-50">
                  <img src={form.recipeImageUrl} alt="preview"
                    className="w-full h-full object-cover"
                    onError={e => { e.target.style.display = 'none'; }} />
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button type="button" onClick={() => setStep(2)} disabled={!form.recipeName}>
                  Continue →
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 2: INGREDIENTS ── */}
          {step === 2 && (
            <div className="flex flex-col gap-8 animate-fade-in">
              <div>
                <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-1">Ingredients</p>
                <p className="text-sm text-gray-400">List each ingredient on its own line.</p>
              </div>

              <div className="flex flex-col gap-0 divide-y divide-gray-100">
                {ingredients.map((ing, i) => (
                  <div key={i} className="flex items-center gap-4 py-1 group">
                    <span className="text-xs text-gray-300 w-5 text-right flex-shrink-0 font-mono">{i + 1}</span>
                    <input
                      value={ing}
                      onChange={e => updateList(setIngredients, i, e.target.value)}
                      placeholder={`e.g. 2 cups flour`}
                      className="flex-1 py-3 bg-transparent text-sm text-gray-900 placeholder-gray-300 focus:outline-none"
                    />
                    {ingredients.length > 1 && (
                      <button type="button" onClick={() => removeItem(setIngredients, i)}
                        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all text-lg leading-none">
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button type="button" onClick={() => addItem(setIngredients)}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors w-fit">
                <span className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-xs hover:border-gray-600 transition-colors">+</span>
                Add ingredient
              </button>

              <div className="flex justify-between pt-4 border-t border-gray-100">
                <Button type="button" variant="ghost" onClick={() => setStep(1)}>← Back</Button>
                <Button type="button" onClick={() => setStep(3)}>Continue →</Button>
              </div>
            </div>
          )}

          {/* ── STEP 3: INSTRUCTIONS ── */}
          {step === 3 && (
            <div className="flex flex-col gap-8 animate-fade-in">
              <div>
                <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-1">Instructions</p>
                <p className="text-sm text-gray-400">Walk through each step clearly.</p>
              </div>

              <div className="flex flex-col gap-6">
                {steps.map((s, i) => (
                  <div key={i} className="flex gap-5 group">
                    <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-3">
                      <span className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      {i < steps.length - 1 && <div className="w-px flex-1 bg-gray-100 min-h-[20px]" />}
                    </div>
                    <div className="flex-1 pb-2">
                      <textarea
                        value={s}
                        onChange={e => updateList(setSteps, i, e.target.value)}
                        placeholder={`Describe step ${i + 1}...`}
                        rows={2}
                        className="w-full py-2.5 bg-transparent border-b border-gray-100 focus:border-gray-400 text-sm text-gray-900 placeholder-gray-300 focus:outline-none transition-colors duration-200 resize-none"
                      />
                    </div>
                    {steps.length > 1 && (
                      <button type="button" onClick={() => removeItem(setSteps, i)}
                        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all text-lg leading-none pt-3">
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button type="button" onClick={() => addItem(setSteps)}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors w-fit">
                <span className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-xs hover:border-gray-600 transition-colors">+</span>
                Add step
              </button>

              {error && (
                <p className="text-sm text-red-500 border-l-2 border-red-300 pl-3">{error}</p>
              )}

              <div className="flex justify-between pt-4 border-t border-gray-100">
                <Button type="button" variant="ghost" onClick={() => setStep(2)}>← Back</Button>
                <Button type="submit" loading={loading}>
                  Publish Recipe
                </Button>
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
