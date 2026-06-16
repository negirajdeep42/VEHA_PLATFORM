import { Link } from 'react-router-dom';

const col = 'block text-[13px] text-cream-soft hover:text-gold transition-colors mb-3';
const head = 'text-[10.5px] tracking-[0.2em] uppercase text-gold mb-5 font-medium';

export default function Footer() {
  return (
    <footer className="border-t border-line mt-20">
      <div className="max-w-[1240px] mx-auto px-7 pt-16 pb-10">
        <div className="grid md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10 pb-12 border-b border-line">
          <div>
            <Link to="/" className="font-disp text-2xl tracking-[0.2em] bg-gradient-to-b from-gold-light to-gold-dark bg-clip-text text-transparent">VEHA</Link>
            <p className="text-[13px] text-cream-soft leading-relaxed max-w-[290px] mt-5">
              Hallmarked gold and sterling silver jewellery, finished by hand and made to be lived in.
            </p>
          </div>
          <div>
            <h5 className={head}>Shop</h5>
            <Link to="/shop?category=rings" className={col}>Rings</Link>
            <Link to="/shop?category=earrings" className={col}>Earrings</Link>
            <Link to="/shop?category=necklaces" className={col}>Necklaces</Link>
            <Link to="/shop?category=bracelets" className={col}>Bracelets</Link>
            <Link to="/shop" className={col}>Shop all</Link>
          </div>
          <div>
            <h5 className={head}>Explore</h5>
            <Link to="/collections" className={col}>Collections</Link>
            <Link to="/house" className={col}>The House</Link>
            <Link to="/house#contact" className={col}>Contact</Link>
            <Link to="/cart" className={col}>Cart</Link>
          </div>
          <div>
            <h5 className={head}>Service</h5>
            <Link to="/house" className={col}>Shipping</Link>
            <Link to="/house" className={col}>Returns</Link>
            <Link to="/house" className={col}>Jewellery care</Link>
            <Link to="/admin" className={col}>Admin Dashboard</Link>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-7">
          <small className="text-cream-dim text-xs">&copy; 2026 Veha Jewelry. Hallmarked &amp; hand-finished.</small>
          <div className="flex gap-2">
            {['UPI', 'Visa', 'Mastercard', 'COD'].map((p) => (
              <span key={p} className="text-[9.5px] tracking-[0.12em] uppercase text-cream-dim border border-line px-2.5 py-1.5">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
