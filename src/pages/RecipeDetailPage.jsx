import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipe, deleteRecipe } from '../services/recipeService';
import { getComments, addComment } from '../services/socialService';
import { useAuth } from '../context/AuthContext';
import CommentCard from '../components/CommentCard';
import Button from '../components/Button';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=90';

export default function RecipeDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recipe,      setRecipe]      = useState(null);
  const [comments,    setComments]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [commentText, setCommentText] = useState('');
  const [posting,     setPosting]     = useState(false);
  const [deleting,    setDeleting]    = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    Promise.all([getRecipe(id), getComments(id)])
      .then(([r, c]) => { setRecipe(r); setComments(Array.isArray(c) ? c : []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setPosting(true);
    try {
      const nc = await addComment({ recipeId: id, content: commentText, userId: user?.userId });
      setComments(prev => [...prev, nc]);
      setCommentText('');
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch { }
    finally { setPosting(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this recipe?')) return;
    setDeleting(true);
    try { await deleteRecipe(id); navigate('/home'); }
    catch { setDeleting(false); }
  };

  if (loading) return (
    <div className="flex-1 flex items-center justify-center bg-[#fafaf8]">
      <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!recipe) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-[#fafaf8]">
      <div className="text-6xl">🍽️</div>
      <p className="font-serif text-2xl text-zinc-600">Recipe not found</p>
      <Button onClick={() => navigate('/home')} variant="secondary">Back to Explore</Button>
    </div>
  );

  const title        = recipe.recipeName;
  const image        = recipe.recipeImageUrl || PLACEHOLDER;
  const instructions = recipe.recipeInstructions || '';
  const ingredients  = recipe.ingredients || '';
  const category     = recipe.category;
  const prepTime     = recipe.prepTime;
  const isOwner      = user && String(user.userId) === String(recipe.userId);

  const ingredientList = ingredients.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
  const stepList       = instructions.split(/\n+/).map(s => s.replace(/^\d+[\.\)]\s*/, '').trim()).filter(Boolean);

  return (
    <div className="flex-1 bg-[#fafaf8] animate-fade-in">

      {/* Full-bleed hero */}
      <div className="relative w-full h-[55vh] min-h-[400px] overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover"
          onError={e => { e.target.src = PLACEHOLDER; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              {category && <span className="px-3 py-1 bg-amber-400 text-zinc-900 text-xs font-bold rounded-full tracking-wide uppercase">{category}</span>}
              {prepTime > 0 && <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">⏱ {prepTime} min</span>}
            </div>
            <h1 className="font-serif text-white text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">{title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10">

        {/* Owner actions */}
        {isOwner && (
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => navigate(`/recipe/${id}/edit`)}>Edit Recipe</Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
          </div>
        )}

        {/* Ingredients */}
        {ingredientList.length > 0 && (
          <section>
            <h2 className="font-serif text-2xl font-bold text-zinc-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-sm">🥕</span>
              Ingredients
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ingredientList.map((ing, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-zinc-100 shadow-sm hover:border-amber-200 hover:shadow-md transition-all duration-200">
                  <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                  <span className="text-zinc-700 text-sm font-medium">{ing}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Steps */}
        {stepList.length > 0 && (
          <section>
            <h2 className="font-serif text-2xl font-bold text-zinc-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-sm text-white">📋</span>
              Instructions
            </h2>
            <div className="flex flex-col gap-4">
              {stepList.map((step, i) => (
                <div key={i} className="flex gap-5 p-5 bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="w-10 h-10 rounded-full bg-amber-400 text-zinc-900 font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-sm">
                    {i + 1}
                  </div>
                  <p className="text-zinc-700 text-sm leading-relaxed pt-2.5">{step}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Comments */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-zinc-900 mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-sm">💬</span>
            Comments
            <span className="text-base font-normal text-zinc-400 font-sans">({comments.length})</span>
          </h2>

          <div className="flex flex-col gap-4 mb-6">
            {comments.length === 0
              ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-zinc-100">
                  <div className="text-4xl mb-2">💬</div>
                  <p className="text-zinc-400 text-sm">No comments yet. Start the conversation!</p>
                </div>
              )
              : comments.map((c, i) => <CommentCard key={c.id || i} comment={c} />)}
            <div ref={bottomRef} />
          </div>

          {user ? (
            <form onSubmit={handleComment} className="flex gap-3 items-center bg-white rounded-2xl border border-zinc-200 p-3 shadow-sm focus-within:border-amber-400 focus-within:shadow-md transition-all duration-200">
              <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
                <span className="text-zinc-900 font-bold text-sm">{(user.userName || 'U')[0].toUpperCase()}</span>
              </div>
              <input value={commentText} onChange={e => setCommentText(e.target.value)}
                placeholder="Share your thoughts..."
                className="flex-1 text-sm text-zinc-900 placeholder-zinc-400 bg-transparent focus:outline-none" />
              <button type="submit" disabled={posting || !commentText.trim()}
                className="px-4 py-2 bg-amber-400 text-zinc-900 text-sm font-semibold rounded-xl hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1.5">
                {posting ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
                Post
              </button>
            </form>
          ) : (
            <div className="text-center py-6 bg-white rounded-2xl border border-zinc-100">
              <p className="text-sm text-zinc-500">
                <button onClick={() => navigate('/login')} className="text-amber-600 font-semibold hover:underline">Sign in</button> to leave a comment.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
