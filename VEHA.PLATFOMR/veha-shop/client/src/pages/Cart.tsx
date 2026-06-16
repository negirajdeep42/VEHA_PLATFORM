import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectCartItems, selectSubtotal, setQty, removeItem } from '../features/cart/cartSlice';
import { Render } from '../lib/renders';
import { formatINR } from '../lib/format';

const FREE_OVER = 999;

export default function Cart() {
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectSubtotal);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [rate, setRate] = useState(0);
  const [promoMsg, setPromoMsg] = useState('Have a code? Try VEHA10.');
  const [promoErr, setPromoErr] = useState(false);

  if (items.length === 0) {
    return (
      <div className="max-w-[1240px] mx-auto px-7 py-24 text-center">
        <h1 className="font-edi text-4xl text-cream mb-3">Your cart is empty</h1>
        <p className="text-cream-soft mb-7">The good stuff is waiting in the collection.</p>
        <Link to="/shop" className="inline-block bg-gradient-to-br from-[#E8CC76] to-gold-mid text-noir text-[11px] tracking-[0.22em] uppercase px-9 py-4">Browse jewellery</Link>
      </div>
    );
  }

  const discount = Math.round(subtotal * rate);
  const shipping = subtotal - discount >= FREE_OVER ? 0 : 49;
  const total = subtotal - discount + shipping;

  const applyPromo = (code: string) => {
    if (code.trim().toUpperCase() === 'VEHA10') { setRate(0.1); setPromoErr(false); setPromoMsg('Code VEHA10 applied \u2014 10% off.'); }
    else if (!code.trim()) { setPromoErr(true); setPromoMsg('Enter a promo code first.'); }
    else { setRate(0); setPromoErr(true); setPromoMsg('That code isn\u2019t valid.'); }
  };

  return (
    <div className="max-w-[1240px] mx-auto px-7 py-12">
      <h1 className="font-disp text-3xl md:text-4xl tracking-[0.08em] text-center mb-10 bg-gradient-to-b from-gold-light to-gold-dark bg-clip-text text-transparent">Shopping cart</h1>
      <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-start">
        <div className="border-t border-line">
          {items.map((it) => (
            <div key={it.id} className="grid grid-cols-[90px_1fr_auto] gap-5 py-7 border-b border-line items-center">
              <div className="aspect-square bg-[radial-gradient(circle_at_50%_40%,#241F14,#0C0B09)] border border-line p-2">
                <Render kind={it.kind} className="w-full h-full" />
              </div>
              <div>
                <div className="font-edi text-2xl text-cream leading-none">{it.name}</div>
                <div className="text-[11px] tracking-[0.12em] uppercase text-cream-dim mt-2 mb-4">{it.variant}</div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-line-strong">
                    <button onClick={() => dispatch(setQty({ id: it.id, qty: it.qty - 1 }))} className="w-9 h-9 text-cream hover:text-gold">&minus;</button>
                    <span className="w-9 text-center text-sm text-cream">{it.qty}</span>
                    <button onClick={() => dispatch(setQty({ id: it.id, qty: it.qty + 1 }))} className="w-9 h-9 text-cream hover:text-gold">+</button>
                  </div>
                  <button onClick={() => dispatch(removeItem(it.id))} className="text-[11px] tracking-[0.12em] uppercase text-cream-dim hover:text-gold">Remove</button>
                </div>
              </div>
              <div className="text-right">
                <div className="text-base text-gold">{formatINR(it.price * it.qty)}</div>
                <div className="text-[11px] text-cream-dim mt-1">{formatINR(it.price)} each</div>
              </div>
            </div>
          ))}
          <Link to="/shop" className="inline-block mt-7 text-[11px] tracking-[0.16em] uppercase text-gold-mid hover:text-gold-light">&larr; Continue shopping</Link>
        </div>

        <aside className="border border-line-strong bg-noir-2 p-8 lg:sticky lg:top-28">
          <h3 className="font-disp text-sm tracking-[0.14em] uppercase mb-6 text-cream">Order summary</h3>
          <div className="flex justify-between py-2.5 text-sm text-cream-soft"><span>Subtotal</span><span className="text-cream">{formatINR(subtotal)}</span></div>
          {discount > 0 && <div className="flex justify-between py-2.5 text-sm text-cream-soft"><span>Discount</span><span className="text-gold">&minus;{formatINR(discount)}</span></div>}
          <div className="flex justify-between py-2.5 text-sm text-cream-soft"><span>Shipping</span><span className={shipping === 0 ? 'text-gold uppercase text-xs tracking-wide' : 'text-cream'}>{shipping === 0 ? 'Free' : formatINR(shipping)}</span></div>

          <div className="flex gap-2 my-4 py-4 border-y border-line">
            <input id="promo" placeholder="Promo code" className="flex-1 bg-white/5 border border-line-strong text-cream text-xs uppercase tracking-wide px-3.5 outline-none focus:border-gold" />
            <button onClick={() => applyPromo((document.getElementById('promo') as HTMLInputElement).value)} className="border border-line-strong text-gold text-[11px] tracking-[0.12em] uppercase px-4 py-3 hover:border-gold hover:text-gold-light">Apply</button>
          </div>
          <p className={`text-[11.5px] mb-3 ${promoErr ? 'text-[#d98a6a]' : 'text-gold'}`}>{promoMsg}</p>

          <div className="flex justify-between items-baseline py-4 border-t border-line-strong mb-5">
            <span className="text-[13px] tracking-[0.14em] uppercase text-cream">Total</span>
            <span className="text-2xl font-medium text-gold">{formatINR(total)}</span>
          </div>
          <button onClick={() => navigate('/checkout')} className="w-full bg-gradient-to-br from-[#E8CC76] to-gold-mid text-noir text-[11px] tracking-[0.22em] uppercase py-4 hover:from-gold-light hover:to-gold transition-colors">Proceed to checkout</button>
        </aside>
      </div>
    </div>
  );
}
