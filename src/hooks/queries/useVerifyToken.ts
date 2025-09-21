import { VERIFY_QUERY_KEY } from '@/constants/query-keys';
import { getToken } from '@/lib/token';
import type { IUser } from '@/schemas/types';
import { checkTokenValidity } from '@/services/user-api/auth';
import { useQuery } from '@tanstack/react-query';

type Props = {
  onSuccess?: (data: IUser) => void;
};

export default function useVerifyTokenQuery({ onSuccess }: Props) {
  return useQuery({
    queryKey: [VERIFY_QUERY_KEY],
    queryFn: () =>
      checkTokenValidity().then((data) => {
        onSuccess?.(data);
        return null;
      }),

    retry: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    enabled: () => !!getToken()
  });
}
