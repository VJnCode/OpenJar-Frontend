import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getRecipe, deleteRecipe, splitIngredients, splitSteps } from '../services/recipeService';
import { getComments, addComment, replyComment, deleteComment, getLikes, toggleLike } from '../services/socialService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import usePublicUser from '../hooks/usePublicUser';
import usePageTitle from '../hooks/usePageTitle';
import CommentCard from '../components/CommentCard';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import Spinner from '../components/Spinner';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=90';

function countComments(list) {
  return list.reduce((n, c) => n + (c.deleted ? 0 : 1) + countComments(c.replies || []), 0);
}

/** A set of checked indexes, toggled by tapping (for following along while cooking). */
function useChecklist(resetKey) {
  const [state, setState] = useState({ key: resetKey, done: new Set() });
  const done = state.key === resetKey ? state.done : new Set();
  const toggle = (i) => setState(() => {
    const next = new Set(done);
    if (next.has(i)) next.delete(i); else next.add(i);
    return { key: resetKey, done: next };
  });
  const reset = () => setState({ key: resetKey, done: new Set() });
  return { done, toggle, reset };
}

function Stat({ icon, value, label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-0.5 px-2 py-3">
      <span className="text-lg" aria-hidden="true">{icon}</span>
      <span className="text-xl font-bold text-ink leading-none mt-1 tabular-nums">{value}</span>
      <span className="text-[11px] uppercase tracking-wider text-muted font-semibold">{label}</span>
    </div>
  );
}

function Progress({ done, total }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 min-w-[140px]">
      <div className="flex-1 h-1.5 rounded-full bg-line overflow-hidden" role="progressbar"
        aria-valuenow={done} aria-valuemin={0} aria-valuemax={total}>
        <div className="h-full bg-brand rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-muted tabular-nums">{done}/{total}</span>
    </div>
  );
}

