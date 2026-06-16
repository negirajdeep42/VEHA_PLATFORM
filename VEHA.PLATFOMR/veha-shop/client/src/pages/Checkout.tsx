import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectCartItems, selectSubtotal, clearCart } from '../features/cart/cartSlice';
import { useCreateOrderMutation } from '../features/api/apiSlice';
import { Render } from '../lib/renders';
import { formatINR } from '../lib/format';

const FREE_OVER = 999;
const REQUIRED = ['name', 'email', 'phone', 'address', 'city', 'state', 'pincode'] as const;
type Field = (typeof REQUIRED)[number];

export default function Checkout() {
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectSubtotal);
  const dispatch = useAppDispatch();
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const [form, setForm] = useState<Record<Field, string>>({ name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '' });
  const [errors, setErrors] = useState<Partial<Record<Field, boolean>>>({});
  const [payment, setPayment] = useState<'upi' | 'card' | 'cod'>('upi');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [apiError, setApiError] = useState('');

  const shipping = subtotal >= FREE_OVER ? 0 : 49;
  const total = subtotal + shipping;
  const set = (f: Field, v: string) => { setForm((s) => ({ ...s, [f]: v })); setErrors((e) => ({ ...e, [f]: false })); };

  const placeOrder = async () => {
    const errs: Partial<Record<Field, boolean>> = {};
    REQUIRED.forEach((f) => { if (!form[f].trim()) errs[f] = true; });
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setApiError('');
    try {
      // Send only product id + variant + qty. The server prices it.
      const result = await createOrder({
        customer: form,
        paymentMethod: payment,
        items: items.map((i) => ({ productId: i.productId, variant: i.variant, qty: i.qty })),
      }).unwrap();
      setOrderId(result.id);
      dispatch(clearCart());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: any) {
      setApiError(e?.data?.error ?? 'Could not place the order. Is the API running?');
    }
  };

  if (orderId) {
    return (
      <div className="max-w-[540px] mx-auto px-7 py-20 text-center">
        <div className="w-20 h-20 mx-auto mb-6 border border-line-strong rounded-full flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-9 h-9 text-gold"><path d="M5 13l4 4 10-11" /></svg>
        </div>
        <h2 className="font-edi text-4xl text-cream mb-3">Thank you</h2>
        <p className="text-cream-soft mb-5">Your order is confirmed. We hand-finish and dispatch within 24 hours.</p>
        <div className="inline-block font-disp tracking-[0.18em] text-gold border border-line-strong px-6 py-3 mb-7">{orderId}</div>
        <div><Link to="/shop" className="inline-block bg-gradient-to-br from-[#E8CC76] to-gold-mid text-noir text-[11px] tracking-[0.22em] uppercase px-9 py-4">Continue shopping</Link></div>
      </div>
    );
  }

  if (items.length === 0) {
    return <div className="max-w-[1240px] mx-auto px-7 py-24 text-center text-cream-soft">Your cart is empty. <Link to="/shop" className="text-gold">Browse jewellery</Link>.</div>;
  }

  const inputCls = (f: Field) => `w-full bg-white/5 border text-cream text-sm px-4 py-3 outline-none focus:border-gold ${errors[f] ? 'border-[#d98a6a]' : 'border-line-strong'}`;

  return (
    <div className="max-w-[1240px] mx-auto px-7 py-12">
      <h1 className="font-disp text-3xl md:text-4xl tracking-[0.08em] text-center mb-10 bg-gradient-to-b from-gold-light to-gold-dark bg-clip-text text-transparent">Checkout</h1>
      <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">
        <div>
          <h2 className="font-edi text-2xl text-cream mb-5">Contact &amp; shipping</h2>
          <div className="grid gap-4">
            <input className={inputCls('name')} placeholder="Full name" value={form.name} onChange={(e) => set('name', e.target.value)} />
            <div className="grid sm:grid-cols-2 gap-4">
              <input className={inputCls('email')} placeholder="Email" value={form.email} onChange={(e) => set('email', e.target.value)} />
              <input className={inputCls('phone')} placeholder="Phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            </div>
            <input className={inputCls('address')} placeholder="Address" value={form.address} onChange={(e) => set('address', e.target.value)} />
            <div className="grid sm:grid-cols-2 gap-4">
              <input className={inputCls('city')} placeholder="City" value={form.city} onChange={(e) => set('city', e.target.value)} />
              <input className={inputCls('state')} placeholder="State" value={form.state} onChange={(e) => set('state', e.target.value)} />
            </div>
            <input className={`${inputCls('pincode')} sm:w-1/2`} placeholder="Pincode" value={form.pincode} onChange={(e) => set('pincode', e.target.value)} />
          </div>

          <h2 className="font-edi text-2xl text-cream mt-9 mb-5">Payment</h2>
          <div className="grid gap-3">
            {([['upi', 'UPI', 'Pay by any UPI app'], ['card', 'Card', 'Credit or debit card'], ['cod', 'Cash on delivery', 'Pay when it arrives']] as const).map(([key, t, d]) => (
              <button key={key} onClick={() => setPayment(key)} className={`flex items-center gap-3.5 border px-4 py-4 text-left transition-colors ${payment === key ? 'border-gold bg-noir-3' : 'border-line-strong hover:border-gold-mid'}`}>
                <span className={`w-[18px] h-[18px] rounded-full border flex-shrink-0 ${payment === key ? 'border-gold' : 'border-line-strong'} relative`}>
                  {payment === key && <span className="absolute inset-1 rounded-full bg-gradient-to-br from-gold-light to-gold-mid" />}
                </span>
                <span className="flex-1"><span className="block text-sm text-cream">{t}</span><span className="block text-[11.5px] text-cream-dim">{d}</span></span>
              </button>
            ))}
          </div>
        </div>

        <aside className="border border-line-strong bg-noir-2 p-7 lg:sticky lg:top-28">
          <h3 className="font-disp text-sm tracking-[0.14em] uppercase mb-5 text-cream">Your order</h3>
          {items.map((it) => (
            <div key={it.id} className="flex items-center gap-3.5 py-3 border-b border-line">
              <div className="relative w-[52px] h-[52px] flex-shrink-0 bg-[radial-gradient(circle_at_50%_40%,#241F14,#0C0B09)] border border-line p-1.5">
                <Render kind={it.kind} className="w-full h-full" />
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-noir-4 border border-line-strong text-gold text-[10px] flex items-center justify-center">{it.qty}</span>
              </div>
              <div className="flex-1 min-w-0"><div className="font-edi text-base text-cream leading-tight">{it.name}</div><div className="text-[10.5px] uppercase tracking-wide text-cream-dim mt-0.5">{it.variant}</div></div>
              <div className="text-sm text-gold whitespace-nowrap">{formatINR(it.price * it.qty)}</div>
            </div>
          ))}
          <div className="flex justify-between py-2.5 text-sm text-cream-soft mt-2"><span>Subtotal</span><span className="text-cream">{formatINR(subtotal)}</span></div>
          <div className="flex justify-between py-2.5 text-sm text-cream-soft"><span>Shipping</span><span className={shipping === 0 ? 'text-gold uppercase text-xs' : 'text-cream'}>{shipping === 0 ? 'Free' : formatINR(shipping)}</span></div>
          <div className="flex justify-between items-baseline py-4 border-t border-line-strong mb-5"><span className="text-[13px] tracking-[0.14em] uppercase text-cream">Total</span><span className="text-2xl font-medium text-gold">{formatINR(total)}</span></div>
          {apiError && <p className="text-[#d98a6a] text-xs mb-3">{apiError}</p>}
          <button onClick={placeOrder} disabled={isLoading} className="w-full bg-gradient-to-br from-[#E8CC76] to-gold-mid text-noir text-[11px] tracking-[0.22em] uppercase py-4 hover:from-gold-light hover:to-gold transition-colors disabled:opacity-50">
            {isLoading ? 'Placing\u2026' : 'Place order'}
          </button>
          <p className="text-[11px] text-cream-dim text-center mt-3.5 leading-relaxed">Demo checkout &mdash; no real payment is taken.<br />Server re-prices every item before saving.</p>
        </aside>
      </div>
    </div>
  );
}
