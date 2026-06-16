import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { Render } from '../lib/renders';
import { formatINR } from '../lib/format';
import { useAppDispatch } from '../app/hooks';
import { addItem } from '../features/cart/cartSlice';
import { useState } from 'react';

export default function ProductCard({ p }: { p: Product }) {
  const dispatch = useAppDispatch();
  const [added, setAdded] = useState(false);
  const off = p.compareAt ? Math.round(((p.compareAt - p.price) / p.compareAt) * 100) : 0;

  const add = () => {
    dispatch(addItem({
      id: p.id, productId: p.id, name: p.name,
      variant: `${p.metal} \u00B7 ${p.category}`, price: p.price, qty: 1, kind: p.kind,
    }));
    setAdded(true);
    setTimeout(() => setAdded(false), 1300);
  };

  return (
    <div className="bg-noir-2 border border-line hover:border-line-strong transition-colors group">
      <Link to={`/product/${p.id}`} className="block relative aspect-square bg-[radial-gradient(circle_at_50%_40%,#241F14,#0C0B09)] overflow-hidden">
        {p.badge && (
          <span className="absolute top-3 left-3 z-10 bg-gradient-to-br from-gold-light to-gold-mid text-noir text-[9.5px] tracking-[0.16em] uppercase px-2.5 py-1 font-medium">{p.badge}</span>
        )}
        <Render kind={p.kind} className="w-full h-full transition-transform duration-500 group-hover:scale-105" />
      </Link>
      <div className="p-5">
        <Link to={`/product/${p.id}`} className="font-edi text-2xl text-cream leading-tight">{p.name}</Link>
        <div className="text-[10px] tracking-[0.16em] uppercase text-cream-dim mt-1.5 mb-3">{p.category} &middot; {p.metal}</div>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-base font-medium text-gold">{formatINR(p.price)}</span>
          {p.compareAt && <span className="text-[13px] text-cream-dim line-through">{formatINR(p.compareAt)}</span>}
          {off > 0 && <span className="text-[10px] text-gold-mid">{off}% off</span>}
        </div>
        <button
          onClick={add}
          className={`mt-4 w-full border text-[10px] font-medium tracking-[0.2em] uppercase py-2.5 transition-colors ${
            added ? 'bg-gradient-to-br from-gold-light to-gold-mid text-noir border-gold' : 'border-line-strong text-gold hover:border-gold hover:text-gold-light'
          }`}
        >
          {added ? 'Added \u2713' : 'Add to bag'}
        </button>
      </div>
    </div>
  );
}