function CheckCircle({ checked }) {
  return (
    <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
      checked ? 'bg-brand border-brand text-white scale-105' : 'border-line text-transparent group-hover:border-brand/50'}`}>
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

export default function RecipeDetailPage() {
  const { id } = useParams();
  const { user, login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [recipe,      setRecipe]      = useState(null);
  const [notFound,    setNotFound]    = useState(false);
  const [loadError,   setLoadError]   = useState('');
  const [comments,    setComments]    = useState([]);
  const [likes,       setLikes]       = useState({ totalLikes: 0, liked: false });
  const [loading,     setLoading]     = useState(true);
  const [commentText, setCommentText] = useState('');
  const [posting,     setPosting]     = useState(false);
  const [liking,      setLiking]      = useState(false);
  const [deleting,    setDeleting]    = useState(false);
  const bottomRef = useRef(null);

  const chef        = usePublicUser(recipe?.userId);
  const ingredients = useChecklist(`ing-${id}`);
  const steps       = useChecklist(`step-${id}`);
  usePageTitle(recipe?.recipeName);

  const reloadComments = useCallback(() => getComments(id).then(setComments), [id]);

  useEffect(() => {
    let alive = true;
    setLoading(true); setNotFound(false); setLoadError('');
    getRecipe(id)
      .then(r => { if (alive) setRecipe(r); })
      .catch(err => { if (!alive) return; err.status === 404 ? setNotFound(true) : setLoadError(err.message); })
      .finally(() => alive && setLoading(false));
    // Social data is secondary: failures here shouldn't hide the recipe.
    getComments(id).then(c => alive && setComments(c)).catch(() => {});
    getLikes(id).then(l => alive && setLikes(l)).catch(() => {});
    return () => { alive = false; };
  }, [id, user?.userId]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setPosting(true);
    try {
      await addComment(id, commentText.trim());
      setCommentText('');
      await reloadComments();
      toast.success('Comment posted');
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPosting(false);
    }
  };

  const handleReply = async (parentId, text) => {
    await replyComment(id, parentId, text);
    await reloadComments();
    toast.success('Reply posted');
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId);
    await reloadComments();
    toast.info('Comment deleted');
  };

  const handleLike = async () => {
    if (!user) { login(); return; }
    setLiking(true);
    // Optimistic update, rolled back on failure.
    const prev = likes;
    setLikes({ liked: !prev.liked, totalLikes: prev.totalLikes + (prev.liked ? -1 : 1) });
    try {
      const next = await toggleLike(id);
      setLikes(next);
      if (next.liked) toast.success('Added to your liked recipes');
    } catch (err) {
      setLikes(prev);
      toast.error(err.message);
    } finally {
      setLiking(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: recipe.recipeName, text: `${recipe.recipeName} on OpenJar`, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard');
      }
    } catch (err) {
      if (err?.name !== 'AbortError') toast.error('Could not share this recipe');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this recipe? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await deleteRecipe(id);
      toast.info('Recipe deleted');
      navigate('/home');
    } catch (err) {
      toast.error(err.message);
      setDeleting(false);
    }
  };

  if (loading) return <Spinner />;

  if (notFound || loadError || !recipe) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-canvas py-24 px-6 text-center">
      <div className="text-6xl">🍽️</div>
      <p className="font-display text-2xl text-ink/75">{notFound ? 'Recipe not found' : 'Could not load this recipe'}</p>
      {loadError && <p className="text-sm text-muted">{loadError}</p>}
      <Button onClick={() => navigate('/home')} variant="secondary">Back to Explore</Button>
    </div>
  );

  const title          = recipe.recipeName;
  const image          = recipe.recipeImageUrl || PLACEHOLDER;
  const category       = recipe.category;
  const prepTime       = recipe.prepTime;
  const isOwner        = user && String(user.userId) === String(recipe.userId);
  const ingredientList = splitIngredients(recipe.ingredients || '');
  const stepList       = splitSteps(recipe.recipeInstructions || '');
  const commentCount   = countComments(comments);
  const chefName       = chef === undefined ? null : (chef?.userName || 'OpenJar cook');
  const allStepsDone   = stepList.length > 0 && steps.done.size === stepList.length;

  return (
    <div className="flex-1 bg-canvas animate-fade-in">

      {/* Full-bleed hero */}
      <div className="relative w-full h-[58vh] min-h-[420px] overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover animate-kenburns"
          referrerPolicy="no-referrer"
          onError={e => { e.currentTarget.src = PLACEHOLDER; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-12 pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2.5 mb-4 flex-wrap">
              {category && (
                <Link to={`/home?cat=${encodeURIComponent(category)}`}
                  className="px-3 py-1 bg-brand text-white text-xs font-bold rounded-full tracking-wide uppercase hover:bg-brand-dark transition-colors">
                  {category}
                </Link>
              )}
            </div>
            <h1 className="font-display text-white text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight break-words mb-5">{title}</h1>
            <Link to={`/profile/${recipe.userId}`}
              className="inline-flex items-center gap-2.5 pl-1 pr-4 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 hover:bg-white/25 transition-colors">
              <Avatar name={chefName} seed={recipe.userId} size="sm" />
              <span className="text-white text-sm">
                <span className="text-white/70">by </span>
                {chefName ? <span className="font-semibold">{chefName}</span> : <span className="inline-block h-3 w-20 rounded bg-white/30 align-middle" />}
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 flex flex-col gap-10">

        {/* Stats strip overlapping the hero */}
        <div className="-mt-12 relative z-10 grid grid-cols-3 sm:grid-cols-5 divide-x divide-line bg-surface rounded-3xl border border-line shadow-card">
          <Stat icon="⏱️" value={prepTime > 0 ? `${prepTime}m` : '—'} label="Prep" />
          <Stat icon="🥕" value={ingredientList.length} label="Ingredients" />
          <Stat icon="📋" value={stepList.length} label="Steps" />
          <div className="hidden sm:block"><Stat icon="❤️" value={likes.totalLikes} label="Likes" /></div>
          <div className="hidden sm:block"><Stat icon="💬" value={commentCount} label="Comments" /></div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={handleLike} disabled={liking} aria-pressed={likes.liked}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border-[1.5px] transition-all duration-200 active:scale-[0.97] ${
              likes.liked ? 'bg-danger-soft text-danger border-danger/30' : 'bg-surface text-ink border-line hover:border-muted/40'}`}>
            <svg className={`w-4 h-4 transition-transform ${likes.liked ? 'scale-110' : ''}`} viewBox="0 0 24 24" fill={likes.liked ? 'currentColor' : 'none'} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {likes.liked ? 'Liked' : 'Like'} · {likes.totalLikes}
          </button>

          <Button variant="secondary" onClick={handleShare}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.7 10.7l6.6-3.4M8.7 13.3l6.6 3.4M18 5a3 3 0 11-6 0 3 3 0 016 0zM9 12a3 3 0 11-6 0 3 3 0 016 0zm9 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Share
          </Button>

          {isOwner && (
            <div className="flex gap-3 sm:ml-auto">
              <Button variant="secondary" onClick={() => navigate(`/recipes/${id}/edit`)}>Edit Recipe</Button>
              <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
            </div>
          )}
        </div>

        {/* Ingredients: tap to tick off while shopping / prepping */}
        {ingredientList.length > 0 && (
          <section>
            <div className="flex items-center justify-between gap-4 mb-2 flex-wrap">
              <h2 className="font-display text-2xl font-bold text-ink flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-brand-soft flex items-center justify-center text-base">🥕</span>
                Ingredients
              </h2>
              <Progress done={ingredients.done.size} total={ingredientList.length} />
            </div>
            <p className="text-sm text-muted mb-5">Tap an ingredient to tick it off.</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ingredientList.map((ing, i) => {
                const checked = ingredients.done.has(i);
                return (
                  <li key={i}>
                    <button type="button" onClick={() => ingredients.toggle(i)} aria-pressed={checked}
                      className={`group w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all duration-200 ${
                        checked ? 'bg-brand-soft/60 border-brand/30' : 'bg-surface border-line hover:border-brand/40 shadow-sm'}`}>
                      <CheckCircle checked={checked} />
                      <span className={`text-sm font-medium break-words transition-colors ${checked ? 'text-muted line-through' : 'text-ink'}`}>{ing}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {ingredients.done.size > 0 && (
              <button onClick={ingredients.reset} className="mt-3 text-xs font-semibold text-muted hover:text-ink">Reset ingredients</button>
            )}
          </section>
        )}

        {/* Steps: mark as you go */}
        {stepList.length > 0 && (
          <section>
            <div className="flex items-center justify-between gap-4 mb-2 flex-wrap">
              <h2 className="font-display text-2xl font-bold text-ink flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-brand-soft flex items-center justify-center text-base">📋</span>
                Instructions
              </h2>
              <Progress done={steps.done.size} total={stepList.length} />
            </div>
            <p className="text-sm text-muted mb-5">Mark each step done as you cook.</p>
            <ol className="flex flex-col gap-3">
              {stepList.map((step, i) => {
                const checked = steps.done.has(i);
                return (
                  <li key={i}>
                    <button type="button" onClick={() => steps.toggle(i)} aria-pressed={checked}
                      className={`group w-full flex gap-4 p-5 rounded-2xl border text-left transition-all duration-200 ${
                        checked ? 'bg-brand-soft/60 border-brand/30' : 'bg-surface border-line hover:border-brand/40 shadow-sm'}`}>
                      <span className={`w-9 h-9 rounded-full font-bold text-sm flex items-center justify-center flex-shrink-0 transition-all ${
                        checked ? 'bg-brand text-white' : 'bg-brand-soft text-brand'}`}>
                        {checked ? '✓' : i + 1}
                      </span>
                      <p className={`text-[15px] leading-relaxed pt-1.5 break-words ${checked ? 'text-muted line-through' : 'text-ink/85'}`}>{step}</p>
                    </button>
                  </li>
                );
              })}
            </ol>
            {allStepsDone && (
              <div className="mt-5 flex items-center gap-3 p-4 rounded-2xl bg-success-soft text-success animate-slide-down">
                <span className="text-2xl">🎉</span>
                <p className="text-sm font-semibold">All done, enjoy your meal! {user && !likes.liked && (
                  <button onClick={handleLike} className="underline underline-offset-2 ml-1">Give it a like?</button>
                )}</p>
              </div>
            )}
          </section>
        )}

        {/* Comments */}
        <section>
          <h2 className="font-display text-2xl font-bold text-ink mb-6 flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-brand-soft flex items-center justify-center text-base">💬</span>
            Comments
            <span className="text-base font-normal text-muted font-sans">({commentCount})</span>
          </h2>

          <div className="flex flex-col gap-4 mb-6">
            {comments.length === 0
              ? (
                <div className="text-center py-12 bg-surface rounded-2xl border border-dashed border-line">
                  <div className="text-4xl mb-2">💬</div>
                  <p className="text-ink font-semibold">No comments yet</p>
                  <p className="text-muted text-sm mt-1">Tried it? Tell the chef how it went.</p>
                </div>
              )
              : comments.map(c => (
                <CommentCard key={c.id} comment={c} currentUserId={user?.userId}
                  onReply={handleReply} onDelete={handleDeleteComment} />
              ))}
            <div ref={bottomRef} />
          </div>

          {user ? (
            <form onSubmit={handleComment} className="flex gap-3 items-center bg-surface rounded-2xl border-[1.5px] border-line p-3 shadow-sm focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/15 transition-all duration-200">
              <Avatar name={user.userName} seed={user.userId} size="md" />
              <input value={commentText} onChange={e => setCommentText(e.target.value)}
                placeholder="Share your thoughts..." maxLength={2000} aria-label="Write a comment"
                className="flex-1 min-w-0 text-sm text-ink placeholder:text-muted/60 bg-transparent focus:outline-none" />
              <button type="submit" disabled={posting || !commentText.trim()}
                className="px-4 py-2 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200">
                {posting ? 'Posting…' : 'Post'}
              </button>
            </form>
          ) : (
            <div className="text-center py-6 bg-surface rounded-2xl border border-line">
              <p className="text-sm text-muted">
                <button onClick={login} className="text-brand font-semibold hover:underline">Sign in</button> to leave a comment.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
