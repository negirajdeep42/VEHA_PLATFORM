import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useGetProductQuery } from '../features/api/apiSlice';
import { Render } from '../lib/renders';
import { formatINR } from '../lib/format';
import { useAppDispatch } from '../app/hooks';
import { addItem } from '../features/cart/cartSlice';

const metals = ['22k Yellow Gold', '18k Rose Gold', '925 Silver'];
const sizes = ['10', '12', '14', '16', '18'];

export default function Product() {
  const { id = '' } = useParams();
  const { data: p, isLoading, isError } = useGetProductQuery(id);
  const dispatch = useAppDispatch();
  const [metal, setMetal] = useState(metals[0]);
  const [size, setSize] = useState(sizes[1]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (isLoading) return <p className="text-cream-soft py-24 text-center">Loading&hellip;</p>;
  if (isError || !p) return <p className="text-cream-soft py-24 text-center">Product not found. <Link to="/shop" className="text-gold">Back to shop</Link></p>;

  const off = p.compareAt ? Math.round(((p.compareAt - p.price) / p.compareAt) * 100) : 0;
  const isRing = p.category === 'rings';

  const add = () => {
    const variant = isRing ? `${metal} \u00B7 Size ${size}` : metal;
    dispatch(addItem({
      id: `${p.id}-${metal}-${isRing ? size : 'na'}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      productId: p.id, name: p.name, variant, price: p.price, qty, kind: p.kind,
    }));
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="max-w-[1240px] mx-auto px-7 py-10">
      <nav className="text-[11px] tracking-[0.14em] uppercase text-cream-dim mb-8">
        <Link to="/" className="hover:text-gold">Home</Link> <span className="text-gold-dark mx-2">/</span>
        <Link to="/shop" className="hover:text-gold">Shop</Link> <span className="text-gold-dark mx-2">/</span>
        <span className="text-gold-mid">{p.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-14 items-start">
        <div className="relative aspect-square bg-[radial-gradient(circle_at_50%_38%,#241F14,#0C0B09)] border border-line">
          <div className="absolute inset-5 border border-line-strong pointer-events-none" />
          <Render kind={p.kind} className="w-4/5 h-4/5 m-auto absolute inset-0" />
        </div>

        <div>
          <div className="text-[11px] tracking-[0.24em] uppercase text-gold-mid mb-3.5">{p.category} &middot; {p.metal}</div>
          <h1 className="font-edi text-4xl md:text-5xl text-cream mb-3.5">{p.name}</h1>
          <div className="flex items-baseline gap-3 flex-wrap pb-6 mb-7 border-b border-line">
            <span className="text-3xl font-medium text-gold">{formatINR(p.price)}</span>
            {p.compareAt && <span className="text-lg text-cream-dim line-through">{formatINR(p.compareAt)}</span>}
            {off > 0 && <span className="text-[11px] text-noir bg-gradient-to-br from-gold-light to-gold-mid px-2 py-1">{off}% off</span>}
          </div>

          <div className="mb-6">
            <div className="text-[11px] tracking-[0.2em] uppercase text-cream-soft mb-3">Metal</div>
            <div className="flex gap-2.5 flex-wrap">
              {metals.map((m) => (
                <button key={m} onClick={() => setMetal(m)}
                  className={`text-xs uppercase px-4 py-2.5 border transition-colors ${metal === m ? 'border-gold text-gold-light bg-noir-3' : 'border-line text-cream hover:border-line-strong'}`}>{m}</button>
              ))}
            </div>
          </div>

          {isRing && (
            <div className="mb-6">
              <div className="text-[11px] tracking-[0.2em] uppercase text-cream-soft mb-3">Ring size</div>
              <div className="flex gap-2.5 flex-wrap">
                {sizes.map((s) => (
                  <button key={s} onClick={() => setSize(s)}
                    className={`text-xs min-w-[48px] px-4 py-2.5 border transition-colors ${size === s ? 'border-gold text-gold-light bg-noir-3' : 'border-line text-cream hover:border-line-strong'}`}>{s}</button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 items-stretch mt-8">
            <div className="flex items-center border border-line-strong">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-11 text-cream hover:text-gold text-lg">&minus;</button>
              <span className="w-10 text-center text-cream">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="w-11 text-cream hover:text-gold text-lg">+</button>
            </div>
            <button onClick={add}
              className={`flex-1 text-[11px] font-medium tracking-[0.22em] uppercase transition-colors ${added ? 'bg-gradient-to-br from-gold-light to-gold text-noir' : 'bg-gradient-to-br from-[#E8CC76] to-gold-mid text-noir hover:from-gold-light hover:to-gold'}`}>
              {added ? 'Added \u2713' : 'Add to cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
