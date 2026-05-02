import { Link } from 'react-router-dom';

const IMGS = [
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
  'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&q=80',
  'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&q=80',
  'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80',
];

export default function RecipeCard({ recipe, index = 0 }) {
  const id    = recipe.recipeId;
  const title = recipe.recipeName;
  const image = recipe.recipeImageUrl || IMGS[index % IMGS.length];
  const cat   = recipe.category;
  const time  = recipe.prepTime;
  const likes = recipe.likeCount || 0;

  if (!id) return null;

  return (
    <Link to={`/recipe/${id}`} className="group block bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-gray-100">
        <img src={image} alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          onError={e => { e.target.src = IMGS[0]; }} />
        {/* Category pill */}
        {cat && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-gray-700 text-xs font-semibold rounded-full shadow-sm">
              {cat}
            </span>
          </div>
        )}
        {/* Time pill */}
        {time > 0 && (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 bg-[#C8472B] text-white text-xs font-bold rounded-lg flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {time}m
            </span>
          </div>
        )}
        {/* Bookmark icon */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-3 pb-1 px-1">
        <h3 className="font-display text-gray-900 text-base font-semibold leading-snug line-clamp-2 group-hover:text-[#C8472B] transition-colors duration-200 mb-2">
          {title || 'Untitled Recipe'}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-[10px] text-orange-600 font-bold">OJ</span>
            </div>
            <span className="text-gray-400 text-xs">Community</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-xs">{likes}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
