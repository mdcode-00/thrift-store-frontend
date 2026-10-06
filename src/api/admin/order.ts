// src/api/admin/orders.ts
import axiosInstance from '@/api/axiosInstance';
import type { Order } from '@/types';

interface AdminOrder extends Omit<Order , 'buyerId'> {
  buyerId: { _id: string; name: string; email: string }; // populated, not just a string id
}

interface AdminOrderListResponse {
  orders: AdminOrder[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export async function fetchAllOrdersAdmin(
  page = 1,
  limit = 20,
  status?: 'pending' | 'paid' | 'failed'
): Promise<AdminOrderListResponse> {
  const { data } = await axiosInstance.get('/admin/orders', {
    params: { page, limit, ...(status ? { status } : {}) },
  });
  return data;
}