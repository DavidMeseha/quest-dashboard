import type { ICategory } from '@/schemas/types';
import type { Tag } from '../types';
import api from './api';

export async function findCategories(params: { query: string }) {
  return await api.get<ICategory[]>('/api/v1/admin/find/categories', { params }).then((data) => data.data);
}

export async function findTags(params: { query: string }) {
  return await api.get<Tag[]>('/api/v1/admin/find/tags', { params }).then((data) => data.data);
}
