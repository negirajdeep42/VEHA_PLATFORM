import { useState, useEffect } from 'react';
import { useCreateProductMutation, useUpdateProductMutation } from '../../features/api/apiSlice';
import type { Product, Category, Metal, Kind } from '../../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: Product | null;
}

export default function ProductModal({ isOpen, onClose, editingProduct }: ProductModalProps) {
  const [createProduct, { isLoading: creatingProduct }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updatingProduct }] = useUpdateProductMutation();

  const [formValues, setFormValues] = useState({
    id: '',
    name: '',
    category: 'rings' as Category,
    metal: 'gold' as Metal,
    kind: 'ring' as Kind,
    price: 0,
    compareAt: '',
    badge: '',
    featured: 0,
    inventoryQty: 100,
  });
  const [formError, setFormError] = useState('');

  // Sync edit mode product values
  useEffect(() => {
    if (editingProduct) {
      setFormValues({
        id: editingProduct.id,
        name: editingProduct.name,
        category: editingProduct.category,
        metal: editingProduct.metal,
        kind: editingProduct.kind,
        price: editingProduct.price,
        compareAt: editingProduct.compareAt ? String(editingProduct.compareAt) : '',
        badge: editingProduct.badge || '',
        featured: editingProduct.featured,
        inventoryQty: (editingProduct as any).inventoryQty ?? 100,
      });
    } else {
      setFormValues({
        id: '',
        name: '',
        category: 'rings',
        metal: 'gold',
        kind: 'ring',
        price: 0,
        compareAt: '',
        badge: '',
        featured: 0,
        inventoryQty: 100,
      });
    }
    setFormError('');
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.name.trim()) {
      setFormError('Product Name is required.');
      return;
    }
    if (formValues.price <= 0) {
      setFormError('Price must be greater than zero.');
      return;
    }

    const payload: any = {
      name: formValues.name,
      category: formValues.category,
      metal: formValues.metal,
      kind: formValues.kind,
      price: Number(formValues.price),
      compareAt: formValues.compareAt ? Number(formValues.compareAt) : null,
      badge: formValues.badge.trim() || null,
      featured: Number(formValues.featured),
      inventoryQty: Number(formValues.inventoryQty)
    };

    try {
      if (editingProduct) {
        await updateProduct({ id: editingProduct.id, body: payload }).unwrap();
      } else {
        if (formValues.id.trim()) {
          payload.id = formValues.id.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
        }
        await createProduct(payload).unwrap();
      }
      onClose();
    } catch (err: any) {
      setFormError(err?.data?.error || 'Failed to save product details.');
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[560px] bg-noir-2 border border-line-strong p-6 md:p-8 z-10 shadow-2xl animate-fade-in text-xs max-h-[90vh] overflow-y-auto">
        <header className="flex justify-between items-center mb-6 pb-4 border-b border-line">
          <h3 className="font-disp text-sm tracking-[0.14em] uppercase text-cream">
            {editingProduct ? 'Edit Catalog Item' : 'Add Catalog Item'}
          </h3>
          <button onClick={onClose} className="text-cream-soft hover:text-gold" aria-label="Close modal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </header>

        {formError && <p className="text-[#d98a6a] text-xs text-center mb-4">{formError}</p>}

        <form onSubmit={handleFormSubmit} className="space-y-4 text-cream-soft">
          {!editingProduct && (
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-cream-dim mb-1">Custom ID / Slug (Optional)</label>
              <input
                type="text"
                placeholder="e.g. royal-edit-jhumka (auto-slugified if blank)"
                value={formValues.id}
                onChange={(e) => setFormValues(f => ({ ...f, id: e.target.value }))}
                className="w-full bg-white/5 border border-line-strong text-cream text-xs px-3.5 py-2.5 outline-none focus:border-gold"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-cream-dim mb-1">Product Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Royal Jhumka Drop"
              value={formValues.name}
              onChange={(e) => setFormValues(f => ({ ...f, name: e.target.value }))}
              className="w-full bg-white/5 border border-line-strong text-cream text-xs px-3.5 py-2.5 outline-none focus:border-gold"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-cream-dim mb-1">Category</label>
              <select
                value={formValues.category}
                onChange={(e) => setFormValues(f => ({ ...f, category: e.target.value as Category }))}
                className="w-full bg-noir border border-line-strong text-cream text-xs px-3 py-2.5 outline-none focus:border-gold"
              >
                <option value="rings">Rings</option>
                <option value="earrings">Earrings</option>
                <option value="necklaces">Necklaces</option>
                <option value="bracelets">Bracelets</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-cream-dim mb-1">Metal Base</label>
              <select
                value={formValues.metal}
                onChange={(e) => setFormValues(f => ({ ...f, metal: e.target.value as Metal }))}
                className="w-full bg-noir border border-line-strong text-cream text-xs px-3 py-2.5 outline-none focus:border-gold"
              >
                <option value="gold">Yellow Gold</option>
                <option value="rose">Rose Gold</option>
                <option value="silver">Silver</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-cream-dim mb-1">Render Shape</label>
              <select
                value={formValues.kind}
                onChange={(e) => setFormValues(f => ({ ...f, kind: e.target.value as Kind }))}
                className="w-full bg-noir border border-line-strong text-cream text-xs px-3 py-2.5 outline-none focus:border-gold"
              >
                <option value="ring">Solitaire Ring</option>
                <option value="cuff">Wave Cuff</option>
                <option value="earrings">Gem Drop Earrings</option>
                <option value="hoops">Silver Hoops</option>
                <option value="necklace">Pendant Chain</option>
                <option value="tennis">Tennis Bracelet</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-cream-dim mb-1">Selling Price (INR)</label>
              <input
                type="number"
                required
                min={1}
                value={formValues.price}
                onChange={(e) => setFormValues(f => ({ ...f, price: Number(e.target.value) }))}
                className="w-full bg-white/5 border border-line-strong text-cream text-xs px-3.5 py-2.5 outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-cream-dim mb-1">Compare Price (Was)</label>
              <input
                type="number"
                min={1}
                placeholder="Optional details for Was"
                value={formValues.compareAt}
                onChange={(e) => setFormValues(f => ({ ...f, compareAt: e.target.value }))}
                className="w-full bg-white/5 border border-line-strong text-cream text-xs px-3.5 py-2.5 outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-[10px] uppercase tracking-wider text-cream-dim mb-1">Inventory stock</label>
              <input
                type="number"
                required
                min={0}
                value={formValues.inventoryQty}
                onChange={(e) => setFormValues(f => ({ ...f, inventoryQty: Number(e.target.value) }))}
                className="w-full bg-white/5 border border-line-strong text-cream text-xs px-3.5 py-2.5 outline-none focus:border-gold"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-[10px] uppercase tracking-wider text-cream-dim mb-1">Featured Weight</label>
              <input
                type="number"
                required
                value={formValues.featured}
                onChange={(e) => setFormValues(f => ({ ...f, featured: Number(e.target.value) }))}
                className="w-full bg-white/5 border border-line-strong text-cream text-xs px-3.5 py-2.5 outline-none focus:border-gold"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-[10px] uppercase tracking-wider text-cream-dim mb-1">Badge</label>
              <input
                type="text"
                placeholder="New / Bestseller"
                value={formValues.badge}
                onChange={(e) => setFormValues(f => ({ ...f, badge: e.target.value }))}
                className="w-full bg-white/5 border border-line-strong text-cream text-xs px-3.5 py-2.5 outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-line mt-6">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-cream-dim hover:text-cream uppercase tracking-wider px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creatingProduct || updatingProduct}
              className="bg-gradient-to-br from-[#E8CC76] to-gold-mid text-noir text-[10.5px] font-semibold tracking-[0.16em] uppercase px-5 py-2.5 hover:from-gold-light hover:to-gold transition-colors disabled:opacity-50"
            >
              {creatingProduct || updatingProduct ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
