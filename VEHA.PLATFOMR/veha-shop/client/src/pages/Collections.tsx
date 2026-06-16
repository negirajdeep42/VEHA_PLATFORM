import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '../features/api/apiSlice';
import { Render } from '../lib/renders';
import ProductCard from '../components/ProductCard';
import type { Kind } from '../types';

const EDITS: { title: string; blurb: string; kind: Kind; to: string }[] = [
  { title: 'The Royal Edit', blurb: 'Statement gold with brilliant-cut stones \u2014 for the moments that ask for a little more.', kind: 'necklace', to: '/shop?category=necklaces' },
  { title: 'Everyday Essentials', blurb: 'Light, comfort-fit pieces you can wear from morning coffee to midnight, and never take off.', kind: 'ring', to: '/shop?category=rings' },
  { title: 'The Silver Line', blurb: 'Cool-toned 925 sterling silver \u2014 quiet, modern, and endlessly easy to layer.', kind: 'hoops', to: '/shop?category=earrings' },
];

const CATS = [
  { label: 'Rings', kind: 'ring' as Kind, to: '/shop?category=rings' },
  { label: 'Earrings', kind: 'earrings' as Kind, to: '/shop?category=earrings' },
  { label: 'Necklaces', kind: 'necklace' as Kind, to: '/shop?category=necklaces' },
  { label: 'Bracelets', kind: 'cuff' as Kind, to: '/shop?category=bracelets' },
];

export default function Collections() {
  const { data: products } = useGetProductsQuery({ sort: 'off' });
  const featured = products?.slice(0, 4) ?? [];

  return (
    <>
      <header className="text-center py-16 px-7 bg-[radial-gradient(ellipse_70%_100%_at_50%_0%,#1A140C,#0B0B0C_72%)] border-b border-line">
        <p className="text-[11px] tracking-[0.34em] uppercase text-gold-mid mb-3">Curated by Veha</p>
        <h1 className="font-disp text-4xl md:text-6xl tracking-[0.08em] bg-gradient-to-b from-gold-light to-gold-dark bg-clip-text text-transparent">Collections</h1>
        <p className="text-cream-soft max-w-[520px] mx-auto mt-4">Edits put together by hand, for the way you actually wear jewellery.</p>
      </header>

      {/* feature rows */}
      <div className="max-w-[1240px] mx-auto px-7 py-16 space-y-16">
        {EDITS.map((e, i) => (
          <div key={e.title} className={`grid md:grid-cols-2 gap-10 items-center ${i % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}>
            <div className="relative aspect-[4/3] bg-[radial-gradient(circle_at_50%_40%,#241F14,#0C0B09)] border border-line">
              <div className="absolute inset-5 border border-line-strong pointer-events-none" />
              <Render kind={e.kind} className="w-3/5 h-3/5 m-auto absolute inset-0" />
            </div>
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-gold-mid mb-4">Edit {String(i + 1).padStart(2, '0')}</p>
              <h2 className="font-edi text-4xl md:text-5xl text-cream mb-4">{e.title}</h2>
              <p className="text-cream-soft leading-relaxed max-w-[440px] mb-7">{e.blurb}</p>
              <Link to={e.to} className="border border-line-strong text-gold text-[11px] tracking-[0.22em] uppercase px-8 py-3.5 hover:border-gold hover:text-gold-light transition-colors">Explore the edit</Link>
            </div>
          </div>
        ))}
      </div>

      {/* shop by category */}
      <section className="max-w-[1240px] mx-auto px-7 pb-16">
        <div className="text-center mb-10">
          <p className="text-[11px] tracking-[0.34em] uppercase text-gold-mid mb-3">Browse</p>
          <h2 className="font-disp text-3xl md:text-4xl tracking-[0.08em] bg-gradient-to-b from-gold-light to-gold-dark bg-clip-text text-transparent">Shop by category</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATS.map((c) => (
            <Link key={c.label} to={c.to} className="border border-line hover:border-gold-mid transition-colors group">
              <div className="aspect-square bg-[radial-gradient(circle_at_50%_40%,#241F14,#0C0B09)] overflow-hidden">
                <Render kind={c.kind} className="w-full h-full transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="text-center py-4">
                <span className="font-edi text-xl text-cream group-hover:text-gold-light transition-colors">{c.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* featured products from the API */}
      <section className="max-w-[1240px] mx-auto px-7 pb-20">
        <div className="text-center mb-10">
          <p className="text-[11px] tracking-[0.34em] uppercase text-gold-mid mb-3">Best value right now</p>
          <h2 className="font-disp text-3xl md:text-4xl tracking-[0.08em] bg-gradient-to-b from-gold-light to-gold-dark bg-clip-text text-transparent">Most-loved pieces</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>
    </>
  );
}
