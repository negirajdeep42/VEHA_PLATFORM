import { useState } from 'react';
import { useGetPromotionsQuery, useDeletePromotionMutation } from '../../features/api/apiSlice';
import PromotionModal from './PromotionModal';

export default function PromotionTab() {
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<any | null>(null);

  const { data: promotions = [], isLoading: promosLoading, isError: promosError } = useGetPromotionsQuery();
  const [deletePromotion] = useDeletePromotionMutation();

  const handleOpenNewPromoModal = () => {
    setEditingPromotion(null);
    setIsPromoModalOpen(true);
  };

  const handleOpenEditPromoModal = (p: any) => {
    setEditingPromotion(p);
    setIsPromoModalOpen(true);
  };

  const handleDeletePromotion = async (id: string, code: string) => {
    if (confirm(`Are you sure you want to delete promo code "${code}"?`)) {
      try {
        await deletePromotion(id).unwrap();
      } catch (err: any) {
        alert(err?.data?.error || 'Failed to delete promotion code.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <p className="text-xs text-cream-soft">Configure coupon codes, discount percentages, and usage bounds.</p>
        <button
          onClick={handleOpenNewPromoModal}
          className="bg-gradient-to-br from-[#E8CC76] to-gold-mid text-noir text-[10px] font-semibold tracking-[0.16em] uppercase px-5 py-2.5 hover:from-gold-light hover:to-gold transition-colors"
        >
          Create Promo Code
        </button>
      </div>

      {promosLoading && <p className="text-center py-12 text-cream-soft">Loading promotions...</p>}
      {promosError && <p className="text-center py-12 text-cream-soft">Failed to load promotions. Verify that MongoDB is online.</p>}

      {!promosLoading && promotions.length === 0 && (
        <p className="text-center py-16 text-cream-dim font-edi italic text-lg border border-line bg-noir-2">No promotion codes configured yet.</p>
      )}

      {!promosLoading && promotions.length > 0 && (
        <div className="overflow-x-auto border border-line">
          <table className="w-full text-left border-collapse bg-noir-2">
            <thead>
              <tr className="border-b border-line text-[9.5px] uppercase tracking-[0.18em] text-gold font-medium bg-noir">
                <th className="py-4.5 px-5">Code</th>
                <th className="py-4.5 px-4 text-center">Discount</th>
                <th className="py-4.5 px-4 text-center">Expiry</th>
                <th className="py-4.5 px-4 text-center">Usage Limit</th>
                <th className="py-4.5 px-4 text-center">Usage Count</th>
                <th className="py-4.5 px-5 text-right w-[180px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-xs">
              {promotions.map((p: any) => (
                <tr key={p._id} className="hover:bg-noir-3/50 transition-colors">
                  <td className="py-4 px-5 font-disp font-semibold text-cream uppercase tracking-wider">{p.code}</td>
                  <td className="py-4 px-4 text-center text-gold font-medium font-mono text-sm">{Math.round(p.discountRate * 100)}% Off</td>
                  <td className="py-4 px-4 text-center text-cream-soft">
                    {p.expirationDate ? new Date(p.expirationDate).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="py-4 px-4 text-center text-cream-soft">
                    {p.usageLimit !== null ? p.usageLimit : 'Unlimited'}
                  </td>
                  <td className="py-4 px-4 text-center text-cream font-medium">{p.usageCount}</td>
                  <td className="py-4 px-5 text-right space-x-3.5">
                    <button
                      onClick={() => handleOpenEditPromoModal(p)}
                      className="text-[10px] uppercase text-gold hover:text-gold-light tracking-widest font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePromotion(p._id, p.code)}
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

      <PromotionModal 
        isOpen={isPromoModalOpen} 
        onClose={() => setIsPromoModalOpen(false)} 
        editingPromotion={editingPromotion} 
      />
    </div>
  );
}
