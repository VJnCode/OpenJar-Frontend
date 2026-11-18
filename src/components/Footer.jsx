import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

/** Warm dark footer shared by every page (matches the sign-in showcase panel). */
export default function Footer() {
  const { user, login } = useAuth();
  const linkCls = 'text-white/60 text-sm hover:text-white transition-colors w-fit';

  return (
    <footer className="bg-[#1c1917] text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="mb-3">
              <Logo size={36} tone="light" />
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              A community kitchen for discovering, sharing and celebrating home cooking.
            </p>
          </div>
          <nav aria-label="Explore">
            <p className="font-semibold text-sm mb-3">Explore</p>
            <div className="flex flex-col gap-2">
              <Link to="/home" className={linkCls}>All recipes</Link>
              <Link to="/categories" className={linkCls}>Categories</Link>
              <Link to="/create" className={linkCls}>Share a recipe</Link>
            </div>
          </nav>
          <nav aria-label="Account">
            <p className="font-semibold text-sm mb-3">Account</p>
            <div className="flex flex-col gap-2">
              {user ? (
                <Link to={`/profile/${user.userId}`} className={linkCls}>Your kitchen</Link>
              ) : (
                <>
                  <button onClick={login} className={`${linkCls} text-left`}>Sign in</button>
                  <Link to="/register" className={linkCls}>Create account</Link>
                </>
              )}
            </div>
          </nav>
        </div>
        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-white/50 text-sm">© {new Date().getFullYear()} OpenJar · Made with ❤️ for food lovers.</p>
        </div>
      </div>
    </footer>
  );
}
