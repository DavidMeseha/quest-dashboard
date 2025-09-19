import type { IFullProduct } from '@/schemas/types';
import api from './api';
import type { AdminPaginatedResponse } from './types';

export default async function getProducts(params: {
  page: number;
  limit: number;
  query: string;
  vendor?: string;
  category?: string;
}) {
  return api.get<AdminPaginatedResponse<IFullProduct>>('/api/v1/admin/products', { params }).then((data) => data.data);
}
