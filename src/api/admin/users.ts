import { axiosInstance } from "@/api/axiosInstance";
import type {User} from "@/types/index";
import type {Order} from "@/types/index";

interface AdminUserListResponse {
  users : User[];
   pagination: { page: number; limit: number; total: number; totalPages: number };
}


export async function fetchAllUsersAdmin(page = 1, limit= 20, search?: string): Promise<AdminUserListResponse> {

  const {data} = await axiosInstance.get('/admin/users', {
    params: {page, limit , ...(search ? {search} : {})},
  });

  return data;
}

export async function fetchUserById(id: string): Promise<{ user: User; orders: Order[] }> {
  const { data } = await axiosInstance.get(`/admin/users/${id}`);
  return data;
}

export async function setUserRole(id: string, role: 'user' | 'admin'): Promise<User> {
  const { data } = await axiosInstance.patch(`/admin/users/${id}/role`, { role });
  return data;
}