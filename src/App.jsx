import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Button from './components/Button';
import Spinner from './components/Spinner';
import GoogleButton from './components/GoogleButton';

import HomePage          from './pages/HomePage';
import RecipeDetailPage  from './pages/RecipeDetailPage';
import CreateRecipePage  from './pages/CreateRecipePage';
import ProfilePage       from './pages/ProfilePage';
import CategoriesPage    from './pages/CategoriesPage';
import LoginPage         from './pages/LoginPage';
import RegisterPage      from './pages/RegisterPage';
import VerifyPage        from './pages/VerifyPage';
import CallbackPage      from './pages/CallbackPage';

// Focused auth screens don't need the site footer.
const NO_FOOTER = ['/login', '/register', '/verify'];

function Layout() {
  const { pathname } = useLocation();

  // A new page should start at the top, not at the previous page's scroll position.
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-brand focus:text-white">
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="flex-1 flex flex-col">
        <Outlet />
      </main>
      {!NO_FOOTER.includes(pathname) && <Footer />}
    </div>
  );
}

/** Client-side guard for pages that need a session. The server enforces the real rules. */
function RequireAuth({ children }) {
  const { user, loading, login } = useAuth();
  if (loading) return <Spinner />;
  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-5 py-24 px-6 text-center">
        <p className="font-display text-2xl text-ink">Sign in to continue</p>
        <p className="text-muted text-sm max-w-sm">You need an OpenJar account to do that.</p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <GoogleButton />
          <Button onClick={login} className="w-full">Sign in with email</Button>
          <Link to="/register" className="text-sm text-muted hover:text-ink">New here? Create an account</Link>
        </div>
      </div>
    );
  }
  return children;
}

function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 py-24">
      <div className="text-6xl">🍽️</div>
      <p className="font-display text-2xl text-ink/80">Page not found</p>
      <Link to="/home" className="text-brand font-semibold hover:underline">Back to Explore</Link>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
     <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/"                element={<Navigate to="/home" replace />} />
            <Route path="/home"            element={<HomePage />} />
            <Route path="/recipe/:id"      element={<RecipeDetailPage />} />
            <Route path="/recipe/:id/edit" element={<RequireAuth><CreateRecipePage /></RequireAuth>} />
            <Route path="/create"          element={<RequireAuth><CreateRecipePage /></RequireAuth>} />
            <Route path="/profile/:id"     element={<ProfilePage />} />
            <Route path="/categories"      element={<CategoriesPage />} />
            <Route path="/login"           element={<LoginPage />} />
            <Route path="/register"        element={<RegisterPage />} />
            <Route path="/verify"          element={<VerifyPage />} />
            <Route path="*"                element={<NotFound />} />
          </Route>
          <Route path="/callback" element={<CallbackPage />} />
        </Routes>
      </BrowserRouter>
     </ToastProvider>
    </AuthProvider>
  );
}
