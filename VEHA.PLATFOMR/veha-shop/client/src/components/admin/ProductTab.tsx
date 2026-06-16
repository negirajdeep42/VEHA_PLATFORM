import { useState } from 'react';
import { useGetProductsQuery, useDeleteProductMutation } from '../../features/api/apiSlice';
import { formatINR } from '../../lib/format';
import { Render } from '../../lib/renders';
import ProductModal from './ProductModal';
import type { Product, Category } from '../../types';

export default function ProductTab() {
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState<'all' | Category>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data: products = [], isLoading: productsLoading, isError: productsError } = useGetProductsQuery({ sort: 'featured' });
  const [deleteProduct] = useDeleteProductMutation();

  const filteredProducts = products.filter((p) => {
    const s = productSearch.trim().toLowerCase();
    const matchesSearch = !s || p.name.toLowerCase().includes(s) || p.id.toLowerCase().includes(s);
    const matchesCat = productCatFilter === 'all' || p.category === productCatFilter;
    return matchesSearch && matchesCat;
  });

  const handleOpenNewModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      try {
        await deleteProduct(id).unwrap();
      } catch (err: any) {
        alert(err?.data?.error || 'Failed to delete product.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center bg-[#0E0E10] p-4 border border-line-strong justify-between animate-fade-in">
        <div className="flex flex-wrap gap-3 items-center flex-1">
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="w-full bg-white/5 border border-line text-cream text-xs px-3.5 py-2.5 outline-none focus:border-gold"
            />
            {productSearch && (
              <button
                onClick={() => setProductSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cream-dim hover:text-cream text-[10px] uppercase font-semibold"
              >
                Clear
              </button>
            )}
          </div>
          <div className="w-[160px]">
            <select
              value={productCatFilter}
              onChange={(e) => setProductCatFilter(e.target.value as any)}
              className="w-full bg-noir border border-line text-cream text-xs px-3 py-2.5 outline-none focus:border-gold"
            >
              <option value="all">All Categories</option>
              <option value="rings">Rings</option>
              <option value="earrings">Earrings</option>
              <option value="necklaces">Necklaces</option>
              <option value="bracelets">Bracelets</option>
            </select>
          </div>
          <span className="text-[11px] text-cream-dim uppercase tracking-wider pl-1">
            Showing {filteredProducts.length} of {products.length} products
          </span>
        </div>
        <button
          onClick={handleOpenNewModal}
          className="bg-gradient-to-br from-[#E8CC76] to-gold-mid text-noir text-[10px] font-semibold tracking-[0.16em] uppercase px-5 py-2.5 hover:from-gold-light hover:to-gold transition-colors"
        >
          Add New Product
        </button>
      </div>

      {productsLoading && <p className="text-center py-12 text-cream-soft">Loading catalog...</p>}
      {productsError && <p className="text-center py-12 text-cream-soft">Failed to load catalog.</p>}

      {!productsLoading && filteredProducts.length === 0 && (
        <p className="text-center py-16 text-cream-dim font-edi italic text-lg border border-line bg-noir-2">No matching products found in the catalog.</p>
      )}

      {!productsLoading && filteredProducts.length > 0 && (
        <div className="overflow-x-auto border border-line bg-[#0E0E10]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line text-[9.5px] uppercase tracking-[0.18em] text-gold font-medium bg-noir">
                <th className="py-4.5 px-5 w-[80px]">Visual</th>
                <th className="py-4.5 px-4">Name</th>
                <th className="py-4.5 px-4">Category</th>
                <th className="py-4.5 px-4 text-right">Price</th>
                <th className="py-4.5 px-4 text-center">Stock Status</th>
                <th className="py-4.5 px-4 text-center">Qty</th>
                <th className="py-4.5 px-5 text-right w-[180px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-xs">
              {filteredProducts.map((p: any) => (
                <tr key={p.id} className="hover:bg-noir-3/50 transition-colors">
                  <td className="py-3 px-5">
                    <div className="w-12 h-12 bg-[radial-gradient(circle_at_50%_40%,#241F14,#0C0B09)] border border-line p-1">
                      <Render kind={p.kind} className="w-full h-full" />
                    </div>
                  </td>
                  <td className="py-3 px-4 font-edi text-base text-cream">{p.name}</td>
                  <td className="py-3 px-4 text-cream-soft uppercase tracking-wider text-[10px]">{p.category} &middot; {p.metal}</td>
                  <td className="py-3 px-4 text-right text-gold font-medium">{formatINR(p.price)}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 border ${
                      p.stockStatus === 'out_of_stock'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : p.stockStatus === 'low_stock'
                          ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {p.stockStatus?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-cream font-medium">{p.inventoryQty}</td>
                  <td className="py-3 px-5 text-right space-x-3.5">
                    <button
                      onClick={() => handleOpenEditModal(p)}
                      className="text-[10px] uppercase text-gold hover:text-gold-light tracking-widest font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      className="text-[10px] uppercase text-[#d98a6a] hover:text-red-400 tracking-widest font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editingProduct={editingProduct} 
      />
    </div>
  );
}
