import axiosInstance from './axiosInstance'
import type { Order } from '@/types'

export interface OrderListResponse {
  orders: Order[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export async function fetchOrders(page = 1, limit = 10): Promise<OrderListResponse> {
  const { data } = await axiosInstance.get('/orders', { params: { page, limit } })
  const orders: Order[] = data.orders ?? data.data ?? []
  const rawPag = data.pagination ?? data
  return {
    orders,
    pagination: {
      page: rawPag.page ?? page,
      limit: rawPag.limit ?? limit,
      total: rawPag.total ?? orders.length,
      totalPages: rawPag.totalPages ?? rawPag.totalPage ?? 1,
    },
  }
}

export async function fetchOrderById(id: string): Promise<Order> {
  const { data } = await axiosInstance.get(`/orders/${id}`)
  return data.order ?? data.data ?? data
}
