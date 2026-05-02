import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import SkeletonCard from '../components/SkeletonCard';
import { getRecipes } from '../services/recipeService';

const CATS = [
  { label: 'All',       emoji: '🍽️' },
  { label: 'Breakfast', emoji: '🥞' },
  { label: 'Lunch',     emoji: '🥗' },
  { label: 'Dinner',    emoji: '🍝' },
  { label: 'Dessert',   emoji: '🍰' },
  { label: 'Vegan',     emoji: '🥦' },
  { label: 'Snacks',    emoji: '🍿' },
  { label: 'Drinks',    emoji: '🥤' },
];

const HERO_SLIDES = [
  { img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=90', tag: 'Chef\'s Special', title: 'Discover Recipes\nYou\'ll Love', sub: 'Explore thousands of recipes from passionate home cooks around the world.' },
  { img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1400&q=90', tag: 'Trending Now',   title: 'Share Your\nCulinary Art',  sub: 'Join our community and inspire others with your unique recipes.' },
];

export default function HomePage() {
  const [recipes,  setRecipes]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [cat,      setCat]      = useState('All');
  const [slide,    setSlide]    = useState(0);

  useEffect(() => {
    getRecipes()
      .then(d => setRecipes(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const filtered = recipes.filter(r => {
    const ms = (r.recipeName || '').toLowerCase().includes(search.toLowerCase());
    const mc = cat === 'All' || (r.category || '').toLowerCase() === cat.toLowerCase();
    return ms && mc;
  });

  const hero     = HERO_SLIDES[slide];
  const featured = filtered[0];
  const grid     = filtered.slice(1);

  return (
    <div className="flex-1 bg-[#F8F7F4]">

      {/* ── HERO ── */}
      <section className="relative h-[580px] overflow-hidden">
        <img key={slide} src={hero.img} alt="hero"
          className="w-full h-full object-cover animate-fade-in"
          style={{ animationDuration: '0.8s' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-lg animate-fade-up">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C8472B] text-white text-xs font-bold rounded-xl mb-5 tracking-wider uppercase">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                {hero.tag}
              </span>
              <h1 className="font-display text-white text-5xl sm:text-6xl font-bold leading-[1.08] mb-5 whitespace-pre-line">
                {hero.title}
              </h1>
              <p className="text-white/70 text-base leading-relaxed mb-8 max-w-sm">{hero.sub}</p>
              <div className="flex gap-3 flex-wrap">
                <Link to="/create"
                  className="px-6 py-3 bg-[#C8472B] text-white font-semibold rounded-xl hover:bg-[#b03d24] transition-all duration-200 shadow-md text-sm">
                  Share a Recipe
                </Link>
                <a href="#recipes"
                  className="px-6 py-3 bg-white/15 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-white/25 transition-all duration-200 border border-white/30 text-sm">
                  Explore All
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className={`rounded-full transition-all duration-300 ${i === slide ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40'}`} />
          ))}
        </div>
      </section>

      {/* ── SEARCH + CATEGORY BAR ── */}
      <section className="bg-white border-b border-gray-100 sticky top-[68px] z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row gap-3 items-center">
          {/* Search */}
          <div className="relative w-full sm:w-72 flex-shrink-0">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input type="text" placeholder="Search recipes..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C8472B]/30 focus:border-[#C8472B] transition-all" />
          </div>
          {/* Category pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full scrollbar-hide pb-0.5">
            {CATS.map(c => (
              <button key={c.label} onClick={() => setCat(c.label)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                  cat === c.label
                    ? 'bg-[#C8472B] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                <span>{c.emoji}</span> {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div id="recipes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-28">
            <div className="text-7xl mb-4">🍽️</div>
            <h3 className="font-display text-2xl font-semibold text-gray-700 mb-2">No recipes found</h3>
            <p className="text-gray-400 text-sm mb-6">{search ? 'Try a different search.' : 'Be the first to share!'}</p>
            <Link to="/create" className="inline-block px-6 py-3 bg-[#C8472B] text-white font-semibold rounded-xl text-sm hover:bg-[#b03d24] transition-all">
              Create Recipe
            </Link>
          </div>
        ) : (
          <>
            {/* Featured split card */}
            {featured && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-display text-2xl font-bold text-gray-900">Featured Recipe</h2>
                  <Link to="/home" className="text-sm text-[#C8472B] font-semibold hover:underline">View All →</Link>
                </div>
                <Link to={`/recipe/${featured.recipeId}`}
                  className="group grid grid-cols-1 lg:grid-cols-5 rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
                  <div className="lg:col-span-3 relative overflow-hidden aspect-video lg:aspect-auto lg:min-h-[360px]">
                    <img
                      src={featured.recipeImageUrl || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=80'}
                      alt={featured.recipeName}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=80'; }}
                    />
                    {featured.category && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-white/95 text-gray-700 text-xs font-bold rounded-full shadow-sm">
                        {featured.category}
                      </span>
                    )}
                  </div>
                  <div className="lg:col-span-2 p-8 lg:p-10 flex flex-col justify-center">
                    <span className="text-[#C8472B] text-xs font-bold tracking-widest uppercase mb-3">⭐ Editor's Pick</span>
                    <h2 className="font-display text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-4 group-hover:text-[#C8472B] transition-colors duration-200">
                      {featured.recipeName}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                      {featured.prepTime > 0 && (
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {featured.prepTime} min
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {featured.likeCount || 0}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-[#C8472B] group-hover:gap-3 transition-all duration-200">
                      View Full Recipe
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </div>
            )}

            {/* Grid */}
            {grid.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-display text-2xl font-bold text-gray-900">
                    {cat === 'All' ? 'Latest Recipes' : `${cat} Recipes`}
                  </h2>
                  <span className="text-sm text-gray-400">{grid.length} recipes</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-up">
                  {grid.map((r, i) => <RecipeCard key={r.recipeId} recipe={r} index={i + 1} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-[#C8472B] flex items-center justify-center">
                  <span className="text-white font-bold text-sm">OJ</span>
                </div>
                <span className="font-display text-xl font-bold">OpenJar</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                A community platform for food lovers to discover, share, and celebrate amazing recipes.
              </p>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">Explore</p>
              <div className="flex flex-col gap-2">
                <Link to="/home"          className="text-gray-400 text-sm hover:text-white transition-colors">All Recipes</Link>
                <Link to="/categories"    className="text-gray-400 text-sm hover:text-white transition-colors">Categories</Link>
                <Link to="/create"        className="text-gray-400 text-sm hover:text-white transition-colors">Create Recipe</Link>
              </div>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">Account</p>
              <div className="flex flex-col gap-2">
                <Link to="/login"         className="text-gray-400 text-sm hover:text-white transition-colors">Sign In</Link>
                <Link to="/register"      className="text-gray-400 text-sm hover:text-white transition-colors">Register</Link>
                <Link to="/notifications" className="text-gray-400 text-sm hover:text-white transition-colors">Notifications</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-gray-500 text-sm">© 2025 OpenJar. Made with ❤️ for food lovers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
