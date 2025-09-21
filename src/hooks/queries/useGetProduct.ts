import { PRODUCT_QUERY_KEY } from '@/constants/query-keys';
import getProduct from '@/services/admin-api/getProduct';
import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router';

export default function useGetProduct(productId: string) {
  const navigate = useNavigate();

  return useQuery({
    queryKey: [PRODUCT_QUERY_KEY, productId],
    queryFn: () =>
      getProduct(productId).catch((err) => {
        if (isAxiosError(err)) {
          if (err.response?.status === 404) navigate('/notfound');
        }

        return undefined;
      }),
    gcTime: 0,
    staleTime: 0,
    refetchOnMount: true
  });
}
