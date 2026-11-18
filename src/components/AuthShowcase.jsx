import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SLIDES = [
  { img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=80', tag: "Chef's special",  line: 'Every great dish starts with a recipe.' },
  { img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1400&q=80', tag: 'Trending now',    line: 'Share your culinary art with the world.' },
  { img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1400&q=80', tag: 'Fresh picks',     line: 'Healthy, colourful and ready in minutes.' },
  { img: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=1400&q=80', tag: 'Weekend brunch',  line: 'Slow mornings deserve something delicious.' },
];

const CHIPS = [
  { emoji: '🍅', text: 'Fresh & seasonal',      pos: 'top-[22%] right-[12%]', delay: '0s' },
  { emoji: '⏱️', text: 'Ready in 20 min',        pos: 'top-[42%] left-[9%]',  delay: '-2s' },
  { emoji: '❤️', text: 'Loved by the community', pos: 'top-[13%] left-[46%]', delay: '-4s' },
];

/** Decorative, animated food panel shared by the sign-in and sign-up pages. */
export default function AuthShowcase() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setInterval(() => setI(n => (n + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, [i]);

  return (
    <aside className="hidden lg:block lg:w-[52%] relative overflow-hidden bg-stone-900 text-white" aria-hidden="true">
      {SLIDES.map((s, n) => (
        <div key={s.img}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1400ms] ${n === i ? 'opacity-100 animate-kenburns' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${s.img})` }} />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/5 to-black/75" />

      <Link to="/" className="absolute z-10 top-7 left-9 pointer-events-auto" aria-label="OpenJar home">
        <span className="inline-flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-2xl bg-white/90 backdrop-blur shadow-xl">
          <img src="/logo-mark.png" alt="" width="34" height="34" className="w-[34px] h-[34px]" />
          <span className="font-display text-xl font-bold text-stone-900">Open<span className="text-[#C8472B]">Jar</span></span>
        </span>
      </Link>

      {CHIPS.map(c => (
        <div key={c.text} style={{ animationDelay: c.delay }}
          className={`absolute z-10 ${c.pos} animate-floaty px-3.5 py-2.5 rounded-2xl bg-white/90 text-stone-900 text-[13px] font-semibold shadow-xl flex items-center gap-2`}>
          <span className="text-lg">{c.emoji}</span>{c.text}
        </div>
      ))}

      <div className="absolute z-10 left-10 right-10 bottom-12">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs font-semibold tracking-widest uppercase">
          ✦ {SLIDES[i].tag}
        </span>
        <h2 key={i} className="font-display text-4xl xl:text-5xl leading-tight mt-4 mb-3 max-w-lg animate-fade-up">
          {SLIDES[i].line}
        </h2>
        <p className="text-white/75 max-w-md leading-relaxed">
          Discover recipes from home cooks, save your favourites and share what's cooking in your kitchen.
        </p>
        <div className="flex gap-2 mt-6 pointer-events-auto">
          {SLIDES.map((s, n) => (
            <button key={s.img} onClick={() => setI(n)} aria-label={`Show slide ${n + 1}`}
              className={`h-1 rounded-full transition-all duration-300 ${n === i ? 'w-11 bg-white' : 'w-6 bg-white/35 hover:bg-white/60'}`} />
          ))}
        </div>
      </div>
    </aside>
  );
}
