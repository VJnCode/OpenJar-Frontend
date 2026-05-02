import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUser, updateUser } from '../services/userService';
import { getRecipes } from '../services/recipeService';
import { useAuth } from '../context/AuthContext';
import RecipeCard from '../components/RecipeCard';
import Button from '../components/Button';
import InputField from '../components/InputField';

export default function ProfilePage() {
  const { id } = useParams();
  const { user: authUser, setUser: setAuthUser } = useAuth();
  const navigate = useNavigate();

  const [profile,  setProfile]  = useState(null);
  const [recipes,  setRecipes]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [editing,  setEditing]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [form,     setForm]     = useState({});
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');

  const isOwn = authUser?.userId === id;

  useEffect(() => {
    Promise.all([getUser(id), getRecipes()])
      .then(([u, all]) => {
        setProfile(u);
        setForm({ userName: u.userName || '', userEmail: u.userEmail || '' });
        setRecipes(Array.isArray(all) ? all.filter(r => String(r.userId) === String(id)) : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    try {
      const updated = await updateUser(id, form);
      setProfile(updated);
      if (isOwn) setAuthUser(prev => ({ ...prev, ...form }));
      setEditing(false);
      setSuccess('Profile updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex-1 flex items-center justify-center bg-[#fafaf8]">
      <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!profile) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-[#fafaf8]">
      <div className="text-6xl">👤</div>
      <p className="font-serif text-2xl text-zinc-600">User not found</p>
      <Button onClick={() => navigate('/home')} variant="secondary">Back to Explore</Button>
    </div>
  );

  const initial = (profile.userName || 'U')[0].toUpperCase();

  return (
    <div className="flex-1 bg-[#fafaf8] animate-fade-in">

      {/* Profile header */}
      <div className="bg-zinc-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <div className="w-24 h-24 rounded-2xl bg-amber-400 flex items-center justify-center shadow-xl flex-shrink-0">
              <span className="text-zinc-900 font-bold text-4xl font-serif">{initial}</span>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                {profile.userName || 'Unknown User'}
              </h1>
              <p className="text-white/50 text-sm mt-1">{profile.userEmail || ''}</p>
              <div className="flex items-center justify-center sm:justify-start gap-6 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-400">{recipes.length}</div>
                  <div className="text-xs text-white/50 mt-0.5">Recipes</div>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-xs text-white/50 mt-0.5">Followers</div>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-xs text-white/50 mt-0.5">Following</div>
                </div>
              </div>
            </div>
            {isOwn && !editing && (
              <button onClick={() => setEditing(true)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg border border-white/20 transition-all duration-200 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-zinc-100 animate-slide-down">
            <h2 className="font-serif text-xl font-bold text-zinc-900 mb-6">Edit Profile</h2>
            <form onSubmit={handleSave} className="flex flex-col gap-4 max-w-md">
              <InputField label="Username" value={form.userName}
                onChange={e => setForm(f => ({ ...f, userName: e.target.value }))} />
              <InputField label="Email" type="email" value={form.userEmail}
                onChange={e => setForm(f => ({ ...f, userEmail: e.target.value }))} />
              {error   && <p className="text-sm text-red-500">{error}</p>}
              {success && <p className="text-sm text-green-600">{success}</p>}
              <div className="flex gap-3 pt-2">
                <Button type="submit" loading={saving}>Save Changes</Button>
                <Button type="button" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        )}

        {success && !editing && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm animate-slide-down">{success}</div>
        )}

        {/* Recipes */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-zinc-200" />
            <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
              {isOwn ? 'My Recipes' : 'Their Recipes'}
            </span>
            <div className="h-px flex-1 bg-zinc-200" />
          </div>

          {recipes.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-zinc-100">
              <div className="text-5xl mb-3">🍳</div>
              <p className="font-serif text-xl text-zinc-500 mb-1">No recipes yet</p>
              <p className="text-zinc-400 text-sm mb-6">{isOwn ? "You haven't shared any recipes." : 'Nothing here yet.'}</p>
              {isOwn && <Button variant="dark" onClick={() => navigate('/create')}>Create Your First Recipe</Button>}
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
