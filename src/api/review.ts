import axiosInstance from './axiosInstance';
import type { Review } from '@/types';

interface ReviewListResponse {
  reviews: Review[];
  avgRating: number | null;
  total: number;
  pagination: { page: number; limit: number; totalPages: number };
}

export async function fetchReviews(page = 1, limit = 12): Promise<ReviewListResponse> {
  const { data } = await axiosInstance.get('/reviews', { params: { page, limit } });
  return data;
}

export async function fetchMyReviews(): Promise<Review[]> {
  const { data } = await axiosInstance.get('/reviews/mine');
  return data;
}

export async function submitReview(orderId: string, rating: number, comment: string): Promise<Review> {
  const { data } = await axiosInstance.post('/reviews', { orderId, rating, comment });
  return data;
}