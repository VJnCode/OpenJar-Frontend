import { Link } from 'react-router-dom';

export default function LoginPage() {
  const handleLogin = () => {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id:     'openjar-client',
      redirect_uri:  'http://localhost:8081/login/oauth2/code/openjar-client',
      scope:         'openid profile',
    });
    window.location.href = `/oauth2/authorize?${params}`;
  };

  return (
    <div className="flex-1 flex bg-white">
      {/* Left — decorative */}
      <div className="hidden lg:block lg:w-[45%] relative overflow-hidden bg-gray-50">
        <img
          src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=85"
          alt=""
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent" />
        <div className="absolute bottom-12 left-10 right-10">
          <p className="font-display text-3xl font-bold text-gray-900 leading-snug">
            "Every great dish<br />starts with a recipe."
          </p>
          <p className="text-gray-500 text-sm mt-2">— OpenJar Community</p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-sm animate-fade-up">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-7 h-7 rounded-lg bg-[#C8472B] flex items-center justify-center">
              <span className="text-white font-bold text-xs">OJ</span>
            </div>
            <span className="font-display font-bold text-gray-900">OpenJar</span>
          </Link>

          <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-1">Welcome back</p>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-3">Sign in</h1>
          <p className="text-gray-400 text-sm mb-10">Access your OpenJar account to explore and share recipes.</p>

          <button
            onClick={handleLogin}
            className="w-full py-3 bg-[#C8472B] text-white text-sm font-semibold rounded-xl hover:bg-[#b03d24] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Continue with OpenJar SSO
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-300">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <p className="text-sm text-gray-400 text-center">
            New here?{' '}
            <Link to="/register" className="text-[#C8472B] font-semibold hover:underline">Create a free account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
