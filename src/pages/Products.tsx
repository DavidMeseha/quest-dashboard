import React, { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { ADMIN_PRODUCTS_QUERY_KEY } from '@/constants/query-keys';
import getProducts from '@/services/admin-api/getProducts';
import useDebounce from '@/hooks/useDebounce';
import { Input } from '@/components/ui/input';
import CategorySelect from '@/components/ui/extend/CategorySelect';
import { NavLink } from 'react-router';
import LoadingSpinner from '@/components/ui/loading-spinner';
import DataPagination from '@/components/ui/extend/Pagination';
import ProductCard from '@/components/ProductCard';

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const isFeltering = !!selectedCategory || !!search;

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [ADMIN_PRODUCTS_QUERY_KEY, page, search, selectedCategory],
    queryFn: () => getProducts({ page: page, limit: 5, query: search, category: selectedCategory }),
    placeholderData: keepPreviousData
  });
  const products = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.currentPage ?? 1;

  const searchProductNameHandle = useDebounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  });

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
            canUseAllOption
            className="w-36"
            selectedCategoryId={selectedCategory}
            onChange={(value) => {
              setSelectedCategory(value);
              setPage(1);
            }}
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
          <DataPagination currentPage={currentPage} totalPages={totalPages} onPageChang={(target) => setPage(target)} />
        </div>
      </div>

      <div className="space-y-4">
        {products.length > 0 ? (
          products?.map((product) => <ProductCard key={product._id} product={product} />)
        ) : (
          <div className="text-muted-foreground flex h-[50vh] items-center justify-center text-center">
            {isFeltering ? 'No products matching prams' : 'You have no products Yet'}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-center gap-2">
        <DataPagination currentPage={currentPage} totalPages={totalPages} onPageChang={(target) => setPage(target)} />
      </div>
    </div>
  );
}
