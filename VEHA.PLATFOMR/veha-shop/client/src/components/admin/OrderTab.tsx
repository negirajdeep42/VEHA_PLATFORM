import { useState } from 'react';
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '../../features/api/apiSlice';
import { formatINR } from '../../lib/format';

type OrderStatusFilter = 'all' | 'pending' | 'shipped' | 'delivered';

export default function OrderTab() {
  const [orderFilter, setOrderFilter] = useState<OrderStatusFilter>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const { data: orders = [], isLoading: ordersLoading, isError: ordersError } = useGetOrdersQuery();
  const [updateOrderStatus, { isLoading: updatingStatus }] = useUpdateOrderStatusMutation();

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateOrderStatus({ id, status }).unwrap();
    } catch (err: any) {
      alert(err?.data?.error || 'Failed to update order status');
    }
  };

  const badgeCls = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
      case 'shipped': return 'bg-blue-500/10 text-blue-400 border border-blue-500/30';
      default: return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2.5 pb-4">
        {([['all', 'All Orders'], ['pending', 'Pending'], ['shipped', 'Shipped'], ['delivered', 'Delivered']] as const).map(([f, label]) => (
          <button
            key={f}
            onClick={() => setOrderFilter(f)}
            className={`text-[10px] tracking-[0.12em] uppercase px-4 py-2 border transition-colors ${
              orderFilter === f ? 'border-gold text-gold bg-noir-3' : 'border-line text-cream-soft hover:border-line-strong'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {ordersLoading && <p className="text-center py-12 text-cream-soft">Loading placed orders...</p>}
      {ordersError && <p className="text-center py-12 text-cream-soft">Failed to load orders. Verify that MongoDB is online.</p>}

      {!ordersLoading && filteredOrders.length === 0 && (
        <p className="text-center py-16 text-cream-dim font-edi italic text-lg border border-line p-6 bg-noir-2">No orders match the filter.</p>
      )}

      {!ordersLoading && filteredOrders.length > 0 && (
        <div className="border border-line divide-y divide-line bg-noir-2">
          {filteredOrders.map((ord) => (
            <div key={ord._id} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4.5">
                  <div>
                    <span 
                      className="font-disp tracking-wider text-sm font-semibold text-cream hover:text-gold cursor-pointer" 
                      onClick={() => setExpandedOrderId(expandedOrderId === ord._id ? null : ord._id)}
                    >
                      {ord._id}
                    </span>
                    <span className="block text-[10px] text-cream-dim mt-0.5">{new Date(ord.createdAt).toLocaleString()}</span>
                  </div>
                  <span className={`text-[9px] tracking-widest uppercase px-2 py-0.5 font-medium ${badgeCls(ord.status)}`}>
                    {ord.status}
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-gold font-medium block text-base">{formatINR(ord.total)}</span>
                    <span className="text-cream-dim text-[10.5px] block mt-0.5">{ord.items.length} items &middot; {ord.customer.name}</span>
                  </div>
                  <button
                    onClick={() => setExpandedOrderId(expandedOrderId === ord._id ? null : ord._id)}
                    className="text-xs uppercase text-cream-soft hover:text-gold tracking-widest"
                  >
                    {expandedOrderId === ord._id ? 'Collapse' : 'Details \u2193'}
                  </button>
                </div>
              </div>

              {/* Expandable Panel */}
              {expandedOrderId === ord._id && (
                <div className="mt-6 pt-5 border-t border-line/50 grid md:grid-cols-2 gap-8 text-xs animate-fade-in pl-1">
                  {/* Customer info & shipping details */}
                  <div className="space-y-4 bg-noir-3 p-4 border border-line">
                    <h4 className="font-disp text-[10.5px] tracking-wider uppercase text-gold">Shipping &amp; Customer Details</h4>
                    <div className="space-y-1.5 text-cream-soft">
                      <p><strong className="text-cream font-normal">Name:</strong> {ord.customer.name}</p>
                      <p><strong className="text-cream font-normal">Email:</strong> {ord.customer.email}</p>
                      <p><strong className="text-cream font-normal">Phone:</strong> {ord.customer.phone}</p>
                      <p><strong className="text-cream font-normal">Address:</strong> {ord.customer.address}</p>
                      <p><strong className="text-cream font-normal">Location:</strong> {ord.customer.city}, {ord.customer.state} - {ord.customer.pincode}</p>
                      <p><strong className="text-cream font-normal">Payment:</strong> <span className="uppercase">{ord.paymentMethod}</span></p>
                      {ord.promoCode && <p><strong className="text-cream font-normal">Promo Code:</strong> <span className="text-gold uppercase">{ord.promoCode}</span></p>}
                    </div>

                    {/* Status Change Selector */}
                    <div className="pt-2 border-t border-line/45 flex items-center gap-3">
                      <span className="text-[10px] tracking-wider uppercase text-cream-dim font-medium">Fulfillment Status:</span>
                      <select
                        value={ord.status}
                        disabled={updatingStatus}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        className="bg-noir border border-line-strong text-cream text-[11px] px-2 py-1 outline-none focus:border-gold"
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>

                  {/* Items details breakdown */}
                  <div className="space-y-4">
                    <h4 className="font-disp text-[10.5px] tracking-wider uppercase text-gold">Items Breakdown</h4>
                    <div className="space-y-3">
                      {ord.items.map((line: any) => (
                        <div key={line._id} className="flex justify-between items-center text-xs pb-3 border-b border-line last:border-b-0">
                          <div>
                            <span className="text-cream font-medium">{line.name}</span>
                            <span className="text-cream-dim text-[10px] block mt-0.5">{line.qty}x &middot; {line.variant || 'Standard'}</span>
                          </div>
                          <span className="text-gold whitespace-nowrap">{formatINR(line.price * line.qty)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-line-strong pt-3 space-y-1.5 text-right font-medium text-cream-soft">
                      <p className="text-[10.5px]">Subtotal: <span className="text-cream">{formatINR(ord.subtotal)}</span></p>
                      {ord.discount > 0 && <p className="text-[10.5px]">Discount: <span className="text-gold">&minus;{formatINR(ord.discount)}</span></p>}
                      <p className="text-[10.5px]">Shipping: <span className="text-cream">{ord.shipping === 0 ? 'Free' : formatINR(ord.shipping)}</span></p>
                      <p className="text-sm text-gold pt-1">Total: <span className="text-base font-semibold">{formatINR(ord.total)}</span></p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
