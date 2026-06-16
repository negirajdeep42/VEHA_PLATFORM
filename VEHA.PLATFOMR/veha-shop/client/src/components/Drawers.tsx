import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectWishlistItems, removeWishlist, clearWishlist } from '../features/wishlist/wishlistSlice';
import { addItem } from '../features/cart/cartSlice';
import { selectCurrentUser, selectIsAuthenticated, login } from '../features/auth/authSlice';
import { Render } from '../lib/renders';
import { formatINR } from '../lib/format';
import { useGetUserOrdersQuery, useUpdateProfileMutation } from '../features/api/apiSlice';
import { SignInButton, SignUpButton, useClerk } from '@clerk/clerk-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: DrawerProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-noir/95 backdrop-blur-md flex items-center justify-center p-7 transition-all duration-300">
      <button onClick={onClose} className="absolute top-7 right-7 text-cream-soft hover:text-gold text-sm tracking-[0.2em] uppercase flex items-center gap-2">
        <span>Close</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M18 6 6 18M6 6l12 12" /></svg>
      </button>
      <form onSubmit={handleSearch} className="w-full max-w-[720px] text-center">
        <label htmlFor="search-input" className="block text-[11px] tracking-[0.34em] uppercase text-gold-mid mb-6">What are you looking for?</label>
        <div className="relative border-b border-line-strong focus-within:border-gold pb-3 flex items-center">
          <input
            id="search-input"
            type="text"
            placeholder="Search rings, necklaces, cuffs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-cream placeholder-cream-dim text-xl md:text-3xl font-edi outline-none pr-12 text-center"
            autoFocus
          />
          <button type="submit" className="absolute right-0 text-cream hover:text-gold transition-colors" aria-label="Submit search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          </button>
        </div>
        <p className="text-xs text-cream-soft/60 mt-4 italic">Press Enter to search the collection</p>
      </form>
    </div>
  );
}

