import {useEffect, useState} from "react";
import {fetchAllOrdersAdmin} from "@/api/admin/order";
import {Skeleton} from "@/components/ui/Skeleton";
import {Pagination} from "@/components/ui/Pagination";


type StatusFilter = 'all' | 'pending' | 'paid' | 'failed';

function StatusBadge({ status }: { status: 'pending' | 'paid' | 'failed' }) {
  const styles = {
    paid: 'bg-[#d1fae5] text-[#065f46]',
    pending: 'bg-[var(--color-accent)] text-[var(--color-foreground)]',
    failed: 'bg-[#fee2e2] text-[#991b1b]',
  };
  return (
    <span className={`inline-block px-2.5 py-1 text-xs font-sans font-semibold uppercase tracking-widest rounded-sm ${styles[status]}`}>
      {status}
    </span>
  );
}

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchAllOrdersAdmin(page, 20, statusFilter === 'all' ? undefined : statusFilter)
      .then((data: any) => {
        setOrders(data.orders);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
      })
      .finally(() => setIsLoading(false));
  }, [page, statusFilter]);

  function handleFilterChange(value: StatusFilter) {
    setStatusFilter(value);
    setPage(1);
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 max-w-[1200px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6 mb-6">
        <h1 className="font-serif text-3xl font-medium text-foreground">All Orders</h1>
        <div className="flex gap-2 overflow-x-auto">
          {(['all', 'pending', 'paid', 'failed'] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => handleFilterChange(s)}
              className={`shrink-0 px-3 py-1.5 text-xs font-sans font-semibold uppercase tracking-wider rounded-sm border transition-colors ${
                statusFilter === s
                  ? 'bg-primary text-white border-primary'
                  : 'border-border text-secondary hover:border-primary hover:text-primary'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <p className="font-sans text-xs text-secondary mb-4">{total} order{total === 1 ? '' : 's'}</p>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-sm" />)}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center py-16 text-secondary font-sans text-sm">No orders match this filter.</p>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden md:block border border-border rounded-sm overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-surface border-b border-border">
                <tr className="text-left font-sans text-xs uppercase tracking-wider text-secondary">
                  <th className="p-3">Product</th>
                  <th className="p-3">Buyer</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-border/60 last:border-0">
                    <td className="p-3 font-medium text-foreground whitespace-nowrap">{order.productName}</td>
                    <td className="p-3 text-secondary whitespace-nowrap">
                      {order.buyerId?.name || 'Unknown'}
                      <div className="text-xs">{order.buyerId?.email}</div>
                    </td>
                    <td className="p-3 text-foreground">{order.quantity}</td>
                    <td className="p-3 text-foreground whitespace-nowrap">₹{(order.price * order.quantity).toFixed(2)}</td>
                    <td className="p-3"><StatusBadge status={order.paymentStatus} /></td>
                    <td className="p-3 text-secondary text-xs whitespace-nowrap">
                      {new Date(order.soldAt || order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="md:hidden space-y-3">
            {orders.map((order) => (
              <div key={order._id} className="rounded-sm border border-border bg-surface p-4">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{order.productName}</p>
                    <p className="text-xs text-secondary mt-1">{order.buyerId?.name || 'Unknown'}</p>
                    <p className="text-xs text-secondary">{order.buyerId?.email}</p>
                  </div>
                  <StatusBadge status={order.paymentStatus} />
                </div>
                <div className="grid grid-cols-2 gap-3 border-t border-border pt-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-secondary">Quantity</p>
                    <p className="text-sm text-foreground mt-1">{order.quantity}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-secondary">Total</p>
                    <p className="text-sm text-foreground mt-1">₹{(order.price * order.quantity).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-secondary">Date</p>
                    <p className="text-sm text-secondary mt-1">
                      {new Date(order.soldAt || order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

export default AdminOrdersPage;