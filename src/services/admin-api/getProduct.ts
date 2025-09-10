import type { IFullProduct } from '@/schemas/types';
import api from './api';

export default async function getProduct(id: string) {
  return api.get<IFullProduct>('/api/v1/admin/product/' + id).then((data) => data.data);
}
