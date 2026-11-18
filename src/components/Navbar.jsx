import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

export default function Navbar() {
  const { user, loading, login, logout } = useAuth();
  const location = useLocation();
  // The menu is open only for the path it was opened on, so navigating closes it.
  const [openOn, setOpenOn]     = useState(null);
  const open = openOn === location.pathname;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const lc = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-150 ${isActive ? 'text-brand' : 'text-ink/75 hover:text-ink'}`;

  const initial = (user?.userName || 'U')[0].toUpperCase();

  return (
    <header className={`sticky top-0 z-50 bg-surface/85 backdrop-blur-xl border-b transition-all duration-300 ${scrolled ? 'border-line shadow-card' : 'border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between gap-6">

        {/* Logo */}
        <Link to="/" className="flex-shrink-0 transition-transform hover:-rotate-2" aria-label="OpenJar home">
          <Logo size={40} />
        </Link>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Main">
          <NavLink to="/home"       className={lc}>Explore</NavLink>
          <NavLink to="/categories" className={lc}>Categories</NavLink>
          {user && <NavLink to="/create" className={lc}>Create</NavLink>}
        </nav>

        {/* Right */}
        <div className="hidden md:flex items-center gap-3 min-w-[140px] justify-end">
          <ThemeToggle />
          {loading ? (
            <div className="w-9 h-9 rounded-full skeleton" aria-hidden="true" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link to={`/profile/${user.userId}`} className="flex items-center gap-2 group" title="Your profile">
                <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm">{initial}</span>
                </div>
                <span className="text-sm font-medium text-ink/80 group-hover:text-ink max-w-[120px] truncate">
                  {user.userName}
                </span>
              </Link>
              <button onClick={logout} className="text-xs text-muted hover:text-danger transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={login} className="px-4 py-2 text-sm font-medium text-muted hover:text-ink transition-colors">
                Sign in
              </button>
              <Link to="/register" className="px-5 py-2.5 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand-dark transition-all duration-200 shadow-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile: theme + menu */}
        <div className="md:hidden flex items-center gap-1">
        <ThemeToggle />
        <button className="p-2 text-ink/75" onClick={() => setOpenOn(open ? null : location.pathname)}
          aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-surface border-t border-line px-4 py-5 flex flex-col gap-4 animate-slide-down">
          <NavLink to="/home"       className={lc}>Explore</NavLink>
          <NavLink to="/categories" className={lc}>Categories</NavLink>
          {user && <NavLink to="/create" className={lc}>Create</NavLink>}
          {user && <NavLink to={`/profile/${user.userId}`} className={lc}>Profile</NavLink>}
          <div className="pt-2 border-t border-line">
            {user
              ? <button onClick={logout} className="text-sm text-danger">Logout</button>
              : <button onClick={login} className="text-sm font-medium text-brand">Sign in</button>}
          </div>
        </div>
      )}
    </header>
  );
}
