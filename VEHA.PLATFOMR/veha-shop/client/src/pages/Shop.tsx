import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useGetProductsQuery } from '../features/api/apiSlice';
import ProductCard from '../components/ProductCard';

const cats = ['all', 'rings', 'earrings', 'necklaces', 'bracelets'] as const;

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') ?? 'all';
  const [sort, setSort] = useState('featured');

  const { data: products, isLoading, isError } = useGetProductsQuery({
    category: category === 'all' ? undefined : category,
    sort,
  });

  const pickCategory = (c: string) => {
    if (c === 'all') setSearchParams({});
    else setSearchParams({ category: c });
  };

  return (
    <div className="max-w-[1240px] mx-auto px-7 py-12">
      <header className="text-center mb-10">
        <p className="text-[11px] tracking-[0.34em] uppercase text-gold-mid mb-3">The collection</p>
        <h1 className="font-disp text-4xl md:text-5xl tracking-[0.08em] bg-gradient-to-b from-gold-light to-gold-dark bg-clip-text text-transparent capitalize">
          {category === 'all' ? 'Shop all' : category}
        </h1>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5 mb-8">
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => pickCategory(c)}
              className={`text-xs tracking-[0.1em] uppercase px-4 py-2 border transition-colors ${
                category === c ? 'border-gold text-gold-light bg-noir-3' : 'border-line text-cream-soft hover:border-line-strong'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-noir-2 border border-line-strong text-cream text-xs tracking-wide px-3.5 py-2.5 outline-none"
        >
          <option value="featured">Featured</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
          <option value="off">Biggest discount</option>
        </select>
      </div>

      {isLoading && <p className="text-cream-soft py-16 text-center">Loading the collection&hellip;</p>}
      {isError && <p className="text-cream-soft py-16 text-center">Couldn&rsquo;t reach the shop. Is the API running on port 4000?</p>}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
      {products && products.length === 0 && (
        <p className="text-cream-soft py-16 text-center">
          Nothing matches yet. <Link to="/shop" className="text-gold">See everything</Link>.
        </p>
      )}
    </div>
  );
}
