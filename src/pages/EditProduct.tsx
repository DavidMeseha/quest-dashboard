import ProductForm from '@/components/productForm/productForm';
import { ADMIN_PRODUCTS_QUERY_KEY, PRODUCT_QUERY_KEY } from '@/constants/query-keys';
import { editProduct } from '@/services/admin-api/createProduct';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import getProduct from '@/services/admin-api/getProduct';
import type { ProductForm as ProductInputForm } from '@/schemas/validation';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { isAxiosError } from 'axios';

export default function EditProductPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = useParams();

  const { data, isLoading } = useQuery({
    queryKey: [PRODUCT_QUERY_KEY, params.id],
    queryFn: () =>
      getProduct(params.id as string).catch((err) => {
        if (isAxiosError(err)) {
          if (err.response?.status === 404) navigate('/notfound');
        }

        return undefined;
      }),
    gcTime: 0,
    staleTime: 0,
    refetchOnMount: true
  });
  const product = data;

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
