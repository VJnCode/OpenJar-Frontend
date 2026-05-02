import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleLogout = async () => { await logout(); navigate('/'); };

  const lc = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-150 ${isActive ? 'text-[#C8472B]' : 'text-gray-600 hover:text-gray-900'}`;

  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'border-b border-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between gap-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#C8472B] flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm tracking-tight">OJ</span>
          </div>
          <span className="font-display text-gray-900 text-xl font-bold tracking-tight">OpenJar</span>
        </Link>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-7">
          <NavLink to="/home"          className={lc}>Explore</NavLink>
          <NavLink to="/categories"    className={lc}>Categories</NavLink>
          <NavLink to="/notifications" className={lc}>Notifications</NavLink>
          {user && <NavLink to="/create" className={lc}>Create</NavLink>}
        </nav>

        {/* Right */}
        <div className="hidden md:flex items-center gap-3">
          {/* Search icon */}
          <button className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
            <svg className="w-4.5 h-4.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              {/* Notification bell */}
              <div className="relative">
                <button onClick={() => setNotifOpen(o => !o)}
                  className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors relative">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C8472B] rounded-full" />
                </button>
                {notifOpen && (
                  <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 animate-slide-down z-50">
                    <p className="font-semibold text-gray-900 text-sm mb-3">Notifications</p>
                    <div className="text-center py-6 text-gray-400 text-sm">No new notifications</div>
                  </div>
                )}
              </div>

              {/* Avatar */}
              <Link to={`/profile/${user.userId}`} className="flex items-center gap-2 pl-1 group">
                <div className="w-9 h-9 rounded-full bg-[#C8472B] flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm">{(user.userName || 'U')[0].toUpperCase()}</span>
                </div>
              </Link>
              <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-red-500 transition-colors ml-1">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                Sign in
              </Link>
              <Link to="/register" className="px-5 py-2.5 bg-[#C8472B] text-white text-sm font-semibold rounded-xl hover:bg-[#b03d24] transition-all duration-200 shadow-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 text-gray-600" onClick={() => setOpen(o => !o)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-5 flex flex-col gap-4 animate-slide-down">
          <NavLink to="/home"          className={lc} onClick={() => setOpen(false)}>Explore</NavLink>
          <NavLink to="/categories"    className={lc} onClick={() => setOpen(false)}>Categories</NavLink>
          <NavLink to="/notifications" className={lc} onClick={() => setOpen(false)}>Notifications</NavLink>
          {user && <NavLink to="/create" className={lc} onClick={() => setOpen(false)}>Create</NavLink>}
          {user && <NavLink to={`/profile/${user.userId}`} className={lc} onClick={() => setOpen(false)}>Profile</NavLink>}
          <div className="pt-2 border-t border-gray-100">
            {user
              ? <button onClick={handleLogout} className="text-sm text-red-500">Logout</button>
              : <Link to="/login" className="text-sm font-medium text-[#C8472B]">Sign in</Link>}
          </div>
        </div>
      )}
    </header>
  );
}
