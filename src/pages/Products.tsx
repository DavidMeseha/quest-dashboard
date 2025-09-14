import React, { useEffect } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { ADMIN_PRODUCTS_QUERY_KEY } from '@/constants/query-keys';
import getProducts from '@/services/admin-api/getProducts';
import useDebounce from '@/hooks/useDebounce';
import { Input } from '@/components/ui/input';
import CategorySelect from '@/components/ui/extend/CategorySelect';
import { NavLink, useSearchParams } from 'react-router';
import LoadingSpinner from '@/components/ui/loading-spinner';
import DataPagination from '@/components/ui/extend/Pagination';
import ProductCard from '@/components/ProductCard';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') ?? '1');
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const isFiltering = !!category || !!search;

  const setQueris = (props: { page?: string; category?: string; search?: string }) => {
    setSearchParams({ page: page.toString(), category, search, ...props });
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [ADMIN_PRODUCTS_QUERY_KEY, page, search, category],
    queryFn: () => getProducts({ page: page, limit: 5, query: search, category }),
    placeholderData: keepPreviousData
  });
  const products = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const searchProductNameHandle = useDebounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setQueris({ page: '1', search: e.target.value });
  });

  useEffect(() => {
    setQueris({});
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-2xl font-bold">Your Products</h1>
        <div className="w-full md:w-1/3">
          <Input className="w-full" placeholder="Find Products" onChange={searchProductNameHandle} />
        </div>
      </div>

      <div className="flex flex-col justify-between md:flex-row">
        <div className="flex flex-wrap items-center gap-4">
          <CategorySelect
            useAllOption
            className="w-36"
            selectedCategoryId={category}
            onChange={(value) => setQueris({ page: '1', category: value })}
          />
          <NavLink
            className="bg-primary text-primary-foreground flex items-center justify-center rounded-md px-4 py-2 text-sm font-bold"
            to="/create-product"
          >
            <Plus size={20} />
            <span>New Product</span>
          </NavLink>

          {(isLoading || isFetching) && (
            <LoadingSpinner className="fill-muted-foreground inline-block w-auto" size={18} />
          )}
        </div>

        <div className="mt-6 md:mt-0">
          <DataPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChang={(target) => setQueris({ page: String(target) })}
          />
        </div>
      </div>

      <div className="space-y-4">
        {products.length > 0 ? (
          products?.map((product) => <ProductCard key={product._id} product={product} />)
        ) : (
          <div className="text-muted-foreground flex h-[50vh] items-center justify-center text-center">
            {isFiltering ? 'No products matching prams' : 'You have no products Yet'}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-center gap-2">
        <DataPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChang={(target) => setQueris({ page: String(target) })}
        />
      </div>
    </div>
  );
}
