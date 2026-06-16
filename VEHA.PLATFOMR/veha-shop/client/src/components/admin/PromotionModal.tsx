import { useState, useEffect } from 'react';
import { useCreatePromotionMutation, useUpdatePromotionMutation } from '../../features/api/apiSlice';

interface PromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPromotion: any;
}

export default function PromotionModal({ isOpen, onClose, editingPromotion }: PromotionModalProps) {
  const [createPromotion, { isLoading: creatingPromo }] = useCreatePromotionMutation();
  const [updatePromotion, { isLoading: updatingPromo }] = useUpdatePromotionMutation();

  const [promoValues, setPromoValues] = useState({
    code: '',
    discountPercent: 10,
    expirationDate: '',
    usageLimit: '',
  });
  const [promoError, setPromoError] = useState('');

  // Sync edit mode promotion values
  useEffect(() => {
    if (editingPromotion) {
      setPromoValues({
        code: editingPromotion.code,
        discountPercent: Math.round(editingPromotion.discountRate * 100),
        expirationDate: editingPromotion.expirationDate ? new Date(editingPromotion.expirationDate).toISOString().split('T')[0] : '',
        usageLimit: editingPromotion.usageLimit !== null ? String(editingPromotion.usageLimit) : '',
      });
    } else {
      setPromoValues({
        code: '',
        discountPercent: 10,
        expirationDate: '',
        usageLimit: '',
      });
    }
    setPromoError('');
  }, [editingPromotion, isOpen]);

  if (!isOpen) return null;

  const handlePromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoValues.code.trim()) {
      setPromoError('Promo Code is required.');
      return;
    }
    if (promoValues.discountPercent <= 0 || promoValues.discountPercent > 100) {
      setPromoError('Discount percent must be between 1 and 100.');
      return;
    }

    const payload: any = {
      code: promoValues.code.trim().toUpperCase(),
      discountRate: Number(promoValues.discountPercent) / 100,
      expirationDate: promoValues.expirationDate ? new Date(promoValues.expirationDate) : null,
      usageLimit: promoValues.usageLimit.trim() !== '' ? Number(promoValues.usageLimit) : null
    };

    try {
      if (editingPromotion) {
        await updatePromotion({ id: editingPromotion._id, body: payload }).unwrap();
      } else {
        await createPromotion(payload).unwrap();
      }
      onClose();
    } catch (err: any) {
      setPromoError(err?.data?.error || 'Failed to save promotion code.');
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[480px] bg-noir-2 border border-line-strong p-6 md:p-8 z-10 shadow-2xl animate-fade-in text-xs text-cream-soft">
        <header className="flex justify-between items-center mb-6 pb-4 border-b border-line">
          <h3 className="font-disp text-sm tracking-[0.14em] uppercase text-cream">
            {editingPromotion ? 'Edit Promo Code' : 'Create Promo Code'}
          </h3>
          <button onClick={onClose} className="text-cream-soft hover:text-gold" aria-label="Close modal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </header>

        {promoError && <p className="text-[#d98a6a] text-xs text-center mb-4">{promoError}</p>}

        <form onSubmit={handlePromoSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-cream-dim mb-1">Promo Code</label>
            <input
              type="text"
              required
              placeholder="e.g. WINTER15"
              disabled={!!editingPromotion}
              value={promoValues.code}
              onChange={(e) => setPromoValues(f => ({ ...f, code: e.target.value }))}
              className="w-full bg-white/5 border border-line-strong text-cream text-xs px-3.5 py-2.5 outline-none focus:border-gold uppercase disabled:opacity-60"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-cream-dim mb-1">Discount Rate (%)</label>
              <input
                type="number"
                required
                min={1}
                max={100}
                placeholder="e.g. 15 for 15% off"
                value={promoValues.discountPercent}
                onChange={(e) => setPromoValues(f => ({ ...f, discountPercent: Number(e.target.value) }))}
                className="w-full bg-white/5 border border-line-strong text-cream text-xs px-3.5 py-2.5 outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-cream-dim mb-1">Usage Limit (Optional)</label>
              <input
                type="number"
                min={1}
                placeholder="Blank for unlimited"
                value={promoValues.usageLimit}
                onChange={(e) => setPromoValues(f => ({ ...f, usageLimit: e.target.value }))}
                className="w-full bg-white/5 border border-line-strong text-cream text-xs px-3.5 py-2.5 outline-none focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-cream-dim mb-1">Expiration Date (Optional)</label>
            <input
              type="date"
              value={promoValues.expirationDate}
              onChange={(e) => setPromoValues(f => ({ ...f, expirationDate: e.target.value }))}
              className="w-full bg-noir border border-line-strong text-cream text-xs px-3.5 py-2.5 outline-none focus:border-gold"
            />
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
              disabled={creatingPromo || updatingPromo}
              className="bg-gradient-to-br from-[#E8CC76] to-gold-mid text-noir text-[10.5px] font-semibold tracking-[0.16em] uppercase px-5 py-2.5 hover:from-gold-light hover:to-gold transition-colors disabled:opacity-50"
            >
              {creatingPromo || updatingPromo ? 'Saving...' : 'Save Code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
