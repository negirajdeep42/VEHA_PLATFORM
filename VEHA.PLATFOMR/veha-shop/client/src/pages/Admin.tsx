import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectCurrentUser, selectIsAuthenticated } from '../features/auth/authSlice';
import OrderTab from '../components/admin/OrderTab';
import ProductTab from '../components/admin/ProductTab';
import PromotionTab from '../components/admin/PromotionTab';

type Tab = 'orders' | 'products' | 'promotions';

export default function Admin() {
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [activeTab, setActiveTab] = useState<Tab>('orders');

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-7 text-center animate-fade-in">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          className="w-16 h-16 text-[#d98a6a] mb-5"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <h2 className="font-disp text-2xl tracking-[0.14em] uppercase text-cream mb-3">
          Access Denied
        </h2>
        <p className="text-sm text-cream-soft max-w-[420px] mb-8 leading-relaxed">
          This section of the House is restricted to administrators. Please authenticate with a
          valid staff profile.
        </p>
        <Link
          to="/"
          className="border border-line-strong hover:border-gold hover:text-gold text-cream text-xs font-semibold tracking-[0.2em] uppercase px-7 py-3.5 transition-colors"
        >
          Return to Boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1240px] mx-auto px-7 py-12">
      <header className="mb-10 text-center md:text-left md:flex justify-between items-end border-b border-line pb-6">
        <div>
          <p className="text-[11px] tracking-[0.34em] uppercase text-gold-mid mb-2">Internal Atelier</p>
          <h1 className="font-disp text-4xl md:text-5xl tracking-[0.08em] bg-gradient-to-b from-gold-light to-gold-dark bg-clip-text text-transparent">Admin Dashboard</h1>
        </div>
        <div className="flex justify-center gap-4 mt-6 md:mt-0 border border-line-strong p-1 bg-noir-2">
          {([['orders', 'Manage Orders'], ['products', 'Manage Products'], ['promotions', 'Manage Promotions']] as const).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs tracking-[0.14em] uppercase px-5 py-2.5 transition-colors ${
                activeTab === tab ? 'bg-gradient-to-br from-gold-light to-gold-mid text-noir font-medium' : 'text-cream-soft hover:text-cream'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* Tabs */}
      {activeTab === 'orders' && <OrderTab />}
      {activeTab === 'products' && <ProductTab />}
      {activeTab === 'promotions' && <PromotionTab />}
    </div>
  );
}
