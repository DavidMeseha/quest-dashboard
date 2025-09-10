import type { IFullProduct } from '@/schemas/types';
import { deleteProduct, republishProduct } from '@/services/admin-api/productActions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Bookmark, Edit, Heart, Redo2, ShoppingCart, Star, Trash2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { ADMIN_PRODUCTS_QUERY_KEY } from '@/constants/query-keys';
import { format } from 'date-fns';
import { NavLink } from 'react-router';
import SubmitButton from './ui/submit-button';

type Props = {
  product: IFullProduct;
};

export default function ProductCard({ product }: Props) {
  const queryClient = useQueryClient();

  const deleteProductMutation = useMutation({
    mutationKey: ['delete-product', product._id],
    mutationFn: () => deleteProduct(product._id),
    onSuccess: () => queryClient.invalidateQueries({ predicate: (q) => q.queryKey.includes(ADMIN_PRODUCTS_QUERY_KEY) })
  });

  const republishProductMutation = useMutation({
    mutationKey: ['delete-product', product._id],
    mutationFn: () => republishProduct(product._id),
    onSuccess: () => queryClient.invalidateQueries({ predicate: (q) => q.queryKey.includes(ADMIN_PRODUCTS_QUERY_KEY) })
  });

  return (
    <div
      className={`bg-card text-card-foreground relative flex flex-col gap-4 rounded-lg border p-4 shadow-sm sm:flex-row sm:items-start ${product.stock > 0 && !product.deleted ? '' : 'border-destructive'}`}
    >
      <div className="absolute start-2 top-2 z-20 flex gap-2">
        {product.deleted && <Badge variant="destructive">Deleted</Badge>}
        {product.stock < 1 && <Badge variant="destructive">No Stock</Badge>}
      </div>
      <div className="relative h-32 w-full flex-shrink-0 sm:w-32">
        <img
          alt={product.name}
          className="mx-auto max-h-full rounded-md object-contain"
          src={product.pictures[0].imageUrl}
        />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <div>
          <h3 className="me-4 inline-block font-semibold">{product.name}</h3>
          <p className="text-primary inline-block font-bold">${product.price.price}</p>
        </div>
        <p className="text-muted-foreground text-sm">Category: {product.category.name}</p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-muted-foreground text-sm">Stock: {product.stock}</span>
          <span className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 text-yellow-400" />
            {product.productReviewOverview.totalReviews
              ? (product.productReviewOverview.ratingSum / product.productReviewOverview.totalReviews).toFixed(1)
              : 0}
          </span>

          <div className="flex gap-2">
            <Badge className="flex items-center gap-1" variant="outline">
              <Heart className="h-3 w-3" /> {product.likes}
            </Badge>
            <Badge className="flex items-center gap-1" variant="outline">
              <Bookmark className="h-3 w-3" /> {product.saves}
            </Badge>
            <Badge className="flex items-center gap-1" variant="outline">
              <ShoppingCart className="h-3 w-3" /> {product.carts}
            </Badge>
          </div>
        </div>

        <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          <p>Created: {format(new Date(product.createdAt), 'PP')}</p>
          <p>Updated: {format(new Date(product.updatedAt), 'PP')}</p>
        </div>
      </div>

      <div className="flex">
        <NavLink
          title="Edit Product"
          className="text-foreground bg-white p-3 hover:bg-white hover:text-blue-700"
          to={`/edit-product/${product._id}`}
        >
          <Edit className="h-4 w-4" />
        </NavLink>
        {product.deleted ? (
          <SubmitButton
            title="Republish Product"
            className="text-foreground hover:text-succces bg-transparent fill-black shadow-none hover:bg-white"
            isLoading={republishProductMutation.isPending}
            onClick={() => republishProductMutation.mutate()}
          >
            <Redo2 className="h-4 w-4" />
          </SubmitButton>
        ) : (
          <SubmitButton
            title="Soft Delete Product"
            className="text-foreground hover:text-destructive bg-white fill-black shadow-none hover:bg-white"
            isLoading={deleteProductMutation.isPending}
            onClick={() => deleteProductMutation.mutate()}
          >
            <Trash2 className="h-4 w-4" />
          </SubmitButton>
        )}
      </div>
    </div>
  );
}
