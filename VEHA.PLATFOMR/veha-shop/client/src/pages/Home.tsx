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

  const s = SLIDES[slide];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[radial-gradient(ellipse_70%_80%_at_50%_0%,#1A140C,#0B0B0C_72%)]">
        {/* decorative jewellery backdrop */}
        <Jhumka className="pointer-events-none select-none absolute -left-10 top-12 w-[230px] md:w-[320px] opacity-[0.16] blur-[1px]" />
        <Jhumka className="pointer-events-none select-none absolute -right-10 top-12 w-[230px] md:w-[320px] opacity-[0.16] blur-[1px] scale-x-[-1]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(217,184,92,0.10),transparent_55%)]" />



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
          {[['Rings', 'rings'], ['Earrings', 'earrings'], ['Necklaces', 'necklaces'], ['Bracelets', 'bracelets']].map(([label, catKey]) => (
            <Link key={label} to={`/shop?category=${catKey}`} className="border border-line hover:border-gold-mid transition-colors py-9 text-center group">
              <span className="font-edi text-2xl text-cream group-hover:text-gold-light transition-colors">{label}</span>
              <span className="block text-[10px] tracking-[0.2em] uppercase text-cream-dim mt-1">Explore &rarr;</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED EDITORIALS */}
      <section className="max-w-[1240px] mx-auto px-7 pb-20">
        <div className="grid md:grid-cols-2 gap-7">
          <Link to="/shop?search=bridal" className="relative overflow-hidden group min-h-[340px] flex items-end border border-line-strong hover:border-gold transition-colors">
            <img 
              src="/bridal_banner_editorial.png" 
              alt="Bridal Collection" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/40 to-transparent" />
            <div className="relative z-10 p-8">
              <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-gold-mid mb-2">Featured Edit</p>
              <h3 className="font-disp text-3xl text-cream tracking-[0.05em] uppercase mb-1">Bridal Collection</h3>
              <p className="text-xs text-cream-soft max-w-[320px] mb-4">Complete bridal sets, traditional necklaces, and heirloom pieces.</p>
              <span className="inline-block text-[10px] font-medium tracking-[0.2em] uppercase border-b border-gold pb-0.5 text-gold group-hover:text-gold-light transition-colors">Explore Now &rarr;</span>
            </div>
          </Link>

          <Link to="/shop?sort=featured" className="relative overflow-hidden group min-h-[340px] flex items-end border border-line-strong hover:border-gold transition-colors">
            <img 
              src="/gift_banner_editorial.png" 
              alt="Gift Store" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/40 to-transparent" />
            <div className="relative z-10 p-8">
              <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-gold-mid mb-2">Gift Store</p>
              <h3 className="font-disp text-3xl text-cream tracking-[0.05em] uppercase mb-1">Give the Gift of Luxury</h3>
              <p className="text-xs text-cream-soft max-w-[320px] mb-4">Curated jewelry and timepieces inside signature luxury packaging.</p>
              <span className="inline-block text-[10px] font-medium tracking-[0.2em] uppercase border-b border-gold pb-0.5 text-gold group-hover:text-gold-light transition-colors">Shop Gifts &rarr;</span>
            </div>
          </Link>
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="max-w-[1240px] mx-auto px-7 pb-20">
        <div className="text-center mb-10">
          <p className="text-[11px] tracking-[0.34em] uppercase text-gold-mid mb-3">Loved by many</p>
          <h2 className="font-disp text-3xl md:text-4xl tracking-[0.08em] bg-gradient-to-b from-gold-light to-gold-dark bg-clip-text text-transparent uppercase">Bestsellers</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
        <div className="text-center mt-12">
          <Link to="/shop" className="border border-line-strong text-gold text-[11px] tracking-[0.22em] uppercase px-9 py-4 hover:border-gold hover:text-gold-light transition-colors">View all jewellery</Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-[1240px] mx-auto px-7 pb-24 border-t border-line/30 pt-20">
        <div className="text-center mb-12">
          <p className="text-[11px] tracking-[0.34em] uppercase text-gold-mid mb-3">Patron Stories</p>
          <h2 className="font-disp text-3xl md:text-4xl tracking-[0.08em] bg-gradient-to-b from-gold-light to-gold-dark bg-clip-text text-transparent uppercase">What Our Customers Say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: 'Priya Sharma',
              loc: 'Mumbai',
              quote: 'Perfect bridal set! My entire family was in awe of the intricate handiwork. The custom gold polishing looks breathtaking.',
              stars: 5,
              img: 'https://i.pravatar.cc/80?img=5'
            },
            {
              name: 'Aditya Mehta',
              loc: 'Delhi',
              quote: 'Bought the luxury watch edit as a wedding gift. The signature black box packaging is incredibly premium, and shipping was extremely fast.',
              stars: 5,
              img: 'https://i.pravatar.cc/80?img=11'
            },
            {
              name: 'Ananya Rao',
              loc: 'Bangalore',
              quote: 'The craftsmanship on the everyday band ring is superb. Extremely comfortable fit, and it keeps its brilliant polish even with daily wear.',
              stars: 5,
              img: 'https://i.pravatar.cc/85?img=9'
            }
          ].map((t, i) => (
            <div key={i} className="border border-line bg-[#0E0E10] p-6 flex flex-col justify-between hover:border-gold transition-colors duration-300">
              <div>
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, sIdx) => (
                    <svg key={sIdx} viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-gold-mid">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="font-edi italic text-lg text-cream/90 leading-relaxed mb-6">"{t.quote}"</p>
              </div>
              <div className="flex items-center gap-3">
                <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full border border-line-strong object-cover" />
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-cream">{t.name}</h4>
                  <span className="text-[10px] uppercase tracking-widest text-cream-dim">{t.loc}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