export function WishlistDrawer({ isOpen, onClose }: DrawerProps) {
  const items = useAppSelector(selectWishlistItems);
  const dispatch = useAppDispatch();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* drawer */}
      <aside className="relative w-full max-w-[440px] h-full bg-noir-2 border-l border-line-strong flex flex-col z-10 shadow-2xl animate-slide-in">
        <header className="px-6 py-6 border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-disp text-sm tracking-[0.14em] uppercase text-cream">Your Wishlist ({items.length})</h3>
            {items.length > 0 && (
              <button
                onClick={() => dispatch(clearWishlist())}
                className="text-[9px] tracking-widest uppercase text-cream-dim hover:text-[#d98a6a] border border-line-strong px-2 py-0.5 hover:border-[#d98a6a]/60 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
          <button onClick={onClose} className="text-cream-soft hover:text-gold">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-20 text-cream-soft">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-12 h-12 mx-auto mb-4 text-cream-dim"><path d="M12 20s-7-4.4-9.3-9C1 7.7 3 4.5 6.2 4.5c2 0 3.3 1.2 4.1 2.4l1.7 2 1.7-2c.8-1.2 2.1-2.4 4.1-2.4 3.2 0 5.2 3.2 3.5 6.5C19 15.6 12 20 12 20Z" /></svg>
              <p className="text-sm font-edi italic">No items wishlisted yet.</p>
              <p className="text-xs text-cream-dim mt-2">Explore the shop and tap the heart icon on your favorite pieces.</p>
            </div>
          ) : (
            items.map((it) => (
              <div key={it.id} className="grid grid-cols-[72px_1fr_auto] gap-4 py-4 border-b border-line items-center">
                <div className="aspect-square bg-[radial-gradient(circle_at_50%_40%,#241F14,#0C0B09)] border border-line p-1">
                  <Render kind={it.kind} className="w-full h-full" />
                </div>
                <div>
                  <h4 className="font-edi text-lg text-cream leading-tight">{it.name}</h4>
                  <div className="text-[10px] tracking-[0.12em] uppercase text-cream-dim mt-1">{it.metal} &middot; {it.category}</div>
                  <div className="text-sm text-gold mt-1">{formatINR(it.price)}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      dispatch(addItem({
                        id: `${it.id}-${it.metal}-na`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                        productId: it.id, name: it.name, variant: it.metal, price: it.price, qty: 1, kind: it.kind
                      }));
                    }}
                    className="border border-line-strong hover:border-gold hover:text-gold text-gold-mid text-[9px] tracking-[0.16em] uppercase px-2 py-1.5 transition-colors"
                  >
                    Add to Bag
                  </button>
                  <button
                    onClick={() => dispatch(removeWishlist(it.id))}
                    className="text-[9.5px] uppercase tracking-wide text-cream-dim hover:text-[#d98a6a] text-center mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}

export function AccountDrawer({ isOpen, onClose }: DrawerProps) {
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const clerk = useClerk();
  const dispatch = useAppDispatch();

  // Profile Form States
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formState, setFormState] = useState('');
  const [formPincode, setFormPincode] = useState('');

  // Update Profile Mutation
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const currentToken = useAppSelector((state: any) => state.auth.token);

  useEffect(() => {
    if (user) {
      setFormName(user.name || '');
      setFormPhone(user.phone || '');
      setFormAddress(user.address || '');
      setFormCity(user.city || '');
      setFormState(user.state || '');
      setFormPincode(user.pincode || '');
    }
  }, [user]);

  // RTK Query hooks
  const { data: userOrders, isLoading: ordersLoading } = useGetUserOrdersQuery(undefined, {
    skip: !isAuthenticated,
  });

  if (!isOpen) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedUser = await updateProfile({
        name: formName,
        phone: formPhone,
        address: formAddress,
        city: formCity,
        state: formState,
        pincode: formPincode,
      }).unwrap();

      dispatch(login({ user: updatedUser, token: currentToken || '' }));
      setIsEditingAddress(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* drawer */}
      <aside className="relative w-full max-w-[480px] h-full bg-noir-2 border-l border-line-strong flex flex-col z-10 shadow-2xl animate-slide-in">
        <header className="px-6 py-6 border-b border-line flex items-center justify-between">
          <h3 className="font-disp text-sm tracking-[0.14em] uppercase text-cream">
            {isAuthenticated ? 'My Profile' : 'Access Account'}
          </h3>
          <button onClick={onClose} className="text-cream-soft hover:text-gold" aria-label="Close drawer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {!isAuthenticated ? (
            <div className="space-y-8 py-8 flex flex-col items-center justify-center text-center h-full max-h-[500px]">
              <div className="space-y-3">
                <p className="text-[11px] tracking-[0.3em] uppercase text-gold-mid">Secure Authentication</p>
                <h4 className="font-disp text-3xl text-cream tracking-[0.06em] uppercase">House of Veha</h4>
                <p className="text-xs text-cream-soft max-w-[320px] leading-relaxed mx-auto">
                  Access your personal order histories, secure delivery tracking details, and configure bespoke profiles.
                </p>
              </div>

              <div className="w-full space-y-4 pt-4">
                <SignInButton mode="modal">
                  <button
                    className="w-full bg-gradient-to-br from-[#E8CC76] to-gold-mid text-noir text-[11px] tracking-[0.22em] uppercase py-4 font-semibold hover:from-gold-light hover:to-gold transition-all duration-300 shadow-lg cursor-pointer"
                  >
                    Sign In
                  </button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <button
                    className="w-full border border-line-strong text-cream hover:border-gold hover:text-gold text-[11px] tracking-[0.22em] uppercase py-4 transition-all duration-300 bg-white/5 cursor-pointer"
                  >
                    Create Account
                  </button>
                </SignUpButton>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Profile Details */}
              <div className="bg-noir-3 border border-line p-5">
                {!isEditingAddress ? (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-edi text-2xl text-cream">{user?.name}</h4>
                          {user?.role === 'admin' && (
                            <span className="text-[9px] tracking-widest text-noir bg-gold px-1.5 py-0.5 rounded font-semibold uppercase">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-cream-soft">{user?.email}</p>
                        {user?.phone && <p className="text-xs text-cream-soft mt-1">{user?.phone}</p>}
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <button
                          onClick={() => clerk.signOut()}
                          className="border border-line-strong text-[9px] tracking-widest text-cream-soft hover:text-[#d98a6a] hover:border-[#d98a6a] px-2.5 py-1.5 uppercase transition-colors"
                        >
                          Logout
                        </button>
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={onClose}
                            className="text-[9px] tracking-widest text-gold hover:text-gold-light uppercase transition-colors font-medium border border-gold/40 hover:border-gold px-2.5 py-1.5 text-center block"
                          >
                            Admin Panel
                          </Link>
                        )}
                      </div>
                    </div>
                    {user?.address ? (
                      <div className="border-t border-line/50 pt-3 mt-3 text-xs text-cream-soft animate-fade-in">
                        <span className="block text-[9px] tracking-[0.16em] uppercase text-gold-mid mb-1">Saved Shipping Address</span>
                        {user.address}, {user.city}, {user.state} - {user.pincode}
                      </div>
                    ) : (
                      <div className="border-t border-line/50 pt-3 mt-3 text-xs text-cream-dim italic animate-fade-in">
                        No default shipping address saved.
                      </div>
                    )}
                    <div className="mt-4 pt-2 border-t border-line/30 flex justify-end">
                      <button
                        onClick={() => setIsEditingAddress(true)}
                        className="text-[9.5px] uppercase tracking-wider text-gold hover:text-gold-light transition-colors"
                      >
                        {user?.address ? 'Edit Details' : 'Add Shipping Address'}
                      </button>
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleUpdateProfile} className="space-y-4 animate-fade-in">
                    <h4 className="font-disp text-xs tracking-[0.14em] uppercase text-gold-mid pb-2 border-b border-line/30">Edit Profile & Address</h4>
                    <div>
                      <label className="block text-[9px] tracking-[0.16em] uppercase text-gold-mid mb-1">Full Name</label>
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full bg-white/5 border border-line-strong text-cream text-sm px-3 py-2 outline-none focus:border-gold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] tracking-[0.16em] uppercase text-gold-mid mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        className="w-full bg-white/5 border border-line-strong text-cream text-sm px-3 py-2 outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] tracking-[0.16em] uppercase text-gold-mid mb-1">Shipping Address</label>
                      <input
                        type="text"
                        value={formAddress}
                        onChange={(e) => setFormAddress(e.target.value)}
                        className="w-full bg-white/5 border border-line-strong text-cream text-sm px-3 py-2 outline-none focus:border-gold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] tracking-[0.16em] uppercase text-gold-mid mb-1">City</label>
                        <input
                          type="text"
                          value={formCity}
                          onChange={(e) => setFormCity(e.target.value)}
                          className="w-full bg-white/5 border border-line-strong text-cream text-sm px-3 py-2 outline-none focus:border-gold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] tracking-[0.16em] uppercase text-gold-mid mb-1">State</label>
                        <input
                          type="text"
                          value={formState}
                          onChange={(e) => setFormState(e.target.value)}
                          className="w-full bg-white/5 border border-line-strong text-cream text-sm px-3 py-2 outline-none focus:border-gold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] tracking-[0.16em] uppercase text-gold-mid mb-1">Pincode</label>
                      <input
                        type="text"
                        value={formPincode}
                        onChange={(e) => setFormPincode(e.target.value)}
                        className="w-full bg-white/5 border border-line-strong text-cream text-sm px-3 py-2 outline-none focus:border-gold"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className="flex-1 bg-gradient-to-br from-[#E8CC76] to-gold-mid text-noir text-[10px] tracking-[0.18em] uppercase py-2.5 font-semibold hover:from-gold-light hover:to-gold transition-all duration-300 disabled:opacity-50"
                      >
                        {isUpdating ? 'Saving...' : 'Save Details'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingAddress(false)}
                        className="flex-1 border border-line-strong text-cream hover:border-[#d98a6a] hover:text-[#d98a6a] text-[10px] tracking-[0.18em] uppercase py-2.5 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Order History */}
              <div>
                <h4 className="font-disp text-xs tracking-[0.14em] uppercase text-gold-mid mb-4">
                  Order History ({userOrders ? userOrders.length : 0})
                </h4>
                {ordersLoading ? (
                  <p className="text-xs italic text-cream-dim text-center py-6">Loading order history...</p>
                ) : !userOrders || userOrders.length === 0 ? (
                  <p className="text-xs italic text-cream-dim text-center py-6">No orders placed yet.</p>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map((ord: any) => (
                      <div key={ord._id} className="border border-line-strong bg-noir-3/50 p-4 space-y-3 animate-fade-in">
                        <div className="flex justify-between items-center text-xs pb-2 border-b border-line/30">
                          <div>
                            <span className="font-medium text-gold">{ord._id}</span>
                            <span className="text-cream-dim block text-[10px] mt-0.5">
                              {new Date(ord.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-gold font-medium">{formatINR(ord.total)}</span>
                            <span className="text-cream-dim block text-[9.5px] uppercase mt-0.5">{ord.status}</span>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          {ord.items.map((line: any, idx: number) => (
                            <div key={line.productId + '-' + idx} className="flex justify-between text-xs text-cream-soft">
                              <span>
                                {line.qty}x {line.name}{' '}
                                {line.variant && (
                                  <span className="text-[10px] uppercase text-cream-dim">({line.variant})</span>
                                )}
                              </span>
                              <span>{formatINR(line.price * line.qty)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export function MobileMenu({ isOpen, onClose, onOpenSearch, onOpenWishlist, onOpenAccount }: DrawerProps & {
  onOpenSearch: () => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
}) {
  const items = useAppSelector(selectWishlistItems);
  const user = useAppSelector(selectCurrentUser);

  if (!isOpen) return null;

  const mLink = "block text-xl tracking-[0.16em] font-edi text-cream hover:text-gold border-b border-line/40 py-4.5";

  return (
    <div className="fixed inset-0 z-[100] flex">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* drawer */}
      <aside className="relative w-full max-w-[320px] h-full bg-noir-2 border-r border-line-strong flex flex-col z-10 shadow-2xl animate-slide-in-left">
        <header className="px-6 py-6 border-b border-line flex items-center justify-between">
          <Link to="/" className="flex flex-col items-center leading-none" onClick={onClose}>
            <span className="font-disp text-xl font-semibold tracking-[0.2em] bg-gradient-to-b from-gold-light to-gold-dark bg-clip-text text-transparent">VEHA</span>
          </Link>
          <button onClick={onClose} className="text-cream-soft hover:text-gold">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </header>

        <nav className="flex-1 px-7 py-4">
          <Link to="/shop" className={mLink} onClick={onClose}>Shop All</Link>
          <Link to="/collections" className={mLink} onClick={onClose}>Collections</Link>
          <Link to="/house" className={mLink} onClick={onClose}>The House</Link>
          <Link to="/house#contact" className={mLink} onClick={onClose}>Contact</Link>

          <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-line">
            <button
              onClick={() => { onClose(); onOpenSearch(); }}
              className="flex flex-col items-center gap-1.5 py-3 border border-line-strong text-cream hover:border-gold hover:text-gold text-[10px] uppercase tracking-wider transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
              <span>Search</span>
            </button>
            <button
              onClick={() => { onClose(); onOpenWishlist(); }}
              className="relative flex flex-col items-center gap-1.5 py-3 border border-line-strong text-cream hover:border-gold hover:text-gold text-[10px] uppercase tracking-wider transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5"><path d="M12 20s-7-4.4-9.3-9C1 7.7 3 4.5 6.2 4.5c2 0 3.3 1.2 4.1 2.4l1.7 2 1.7-2c.8-1.2 2.1-2.4 4.1-2.4 3.2 0 5.2 3.2 3.5 6.5C19 15.6 12 20 12 20Z" /></svg>
              <span>Wishlist</span>
              {items.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-gradient-to-br from-gold-light to-gold-mid text-noir text-[9px] font-semibold flex items-center justify-center">{items.length}</span>
              )}
            </button>
            <button
              onClick={() => { onClose(); onOpenAccount(); }}
              className="flex flex-col items-center gap-1.5 py-3 border border-line-strong text-cream hover:border-gold hover:text-gold text-[10px] uppercase tracking-wider transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></svg>
              <span>{user ? 'Profile' : 'Login'}</span>
            </button>
          </div>
        </nav>
      </aside>
    </div>
  );
}
