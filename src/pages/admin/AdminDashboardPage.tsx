import { Link } from 'react-router-dom';

export function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-[800px] px-4 py-16 text-center">
      <h1 className="font-serif text-3xl font-medium text-foreground mb-10">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link to="/admin/products" className="border border-border bg-surface rounded-sm p-8 hover:border-primary transition-colors">
          <h2 className="font-serif text-xl text-foreground">Products</h2>
        </Link>
        <Link to="/admin/orders" className="border border-border bg-surface rounded-sm p-8 hover:border-primary transition-colors">
          <h2 className="font-serif text-xl text-foreground">Orders</h2>
        </Link>
        <Link to="/admin/users" className="border border-border bg-surface rounded-sm p-8 hover:border-primary transition-colors">
          <h2 className="font-serif text-xl text-foreground">Users</h2>
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboardPage;