import { Link } from 'react-router-dom';
import Button from '../components/Button';

const FEATURES = [
  { icon: '🍳', title: 'Share Recipes', desc: 'Post your culinary creations with the world.' },
  { icon: '🔍', title: 'Discover Food', desc: 'Explore thousands of recipes from real cooks.' },
  { icon: '💬', title: 'Join the Community', desc: 'Comment, discuss, and connect with food lovers.' },
];

export default function LandingPage() {
  const handleLogin = () => { window.location.href = 'http://localhost:8081/login'; };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-stone-50">
        {/* Decorative blobs */}
        <div className="absolute top-[-80px] right-[-80px] w-[500px] h-[500px] rounded-full bg-orange-200/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-60px] left-[-60px] w-[400px] h-[400px] rounded-full bg-amber-200/40 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-orange-100/30 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-full px-4 py-1.5 mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-sm font-medium text-orange-700">The Recipe Social Platform</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-stone-900 leading-[1.08] tracking-tight mb-6">
            Discover &amp; Share<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
              Amazing Recipes
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-stone-500 max-w-2xl mx-auto leading-relaxed mb-10">
            OpenJar is where passionate cooks share their best recipes, discover new flavors,
            and build a community around the joy of food.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={handleLogin} className="px-8 py-3 text-base shadow-lg shadow-orange-200 hover:shadow-orange-300">
              Get Started — It's Free
            </Button>
            <Link to="/home">
              <Button variant="secondary" className="px-8 py-3 text-base">
                Explore Recipes
              </Button>
            </Link>
          </div>

          {/* Social proof */}
          <p className="mt-8 text-sm text-stone-400">
            Join thousands of home cooks already sharing their passion
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">Everything you need to cook better</h2>
            <p className="text-stone-500 text-lg max-w-xl mx-auto">A platform built for food lovers, by food lovers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map(f => (
              <div key={f.title} className="group p-8 rounded-2xl bg-stone-50 border border-stone-100 hover:border-orange-200 hover:bg-orange-50/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-stone-900 text-lg mb-2">{f.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6 bg-gradient-to-r from-orange-500 to-amber-500">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to start cooking?</h2>
          <p className="text-orange-100 text-lg mb-8">Create your free account and share your first recipe today.</p>
          <Button onClick={handleLogin} className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-3 text-base shadow-lg">
            Join OpenJar
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-stone-900 text-center">
        <p className="text-stone-500 text-sm">© 2025 OpenJar. Made with ❤️ for food lovers.</p>
      </footer>
    </div>
  );
}
