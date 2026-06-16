import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '../features/api/apiSlice';
import ProductCard from '../components/ProductCard';

const SLIDES = [
  { tag: 'Heirloom craft, made for the everyday.', sub: 'BIS-hallmarked gold and 925 sterling silver, finished by hand and kept brilliant for life.' },
  { tag: 'Pieces you\u2019ll never take off.', sub: 'Comfort-fit, hand-finished, and made to live in \u2014 morning to midnight.' },
  { tag: 'The new Royal Edit.', sub: 'Statement gold for the moments that deserve a little more.' },
];

/** Decorative ornate jhumka earring, drawn from the shared gold gradients. */
function Jhumka({ className }: { className?: string }) {
  const drops = [30, 42, 54, 66, 78, 90];
  return (
    <svg viewBox="0 0 120 230" className={className} aria-hidden>
      <circle cx="60" cy="12" r="5" fill="url(#gold-h)" />
      <circle cx="60" cy="12" r="2.2" fill="url(#diamond)" />
      <path d="M60 17 L60 30" stroke="url(#gold-h)" strokeWidth="2" />
      <path d="M38 46 Q60 22 82 46 Z" fill="url(#gold-h)" />
      <ellipse cx="60" cy="47" rx="27" ry="5" fill="url(#gold-h)" />
      <path d="M33 48 Q60 100 87 48 Z" fill="url(#gold-h)" />
      <path d="M40 50 Q60 88 80 50 Z" fill="url(#gem)" opacity="0.55" />
      <circle cx="60" cy="64" r="6" fill="url(#diamond)" />
      {drops.map((x, idx) => {
        const len = 18 + Math.round(14 * Math.sin((idx / (drops.length - 1)) * Math.PI));
        const topY = 78 - Math.round(10 * Math.sin((idx / (drops.length - 1)) * Math.PI));
        return (
          <g key={x}>
            <line x1={x} y1={topY} x2={x} y2={topY + len} stroke="url(#gold-h)" strokeWidth="1.4" />
            <path d={`M${x} ${topY + len} q5 6 0 12 q-5 -6 0 -12`} fill="url(#gem)" />
            <circle cx={x} cy={topY + len + 14} r="3.2" fill="url(#gold-h)" />
          </g>
        );
      })}
    </svg>
  );
}

export default function Home() {
  const [slide, setSlide] = useState(0);
  const { data: products } = useGetProductsQuery({ sort: 'featured' });
  const featured = products?.slice(0, 4) ?? [];

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  const go = (dir: number) => setSlide((s) => (s + dir + SLIDES.length) % SLIDES.length);
  const s = SLIDES[slide];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[radial-gradient(ellipse_70%_80%_at_50%_0%,#1A140C,#0B0B0C_72%)]">
        {/* decorative jewellery backdrop */}
        <Jhumka className="pointer-events-none select-none absolute -left-10 top-12 w-[230px] md:w-[320px] opacity-[0.16] blur-[1px]" />
        <Jhumka className="pointer-events-none select-none absolute -right-10 top-12 w-[230px] md:w-[320px] opacity-[0.16] blur-[1px] scale-x-[-1]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(217,184,92,0.10),transparent_55%)]" />

        {/* carousel arrows */}
        <button onClick={() => go(-1)} aria-label="Previous" className="absolute left-3 md:left-7 top-1/2 -translate-y-1/2 z-20 text-cream-soft hover:text-gold transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-7 h-7"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <button onClick={() => go(1)} aria-label="Next" className="absolute right-3 md:right-7 top-1/2 -translate-y-1/2 z-20 text-cream-soft hover:text-gold transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-7 h-7"><path d="M9 5l7 7-7 7" /></svg>
        </button>

        <div className="relative z-10 max-w-[1240px] mx-auto px-7 text-center py-24 md:py-32">
          <svg viewBox="0 0 100 56" className="w-9 h-[22px] mx-auto mb-6" aria-hidden>
            <path d="M16 46 L13 21 L32 34 L50 12 L68 34 L87 21 L84 46 Z" fill="url(#gd)" />
            <rect x="15" y="45" width="70" height="8" rx="1" fill="url(#gd)" />
          </svg>

          <h1 className="veha-wordmark font-disp font-bold leading-none tracking-[0.12em] pl-[0.12em] text-[clamp(72px,16vw,200px)]">VEHA</h1>
          <div className="text-[11px] md:text-sm tracking-[0.62em] uppercase text-gold-dark mt-1 pl-[0.62em]">Jewelry</div>

          <div className="mx-auto my-7 h-px w-12 bg-gradient-to-r from-transparent via-gold to-transparent" />

          <p key={slide} className="font-edi italic text-2xl md:text-4xl text-cream max-w-[760px] mx-auto fade-in">{s.tag}</p>
          <p className="text-cream-soft text-sm md:text-base max-w-[520px] mx-auto mt-4">{s.sub}</p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 mt-9">
            <Link to="/shop" className="bg-gradient-to-br from-[#E8CC76] to-gold-mid text-noir text-[11px] font-medium tracking-[0.22em] uppercase px-9 py-4 hover:from-gold-light hover:to-gold transition-colors">Shop the collection</Link>
            <a href="#" className="border border-line-strong text-gold text-[11px] font-medium tracking-[0.22em] uppercase px-9 py-4 hover:border-gold hover:text-gold-light transition-colors">The Veha story</a>
          </div>

          {/* dots */}
          <div className="flex justify-center gap-2.5 mt-10">
            {SLIDES.map((_, idx) => (
              <button key={idx} onClick={() => setSlide(idx)} aria-label={`Slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${idx === slide ? 'w-7 bg-gold' : 'w-1.5 bg-line-strong'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY STRIP */}
      <section className="max-w-[1240px] mx-auto px-7 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[['Rings', 'rings'], ['Earrings', 'earrings'], ['Necklaces', 'necklaces'], ['Bracelets', 'bracelets']].map(([label]) => (
            <Link key={label} to="/shop" className="border border-line hover:border-gold-mid transition-colors py-9 text-center group">
              <span className="font-edi text-2xl text-cream group-hover:text-gold-light transition-colors">{label}</span>
              <span className="block text-[10px] tracking-[0.2em] uppercase text-cream-dim mt-1">Explore &rarr;</span>
            </Link>
          ))}
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="max-w-[1240px] mx-auto px-7 pb-20">
        <div className="text-center mb-10">
          <p className="text-[11px] tracking-[0.34em] uppercase text-gold-mid mb-3">Loved by many</p>
          <h2 className="font-disp text-3xl md:text-4xl tracking-[0.08em] bg-gradient-to-b from-gold-light to-gold-dark bg-clip-text text-transparent">Bestsellers</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
        <div className="text-center mt-12">
          <Link to="/shop" className="border border-line-strong text-gold text-[11px] tracking-[0.22em] uppercase px-9 py-4 hover:border-gold hover:text-gold-light transition-colors">View all jewellery</Link>
        </div>
      </section>
    </>
  );
}
