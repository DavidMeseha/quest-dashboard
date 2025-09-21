import ProductForm from '@/components/productForm/productForm';
import { ADMIN_PRODUCTS_QUERY_KEY } from '@/constants/query-keys';
import { editProduct } from '@/services/admin-api/createProduct';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import type { ProductForm as ProductInputForm } from '@/schemas/validation';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { isAxiosError } from 'axios';
import useGetProduct from '@/hooks/queries/useGetProduct';

export default function EditProductPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = useParams();

  const { data: product, isLoading } = useGetProduct(params.id as string);

  const { error, isPending, mutate } = useMutation({
    mutationFn: (form: Partial<ProductInputForm>) => editProduct(form, product?._id || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (q) => q.queryKey.includes(ADMIN_PRODUCTS_QUERY_KEY) });
      toast.success('Product updated');
      navigate('/products');
    }
  });

  const responseError = error ? (isAxiosError(error) ? error.response?.data : 'Unknow Error, Try again Later') : null;

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Edit Product</h1>
      {isLoading ? (
        <LoadingSpinner className="h-32" />
      ) : (
        <ProductForm isPending={isPending} product={product} onSubmit={(form) => mutate(form)} error={responseError} />
      )}
    </>
  );
}
