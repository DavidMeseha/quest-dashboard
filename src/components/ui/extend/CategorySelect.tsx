import { DropdownInputSearch } from '@/components/ui/extend/DropdownInputSearch';
import { CATEGORIES_QUERY_KEY } from '@/constants/query-keys';
import useDebounce from '@/hooks/useDebounce';
import { findCategories } from '@/services/admin-api/find';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

type Props = {
  className?: string;
  selectedCategoryId: string;
  preSelectedCategoryName?: string;
  useAllOption?: boolean;
  onChange: (categoryId: string) => void;
};

export default function CategorySelect({
  selectedCategoryId,
  preSelectedCategoryName,
  onChange,
  className = '',
  useAllOption = false
}: Props) {
  const [categoryQuery, setCategoryQuery] = useState('');

  const categoriesQuery = useQuery({
    queryKey: [CATEGORIES_QUERY_KEY, categoryQuery],
    queryFn: () => findCategories({ query: categoryQuery })
  });
  const categories = categoriesQuery.data ?? [];
  const categoryQueryChangeHandle = useDebounce(setCategoryQuery);
  const options = [...categories.map((category) => ({ value: category._id, label: category.name }))];
  if (useAllOption) options.push({ label: 'All Categories', value: '' });

  return (
    <DropdownInputSearch
      className={className}
      initialName={preSelectedCategoryName}
      isAsync
      isPending={categoriesQuery.isLoading}
      options={options}
      placeholder="Category..."
      value={selectedCategoryId}
      onSearchChange={categoryQueryChangeHandle}
      onValueChange={(value) => onChange(value)}
    />
  );
}
