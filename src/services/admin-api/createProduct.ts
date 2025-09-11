import type { ProductForm } from '@/schemas/validation';
import api from './api';

export async function createProduct(body: ProductForm) {
  return api
    .post<{ id: string; message: string }>('/api/v1/admin/create/product', { ...body })
    .then((data) => data.data);
}

export async function editProduct(body: Partial<ProductForm>, id: string) {
  return api
    .post<{ id: string; message: string }>('/api/v1/admin/edit/product/' + id, { ...body })
    .then((data) => data.data);
}
