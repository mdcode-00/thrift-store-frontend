import axiosInstance  from "./axiosInstance";
import type {Product} from '@/types'


interface ProductListResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

interface ProductQuery {
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc';
}


export async function fetchProducts(query:ProductQuery = {}): Promise<ProductListResponse> {
  const {data} = await axiosInstance.get('/products' , {params: query});

  return data
}


export async function fetchProductById(id: string): Promise<Product> {
  const { data } = await axiosInstance.get(`/products/${id}`);
  return data;
}

export async function fetchProductsByCategory(
  category: string,
  query: ProductQuery = {}
): Promise<ProductListResponse> {
  const { data } = await axiosInstance.get(`/products/category/${category}`, { params: query });
  return data;
}

export async function searchProducts(q: string, query: ProductQuery = {}): Promise<ProductListResponse> {
  const { data } = await axiosInstance.get('/products/search', { params: { q, ...query } });
  return data;
}