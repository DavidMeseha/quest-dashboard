import ProductForm from '@/components/productForm/productForm';
import { ADMIN_PRODUCTS_QUERY_KEY } from '@/constants/query-keys';
import type { ProductForm as ProductFormInputs } from '@/schemas/validation';
import { createProduct } from '@/services/admin-api/createProduct';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

export default function CreateProductPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (form: ProductFormInputs) => createProduct(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (q) => q.queryKey.includes(ADMIN_PRODUCTS_QUERY_KEY) });
      toast.success('Product Created Successfully');
      navigate('/products');
    }
  });

  const responseError = error ? (isAxiosError(error) ? error.response?.data : 'Unknow Error, Try again Later') : null;

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Create Product</h1>
      <ProductForm isPending={isPending} onSubmit={(form) => mutate(form as ProductFormInputs)} error={responseError} />
    </>
  );
}
