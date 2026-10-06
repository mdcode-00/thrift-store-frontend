import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { fetchUserById, setUserRole } from '@/api/admin/users';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import type { User, Order } from '@/types';

export function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingRole, setIsSavingRole] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchUserById(id)
      .then((data) => {
        setUser(data.user);
        setOrders(data.orders);
      })
      .catch(() => toast.error('Could not load user'))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleRoleToggle() {
    if (!user || !id) return;
    const newRole = user.role === 'admin' ? 'user' : 'admin';

    if (!window.confirm(`Change ${user.name}'s role to "${newRole}"?`)) return;

    setIsSavingRole(true);
    try {
      const updated = await setUserRole(id, newRole);
      setUser(updated);
      toast.success(`Role updated to ${newRole}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Could not update role');
    } finally {
      setIsSavingRole(false);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[800px] px-4 py-10 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full rounded-sm" />
      </div>
    );
  }

  if (!user) return <p className="text-center py-20 text-secondary">User not found.</p>;

  return (
    <div className="mx-auto max-w-[800px] px-4 py-10 sm:px-6 lg:px-8">
      <Link to="/admin/users" className="text-sm text-secondary hover:text-primary mb-6 inline-block">
        &larr; Back to Users
      </Link>

      <div className="border border-border bg-surface rounded-sm p-6 mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-2xl font-medium text-foreground">{user.name}</h1>
            <p className="font-sans text-sm text-secondary">{user.email}</p>
            <p className="font-sans text-xs text-secondary mt-1">
              Current role: <span className="font-semibold text-foreground">{user.role || 'user'}</span>
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRoleToggle} disabled={isSavingRole}>
            {isSavingRole ? 'Saving...' : user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
          </Button>
        </div>
      </div>

      <h2 className="font-serif text-xl font-medium text-foreground border-b border-border pb-3 mb-4">
        Order History ({orders.length})
      </h2>

      {orders.length === 0 ? (
        <p className="text-secondary text-sm">No orders yet.</p>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => (
            <div key={order._id} className="flex items-center justify-between border border-border rounded-sm p-3 text-sm">
              <span className="font-medium text-foreground">{order.productName}</span>
              <span className="text-secondary">${order.price} × {order.quantity}</span>
              <span className="text-secondary text-xs uppercase">{order.paymentStatus}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminUserDetailPage;