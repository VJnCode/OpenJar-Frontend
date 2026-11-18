import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import usePublicUser from '../hooks/usePublicUser';

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
  const chef  = usePublicUser(recipe.userId);

  if (!id) return null;

  return (
    <Link to={`/recipes/${id}`}
      className="group block bg-surface rounded-3xl border border-line p-2.5 shadow-sm hover:shadow-card hover:border-brand/30 transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-field">
        <img src={image} alt={title} loading="lazy" referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          onError={e => { e.currentTarget.src = IMGS[0]; }} />
        {/* Category pill */}
        {cat && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-stone-800 text-xs font-semibold rounded-full shadow-sm">
              {cat}
            </span>
          </div>
        )}
        {/* Time pill */}
        {time > 0 && (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 bg-brand text-white text-xs font-bold rounded-lg flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {time}m
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="pt-3.5 pb-1.5 px-2">
        <h3 className="font-display text-ink text-base font-semibold leading-snug line-clamp-2 group-hover:text-brand transition-colors duration-200 mb-2">
          {title || 'Untitled Recipe'}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar name={chef === undefined ? null : (chef?.userName || 'OpenJar cook')} seed={recipe.userId} size="xs" />
            {chef === undefined
              ? <span className="h-3 w-16 rounded skeleton" aria-hidden="true" />
              : <span className="text-muted text-xs truncate">{chef?.userName || 'OpenJar cook'}</span>}
          </div>
          <div className="flex items-center gap-1 text-muted">
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
