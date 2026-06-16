import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../app/hooks';
import { selectCartCount } from '../features/cart/cartSlice';
import { selectWishlistItems } from '../features/wishlist/wishlistSlice';
import { SearchOverlay, WishlistDrawer, AccountDrawer, MobileMenu } from './Drawers';

const navLink = 'text-[11.5px] tracking-[0.18em] uppercase text-cream hover:text-gold transition-colors';
const ANNOUNCE = [
  'BIS-hallmarked gold & 925 silver',
  'Complimentary shipping over \u20B9999',
  '30-day easy returns',
  'Lifetime polish & care',
];

function Announce() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % ANNOUNCE.length), 3200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-[#070707] border-b border-line h-10 flex items-center justify-center overflow-hidden">
      <span className="text-[10.5px] tracking-[0.26em] uppercase text-gold-mid">{ANNOUNCE[i]}</span>
    </div>
  );
}

export default function Header() {
  const count = useAppSelector(selectCartCount);
  const wishlistItems = useAppSelector(selectWishlistItems);
  const wishlistCount = wishlistItems.length;

  const [searchOpen, setSearchOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <Announce />
      <header className="sticky top-0 z-50 bg-noir/80 backdrop-blur border-b border-line">
        <div className="max-w-[1240px] mx-auto px-7 h-[88px] flex items-center justify-between">
          <Link to="/" className="flex flex-col items-center leading-none" aria-label="Veha home">
            <svg viewBox="0 0 100 56" className="w-[30px] h-[18px] mb-[3px]" aria-hidden>
              <path d="M16 46 L13 21 L32 34 L50 12 L68 34 L87 21 L84 46 Z" fill="url(#gd)" />
              <rect x="15" y="45" width="70" height="8" rx="1" fill="url(#gd)" />
            </svg>
            <span className="font-disp text-2xl font-semibold tracking-[0.22em] pl-[0.22em] bg-gradient-to-b from-gold-light to-gold-dark bg-clip-text text-transparent">VEHA</span>
            <span className="text-[8px] tracking-[0.5em] uppercase text-gold-dark mt-[3px] pl-[0.5em]">Jewelry</span>
          </Link>

          <nav className="hidden lg:flex gap-9">
            <Link to="/shop" className={navLink}>Shop</Link>
            <Link to="/collections" className={navLink}>Collections</Link>
            <Link to="/house" className={navLink}>The House</Link>
            <Link to="/house#contact" className={navLink}>Contact</Link>
          </nav>

          <div className="flex items-center gap-5">
            <button onClick={() => setSearchOpen(true)} className="hidden sm:flex text-cream hover:text-gold transition-colors" aria-label="Search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            </button>
            <button onClick={() => setAccountOpen(true)} className="hidden sm:flex text-cream hover:text-gold transition-colors" aria-label="Account">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></svg>
            </button>
            <button onClick={() => setWishlistOpen(true)} className="hidden sm:flex relative text-cream hover:text-gold transition-colors" aria-label="Wishlist">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5"><path d="M12 20s-7-4.4-9.3-9C1 7.7 3 4.5 6.2 4.5c2 0 3.3 1.2 4.1 2.4l1.7 2 1.7-2c.8-1.2 2.1-2.4 4.1-2.4 3.2 0 5.2 3.2 3.5 6.5C19 15.6 12 20 12 20Z" /></svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-3.5 px-0.5 rounded-full bg-gradient-to-br from-gold-light to-gold-mid text-noir text-[8px] font-semibold flex items-center justify-center">{wishlistCount}</span>
              )}
            </button>
            <Link to="/cart" className="relative text-cream hover:text-gold transition-colors" aria-label="Cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                <path d="M6 8h12l-1.2 11.2A2 2 0 0 1 14.8 21H9.2A2 2 0 0 1 7.2 19.2L6 8Z" />
                <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
              </svg>
              <span className="absolute -top-2 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-gradient-to-br from-gold-light to-gold-mid text-noir text-[9px] font-semibold flex items-center justify-center">{count}</span>
            </Link>
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-cream hover:text-gold transition-colors" aria-label="Menu">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Overlays / Drawers */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <WishlistDrawer isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />
      <AccountDrawer isOpen={accountOpen} onClose={() => setAccountOpen(false)} />
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenAccount={() => setAccountOpen(true)}
      />
    </>
  );
}
