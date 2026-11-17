import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRecipes } from '../services/recipeService';
import usePageTitle from '../hooks/usePageTitle';

const CAT_META = {
  Breakfast: { emoji: '🥞', img: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&q=80', color: 'from-amber-400 to-orange-400' },
  Lunch:     { emoji: '🥗', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', color: 'from-green-400 to-emerald-500' },
  Dinner:    { emoji: '🍝', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80', color: 'from-red-400 to-rose-500' },
  Dessert:   { emoji: '🍰', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', color: 'from-pink-400 to-fuchsia-400' },
  Vegan:     { emoji: '🥦', img: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80', color: 'from-lime-400 to-green-500' },
  Snacks:    { emoji: '🍿', img: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&q=80', color: 'from-yellow-400 to-amber-500' },
  Drinks:    { emoji: '🥤', img: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80', color: 'from-blue-400 to-cyan-500' },
  Other:     { emoji: '🍽️', img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80', color: 'from-gray-400 to-slate-500' },
};

export default function CategoriesPage() {
  usePageTitle('Categories');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecipes()
      .then(d => setRecipes(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const catMap = recipes.reduce((acc, r) => {
    const key = r.category || 'Other';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const categories = Object.entries(catMap).map(([name, count]) => ({
    name, count, ...(CAT_META[name] || CAT_META.Other),
  }));

  if (!categories.length && !loading) {
    Object.keys(CAT_META).forEach(name => categories.push({ name, count: 0, ...CAT_META[name] }));
  }

  return (
    <div className="flex-1 bg-canvas">
      {/* Header */}
      <div className="bg-surface border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <span className="text-brand text-xs font-bold tracking-widest uppercase">Browse</span>
          <h1 className="font-display text-4xl font-bold text-ink mt-1 mb-2">Categories</h1>
          <p className="text-muted">Explore recipes by cuisine type and meal category.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton rounded-2xl aspect-square" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 animate-fade-up">
            {categories.map(c => (
              <Link key={c.name} to={`/home?cat=${c.name}`}
                className="group relative overflow-hidden rounded-2xl aspect-square bg-field hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <img src={c.img} alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={e => { e.target.style.display = 'none'; }} />
                <div className={`absolute inset-0 bg-gradient-to-t ${c.color} opacity-60 group-hover:opacity-70 transition-opacity duration-300`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <span className="text-4xl mb-2">{c.emoji}</span>
                  <span className="font-display text-lg font-bold">{c.name}</span>
                  <span className="text-white/80 text-xs mt-1">{c.count} recipes</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
