import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, useAuth, useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useAppDispatch } from './app/hooks';
import { login, logout } from './features/auth/authSlice';
import Header from './components/Header';
import Footer from './components/Footer';
import { VehaDefs } from './lib/renders';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Collections from './pages/Collections';
import House from './pages/House';
import Admin from './pages/Admin';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function ClerkReduxSync() {
  const { isLoaded, userId, getToken } = useAuth();
  const { user } = useUser();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLoaded) {
      if (userId && user) {
        getToken().then((token) => {
          if (token) {
            dispatch(
              login({
                user: {
                  id: userId,
                  name: user.fullName || user.firstName || 'Boutique Guest',
                  email: user.primaryEmailAddress?.emailAddress || '',
                  phone: user.primaryPhoneNumber?.phoneNumber || '',
                  address: (user.unsafeMetadata?.address as string) || '',
                  city: (user.unsafeMetadata?.city as string) || '',
                  state: (user.unsafeMetadata?.state as string) || '',
                  pincode: (user.unsafeMetadata?.pincode as string) || '',
                  role: (user.unsafeMetadata?.role as any) || (user.primaryEmailAddress?.emailAddress === 'admin@veha.example' ? 'admin' : 'customer')
                },
                token
              })
            );
          }
        });
      } else {
        dispatch(logout());
      }
    }
  }, [isLoaded, userId, user, dispatch, getToken]);

  return null;
}

export default function App() {
  if (!clerkPubKey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-noir p-6 text-center">
        <h2 className="text-gold text-2xl font-disp uppercase tracking-wider mb-2">Clerk Configuration Required</h2>
        <p className="text-cream-soft text-sm max-w-[480px]">
          Please configure <code>VITE_CLERK_PUBLISHABLE_KEY</code> in your <code>client/.env</code> file to run the authentication system.
        </p>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <BrowserRouter>
        <ClerkReduxSync />
        <VehaDefs />
        <Header />
        <main className="min-h-[60vh]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/house" element={<House />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </ClerkProvider>
  );
}
