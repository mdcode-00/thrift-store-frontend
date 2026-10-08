import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import { toast } from "react-hot-toast";
import {fetchProducts, searchProducts} from "@/api/products";
import {deleteProduct} from "@/api/admin/products";
import {Button} from "@/components/ui/Button";
import {Skeleton} from "@/components/ui/Skeleton";
import { Pagination } from "@/components/ui/Pagination"; 
import type { Product } from "@/types";

export function AdminProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function loadProducts() {
    setLoading(true);
   const request = search.trim()
      ? searchProducts(search.trim(), { page, limit: 20 })
      : fetchProducts({ page, limit: 20 });

    request
      .then((data) => {
        setProducts(data.products);
        setTotalPages(data.pagination?.totalPages || 1);
      })
      .catch((error) => {
        console.error("Failed to load products:", error);
        toast.error("Failed to load products.");
      })
      .finally(() => setLoading(false));
  }

  useEffect(loadProducts, [page , search]);

  async function handleDelete(id: string, name: string) {
   if (!window.confirm(`Delete "${name}"? This also removes its images from storage and cannot be undone.`)) return;

   setDeletingId(id);
   try {
    await deleteProduct(id);
    toast.success(`Product "${name}" deleted successfully.`);
    loadProducts();
   } catch (error) {
    toast.error(`Failed to delete product "${name}".`);
   } finally {
    setDeletingId(null);
   }
  }

 return (
   <div className="p-3 sm:p-4 md:p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between border-b border-border pb-6 mb-6 flex-wrap gap-4">
        <h1 className="font-serif text-3xl font-medium text-foreground">Manage Products</h1>
        <Button as={Link} to="/admin/products/new" variant="primary" size="md">
          + Add Product
        </Button>
      </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6 mb-6">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name or Products..."
          className="border border-border rounded-sm px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary w-full sm:w-64"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-sm" />)}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center py-16 text-secondary font-sans text-sm">No products yet.</p>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden md:block border border-border rounded-sm overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead className="bg-surface border-b border-border">
                <tr className="text-left font-sans text-xs uppercase tracking-wider text-secondary">
                  <th className="p-3">Image</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Status</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-border/60 last:border-0">
                    <td className="p-3">
                      <img src={product.image[0]?.url} alt={product.name} className="h-12 w-12 object-cover rounded-sm" />
                    </td>
                    <td className="p-3 font-medium text-foreground whitespace-nowrap">{product.name}</td>
                    <td className="p-3 text-secondary whitespace-nowrap">{product.category}</td>
                    <td className="p-3 text-foreground whitespace-nowrap">₹{product.price}</td>
                    <td className="p-3 text-foreground">{product.stock}</td>
                    <td className="p-3">
                      <span className={product.status === 'available' ? 'text-green-700' : 'text-secondary'}>
                        {product.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2 whitespace-nowrap">
                      <Link to={`/admin/products/${product._id}/edit`} className="text-primary hover:underline text-xs font-semibold">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id, product.name)}
                        disabled={deletingId === product._id}
                        className="text-destructive hover:underline text-xs font-semibold disabled:opacity-50"
                      >
                        {deletingId === product._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="md:hidden space-y-3">
            {products.map((product) => (
              <div key={product._id} className="rounded-sm border border-border bg-surface p-4">
                <div className="flex items-start gap-3 mb-3">
                  <img src={product.image[0]?.url} alt={product.name} className="h-16 w-16 object-cover rounded-sm shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{product.name}</p>
                    <p className="text-xs text-secondary">{product.category}</p>
                    <span className={`text-xs ${product.status === 'available' ? 'text-green-700' : 'text-secondary'}`}>
                      {product.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-border pt-3 mb-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-secondary">Price</p>
                    <p className="text-sm text-foreground mt-1">₹{product.price}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-secondary">Stock</p>
                    <p className="text-sm text-foreground mt-1">{product.stock}</p>
                  </div>
                </div>

                <div className="flex gap-4 border-t border-border pt-3">
                  <Link to={`/admin/products/${product._id}/edit`} className="text-primary text-xs font-semibold">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id, product.name)}
                    disabled={deletingId === product._id}
                    className="text-destructive text-xs font-semibold disabled:opacity-50"
                  >
                    {deletingId === product._id ? 'Deleting...' : 'Delete'}
                  </button>
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

export default AdminProductPage;
