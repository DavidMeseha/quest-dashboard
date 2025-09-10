import ProductForm from '@/components/productForm/productForm';
import { ADMIN_PRODUCTS_QUERY_KEY, PRODUCT_QUERY_KEY } from '@/constants/query-keys';
import { editProduct } from '@/services/admin-api/createProduct';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import getProduct from '@/services/admin-api/getProduct';
import type { ProductForm as ProductInputForm } from '@/schemas/validation';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function EditProductPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = useParams();

  const productQuery = useQuery({
    queryKey: [PRODUCT_QUERY_KEY, params.id],
    queryFn: () => getProduct(params.id as string)
  });
  const product = productQuery.data;

  const updateProductMutation = useMutation({
    mutationFn: (form: Partial<ProductInputForm>) => editProduct(form, product?._id || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (q) => q.queryKey.includes(ADMIN_PRODUCTS_QUERY_KEY) });
      toast.success('Product updated');
      navigate('/products');
    },
    onError: () => toast.error('Failed to update product')
  });

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Edit Product</h1>
      {productQuery.isLoading ? (
        <LoadingSpinner />
      ) : (
        <ProductForm
          isPending={updateProductMutation.isPending}
          product={product}
          onSubmit={(form) => updateProductMutation.mutate(form)}
        />
      )}
    </>
  );
}
