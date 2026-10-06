import { useEffect, useState } from "react";
import  type {Product} from '@/types'


interface UseProductResult {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  page: number;
  totalPage: number;
  setPage: (page: number) => void;
}

export function useProduct(
  fetchFn: (page: number) => Promise<{product:Product[]; pagination: {totalPage: number}}>,
  deps: unknown[] = []
): UseProductResult {

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPages] = useState(1);



    useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetchFn(page)
      .then((data) => {
        if (cancelled) return;
        setProducts(data.product);
        setTotalPages(data.pagination.totalPage);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load products right now.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, ...deps]);

    return { products, isLoading, error, page, totalPage, setPage };

}