'use client';

import ProductForm from '@/components/productForm/productForm';
import { ADMIN_PRODUCTS_QUERY_KEY } from '@/constants/query-keys';
import type { ProductForm as ProductFormInputs } from '@/schemas/validation';
import { createProduct } from '@/services/admin-api/createProduct';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

export default function CreateProduct() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createProductMutation = useMutation({
    mutationFn: (form: ProductFormInputs) => createProduct(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (q) => q.queryKey.includes(ADMIN_PRODUCTS_QUERY_KEY) });
      toast.success('Product Created Successfully');
      navigate('/products');
    },
    onError: (err) => {
      if (isAxiosError(err) && err.response?.status === 500)
        toast.error('Failed to Create, Product could be duplicate or with exact same name');
      else toast.error('Failed to Create Product,try again later');
    }
  });

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Create Product</h1>
      <ProductForm
        isPending={createProductMutation.isPending}
        onSubmit={(form) => createProductMutation.mutate(form as ProductFormInputs)}
      />
    </>
  );
}
