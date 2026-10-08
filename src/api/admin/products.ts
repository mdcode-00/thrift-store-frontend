import axiosInstance from "../axiosInstance";
import type { Product } from "@/types";

export interface CreateProductPayload {
  name: string;
  description: string;
  price:number;
  category: string;
  type: 'upper' | 'lower' | 'accessory' | "all";
  stock: number;
  images: File[];
}

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  const formData =  new FormData();
  formData.append("name", payload.name);
  formData.append("description", payload.description);
  formData.append("price", payload.price.toString());
  formData.append("category", payload.category);
  formData.append("stock", payload.stock.toString());
  formData.append("type", payload.type);
  payload.images.forEach((file) => formData.append('images', file));

  const {data} = await axiosInstance.post('/admin/create', formData , {
    headers: {'Content-Type' : 'multipart/form-data' },
  });

  return data;
}


export async function updateProduct(
  id: string,
  payload: Partial<{ name: string; description: string; price: number; category: string; stock: number }>
): Promise<Product> {
  const { data } = await axiosInstance.patch(`/admin/products/${id}`, payload);
  return data;
}


// export async function updateStock(id: string, stock: number): Promise<Product> {
//   const { data } = await axiosInstance.patch(`/admin/products/${id}/stock`, { stock });
//   return data;
// }

export async function deleteProduct(id: string): Promise<void> {
  await axiosInstance.delete(`/admin/products/${id}`);
}