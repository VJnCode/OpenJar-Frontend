import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUser, updateMe, deleteMe } from '../services/userService';
import { getRecipesByUser } from '../services/recipeService';
import { useAuth } from '../context/AuthContext';
import RecipeCard from '../components/RecipeCard';
import Button from '../components/Button';
import InputField from '../components/InputField';
import Spinner from '../components/Spinner';
import { useToast } from '../context/ToastContext';
import usePageTitle from '../hooks/usePageTitle';
import { forgetPublicUser } from '../hooks/usePublicUser';

export default function ProfilePage() {
  const { id } = useParams();
  const { user: authUser, setUser: setAuthUser, logout } = useAuth();
  const navigate = useNavigate();

  const [profile,  setProfile]  = useState(null);
  const [recipes,  setRecipes]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [loadError, setLoadError] = useState('');
  const [editing,  setEditing]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [userName, setUserName] = useState('');
  const [error,    setError]    = useState('');

  const isOwn = authUser?.userId === id;
  const toast = useToast();
  usePageTitle(profile?.userName);

  useEffect(() => {
    let alive = true;
    setLoading(true); setLoadError('');
    Promise.all([getUser(id), getRecipesByUser(id).catch(() => [])])
      .then(([u, list]) => {
        if (!alive) return;
        setProfile(u);
        setUserName(u.userName || '');
        setRecipes(Array.isArray(list) ? list : []);
      })
      .catch(err => alive && setLoadError(err.status === 404 ? '' : err.message))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const updated = await updateMe({ userName: userName.trim() });
      setProfile(p => ({ ...p, userName: updated.userName }));
      setAuthUser(prev => ({ ...prev, userName: updated.userName }));
      setEditing(false);
      forgetPublicUser(updated.userId);
      toast.success('Profile updated');
    } catch (err) {
      setError(err.fieldErrors?.userName || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Permanently delete your account? This cannot be undone.')) return;
    try {
      await deleteMe();
      logout();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Spinner />;

  if (!profile) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-canvas py-24">
      <div className="text-6xl">👤</div>
      <p className="font-display text-2xl text-ink/75">{loadError ? 'Could not load this profile' : 'User not found'}</p>
      {loadError && <p className="text-sm text-muted">{loadError}</p>}
      <Button onClick={() => navigate('/home')} variant="secondary">Back to Explore</Button>
    </div>
  );

  const initial = (profile.userName || 'U')[0].toUpperCase();
  const joined  = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="flex-1 bg-canvas animate-fade-in">

      {/* Profile header */}
      <div className="relative overflow-hidden border-b border-line">
        <div className="absolute -top-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-[radial-gradient(circle,var(--oj-brand-soft)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute -bottom-40 -left-24 w-96 h-96 rounded-full bg-[radial-gradient(circle,var(--oj-brand-soft)_0%,transparent_70%)] opacity-60 pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <div className="w-24 h-24 rounded-3xl bg-brand flex items-center justify-center shadow-xl shadow-brand/30 flex-shrink-0 rotate-[-3deg]">
              <span className="text-white font-bold text-4xl font-display">{initial}</span>
            </div>
            <div className="flex-1 text-center sm:text-left min-w-0">
              <p className="text-xs font-bold text-brand tracking-[0.14em] uppercase mb-1">{isOwn ? 'Your kitchen' : 'Home cook'}</p>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink break-words">
                {profile.userName || 'Unknown User'}
              </h1>
              {/* Email is only ever shown to its owner. */}
              {isOwn && authUser.userEmail && <p className="text-muted text-sm mt-1">{authUser.userEmail}</p>}
              {joined && <p className="text-muted/80 text-xs mt-1">Cooking on OpenJar since {joined}</p>}
              <div className="flex items-center justify-center sm:justify-start gap-3 mt-5">
                <div className="px-4 py-2.5 rounded-2xl bg-surface border border-line shadow-card text-center min-w-[96px]">
                  <div className="text-2xl font-bold text-brand">{recipes.length}</div>
                  <div className="text-xs text-muted mt-0.5">Recipes</div>
                </div>
                <div className="px-4 py-2.5 rounded-2xl bg-surface border border-line shadow-card text-center min-w-[96px]">
                  <div className="text-2xl font-bold text-ink">
                    {recipes.reduce((n, r) => n + (r.likeCount || 0), 0)}
                  </div>
                  <div className="text-xs text-muted mt-0.5">Likes received</div>
                </div>
              </div>
            </div>
            {isOwn && !editing && (
              <button onClick={() => setEditing(true)}
                className="px-4 py-2.5 bg-surface hover:border-muted/40 text-ink text-sm font-semibold rounded-xl border-[1.5px] border-line shadow-sm transition-all duration-200 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">

        {/* Edit form */}
        {editing && (
          <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-sm border border-line animate-slide-down">
            <h2 className="font-display text-xl font-bold text-ink mb-6">Edit Profile</h2>
            <form onSubmit={handleSave} className="flex flex-col gap-4 max-w-md">
              <InputField label="Username" value={userName} maxLength={50} minLength={3} required
                onChange={e => setUserName(e.target.value)} />
              <p className="text-xs text-muted">Your email address can't be changed here.</p>
              {error && <p role="alert" className="text-sm text-danger">{error}</p>}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button type="submit" loading={saving}>Save Changes</Button>
                <Button type="button" variant="ghost" onClick={() => { setEditing(false); setError(''); }}>Cancel</Button>
                <Button type="button" variant="danger" className="sm:ml-auto" onClick={handleDeleteAccount}>Delete account</Button>
              </div>
            </form>
          </div>
        )}


        {/* Recipes */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-line" />
            <span className="text-xs font-bold tracking-widest text-muted uppercase">
              {isOwn ? 'My Recipes' : 'Their Recipes'}
            </span>
            <div className="h-px flex-1 bg-line" />
          </div>

          {recipes.length === 0 ? (
            <div className="text-center py-20 bg-surface rounded-2xl border border-line">
              <div className="text-5xl mb-3">🍳</div>
              <p className="font-display text-xl text-muted mb-1">No recipes yet</p>
              <p className="text-muted text-sm mb-6">{isOwn ? "You haven't shared any recipes." : 'Nothing here yet.'}</p>
              {isOwn && <Button onClick={() => navigate('/create')}>Create Your First Recipe</Button>}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map((r, i) => <RecipeCard key={r.recipeId} recipe={r} index={i} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
