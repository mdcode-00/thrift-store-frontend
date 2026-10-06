import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllUsersAdmin } from '@/api/admin/users';
import { Skeleton } from '@/components/ui/Skeleton';
import { Pagination } from '@/components/ui/Pagination';
import type { User } from '@/types';

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(true);
      fetchAllUsersAdmin(page, 20, search || undefined)
        .then((data: any) => {
          setUsers(data.users);
          setTotalPages(data.pagination.totalPages);
          setTotal(data.pagination.total);
        })
        .finally(() => setIsLoading(false));
    }, 300); // debounce — avoid firing a request on every keystroke while typing

    return () => clearTimeout(timeout);
  }, [page, search]);

  return (
    <div className="p-3 sm:p-4 md:p-6 max-w-[1000px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6 mb-6">
        <h1 className="font-serif text-3xl font-medium text-foreground">Manage Users</h1>
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name or email..."
          className="border border-border rounded-sm px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary w-full sm:w-64"
        />
      </div>

      <p className="font-sans text-xs text-secondary mb-4">{total} user{total === 1 ? '' : 's'}</p>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-sm" />)}
        </div>
      ) : users.length === 0 ? (
        <p className="text-center py-16 text-secondary font-sans text-sm">No users match this search.</p>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden md:block border border-border rounded-sm overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead className="bg-surface border-b border-border">
                <tr className="text-left font-sans text-xs uppercase tracking-wider text-secondary">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u: any) => (
                  <tr key={u._id} className="border-b border-border/60 last:border-0">
                    <td className="p-3 font-medium text-foreground whitespace-nowrap">{u.name}</td>
                    <td className="p-3 text-secondary whitespace-nowrap">{u.email}</td>
                    <td className="p-3">
                      <span className={u.role === 'admin' ? 'text-primary font-semibold' : 'text-secondary'}>
                        {u.role || 'user'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link to={`/admin/users/${u._id}`} className="text-primary hover:underline text-xs font-semibold">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="md:hidden space-y-3">
            {users.map((u: any) => (
              <div key={u._id} className="rounded-sm border border-border bg-surface p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{u.name}</p>
                    <p className="text-xs text-secondary truncate">{u.email}</p>
                  </div>
                  <span className={`text-xs shrink-0 ${u.role === 'admin' ? 'text-primary font-semibold' : 'text-secondary'}`}>
                    {u.role || 'user'}
                  </span>
                </div>
                <div className="border-t border-border pt-3">
                  <Link to={`/admin/users/${u._id}`} className="text-primary text-xs font-semibold">
                    View details &rarr;
                  </Link>
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

export default AdminUsersPage;