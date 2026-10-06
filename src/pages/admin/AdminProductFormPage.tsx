import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { fetchProductById } from "@/api/products";
import { createProduct, updateProduct } from "@/api/admin/products";

const CATEGORIES = [
  "Women's",
  "Men's",
  "Outerwear",
  "Dresses",
  "Denim",
  "Accessories",
];

export function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchProductById(id)
      .then((product) => {
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setCategory(product.category);
        setStock(product.stock);
        setExistingImageUrls(product.image.map((img) => img.url));
      })
      .catch(() => toast.error("Failed to load product data."))
      .finally(() => setIsLoading(false));
  }, [id]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setImages(files.slice(0, 3)); // enforce max 3 client-side too, matching the backend's exact-3 rule
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isEditMode && images.length !== 3) {
      toast.error("Please upload exactly 3 images.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode && id) {
        await updateProduct(id, {
          name,
          description,
          price: Number(price),
          category,
          stock: Number(stock),
        });
        toast.success("Product updated");
      } else {
        await createProduct({
          name,
          description,
          price: Number(price),
          category,
          stock: Number(stock),
          images,
        });
        toast.success("Product created");
      }
      navigate("/admin/products");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading)
    return <div className="p-10 text-center text-secondary">Loading...</div>;

  return (
    <div className="mx-auto max-w-[700px] px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-medium text-foreground border-b border-border pb-6 mb-6">
        {isEditMode ? "Edit Product" : "Add New Product"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-secondary mb-1">
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-border rounded-sm p-2.5 font-sans text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-secondary mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="w-full border border-border rounded-sm p-2.5 font-sans text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-secondary mb-1">
              Price
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
              className="w-full border border-border rounded-sm p-2.5 font-sans text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-secondary mb-1">
              Stock
            </label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              required
              className="w-full border border-border rounded-sm p-2.5 font-sans text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-secondary mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-border rounded-sm p-2.5 font-sans text-sm bg-background focus:outline-none focus:border-primary"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {isEditMode ? (
          <div>
            <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
              Current Images
            </label>
            <div className="flex gap-2">
              {existingImageUrls.map((url) => (
                <img
                  key={url}
                  src={url}
                  className="h-20 w-20 object-cover rounded-sm border border-border"
                />
              ))}
            </div>
            <p className="text-xs text-secondary mt-2">
              Image editing isn't supported yet — only text fields and stock can
              be updated.
            </p>
          </div>
        ) : (
          <div>
            <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
              Images (exactly 3 required)
            </label>

            <label
              htmlFor="product-images"
              className="inline-flex items-center gap-2 cursor-pointer rounded-sm border border-border px-4 py-2.5 font-sans text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Choose Images
            </label>
            <input
              id="product-images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              required
              className="hidden"
            />

            {images.length > 0 ? (
              <p className="text-xs text-secondary mt-2">
                {images.length} of 3 selected
                {images.length !== 3 && (
                  <span className="text-destructive">
                    {" "}
                    — exactly 3 required
                  </span>
                )}
              </p>
            ) : (
              <p className="text-xs text-secondary mt-2">
                No images selected yet
              </p>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : isEditMode
                ? "Save Changes"
                : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AdminProductFormPage;
