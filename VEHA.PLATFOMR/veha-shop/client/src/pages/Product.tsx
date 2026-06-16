import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useGetProductQuery } from '../features/api/apiSlice';
import { Render } from '../lib/renders';
import { formatINR } from '../lib/format';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addItem } from '../features/cart/cartSlice';
import { toggleWishlist, selectIsWishlisted } from '../features/wishlist/wishlistSlice';

const metals = ['22k Yellow Gold', '18k Rose Gold', '925 Silver'];
const sizes = ['10', '12', '14', '16', '18'];

export default function Product() {
  const { id = '' } = useParams();
  const { data: p, isLoading, isError } = useGetProductQuery(id);
  const dispatch = useAppDispatch();
  const isWishlisted = useAppSelector(selectIsWishlisted(id));
  const [metal, setMetal] = useState(metals[0]);
  const [size, setSize] = useState(sizes[1]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  // Gallery view angle state
  const [activeView, setActiveView] = useState<'standard' | 'zoom' | 'angle'>('standard');

  // Accordion tabs state
  const [activeTab, setActiveTab] = useState<'story' | 'specs' | 'shipping'>('story');

  // Local reviews state
  const [reviews, setReviews] = useState([
    { id: 1, name: 'Aditi Sharma', rating: 5, date: '2026-05-12', text: 'Stunning piece! The yellow gold polish is incredibly rich, and it fits perfectly. Worn it every day for weeks and it remains brilliantly shining.' },
    { id: 2, name: 'Vikram Mehta', rating: 4, date: '2026-06-02', text: 'Beautiful craftsmanship. Bought this for my wife, and she loves the delicate Jaipur artisan style. Highly recommended.' }
  ]);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, text: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);

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

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.text.trim()) return;
    setReviews(prev => [
      ...prev,
      {
        id: Date.now(),
        name: newReview.name,
        rating: newReview.rating,
        date: new Date().toISOString().split('T')[0],
        text: newReview.text
      }
    ]);
    setNewReview({ name: '', rating: 5, text: '' });
    setShowReviewForm(false);
  };

  const getSpecs = () => {
    switch (p.kind) {
      case 'ring': return ['Comfort-fit band (width: 1.8mm)', 'Assayed 18k gold purity certified', 'Conflict-free round diamond (0.15ct)', 'Origin: Jaipur, India'];
      case 'cuff': return ['Adjustable diameter (default: 60mm)', 'Assayed 22k gold hallmarked purity', 'Brilliant-cut accent diamond', 'Origin: Jaipur, India'];
      case 'earrings': return ['Length: 22mm; Drop drop width: 12mm', 'Assayed 18k gold purity stamp', 'Jaipur-cut pear drop gemstone inlay', 'Origin: Jaipur, India'];
      case 'hoops': return ['Hoop diameter: 34mm; Thickness: 3.5mm', 'BIS-hallmarked 925 sterling silver', 'Hand-polished friction backing post', 'Origin: Jaipur, India'];
      case 'necklace': return ['Chain length: 18 inches with loops', 'Delicate cable chain with spring clasp', 'Accented details gemstone setting', 'Origin: Jaipur, India'];
      case 'tennis': return ['Double clasp secure closure system', 'BIS-hallmarked 925 sterling silver structure', 'Accented bezel-set round diamond accents', 'Origin: Jaipur, India'];
      default: return ['BIS hallmarked certified purity', 'Individually quality checked', 'Hand-finished by Jaipur artisans', 'Origin: Jaipur, India'];
    }
  };

  const averageRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="max-w-[1240px] mx-auto px-7 py-10">
      <nav className="text-[11px] tracking-[0.14em] uppercase text-cream-dim mb-8">
        <Link to="/" className="hover:text-gold">Home</Link> <span className="text-gold-dark mx-2">/</span>
        <Link to="/shop" className="hover:text-gold">Shop</Link> <span className="text-gold-dark mx-2">/</span>
        <span className="text-gold-mid">{p.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-14 items-start mb-16">
        {/* Interactive Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-[radial-gradient(circle_at_50%_38%,#241F14,#0C0B09)] border border-line overflow-hidden">
            <div className="absolute inset-5 border border-line-strong pointer-events-none z-10" />
            <div className={`w-full h-full relative transition-transform duration-500 flex items-center justify-center ${
              activeView === 'zoom' ? 'scale-[1.6] translate-y-[-10%]' : activeView === 'angle' ? 'scale-[1.1] rotate-[15deg]' : 'scale-100'
            }`}>
              <Render kind={p.kind} className="w-4/5 h-4/5" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {([['standard', 'Standard View'], ['zoom', 'Close Detail'], ['angle', 'Artistic Angle']] as const).map(([v, label]) => (
              <button
                key={v}
                onClick={() => setActiveView(v)}
                className={`border text-[10px] tracking-[0.12em] uppercase py-2.5 transition-colors ${
                  activeView === v ? 'border-gold text-gold bg-noir-3' : 'border-line-strong text-cream-soft hover:border-line hover:text-cream'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div>
          <div className="text-[11px] tracking-[0.24em] uppercase text-gold-mid mb-3.5">{p.category} &middot; {p.metal}</div>
          <h1 className="font-edi text-4xl md:text-5xl text-cream mb-3.5">{p.name}</h1>
          <div className="flex items-center gap-3.5 mb-7">
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

          <div className="flex gap-3 items-stretch mt-8 mb-12">
            <div className="flex items-center border border-line-strong">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-11 text-cream hover:text-gold text-lg">&minus;</button>
              <span className="w-10 text-center text-cream">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="w-11 text-cream hover:text-gold text-lg">+</button>
            </div>
            <button onClick={add}
              className={`flex-1 text-[11px] font-medium tracking-[0.22em] uppercase transition-colors ${added ? 'bg-gradient-to-br from-gold-light to-gold text-noir' : 'bg-gradient-to-br from-[#E8CC76] to-gold-mid text-noir hover:from-gold-light hover:to-gold'}`}>
              {added ? 'Added \u2713' : 'Add to cart'}
            </button>
            <button onClick={() => dispatch(toggleWishlist(p))}
              className={`px-4.5 border flex items-center justify-center transition-colors w-14 ${isWishlisted ? 'border-gold text-gold bg-noir-3' : 'border-line-strong text-cream hover:border-gold hover:text-gold'}`}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <svg viewBox="0 0 24 24" fill={isWishlisted ? "url(#gold-h)" : "none"} stroke={isWishlisted ? "none" : "currentColor"} strokeWidth="1.6" className="w-5 h-5">
                <path d="M12 20s-7-4.4-9.3-9C1 7.7 3 4.5 6.2 4.5c2 0 3.3 1.2 4.1 2.4l1.7 2 1.7-2c.8-1.2 2.1-2.4 4.1-2.4 3.2 0 5.2 3.2 3.5 6.5C19 15.6 12 20 12 20Z" />
              </svg>
            </button>
          </div>

          {/* Details & Specs Accordion */}
          <div className="border border-line-strong divide-y divide-line-strong bg-noir-2">
            {([['story', 'Artisan Story'], ['specs', 'Specifications'], ['shipping', 'Shipping & Returns']] as const).map(([tab, label]) => (
              <div key={tab} className="p-4">
                <button
                  onClick={() => setActiveTab(tab)}
                  className="w-full flex justify-between items-center text-xs tracking-[0.14em] uppercase text-cream hover:text-gold text-left font-medium"
                >
                  <span>{label}</span>
                  <span>{activeTab === tab ? '\u2212' : '+'}</span>
                </button>
                {activeTab === tab && (
                  <div className="mt-3.5 text-xs text-cream-soft leading-relaxed animate-fade-in pl-1">
                    {tab === 'story' && (
                      <p>Veha jewelry represents a dialogue between modern minimalist design and the rich goldsmithing traditions of Rajasthan. Every accent gem is carefully selected, and each metal band is polished entirely by hand in our Jaipur atelier to preserve durability and structural integrity for generations.</p>
                    )}
                    {tab === 'specs' && (
                      <ul className="list-disc list-inside space-y-1">
                        {getSpecs().map((spec, index) => <li key={index}>{spec}</li>)}
                      </ul>
                    )}
                    {tab === 'shipping' && (
                      <p>Enjoy complimentary insured shipping on orders above ₹999. In-stock products are packaged and dispatched within 24 hours. We provide easy, prepaid return pickups within 30 days for size or metal exchanges.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ratings & Reviews Section */}
      <section className="border-t border-line pt-12">
        <h2 className="font-disp text-2xl tracking-[0.08em] bg-gradient-to-b from-gold-light to-gold-dark bg-clip-text text-transparent mb-8">Reviews &amp; Ratings</h2>
        <div className="grid md:grid-cols-[240px_1fr] gap-12 items-start">
          
          {/* Average Rating Block */}
          <div className="bg-noir-2 border border-line-strong p-6 text-center">
            <div className="text-5xl font-semibold text-gold mb-2">{averageRating}</div>
            <div className="flex justify-center gap-1 mb-2 text-gold">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-lg">{i < Math.round(Number(averageRating)) ? '\u2605' : '\u2606'}</span>
              ))}
            </div>
            <p className="text-xs text-cream-soft">Based on {reviews.length} reviews</p>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="mt-6 w-full border border-line-strong hover:border-gold hover:text-gold text-cream-soft text-[10px] tracking-[0.16em] uppercase py-2.5 transition-colors"
            >
              Write a Review
            </button>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="bg-noir-3 border border-line p-5 space-y-4 mb-6">
                <h4 className="font-disp text-xs tracking-wider uppercase text-gold">Share your experience</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase text-cream-dim mb-1">Your Name</label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-line-strong text-cream text-xs px-3.5 py-2.5 outline-none focus:border-gold"
                      placeholder="Aditi Verma"
                      value={newReview.name}
                      onChange={(e) => setNewReview(r => ({ ...r, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-cream-dim mb-1">Rating</label>
                    <select
                      className="w-full bg-noir-2 border border-line-strong text-cream text-xs px-3.5 py-2.5 outline-none focus:border-gold"
                      value={newReview.rating}
                      onChange={(e) => setNewReview(r => ({ ...r, rating: Number(e.target.value) }))}
                    >
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-cream-dim mb-1">Review</label>
                  <textarea
                    rows={4}
                    className="w-full bg-white/5 border border-line-strong text-cream text-xs px-3.5 py-2.5 outline-none focus:border-gold"
                    placeholder="Write your review comments here..."
                    value={newReview.text}
                    onChange={(e) => setNewReview(r => ({ ...r, text: e.target.value }))}
                    required
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowReviewForm(false)} className="text-xs text-cream-dim hover:text-cream uppercase tracking-wider px-4">Cancel</button>
                  <button type="submit" className="bg-gradient-to-br from-[#E8CC76] to-gold-mid text-noir text-[10px] tracking-[0.16em] uppercase px-5 py-2.5">Submit Review</button>
                </div>
              </form>
            )}

            <div className="divide-y divide-line/30">
              {reviews.map((rev) => (
                <div key={rev.id} className="py-5 first:pt-0">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-medium text-cream text-sm">{rev.name}</span>
                      <div className="flex gap-0.5 text-gold text-xs mt-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < rev.rating ? '\u2605' : '\u2606'}</span>
                        ))}
                      </div>
                    </div>
                    <span className="text-cream-dim text-[10px]">{rev.date}</span>
                  </div>
                  <p className="text-xs text-cream-soft leading-relaxed mt-2.5">{rev.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
