import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const VALUES = [
  { t: 'BIS hallmarked', d: 'Every gold piece is independently assayed and stamped, so its purity is certified \u2014 never a guess.' },
  { t: 'Finished by hand', d: 'Each piece is polished and quality-checked by our artisans in Jaipur before it is boxed.' },
  { t: 'Made to be worn', d: 'Comfort-fit bands and secure settings mean our jewellery is built for daily life, not a drawer.' },
  { t: 'Cared for, for life', d: 'Free lifetime polishing and easy 30-day returns. We stand behind everything we make.' },
];

export default function House() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const elem = document.getElementById(location.hash.substring(1));
      if (elem) {
        setTimeout(() => {
          elem.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);
  return (
    <>
      {/* intro */}
      <header className="text-center py-20 px-7 bg-[radial-gradient(ellipse_70%_100%_at_50%_0%,#1A140C,#0B0B0C_72%)] border-b border-line">
        <p className="text-[11px] tracking-[0.34em] uppercase text-gold-mid mb-4">Our story</p>
        <h1 className="font-disp text-4xl md:text-6xl tracking-[0.08em] bg-gradient-to-b from-gold-light to-gold-dark bg-clip-text text-transparent">The House of Veha</h1>
        <p className="font-edi italic text-2xl md:text-3xl text-cream max-w-[720px] mx-auto mt-6">
          Heirloom craft, made for the everyday.
        </p>
      </header>

      {/* manifesto */}
      <section className="max-w-[760px] mx-auto px-7 py-16 text-center">
        <p className="text-cream-soft text-lg leading-relaxed">
          Veha began with a simple idea: that fine jewellery shouldn&rsquo;t live in a locker. We make hallmarked
          gold and 925 sterling silver pieces that are light enough to wear every day, yet finished to the standard
          you&rsquo;d expect from something kept for generations.
        </p>
        <p className="text-cream-soft text-lg leading-relaxed mt-6">
          Each design is drawn in-house, hand-finished by our artisans, and checked piece by piece before it reaches you.
        </p>
      </section>

      {/* values */}
      <section className="max-w-[1240px] mx-auto px-7 pb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map((v, i) => (
            <div key={v.t} className="border border-line p-7">
              <div className="font-disp text-gold text-lg mb-3">{String(i + 1).padStart(2, '0')}</div>
              <h3 className="font-edi text-2xl text-cream mb-3">{v.t}</h3>
              <p className="text-cream-soft text-sm leading-relaxed">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* promise band */}
      <section className="border-y border-line bg-noir-2">
        <div className="max-w-[1240px] mx-auto px-7 py-14 text-center">
          <p className="text-[11px] tracking-[0.34em] uppercase text-gold-mid mb-3">The Veha promise</p>
          <h2 className="font-edi text-3xl md:text-4xl text-cream max-w-[680px] mx-auto">
            If you don&rsquo;t love it, send it back within 30 days. If it ever dulls, we&rsquo;ll polish it for free.
          </h2>
        </div>
      </section>

      {/* contact */}
      <section id="contact" className="max-w-[1240px] mx-auto px-7 py-16">
        <div className="text-center mb-10">
          <p className="text-[11px] tracking-[0.34em] uppercase text-gold-mid mb-3">Say hello</p>
          <h2 className="font-disp text-3xl md:text-4xl tracking-[0.08em] bg-gradient-to-b from-gold-light to-gold-dark bg-clip-text text-transparent">Contact us</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-5 max-w-[900px] mx-auto text-center">
          <div className="border border-line p-8">
            <div className="text-[11px] tracking-[0.2em] uppercase text-cream-dim mb-3">Email</div>
            <a href="mailto:care@veha.example" className="text-cream hover:text-gold transition-colors">care@veha.example</a>
          </div>
          <div className="border border-line p-8">
            <div className="text-[11px] tracking-[0.2em] uppercase text-cream-dim mb-3">Phone</div>
            <a href="tel:+910000000000" className="text-cream hover:text-gold transition-colors">+91 00000 00000</a>
          </div>
          <div className="border border-line p-8">
            <div className="text-[11px] tracking-[0.2em] uppercase text-cream-dim mb-3">Atelier</div>
            <span className="text-cream">Jaipur, India</span>
          </div>
        </div>
        <div className="text-center mt-12">
          <Link to="/shop" className="bg-gradient-to-br from-[#E8CC76] to-gold-mid text-noir text-[11px] tracking-[0.22em] uppercase px-9 py-4 hover:from-gold-light hover:to-gold transition-colors">Explore the collection</Link>
        </div>
      </section>
    </>
  );
}
